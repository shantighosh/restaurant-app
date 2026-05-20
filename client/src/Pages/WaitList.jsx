import React from 'react';

export default function Waitlist() {
  return (
    <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Live Waitlist Standings</h2>
      <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>Your active structural priority queues will render here.</p>
      <div style={{ padding: '20px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '8px', display: 'inline-block', fontWeight: '600' }}>
        No active waitlist positions found for your current session.
      </div>
    </div>
  );
}