
/*import express from 'express';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { protect, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

// =========================================================================
// 🌟 FIX 1: GET MY BOOKINGS
// Target URL: http://localhost:50001/api/reservations/my-bookings
// =========================================================================
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User session invalid.' });
    }

    const myReservations = await Reservation.find({ user: userId }).sort({ date: 1 });
    res.json(myReservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// 🌟 FIX 2: CREATE RESERVATION
// Target URL: http://localhost:50001/api/reservations/
// =========================================================================
router.post('/', protect, async (req, res) => {
  const { partySize, date, timeSlot } = req.body;
  try {
    const newReservation = await Reservation.create({
      user: req.user.id,
      partySize: Number(partySize),
      date: new Date(date),
      timeSlot
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =========================================================================
// 🌟 FIX 3: VIEW ALL RESERVATIONS (Staff Only)
// Target URL: http://localhost:50001/api/reservations/
// =========================================================================
router.get('/', protect, authorizeStaff, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('user', 'name email');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  const { partySize, date, timeSlot, tableId } = req.body;
  
  try {
    // 1. Create the reservation log document row
    const newReservation = await Reservation.create({
      user: req.user.id,
      table: tableId, 
      partySize: Number(partySize),
      date: new Date(date),
      timeSlot
    });

    // 2. 🌟 THE CRITICAL FIX: Find the physical table and change its status property to 'occupied'
    if (tableId) {
      await Table.findByIdAndUpdate(tableId, { status: 'occupied' });
      console.log(`🎯 Table ${tableId} status flipped to occupied successfully!`);
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("🔥 Booking system crash:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router; */

import express from 'express';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { protect, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

// =========================================================================
// 1. GET USER RESERVATIONS
// =========================================================================
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User session invalid.' });
    }

    const myReservations = await Reservation.find({ user: userId })
      .populate({ path: 'table', select: 'tableNumber capacity status type' })
      .sort({ date: 1 });
      
    res.json(myReservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// 2. SECURE RESERVATION TRANSACTION (WITH SAFETY GATE - FIXED)
// =========================================================================
/*router.post('/', protect, async (req, res) => {
  const { partySize, date, timeSlot, tableId } = req.body;
  
  if (!tableId) {
    return res.status(400).json({ message: 'Validation Error: No target table selection detected.' });
  }

  try {
    // 🛡️ SAFETY GATE: Fetch the table first to see what its current state is inside MongoDB
    const targetTable = await Table.findById(tableId);
    
    if (!targetTable) {
      return res.status(404).json({ message: 'The selected table card does not exist.' });
    }

    // If the table is already taken, stop right here and tell the frontend explicitly!
    if (targetTable.status === 'occupied') {
      return res.status(400).json({ message: 'This table has already been booked by another customer!' });
    }

    // 1. Safe mapping: Create reservation line row
    const newReservation = await Reservation.create({
      user: req.user.id,
      table: tableId, 
      partySize: Number(partySize),
      date: new Date(date),
      timeSlot,
      // 🌟 THE CRITICAL FIX: Auto-generates a unique random code so MongoDB never gets a duplicate 'null' again!
      confirmationCode: `CONF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    });

    // 2. Atomically update the table map indicator value to occupied
    targetTable.status = 'occupied';
    await targetTable.save();
    
    console.log(`🎯 Database Synced: Table ${tableId} is now occupied.`);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("🔥 Route Handler System Exception:", error);
    res.status(400).json({ error: error.message });
  }
});*/


// =========================================================================
// 2. SECURE RESERVATION TRANSACTION (FORCED DATABASE WRITE)
// =========================================================================
router.post('/', protect, async (req, res) => {
  const { partySize, date, timeSlot, tableId } = req.body;
  
  if (!tableId) {
    return res.status(400).json({ message: 'Validation Error: No target table selection detected.' });
  }

  try {
    const targetTable = await Table.findById(tableId);
    
    if (!targetTable) {
      return res.status(404).json({ message: 'The selected table card does not exist.' });
    }

    // Checking both lowercase and uppercase variants to be safe!
    if (targetTable.status === 'occupied' || targetTable.status === 'Occupied') {
      return res.status(400).json({ message: 'This table has already been booked!' });
    }

    // 1. Create your reservation record document entry row
    const newReservation = await Reservation.create({
      user: req.user.id,
      table: tableId, 
      partySize: Number(partySize),
      date: new Date(date),
      timeSlot,
      confirmationCode: `CONF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    });

    // 2. 🌟 THE CRITICAL DIRECT OVERWRITE: Force MongoDB to change the value!
    await Table.findByIdAndUpdate(tableId, { $set: { status: 'occupied' } }, { new: true });
    
    console.log(`🎯 FORCE DIRECT SYNC: Table ${tableId} status rewritten to occupied in MongoDB!`);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("🔥 Route Handler System Exception:", error);
    res.status(400).json({ error: error.message });
  }
});

// =========================================================================
// 3. MASTER LOG DECK VIEW (Staff Only)
// =========================================================================
router.get('/', protect, authorizeStaff, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('table');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// =========================================================================
// 4. MANUAL CANCEL BOOKING (Flipped back to Available / Green instantly!)
// =========================================================================
router.put('/:id/cancel-session', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    // 🌟 FORCE THE TABLE STATUS BACK TO AVAILABLE (Turns the card GREEN instantly)
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { $set: { status: 'available' } });
      console.log(`🟢 Manual Action: Table ${reservation.table} reset to available (Green).`);
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Session cancelled successfully, table released to green.', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;