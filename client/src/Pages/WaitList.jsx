import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function Waitlist() {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partySize, setPartySize] = useState(2);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch active waitlist entries on component mounting window
  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const fetchWaitlistData = () => {
    api.get('/waitlist')
      .then(res => {
        console.log("Live waitlist payload returned:", res.data);
        setWaitlist(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Waitlist fetch error:", err);
        setErrorMessage("Could not synchronize live waitlist queue logs.");
      })
      .finally(() => setLoading(false));
  };

  // 2. Handle joining the waitlist queue mapping
  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        partySize: Number(partySize) // 🌟 MATCHES BACKEND EXPECTED SCHEMATIC KEYS EXACTLY
      };

      await api.post('/waitlist', payload);
      setSuccessMessage('🎉 Successfully secured your position in the live waitlist queue!');
      setPartySize(2);
      
      // Instantly refresh list data properties
      fetchWaitlistData();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to register queue entry. You may already be on the list.');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>Syncing live waitlist matrix feed...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header Container */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Live Waitlist Matrix</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '15px' }}>When the floor plan grid layout is occupied, queue your account credentials safely.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Form Container */}
        <div style={{ backgroundColor: '#f8fafc', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Join Queue Line</h3>
          
          {successMessage && <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>{successMessage}</div>}
          {errorMessage && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>❌ {errorMessage}</div>}

          <form onSubmit={handleJoinWaitlist} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b' }}>
              Your reservation profile name will automatically bind to your logged-in session profile credentials.
            </p>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Party Size (Number of Guests)</label>
              <input 
                type="number" 
                min="1" 
                max="20" 
                required 
                value={partySize} 
                onChange={e => setPartySize(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
              SECURE CURRENT POSITION →
            </button>
          </form>
        </div>

        {/* Right Column: Active Queue Display List */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Current Queue Lineup</h3>
          
          {waitlist.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>The lineup is currently empty. Direct floor seating allocations are completely open.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {waitlist.map((entry, index) => {
                // 🌟 FIXED PROPERTY PATHWAY: Extracts name safely from your populated model schema object reference
                const displayName = entry.user?.name || 'BistroFlow Customer';
                
                return (
                  <div key={entry._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '18px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#f1f5f9', borderRadius: '50%', fontSize: '13px', fontWeight: '700', color: '#475569' }}>
                          #{index + 1}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{displayName}</h4>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '13px', marginTop: '6px', paddingLeft: '40px' }}>
                        <span>👥 {entry.partySize || 2} Guests</span>
                        <span>⏱️ Est. Wait: {entry.estimatedWaitMinutes || 10} mins</span>
                      </div>
                    </div>

                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      backgroundColor: entry.status === 'notified' ? '#dbeafe' : '#fef9c3', 
                      color: entry.status === 'notified' ? '#1e40af' : '#854d0e', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em' 
                    }}>
                      {entry.status || 'waiting'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}