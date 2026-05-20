const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const WaitlistEntry = require('../models/WaitlistEntry');
const Table = require('../models/Table');
const User = require('../models/User');
const { sendReminderEmail } = require('../utils/email');
const { logTurnover } = require('../utils/waitPredictor');

module.exports = (io) => {
  // Every 5 minutes: send reminders
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 3600000);
      const in2h = new Date(now.getTime() + 2 * 3600000);

      // 24h reminders
      const reservations24h = await Reservation.find({
        status: 'confirmed',
        reminderSent24h: false,
        date: { $gte: new Date(in24h.getTime() - 300000), $lte: new Date(in24h.getTime() + 300000) }
      }).populate('user table');

      for (const res of reservations24h) {
        if (res.user?.email) await sendReminderEmail(res.user.email, res, 24);
        res.reminderSent24h = true;
        await res.save();
      }

      // 2h reminders
      const reservations2h = await Reservation.find({
        status: 'confirmed',
        reminderSent2h: false,
        date: { $gte: new Date(in2h.getTime() - 300000), $lte: new Date(in2h.getTime() + 300000) }
      }).populate('user table');

      for (const res of reservations2h) {
        if (res.user?.email) await sendReminderEmail(res.user.email, res, 2);
        res.reminderSent2h = true;
        await res.save();
      }
    } catch (err) { console.error('Reminder cron error:', err.message); }
  });

  // Every minute: handle grace period expirations
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Expired reservation grace periods → mark no_show, free table
      const expiredReservations = await Reservation.find({
        status: 'confirmed',
        gracePeriodEnd: { $lte: now }
      }).populate('table');

      for (const res of expiredReservations) {
        res.status = 'no_show';
        await res.save();
        if (res.table) {
          await Table.findByIdAndUpdate(res.table._id, { status: 'free', currentReservation: null });
        }
        io.emit('reservation_updated', res);
        console.log(`No-show auto-set for reservation ${res.confirmationCode}`);
      }

      // Expired waitlist grace periods → mark expired
      const expiredWaitlist = await WaitlistEntry.find({
        status: 'notified',
        gracePeriodEnd: { $lte: now }
      });

      for (const entry of expiredWaitlist) {
        entry.status = 'expired';
        await entry.save();
        console.log(`Waitlist entry expired for user ${entry.user}`);
      }

      // Recalculate waitlist positions after expirations
      if (expiredWaitlist.length > 0) {
        const remaining = await WaitlistEntry.find({ status: 'waiting' }).sort({ position: 1 });
        for (let i = 0; i < remaining.length; i++) {
          remaining[i].position = i + 1;
          await remaining[i].save();
        }
        io.emit('waitlist_updated', await WaitlistEntry.find({ status: { $in: ['waiting','notified'] } }).populate('user','name').sort({ position: 1 }));
      }

    } catch (err) { console.error('Grace period cron error:', err.message); }
  });

  // Every hour: complete reservations whose end time has passed
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const nowTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const seatedPastEnd = await Reservation.find({
        status: 'seated',
        date: { $lte: today },
        endTime: { $lte: nowTime }
      }).populate('table');

      for (const res of seatedPastEnd) {
        const duration = 60; // You can calculate actual duration here
        await logTurnover(res.table?._id, res.partySize, duration);
        res.status = 'completed';
        await res.save();
        if (res.table) {
          await Table.findByIdAndUpdate(res.table._id, { status: 'cleaning', currentReservation: null });
          // After 10 min cleaning → free
          setTimeout(async () => {
            await Table.findByIdAndUpdate(res.table._id, { status: 'free' });
            io.emit('table_status_changed', { _id: res.table._id, status: 'free' });
          }, 10 * 60 * 1000);
        }
      }
    } catch (err) { console.error('Auto-complete cron error:', err.message); }
  });

  console.log('✅ Cron jobs started');
};