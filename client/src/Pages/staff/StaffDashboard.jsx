import { useState } from 'react';

export default function StaffDashboard() {
  const [tables, setTables] = useState([
    { id: 1, type: 'Round', capacity: 4, status: 'Vacant' },
    { id: 2, type: 'Round', capacity: 4, status: 'Vacant' },
    { id: 3, type: 'Round', capacity: 4, status: 'Occupied' },
    { id: 4, type: 'Round', capacity: 4, status: 'Occupied' },
    { id: 5, type: 'Square', capacity: 4, status: 'Vacant' },
    { id: 6, type: 'Long', capacity: 8, status: 'Vacant' },
    { id: 7, type: 'Square', capacity: 4, status: 'Occupied' },
    { id: 8, type: 'Square', capacity: 4, status: 'Experimental' },
    { id: 9, type: 'Square', capacity: 4, status: 'Experimental' },
    { id: 10, type: 'Long', capacity: 6, status: 'Vacant' }
  ]);

  const [waitlist, setWaitlist] = useState([
    { name: 'Jane Doe', size: 2, waitTime: '15m', status: 'Next Available' },
    { name: 'Alex Smith', size: 4, waitTime: '30m', status: 'Waiting' }
  ]);

  const handleTableToggle = (id) => {
    setTables(tables.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Vacant' ? 'Occupied' : t.status === 'Occupied' ? 'Experimental' : 'Vacant';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '24px' }}>
      
      {/* LEFT COLUMN: LIVE MANAGEMENT SYSTEM FLOORGRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '700' }}>Live Table Grid Monitoring</h2>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Click modular cell nodes to manually override room allocation state indicators.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: '600' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span> Vacant</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Occupied</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Experimental</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
            {tables.map(table => (
              <div key={table.id} onClick={() => handleTableToggle(table.id)} style={{
                padding: '20px 12px', borderRadius: '12px', color: '#fff', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s ease',
                backgroundColor: table.status === 'Vacant' ? '#22c55e' : table.status === 'Occupied' ? '#ef4444' : '#3b82f6'
              }}>
                <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: '600' }}>{table.type.toUpperCase()}</div>
                <div style={{ fontSize: '26px', fontWeight: '800', margin: '4px 0' }}>#{table.id}</div>
                <div style={{ fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.12)', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>{table.capacity} Seats</div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPREHENSIVE WAITLIST COMPONENT */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700' }}>Active System Waitlist Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {waitlist.map((guest, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{guest.name} ({guest.size} Guests)</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Waiting duration: {guest.waitTime}</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#d97706' }}>{guest.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: REFS IMAGE COMPONENT CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Visual Floorplan Blueprint</h3>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px 0' }}>Standard interface layout blueprint reference spec:</p>
          <div style={{ flexGrow: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
            <img 
              src="8417789672721545539.jpeg" 
              alt="System Blueprint Specification Screen Asset" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>
            Ref Identifier: 8417789672721545539.jpeg
          </div>
        </div>
      </div>

    </div>
  );
}