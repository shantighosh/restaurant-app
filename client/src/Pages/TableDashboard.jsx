import { useState, useEffect } from 'react';
import api from '../lib/api'; 

export default function TableDashboard() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State Parameters
  const [partySize, setPartySize] = useState(2);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [seatingPreference, setSeatingPreference] = useState('Standard');

  // Fetches your live tables safely before rendering layout
  useEffect(() => {
    api.get('/tables')
      .then(res => {
        let extractedTables = [];
        if (Array.isArray(res.data)) {
          extractedTables = res.data;
        } else if (Array.isArray(res.data?.tables)) {
          extractedTables = res.data.tables;
        } else if (Array.isArray(res.data?.data)) {
          extractedTables = res.data.data;
        }
        setTables(extractedTables);
      })
      .catch(err => console.error('Data pipeline failure:', err))
      .finally(() => setLoading(false));
  }, [bookingSuccess]);

  /*const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setBookingSuccess(false);

    if (!selectedTable) {
      setErrorMessage('Please select a glowing vacant table from the grid layout.');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setErrorMessage('Please choose a valid target Date and Time window.');
      return;
    }

    try {
      const payload = {
        partySize: Number(partySize),
        date: bookingDate,
        timeSlot: bookingTime // Matches backend model schema keys
      };

      await api.post('/reservations', payload);
      setBookingSuccess(true);
      setSelectedTable(null); 
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Booking failure. Table might have just been taken.');
    }
  };*/
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setBookingSuccess(false);

    if (!selectedTable) {
      setErrorMessage('Please select a glowing vacant table from the grid layout.');
      return;
    }

    if (!bookingDate || !bookingTime) {
      setErrorMessage('Please choose a valid target Date and Time window.');
      return;
    }

    try {
      // 🌟 FIXED PAYLOAD: Include the unique ID parameter of the clicked table element!
      const payload = {
        partySize: Number(partySize),
        date: bookingDate,
        timeSlot: bookingTime,
        tableId: selectedTable._id // 🔗 This bridges the link down to your database document status tracker
      };

      await api.post('/reservations', payload);
      setBookingSuccess(true);
      setSelectedTable(null); 
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Booking failure. Table might have just been taken.');
    }
  };

  const getTableIcon = (type, color) => {
    if (type === 'Round') return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>;
    return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
  };

  if (loading) return <div style={{ backgroundColor: '#090d16', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontFamily: 'system-ui, sans-serif' }}>🔄 Streaming Live Seating Matrix...</div>;

  return (
    <div style={{ 
      background: 'linear-gradient(rgba(11, 15, 25, 0.85), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600")', 
      backgroundSize: 'cover', 
      minHeight: '100vh', 
      height: 'auto',
      overflowY: 'auto',
      padding: '24px 24px 60px 24px', 
      fontFamily: 'system-ui, sans-serif', 
      color: '#f8fafc' 
    }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto 20px auto', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Live Dining Hub</h1>
        <p style={{ margin: '4px 0 0 0', color: '#cbd5e1', fontSize: '14px' }}>Select an open seat to configure your premium reservation parameters below.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '30px', maxWidth: '1400px', margin: '0 auto', alignItems: 'start' }}>
        
        {/* Physical Seating Floor Layout Grid */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#94a3b8' }}>Interactive Restaurant Floor Plan Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
            {tables.map(table => {
              const isSelected = selectedTable?._id === table._id;
              const isVacant = table.status && (table.status.toLowerCase() === 'available' || table.status.toLowerCase() === 'vacant');
              const neonColor = isVacant ? '#22c55e' : '#ef4444';
              const displayStatus = isVacant ? 'AVAILABLE' : 'OCCUPIED';
              
              return (
                <div 
                  key={table._id} 
                  onClick={() => isVacant && setSelectedTable(table)} 
                  style={{ 
                    padding: '20px 12px', 
                    borderRadius: '16px', 
                    textAlign: 'center', 
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.45)', 
                    cursor: isVacant ? 'pointer' : 'not-allowed', 
                    opacity: isVacant ? 1 : 0.35, 
                    border: isSelected ? '2px solid #38bdf8' : `1px solid ${neonColor}50`,
                    boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '11px', color: neonColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{displayStatus}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>{getTableIcon(table.type, neonColor)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: '#cbd5e1' }}>
                    <span>Table {table.tableNumber}</span>
                    <span>Cap: {table.capacity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Live Booking & Configuration Form */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>Configure Reservation Parameters</h3>
          <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '13px' }}>Fill out your group size and arrival target windows securely.</p>

          {bookingSuccess && <div style={{ padding: '12px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', border: '1px solid #22c55e' }}>🎉 Booking Confirmed! Your real-time table layout allocation is locked in successfully.</div>}
          {errorMessage && <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', border: '1px solid #ef4444' }}>❌ {errorMessage}</div>}

          <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Target Floor Matrix ID</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: selectedTable ? '#38bdf8' : '#cbd5e1' }}>
                {selectedTable ? `Table #${selectedTable.tableNumber} (${selectedTable.type || 'Standard'} Station - Max ${selectedTable.capacity} Seats)` : '🔴 Click a vacant table on the map grid layout'}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Party Size (Number of Guests)</label>
              <input type="number" min="1" max={selectedTable ? selectedTable.capacity : 20} required value={partySize} onChange={e => setPartySize(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Target Date</label>
                <input type="date" required value={bookingDate} onChange={e => setBookingDate(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Arrival Time</label>
                <input type="time" required value={bookingTime} onChange={e => setBookingTime(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>Zone / Seating Preference</label>
              <select value={seatingPreference} onChange={e => setSeatingPreference(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}>
                <option value="Standard">Standard Indoor Lounge</option>
                <option value="Window">Window-Side View</option>
                <option value="Patio">Open-Air Outdoor Patio</option>
                <option value="Bar">High-Top Structural Bar</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={!selectedTable} 
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: selectedTable ? '#2563eb' : 'rgba(255,255,255,0.05)', 
                color: selectedTable ? '#fff' : '#64748b', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: selectedTable ? 'pointer' : 'not-allowed',
                boxShadow: selectedTable ? '0 4px 15px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                marginTop: '8px'
              }}
            >
              {selectedTable ? 'SECURE RESERVATION ALLOCATION →' : 'SELECT A VACANT TABLE TO UNLOCK'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
