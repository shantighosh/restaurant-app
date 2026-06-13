import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function MyReservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/my-bookings')
      .then(res => {
        console.log("My Bookings List Received:", res.data);
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Error reading personal log cards:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handler for manual cancellations
  const handleCancelSession = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this booking and free up the table?")) {
      try {
        await api.put(`/reservations/${reservationId}/cancel-session`);
        alert("Booking cancelled successfully! The table is now open.");
        window.location.reload(); 
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel the booking slot.");
      }
    }
  };

  // Helper utility function to parse string timestamps into pretty displays
  const formatPrettyDate = (rawDateString) => {
    if (!rawDateString) return 'N/A';
    const parsedDate = new Date(rawDateString);
    return isNaN(parsedDate.getTime()) 
      ? rawDateString 
      : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to pick styling badges depending on reservation status variables
  const getStatusBadgeStyles = (status) => {
    const cleanStatus = status ? status.toLowerCase() : 'pending';
    switch (cleanStatus) {
      case 'confirmed':
        return { bg: '#dcfce7', text: '#166534', label: 'Confirmed' };
      case 'completed':
        return { bg: '#e0f2fe', text: '#0369a1', label: 'Completed' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' };
      default:
        return { bg: '#fef9c3', text: '#854d0e', label: 'Pending' };
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>Syncing reservation logs...</p>;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: '#0f172a' }}>My Bookings</h2>
      <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '15px' }}>Review upcoming seating arrangements and current allocation status values.</p>

      {bookings.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>No active reservation layouts mapped to this account node.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => {
            const statusStyle = getStatusBadgeStyles(b.status);
            const isConfirmed = b.status?.toLowerCase() === 'confirmed';

            return (
              <div key={b._id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                      {b.table?.tableNumber ? `Table Reservation #${b.table.tableNumber}` : 'BistroFlow Table Allocation'}
                    </h4>
                    
                    {b.confirmationCode && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                        Code: {b.confirmationCode}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px', flexWrap: 'wrap' }}>
                      <span>📅 {formatPrettyDate(b.date)}</span>
                      <span>⏰ {b.timeSlot || 'Standard Slot'}</span>
                      <span>👥 {b.partySize || 2} Guests</span>
                    </div>
                  </div>
                  
                  {/* Dynamic Status Pill Block */}
                  <span style={{ 
                    padding: '6px 14px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text
                  }}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Cancel button safely using variable 'b' inside the map loop */}
                {isConfirmed && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '4px' }}>
                    <button
                      onClick={() => handleCancelSession(b._id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      Cancel Table & Leave ✕
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}