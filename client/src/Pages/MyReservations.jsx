import React, { useState } from 'react';

export default function MyReservations() {
  const [bookings] = useState([
    { id: 'b1', date: '2026-06-15', time: '19:00', guests: 2, status: 'confirmed' }
  ]);

  return (
    <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 20px 0' }}>Your Bookings</h2>
      {bookings.map(booking => (
        <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontWeight: '600' }}>Table for {booking.guests} Guests</div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>📅 {booking.date} at {booking.time}</div>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', backgroundColor: '#dcfce7', color: '#15803d' }}>{booking.status}</span>
        </div>
      ))}
    </div>
  );
}