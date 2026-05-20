const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partySize: { type: Number, required: true, min: 1 },
  seatingPreference: { type: String, enum: ['indoor', 'outdoor', 'bar', 'any'], default: 'any' },
  status: { type: String, enum: ['waiting', 'notified', 'seated', 'left', 'expired'], default: 'waiting' },
  position: { type: Number, required: true },
  estimatedWait: { type: Number, default: 0 }, // minutes
  notifiedAt: { type: Date, default: null },
  gracePeriodEnd: { type: Date, default: null },
  phone: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('WaitlistEntry', waitlistSchema);