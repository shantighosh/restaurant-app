const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { verifyToken, requireRole } = require('../middleware/auth');
const { sendConfirmationEmail, sendCancellationEmail } = require('../utils/email');

// Helper: check table availability
async function findAvailableTable(date, startTime, endTime, partySize, preference) {
  const dateStr = new Date(date).toDateString();
  const query = { capacity: { $gte: partySize }, isActive: true, status: { $ne: 'cleaning' } };
  if (preference !== 'any') query.location = preference;
  const tables = await Table.find(query);

  for (const table of tables) {
    const conflict = await Reservation.findOne({
      table: table._id,
      status: { $in: ['confirmed', 'seated'] },
      $expr: { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$date' } }, new Date(date).toISOString().split('T')[0]] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });
    if (!conflict) return table;
  }
  return null;
}

// POST /api/reservations — create
router.post('/', verifyToken, async (req, res) => {
  try {
    const { date, startTime, endTime, partySize, seatingPreference, specialRequests } = req.body;
    const table = await findAvailableTable(date, startTime, endTime, partySize, seatingPreference || 'any');
    if (!table) return res.status(400).json({ message: 'No tables available for this time slot' });

    const reservation = await Reservation.create({
      user: req.user._id,
      table: table._id,
      date, startTime, endTime, partySize,
      seatingPreference: seatingPreference || 'any',
      specialRequests
    });

    await reservation.populate('user table');
    await sendConfirmationEmail(req.user.email, reservation);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reservations — list (staff: all, customer: own)
router.get('/', verifyToken, async (req, res) => {
  try {
    const filter = req.user.role === 'customer' ? { user: req.user._id } : {};
    const { date, status } = req.query;
    if (date) filter.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) };
    if (status) filter.status = status;
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .populate('table', 'tableNumber capacity location')
      .sort({ date: 1, startTime: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reservations/available-slots — check availability
router.get('/available-slots', async (req, res) => {
  try {
    const { date, partySize, preference } = req.query;
    const timeSlots = ['11:00','11:30','12:00','12:30','13:00','13:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];
    const available = [];
    for (const slot of timeSlots) {
      const [h, m] = slot.split(':').map(Number);
      const endHour = h + 1;
      const endTime = `${String(endHour).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const table = await findAvailableTable(date, slot, endTime, parseInt(partySize), preference || 'any');
      if (table) available.push({ time: slot, endTime, location: table.location });
    }
    res.json(available);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/reservations/:id/status — update status (staff)
router.patch('/:id/status', verifyToken, requireRole('staff','admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id).populate('table');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = status;

    if (status === 'seated') {
      reservation.arrivedAt = new Date();
      const graceMins = parseInt(process.env.GRACE_PERIOD_MINUTES) || 15;
      reservation.gracePeriodEnd = new Date(Date.now() + graceMins * 60000);
      if (reservation.table) {
        await Table.findByIdAndUpdate(reservation.table._id, { status: 'occupied', currentReservation: reservation._id });
      }
    }

    if (status === 'completed' || status === 'no_show' || status === 'cancelled') {
      if (reservation.table) {
        await Table.findByIdAndUpdate(reservation.table._id, { status: 'free', currentReservation: null });
      }
      if (status === 'cancelled') await sendCancellationEmail(reservation);
    }

    await reservation.save();
    req.io.emit('reservation_updated', reservation);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reservations/:id — cancel own reservation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user._id });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    const hoursUntil = (new Date(reservation.date) - new Date()) / 3600000;
    if (hoursUntil < 2) return res.status(400).json({ message: 'Cannot cancel within 2 hours of reservation' });
    reservation.status = 'cancelled';
    await reservation.save();
    if (reservation.table) await Table.findByIdAndUpdate(reservation.table, { status: 'free', currentReservation: null });
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;