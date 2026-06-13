import mongoose from 'mongoose';

const turnOverSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  partySize: { type: Number, required: true },
  seatedAt: { type: Date, required: true },
  clearedAt: { type: Date, required: true },
  durationMinutes: { type: Number, required: true } // Calculated automatically: (clearedAt - seatedAt)
}, { timestamps: true });

export default mongoose.model('TurnOver', turnOverSchema);