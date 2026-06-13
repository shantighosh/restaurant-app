/*import cron from 'node-cron';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

export const initCronJobs = () => {
  console.log('⏰ Background Cron Job Engine Initialized...');

  cron.schedule('* * * * *', async () => {
    try {
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      // Find sessions that started 10 minutes ago and are still 'confirmed'
      const activeSessions = await Reservation.find({
        status: 'confirmed',
        createdAt: { $lt: tenMinutesAgo }
      });

      if (activeSessions.length > 0) {
        console.log(`🧹 Auto-Cron: Found ${activeSessions.length} finished dining sessions.`);
        
        for (const res of activeSessions) {
          if (res.table) {
            // 🌟 Set table status back to available (Turns Card GREEN)
            await Table.findByIdAndUpdate(res.table, { $set: { status: 'available' } });
            console.log(`🟢 Auto-Cron: Table ${res.table} is green again.`);
          }
          res.status = 'completed';
          await res.save();
        }
      }
    } catch (error) {
      console.error('❌ Cron execution error:', error.message);
    }
  });
};*/
import cron from 'node-cron';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

export const initCronJobs = () => {
  console.log('⏰ Background Cron Job Engine Initialized...');

  // Runs automatically every single minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      // =========================================================================
      // TASK 1: NATURAL 10-MINUTE COMPLETIONS (Turns cards Green)
      // =========================================================================
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

      // =========================================================================
      // TASK 2: AUTOMATIC HEALING SAFETY NET (Fixes ghost "occupied" tables!)
      // =========================================================================
      // Find all tables currently marked occupied in the database
      const occupiedTables = await Table.find({ status: 'occupied' });

      for (const table of occupiedTables) {
        // Look if there is ANY active confirmed reservation holding this table right now
        const activeBooking = await Reservation.findOne({
          table: table._id,
          status: 'confirmed'
        });

        // 🌟 If no active reservation is found holding this table, it's a ghost state! Fix it!
        if (!activeBooking) {
          await Table.findByIdAndUpdate(table._id, { $set: { status: 'available' } });
          console.log(`🛡️ Auto-Cron Safety Net: Fixed ghost table card ${table._id} ➡️ turned Green!`);
        }
      }

    } catch (error) {
      console.error('❌ Cron execution error:', error.message);
    }
  });
};