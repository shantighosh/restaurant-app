import { useState } from 'react';
import api from '../lib/api';

export default function ReservationForm({ onBookingSuccess }) {
  const [fields, setFields] = useState({ 
    guestName: '', // Added name state variable here
    date: '', 
    time: '19:00', 
    guests: '2', 
    notes: '' 
  });
  const [alert, setAlert] = useState({ type: '', text: '' });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', text: '' });
    try {
      // This sends guestName, date, time, guests, and notes to your backend server
      const response = await api.post('/reservations/create', fields);
      setAlert({ type: 'success', text: 'Table reserved successfully!' });
      if (onBookingSuccess) onBookingSuccess(response.data);
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Selected slot is fully booked.' });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
      <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>Secure a Table</h3>
      
      {alert.text && (
        <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', backgroundColor: alert.type === 'success' ? '#dcfce7' : '#fee2e2', color: alert.type === 'success' ? '#15803d' : '#b91c1c' }}>
          {alert.text}
        </div>
      )}

      {/* 🆕 ADDED: GUEST NAME INPUT FIELD */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Full Name / Reservation Name</label>
        <input 
          type="text" 
          required 
          placeholder="e.g. Shanti Ghosh"
          value={fields.guestName} 
          onChange={e => setFields({...fields, guestName: e.target.value})} 
          style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Date</label>
          <input type="date" required value={fields.date} onChange={e => setFields({...fields, date: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Time Slot</label>
          <select value={fields.time} onChange={e => setFields({...fields, time: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' }}>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="21:00">9:00 PM</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Number of Guests</label>
        <input type="number" min="1" max="12" required value={fields.guests} onChange={e => setFields({...fields, guests: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Special Instructions</label>
        <textarea value={fields.notes} onChange={e => setFields({...fields, notes: e.target.value})} placeholder="Allergies, seating preference..." style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', height: '100px', resize: 'vertical' }} />
      </div>

      <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>
        Confirm Booking Request
      </button>
    </form>
  );
}