import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import api from '../lib/api'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Extract global state management from AuthContext
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with backend API node
      const res = await api.post('/auth/login', { email, password });
      
      // 2. Persist authorization token locally for automatic header injection
      localStorage.setItem('token', res.data.token);

      const user = res.data.user;

      // 3. Inform context layer so elements like Navbar and TableDashboard recognize the customer session
      if (typeof login === 'function') {
        login(user); 
      }

      // 4. Group separation routing logic
      if (user.role === 'staff' || user.role === 'admin') {
        navigate('/staff/dashboard'); // Staff goes to Control Console with Queue
      } else {
        navigate('/tables'); // Customers go directly to live table layout grid
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Verify configuration rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0f172a' }}>Welcome Back</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Sign in to manage floor plans or reserve live spaces.</p>

        {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
              placeholder="name@domain.com" 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              padding: '12px', 
              backgroundColor: '#2563eb', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '700', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '15px', 
              marginTop: '8px', 
              opacity: loading ? 0.7 : 1 
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', margin: '24px 0 0 0', fontSize: '14px', color: '#64748b' }}>
          New to the system? <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Create an Account</Link>
        </p>
      </div>
    </div>
  );
}