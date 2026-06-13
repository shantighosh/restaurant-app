// 📁 File: backend/models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }, 
  partySize: { type: Number, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "19:00"
  
  // 🌟 FIX 1: Explicitly define confirmationCode so Mongoose accepts the payload!
  confirmationCode: { type: String, required: false }, 

  // 🌟 FIX 2: Ensure 'completed' is accepted, default is set to 'confirmed'
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'seated', 'completed'], 
    default: 'confirmed' 
  }
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);