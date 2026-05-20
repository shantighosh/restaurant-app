import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication credentials rejected.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Welcome Back</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>Log in to manage restaurant assignments.</p>
      {error && <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Corporate Email</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Password</label>
          <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Authenticate</button>
      </form>
    </div>
  );
}