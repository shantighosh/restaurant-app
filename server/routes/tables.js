/*import express from 'express';
import Table from '../models/Table.js';
import TurnOver from '../models/TurnoverLog.js';
import { protect, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

// 1. Get all tables (Both Staff and Customers can view layout/availability)
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Create a new table (Staff/Admin Only)
router.post('/', protect, authorizeStaff, async (req, res) => {
  const { tableNumber, capacity } = req.body;
  try {
    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) return res.status(400).json({ message: 'Table number already exists' });

    const newTable = await Table.create({ tableNumber, capacity });
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update Table Status / Seat a Party / Clear a Table (Staff Only)
router.put('/:id', protect, authorizeStaff, async (req, res) => {
  const { status, reservationId, partySize, seatedAt } = req.body;
  try {
    const table = await Table.findById(req.id || req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    // Business Logic: If clearing an occupied table, log the turnover analytics
    if (table.status === 'occupied' && status === 'available') {
      const startTime = seatedAt ? new Date(seatedAt) : table.updatedAt;
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 60000); // converting ms to minutes

      await TurnOver.create({
        table: table._id,
        reservation: reservationId || null,
        partySize: partySize || table.capacity,
        seatedAt: startTime,
        clearedAt: endTime,
        durationMinutes: duration > 0 ? duration : 1
      });
    }

    table.status = status;
    await table.save();
    res.json({ message: `Table status updated to ${status}`, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;*/
import express from 'express';
import Table from '../models/Table.js';
import TurnOver from '../models/TurnoverLog.js';
import { protect, authorizeStaff } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// 1. GET ALL TABLES (Public Layout Matrix View)
// ==========================================
router.get('/', async (req, res) => {
  try {
    let tables = await Table.find().sort({ tableNumber: 1 });

    // 💡 AUTOMATIC DATABASE SEEDER
    // If your MongoDB collection has 0 documents, this populates it instantly
    if (tables.length === 0) {
      const sampleTables = [
        { tableNumber: 1, capacity: 2, type: 'Square', status: 'available' },
        { tableNumber: 2, capacity: 4, type: 'Round', status: 'available' },
        { tableNumber: 3, capacity: 4, type: 'Square', status: 'available' },
        { tableNumber: 4, capacity: 6, type: 'Long', status: 'available' },
        { tableNumber: 5, capacity: 2, type: 'Round', status: 'available' },
        { tableNumber: 6, capacity: 8, type: 'Long', status: 'available' }
      ];
      tables = await Table.insertMany(sampleTables);
      console.log("🚀 Database collection was empty! Auto-seeded 6 restaurant tables.");
    }

    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. CREATE A NEW TABLE (Staff/Admin Only)
// ==========================================
router.post('/', protect, authorizeStaff, async (req, res) => {
  const { tableNumber, capacity, type } = req.body;
  try {
    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) return res.status(400).json({ message: 'Table number already exists' });

    // Force normalized lowercasing on status strings
    const newTable = await Table.create({ 
      tableNumber, 
      capacity, 
      type: type || 'Square',
      status: 'available' 
    });
    
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. UPDATE TABLE STATUS / LEAVE SEAT / CLEAR UP (Staff Only)
// ==========================================
router.put('/:id', protect, authorizeStaff, async (req, res) => {
  const { status, reservationId, partySize, seatedAt } = req.body;
  try {
    // 🌟 FIXED: Replaced req.id fallback with explicit URL variable parameter query
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table record missing or not found' });

    // Business Logic: Strict case-insensitive status evaluation strings
    const currentStatus = table.status ? table.status.toLowerCase() : 'available';
    const targetStatus = status ? status.toLowerCase() : 'available';

    // Analytics Trigger: If clearing an active occupied table, capture turn times
    if (currentStatus === 'occupied' && targetStatus === 'available') {
      const startTime = seatedAt ? new Date(seatedAt) : table.updatedAt;
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 60000); // milliseconds to minutes conversion

      await TurnOver.create({
        table: table._id,
        reservation: reservationId || null,
        partySize: partySize || table.capacity,
        seatedAt: startTime,
        clearedAt: endTime,
        durationMinutes: duration > 0 ? duration : 1
      });
    }

    // Apply normalized clean data fields downstream to MongoDB collections
    table.status = targetStatus;
    await table.save();
    
    res.json({ message: `Table status updated successfully to ${table.status}`, table });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;