const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

exports.sendConfirmationEmail = async (email, reservation) => {
  const msg = {
    to: email,
    from: 'noreply@yourrestaurant.com',
    subject: `Reservation Confirmed — ${reservation.confirmationCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">Your reservation is confirmed! 🎉</h2>
        <div style="background:#f9f9f9;padding:20px;border-radius:8px;margin:20px 0">
          <p><strong>Confirmation Code:</strong> ${reservation.confirmationCode}</p>
          <p><strong>Date:</strong> ${formatDate(reservation.date)}</p>
          <p><strong>Time:</strong> ${reservation.startTime}</p>
          <p><strong>Party Size:</strong> ${reservation.partySize} guests</p>
          <p><strong>Table:</strong> #${reservation.table?.tableNumber || 'TBD'} (${reservation.table?.location || ''})</p>
          ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
        </div>
        <p style="color:#666">Please arrive on time. Tables are held for 15 minutes past your reservation time.</p>
        <p style="color:#888;font-size:12px">To cancel or modify, log in to your account at least 2 hours before your reservation.</p>
      </div>
    `
  };
  try { await sgMail.send(msg); } catch (e) { console.error('Email error:', e.message); }
};

exports.sendReminderEmail = async (email, reservation, hoursAhead) => {
  const msg = {
    to: email,
    from: 'noreply@yourrestaurant.com',
    subject: `Reminder: Your table is in ${hoursAhead} hour${hoursAhead > 1 ? 's' : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2>Don't forget your reservation!</h2>
        <p>You have a table booked for <strong>${reservation.startTime}</strong> today.</p>
        <p>Party of ${reservation.partySize} · Table #${reservation.table?.tableNumber || 'TBD'}</p>
        <p style="color:#888;font-size:12px">Confirmation: ${reservation.confirmationCode}</p>
      </div>
    `
  };
  try { await sgMail.send(msg); } catch (e) { console.error('Email error:', e.message); }
};

exports.sendCancellationEmail = async (reservation) => {
  if (!reservation.user?.email) return;
  const msg = {
    to: reservation.user.email,
    from: 'noreply@yourrestaurant.com',
    subject: `Reservation Cancelled — ${reservation.confirmationCode}`,
    html: `<div style="font-family:sans-serif"><h2>Your reservation has been cancelled.</h2><p>Confirmation: ${reservation.confirmationCode}</p><p>We hope to see you again soon!</p></div>`
  };
  try { await sgMail.send(msg); } catch (e) { console.error('Email error:', e.message); }
};