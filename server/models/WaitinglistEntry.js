import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partySize: { type: Number, required: true },
  status: { type: String, enum: ['waiting', 'notified', 'seated', 'cancelled'], default: 'waiting' },
  estimatedWaitMinutes: { type: Number, default: 15 }
}, { timestamps: true });

export default mongoose.model('WaitingListEntry', waitingListSchema);