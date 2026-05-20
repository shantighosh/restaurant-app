const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  location: { type: String, enum: ['indoor', 'outdoor', 'bar'], default: 'indoor' },
  status: { type: String, enum: ['free', 'occupied', 'reserved', 'cleaning'], default: 'free' },
  currentReservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', default: null },
  averageTurnTime: { type: Number, default: 60 }, // minutes
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);