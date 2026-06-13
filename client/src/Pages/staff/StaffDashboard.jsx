/*import { useState, useEffect } from 'react';
import api from '../../lib/api'; 

export default function StaffDashboard() {
  const [tables, setTables] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 💡 Kept on true so your layout renders perfectly populated without a backend connection
  const [sandboxMode, setSandboxMode] = useState(true); 

  const fetchLiveOperationalState = async () => {
    if (sandboxMode) {
      setTables([
        { _id: '1', tableNumber: '1', capacity: 2, status: 'Vacant', type: 'Round' },
        { _id: '2', tableNumber: '2', capacity: 4, status: 'Occupied', type: 'Square' },
        { _id: '3', tableNumber: '3', capacity: 4, status: 'Vacant', type: 'Booth' },
        { _id: '4', tableNumber: '4', capacity: 4, status: 'Occupied', type: 'Family' },
        { _id: '5', tableNumber: '5', capacity: 8, status: 'Experimental', type: 'Long' },
        { _id: '6', tableNumber: '6', capacity: 2, status: 'Vacant', type: 'Round' },
        { _id: '7', tableNumber: '7', capacity: 4, status: 'Occupied', type: 'Square' },
        { _id: '8', tableNumber: '8', capacity: 8, status: 'Experimental', type: 'Long' },
        { _id: '9', tableNumber: '9', capacity: 8, status: 'Occupied', type: 'Family' },
        { _id: '10', tableNumber: '10', capacity: 8, status: 'Experimental', type: 'Service' }
      ]);
      setWaitlist([
        { _id: 'w1', guestName: 'Jane Doe', guests: 4, time: '15m wait', status: 'Next Available' },
        { _id: 'w2', guestName: 'Alex Smith', guests: 2, time: '30m wait', status: 'Waiting' }
      ]);
      setLoading(false);
      return;
    }

    try {
      setError('');
      const [tablesResponse, waitlistResponse] = await Promise.all([
        api.get('/tables'),
        api.get('/reservations/waitlist')
      ]);
      setTables(tablesResponse?.data || []);
      setWaitlist(waitlistResponse?.data || []);
    } catch (err) {
      setError('Failed to synchronize data from remote network node.');
      setTables([]);
      setWaitlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOperationalState();
  }, [sandboxMode]);

  const handleTableToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Vacant' ? 'Occupied' : currentStatus === 'Occupied' ? 'Experimental' : 'Vacant';
    
    if (sandboxMode) {
      setTables(prev => prev.map(t => t._id === id ? { ...t, status: nextStatus } : t));
      return;
    }

    try {
      await api.put(`/tables/${id}`, { status: nextStatus });
      setTables(prev => prev.map(t => t._id === id ? { ...t, status: nextStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function to return beautiful custom neon layout icons matching your UI spec
  const getTableIcon = (type, color) => {
    switch(type) {
      case 'Round': return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${color})` }}><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
      );
      case 'Long': return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${color})` }}><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M6 6h12M6 18h12"/></svg>
      );
      case 'Service': return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${color})` }}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      );
      default: return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 4px ${color})` }}><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M4 9h2M4 15h2M18 9h2M18 15h2"/></svg>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#090d16', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontSize: '16px', fontFamily: 'system-ui' }}>
        🔄 Initializing Frosted Glass Core Console Layers...
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(rgba(11, 15, 25, 0.7), rgba(11, 15, 25, 0.85)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '40px 24px',
      fontFamily: 'system-ui, sans-serif',
      color: '#f8fafc',
      boxSizing: 'border-box'
    }}>*/
      
      {/* TOP HEADER CONTEXT */}
      /*<div style={{ maxWidth: '1400px', margin: '0 auto 10px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>Floor Control Console</h1>
          <p style={{ margin: '0', color: '#cbd5e1', fontSize: '15px', fontWeight: '500' }}>Manage real-time seating inventory allocation and active queue flow lines.</p>
        </div>
        */
        {/* Toggle Sandbox Mode Button */}
        /*<button 
          onClick={() => { setLoading(true); setSandboxMode(!sandboxMode); }} 
          style={{ padding: '8px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}
        >
          Mode: {sandboxMode ? "Demo Sandbox" : "Live Wire"}
        </button>
      </div>*/

      {/* CORE FROSTED GLASS SPLIT CONTAINER GRID */}
     /* <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>
       */ 
        {/* LEFT COLUMN: SEATING CONTROL CONSOLE WINDOW */}
        /*<div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.45)', 
          padding: '30px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.08)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>Live Seating Layout Matrix</h3>
            <div style={{ width: '40px', height: '14px', opacity: 0.5 }}>
              <svg width="100%" height="100%" viewBox="0 0 40 14" fill="none" stroke="#fff"><path d="M2 12h4M10 8h4M18 4h4M26 9h4M34 2h4" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>*/

          {/* NEON MATRIX CARD GRID GENERATOR */}
          /*<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {tables.map(table => {
              const neonColor = table.status === 'Vacant' ? '#22c55e' : table.status === 'Occupied' ? '#ef4444' : '#3b82f6';
              return (
                <div 
                  key={table._id} 
                  onClick={() => handleTableToggle(table._id, table.status)}
                  style={{
                    padding: '20px 10px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    border: `1px solid ${neonColor}70`,
                    boxShadow: `0 0 15px ${neonColor}15, inset 0 0 15px ${neonColor}10`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${neonColor}35, inset 0 0 15px ${neonColor}20`;
                    e.currentTarget.style.borderColor = neonColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 0 15px ${neonColor}15, inset 0 0 15px ${neonColor}10`;
                    e.currentTarget.style.borderColor = `${neonColor}70`;
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '10px' }}>{table.status}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                    {getTableIcon(table.type, neonColor)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', padding: '0 4px', fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>
                    <span>#{table.tableNumber}</span>
                    <span style={{ opacity: 0.6 }}>{table.capacity} seats</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
*/
        {/* RIGHT COLUMN: ACTIVE QUEUE FLOW PANEL */}
       /* <div style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.45)', 
          padding: '30px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.08)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>Queue Action Items</h3>
              <div style={{ width: '50px', height: '16px', opacity: 0.6 }}>
                <svg width="100%" height="100%" viewBox="0 0 50 16" fill="none" stroke="#38bdf8"><path d="M2 14c10-5 8-10 18-10s8 8 18 2 8-6 10-6" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>*/

            {/* QUEUE INTENT TICKERS */}
           /* <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {waitlist.map((guest, idx) => (
                <div key={guest._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
                    {guest.guestName} <span style={{ color: '#cbd5e1', fontWeight: '400' }}>- {guest.guests} Guests - {guest.time} wait - status: <span style={{ color: '#fbbf24', fontWeight: '600' }}>{guest.status}</span></span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.02em' }}>
                    Live-node in Time-node - {guest.time} wait - status: {guest.status}
                  </div>
                </div>
              ))}
            </div>
          </div>*/

          {/* LOWER DECORATIVE VECTOR GRAPHIC WAVE */}
          /*<div style={{ width: '100%', height: '50px', marginTop: '40px', opacity: 0.35 }}>
            <svg width="100%" height="100%" viewBox="0 0 300 50" fill="none" stroke="#38bdf8" strokeWidth="1.5">
              <path d="M0 25C30 15 45 40 75 30C105 20 120 45 150 25C180 5 195 35 225 20C255 5 270 30 300 15" strokeLinecap="round"/>
              <circle cx="225" cy="20" r="3" fill="#38bdf8"/>
            </svg>
          </div>

        </div>

      </div>
    </div>
  );
}*/


