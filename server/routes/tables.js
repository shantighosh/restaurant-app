const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/tables
router.get('/', verifyToken, async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).populate('currentReservation');
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tables — create table (admin/staff)
router.post('/', verifyToken, requireRole('staff','admin'), async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tables/:id/status — update table status
router.patch('/:id/status', verifyToken, requireRole('staff','admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(req.params.id, { status }, { new: true });
    req.io.emit('table_status_changed', table);
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tables/:id
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await Table.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Table deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;