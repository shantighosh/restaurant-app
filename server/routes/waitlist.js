const express = require('express');
const router = express.Router();
const WaitlistEntry = require('../models/WaitlistEntry');
const { verifyToken, requireRole } = require('../middleware/auth');
const { sendSMS } = require('../utils/sms');
const { predictWaitTime } = require('../utils/waitPredictor');

// POST /api/waitlist/join
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { partySize, seatingPreference, phone } = req.body;
    const existing = await WaitlistEntry.findOne({ user: req.user._id, status: 'waiting' });
    if (existing) return res.status(400).json({ message: 'You are already on the waitlist' });

    const lastEntry = await WaitlistEntry.findOne({ status: 'waiting' }).sort({ position: -1 });
    const position = lastEntry ? lastEntry.position + 1 : 1;
    const estimatedWait = await predictWaitTime(partySize, position);

    const entry = await WaitlistEntry.create({
      user: req.user._id,
      partySize,
      seatingPreference: seatingPreference || 'any',
      phone: phone || req.user.phone || '',
      position,
      estimatedWait
    });

    await entry.populate('user', 'name email phone');
    req.io.emit('waitlist_updated', await getFullWaitlist());
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/waitlist — full list (staff) or own position (customer)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      const entry = await WaitlistEntry.findOne({ user: req.user._id, status: { $in: ['waiting','notified'] } });
      return res.json(entry);
    }
    const list = await getFullWaitlist();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/waitlist/:id/notify — staff notifies customer (table ready)
router.post('/:id/notify', verifyToken, requireRole('staff','admin'), async (req, res) => {
  try {
    const entry = await WaitlistEntry.findById(req.params.id).populate('user');
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    const graceMins = parseInt(process.env.GRACE_PERIOD_MINUTES) || 15;
    entry.status = 'notified';
    entry.notifiedAt = new Date();
    entry.gracePeriodEnd = new Date(Date.now() + graceMins * 60000);
    await entry.save();

    if (entry.phone) await sendSMS(entry.phone, `Hi ${entry.user.name}! Your table is ready. Please arrive within ${graceMins} minutes or your spot may be given away.`);
    req.io.emit('table_ready', { entryId: entry._id, userId: entry.user._id });
    req.io.emit('waitlist_updated', await getFullWaitlist());
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/waitlist/:id/status — update status
router.patch('/:id/status', verifyToken, requireRole('staff','admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const entry = await WaitlistEntry.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    if (status === 'seated' || status === 'left' || status === 'expired') {
      await recalculatePositions();
    }
    req.io.emit('waitlist_updated', await getFullWaitlist());
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/waitlist/leave — customer leaves waitlist
router.delete('/leave', verifyToken, async (req, res) => {
  try {
    await WaitlistEntry.findOneAndUpdate({ user: req.user._id, status: 'waiting' }, { status: 'left' });
    await recalculatePositions();
    req.io.emit('waitlist_updated', await getFullWaitlist());
    res.json({ message: 'Removed from waitlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getFullWaitlist() {
  return WaitlistEntry.find({ status: { $in: ['waiting','notified'] } })
    .populate('user', 'name email phone')
    .sort({ position: 1 });
}

async function recalculatePositions() {
  const entries = await WaitlistEntry.find({ status: 'waiting' }).sort({ position: 1 });
  for (let i = 0; i < entries.length; i++) {
    entries[i].position = i + 1;
    await entries[i].save();
  }
}

module.exports = router;