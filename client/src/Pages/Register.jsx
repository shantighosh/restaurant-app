import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Create an Account</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>Join our restaurant management system.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Password</label>
          <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login here</Link>
      </p>
    </div>
  );
}