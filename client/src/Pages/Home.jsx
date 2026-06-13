import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your global AuthContext

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Smart listener: Catches smooth-scrolling signals sent from the Navbar hooks
  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Protect clear view against fixed navbar overlaps
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      
      // Clean up the history state token to avoid jumping on unrelated refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Unified core button action mapping to your different dashboards
  const handleBookingClick = () => {
    if (!user) {
      // Unauthenticated guests get funneled to log in safely first
      navigate('/login', { state: { from: '/tables' } });
    } else if (user.role === 'staff' || user.role === 'admin') {
      // Staff members skip customer screens and load their operations center
      navigate('/staff/dashboard');
    } else {
      // Standard customers load the clean, queue-free TableDashboard component grid
      navigate('/tables');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b', backgroundColor: '#f8fafc' }}>
      
      {/* 1. HERO SECTION WITH DYNAMIC TABLEDASHBOARD CONNECTIONS */}
      <section id="top" style={{ 
        padding: '140px 40px',
        background: 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.60)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        color: '#fff', 
        textAlign: 'center',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '16px', maxWidth: '800px', letterSpacing: '-0.02em', lineHeight: '1.2', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Smart Seating, Flawless Reservations
        </h1>
        <p style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '36px', maxWidth: '600px', lineHeight: '1.6', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          Explore live table availabilities, select your preferred layout, and lock in your reservation instantly.
        </p>

        {/* Interactive Action Button Group */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={handleBookingClick}
            style={{ 
              backgroundColor: '#2563eb', 
              color: '#fff', 
              border: 'none', 
              padding: '14px 28px',
              borderRadius: '10px', 
              fontSize: '16px', 
              fontWeight: '700', 
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            {user?.role === 'staff' || user?.role === 'admin' ? 'Open Host Control Panel →' : 'Book a Table →'}
          </button>

          {/* Guest Quick Fallbacks (Hides automatically when user profile is verified) */}
          {!user && (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{ 
                  backgroundColor: '#f59e0b', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '14px 28px',
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d97706'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f59e0b'}
              >
                Log In
              </button>

              <button 
                onClick={() => navigate('/register')}
                style={{ 
                  backgroundColor: '#22c55e', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '14px 28px',
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#16a34a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#22c55e'}
              >
                Register
              </button>
            </>
          )}
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about-section" style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '0.05em' }}>About Our Space</span>
          <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '12px 0 20px 0', color: '#0f172a' }}>A Dining Experience Tailored to You</h2>
          
          {/* 🌟 UPGRADED STYLISH PARAGRAPH 1 */}
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
            Welcome to <strong>BistroFlow</strong>, where great food meets smart technology. Our real-time seating map lets you skip the lines by showing you exactly which tables are open, how busy the restaurant is, and when your favorite spot will be free.
          </p>
          
          {/* 🌟 UPGRADED STYLISH PARAGRAPH 2 */}
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8' }}>
            Whether you want a cozy indoor table, a lively spot at the bar, or a relaxing dinner out on our open-air patio, locking in your perfect seat is now just a single click away.
          </p>
        </div>
        <div style={{ backgroundColor: '#e2e8f0', borderRadius: '16px', height: '350px', backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </section>

      {/* 3. CONTACT SECTION */}
      <section id="contact-section" style={{ backgroundColor: '#0f172a', color: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Get In Touch With Us</h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>Have custom hosting demands or corporate booking requests? Reach our managers directly.</p>
          </div>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase' }}>Phone Hotline</h4>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#e2e8f0' }}>+1 (555) 019-2834</p>
            </div>
            <div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase' }}>Email Support</h4>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#e2e8f0' }}>support@bistroflow.com</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}