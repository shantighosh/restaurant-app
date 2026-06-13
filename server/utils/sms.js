import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const notifyWaitlistReady = async (phoneNumber, userName) => {
  try {
    const message = await client.messages.create({
      body: `Hi ${userName}, your table is ready! Please proceed to the front host stand.`,
      from: process.env.TWILIO_PHONE, // Your Twilio number
      to: phoneNumber
    });
    console.log(`📱 Real SMS sent via Twilio. SID: ${message.sid}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Twilio SMS Error:', error);
    return { success: false };
  }
};