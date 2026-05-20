const mongoose = require('mongoose');

const turnoverLogSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  partySize: { type: Number, required: true },
  dayOfWeek: { type: Number, required: true }, // 0=Sunday
  hourOfDay: { type: Number, required: true }, // 0-23
  durationMinutes: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('TurnoverLog', turnoverLogSchema);