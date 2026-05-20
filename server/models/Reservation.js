const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null },
  partySize: { type: Number, required: true, min: 1, max: 20 },
  seatingPreference: { type: String, enum: ['indoor', 'outdoor', 'bar', 'any'], default: 'any' },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "19:00"
  endTime: { type: String, required: true },   // "20:00"
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
    default: 'confirmed'
  },
  confirmationCode: { type: String, unique: true },
  specialRequests: { type: String, default: '' },
  reminderSent24h: { type: Boolean, default: false },
  reminderSent2h: { type: Boolean, default: false },
  arrivedAt: { type: Date, default: null },
  gracePeriodEnd: { type: Date, default: null },
}, { timestamps: true });

reservationSchema.pre('save', function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'RES' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);