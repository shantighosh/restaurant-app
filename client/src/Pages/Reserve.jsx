/*import React from 'react';
import ReservationForm from '../components/ReservationForm';

export default function Reserve() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ReservationForm />
    </div>
  );
}*/
import React from 'react';
import ReservationForm from '../components/ReservationForm';

export default function Reserve() {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', fontFamily: 'system-ui, sans-serif' }}>Secure Seating</h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
          Select your ideal details. If physical floor layouts are fully locked out, our system will seamlessly match you onto the live waitlist queue.
        </p>
      </div>
      <ReservationForm onBookingSuccess={() => window.location.href = '/my-reservations'} />
    </div>
  );
}