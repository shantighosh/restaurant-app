import express from 'express';
import WaitingListEntry from '../models/WaitingListEntry.js';
import { protect, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

// 1. Join the waitlist (Customer or Staff)
router.post('/', protect, async (req, res) => {
  const { partySize } = req.body;
  try {
    // Basic verification: Stop a user from joining multiple times actively
    const activeEntry = await WaitingListEntry.findOne({ user: req.user.id, status: 'waiting' });
    if (activeEntry) return res.status(400).json({ message: 'You are already on the waitlist!' });

    const newWaitlistEntry = await WaitingListEntry.create({
      user: req.user.id,
      partySize,
      estimatedWaitMinutes: partySize * 5 // Rough rule of thumb logic
    });

    res.status(201).json(newWaitlistEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. View current active waitlist (Staff view / Public queue view)
router.get('/', async (req, res) => {
  try {
    const queue = await WaitingListEntry.find({ status: { $in: ['waiting', 'notified'] } })
      .populate('user', 'name')
      .sort({ createdAt: 1 }); // Oldest entries at the top (First Come, First Served)
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update waitlist entry state (e.g., Change from 'waiting' to 'notified' or 'seated') (Staff Only)
router.put('/:id', protect, authorizeStaff, async (req, res) => {
  const { status } = req.body; // 'waiting', 'notified', 'seated', 'cancelled'
  try {
    const entry = await WaitingListEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Waitlist entry not found' });

    entry.status = status;
    await entry.save();
    res.json({ message: `Queue entry status updated to ${status}`, entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;