import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function StaffDashboard() {
  const [stats, setStats] = useState({ vacantTables: 5, totalTables: 8, partiesQueued: 2 });
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff analytics and control data on mount
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const res = await api.get('/waitlist'); // Grab waitlist data safely with staff token
        setWaitlist(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch staff operations data", err);
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  const handleAction = (action, id) => {
    alert(`Performing action: ${action} for ID: ${id}`);
    // Here you would connect to api.post() or api.put() to clear tables or seat parties
  };

  if (loading) return <div style={{ color: '#fff', padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh' }}>Loading Control Panel...</div>;

  return (
    <div style={{ padding: '40px', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
      
      {/* HEADER STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Staff Operations Deck</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Real-time floor flow control management panel.</p>
        </div>
        <button onClick={() => handleAction('reset', null)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Reset Floor Plan Layout
        </button>
      </div>

      {/* QUICK ANALYTICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase' }}>Vacant Tables</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{stats.vacantTables} <span style={{ fontSize: '18px', color: '#64748b' }}>/ {stats.totalTables} Open</span></p>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase' }}>Active Waitlist</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{stats.partiesQueued} <span style={{ fontSize: '18px', color: '#64748b' }}>Parties</span></p>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase' }}>Est. Average Wait</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: '800', color: '#3b82f6' }}>12 <span style={{ fontSize: '18px', color: '#64748b' }}>Mins</span></p>
        </div>
      </div>

      {/* MANAGEMENT PANELS CONTAINER */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* LIVE WAITLIST BOARD */}
        <div style={{ backgroundColor: '#111827', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px 0' }}>Active Customer Waitlist</h2>
          {waitlist.length === 0 ? (
            <p style={{ color: '#4b5563' }}>No parties currently waiting in the lounge queue.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {waitlist.map((party, index) => (
                <div key={party._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{party.name || 'Walk-in Party'}</h4>
                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Size: {party.partySize} Guests &bull; Waiting {party.waitingTime || '5'}m</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleAction('seat', party._id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Seat Party</button>
                    <button onClick={() => handleAction('remove', party._id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK QUICK WALK-IN UTILITIES */}
        <div style={{ backgroundColor: '#111827', padding: '32px', borderRadius: '16px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', margin: 0 }}>Add Walk-In Guest</h3>
          <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            + Queue 2-Guest Party
          </button>
          <button style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            + Queue 4-Guest Party
          </button>
          <button style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
            + Queue Large Group (6+)
          </button>
        </div>

      </div>
    </div>
  );
}