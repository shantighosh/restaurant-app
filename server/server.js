// 📁 File: backend/server.js
import express from 'express';
import mongoose from 'mongoose'; 
import cron from 'node-cron'; 
import cors from 'cors'; 
import dotenv from 'dotenv';

// STEP 1: Import all your routes modules cleanly
import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import waitlistRoutes from './routes/waitlist.js';
import tableRoutes from './routes/tables.js'; // 🌟 FIXED: Added your missing tables route module!

import Table from './models/Table.js'; 
import Reservation from './models/Reservation.js'; 

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// =========================================================================
// STEP 2: MOUNT THE API ROUTE MODULE NODES
// =========================================================================
app.use('/api/auth', authRoutes); 
app.use('/api/reservations', reservationRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/tables', tableRoutes); // 🌟 FIXED: Mounted /api/tables here!

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant';

// =========================================================================
// 3. DATABASE CONNECTION & STARTUP HEALER
// =========================================================================
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('📦 Database Connected directly. Running table optimization scan...');
    
    try {
      const occupiedTables = await Table.find({ status: 'occupied' });
      for (const table of occupiedTables) {
        const activeBooking = await Reservation.findOne({
          table: table._id,
          status: { $regex: /^confirmed$/i } 
        });
        
        if (!activeBooking) {
          await Table.findByIdAndUpdate(table._id, { $set: { status: 'available' } });
          console.log(`🛡️ Startup Safety Net: Cleaned up stuck table card [${table._id}] ➡️ Set to Green.`);
        }
      }
      console.log('✅ Startup table optimization scan complete.');
    } catch (err) {
      console.error('⚠️ Startup scan error:', err.message);
    }
  })
  .catch(err => {
    console.error('❌ Database connection failure:', err.message);
  });

// =========================================================================
// 4. BACKGROUND ENGINE LOGIC (Every 1 minute)
// =========================================================================
cron.schedule('* * * * *', async () => {
  try {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    // Task 1: Check for 10-minute completed dining sessions
    const activeSessions = await Reservation.find({
      status: 'confirmed',
      createdAt: { $lt: tenMinutesAgo }
    });

    if (activeSessions.length > 0) {
      for (const res of activeSessions) {
        if (res.table) {
          await Table.findByIdAndUpdate(res.table, { $set: { status: 'available' } });
          console.log(`🟢 Auto-Cron: 10 minutes completed. Table ${res.table} reset to green.`);
        }
        res.status = 'completed';
        await res.save();
      }
    }

    // Task 2: Safety net for ghost red tables
    const occupiedTables = await Table.find({ status: 'occupied' });
    for (const table of occupiedTables) {
      const activeBooking = await Reservation.findOne({
        table: table._id,
        status: 'confirmed'
      });

      if (!activeBooking) {
        await Table.findByIdAndUpdate(table._id, { $set: { status: 'available' } });
        console.log(`🛡️ Auto-Cron Safety Net: Fixed ghost table card ${table._id} ➡️ turned Green!`);
      }
    }
  } catch (error) {
    console.error('❌ Cron execution error:', error.message);
  }
});

console.log('⏰ Background Cron Job Engine Initialized directly inline...');

// =========================================================================
// 5. LISTEN TO PORT
// =========================================================================
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(`🚀 Server up and running smoothly on port ${PORT}`));