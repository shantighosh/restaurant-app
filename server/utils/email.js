import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendBookingConfirmationEmail = async (userEmail, userName, bookingDetails) => {
  const msg = {
    to: userEmail,
    from: 'your-verified-sendgrid-email@domain.com', // Must be verified in SendGrid
    subject: 'Your Restaurant Reservation is Confirmed! 🎉',
    text: `Hi ${userName}, your table is booked for ${bookingDetails.date} at ${bookingDetails.timeSlot}.`,
    html: `<h3>Hi ${userName},</h3><p>Your reservation is confirmed for <strong>${bookingDetails.date}</strong> at <strong>${bookingDetails.timeSlot}</strong>.</p>`
  };

  try {
    await sgMail.send(msg);
    console.log(`✉️ Real Email sent via SendGrid to: ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Email Error:', error);
    return { success: false };
  }
};