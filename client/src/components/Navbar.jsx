import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tracking hover states for interactive buttons/links
  const [hoveredLink, setHoveredLink] = useState(null);

  // Smart Navigation: Scrolls if on Home page, navigates first if on another page
  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      // Navigate home first, then append the hash behavior
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Already home, scroll immediately
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80; // Fixed navbar protection clearance
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Reusable interactive layout style generator
  const linkStyle = (id) => ({
    background: 'none',
    border: 'none',
    color: hoveredLink === id ? '#3b82f6' : '#cbd5e1', 
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    padding: '6px 10px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center'
  });

  return (
    <nav style={{ 
      backgroundColor: '#0f172a', 
      padding: '16px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      borderBottom: '1px solid #1e293b'
    }}>
      {/* Branding Logo */}
      <Link to="/" onClick={() => handleNavClick('top')} style={{ color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.03em' }}>
        BISTRO<span style={{ color: '#3b82f6' }}>FLOW</span>
      </Link>
      
      {/* Right Navigation Controls Link Group */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        
        {/* Core Nav Links (Scrolls safely from any page) */}
        <button 
          onClick={() => handleNavClick('top')}
          onMouseEnter={() => setHoveredLink('home')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('home')}
        >
          Home
        </button>

        <button 
          onClick={() => handleNavClick('about-section')}
          onMouseEnter={() => setHoveredLink('about')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('about')}
        >
          About
        </button>

        <button 
          onClick={() => handleNavClick('contact-section')}
          onMouseEnter={() => setHoveredLink('contact')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('contact')}
        >
          Contact
        </button>

        {/* Dynamic Authentication Protected Block */}
        {user ? (
          <>
            <span style={{ height: '16px', width: '1px', backgroundColor: '#334155', margin: '0 4px' }} />
            
            <Link 
              to="/tables" 
              onMouseEnter={() => setHoveredLink('reserve')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{ ...linkStyle('reserve'), color: location.pathname === '/tables' ? '#3b82f6' : '#cbd5e1' }}
            >
              Book Table
            </Link>
            
            <Link 
              to="/my-reservations" 
              onMouseEnter={() => setHoveredLink('my-bookings')}
              onMouseLeave={() => setHoveredLink(null)}
              style={linkStyle('my-bookings')}
            >
              My Bookings
            </Link>
            
            <Link 
              to="/waitlist" 
              onMouseEnter={() => setHoveredLink('waitlist')}
              onMouseLeave={() => setHoveredLink(null)}
              style={linkStyle('waitlist')}
            >
              Waitlist
            </Link>
            
            {/* Conditional Staff Panel Switch */}
            {(user.role === 'staff' || user.role === 'admin') && (
              <Link to="/staff/dashboard" style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', transition: 'background 0.2s', marginLeft: '4px' }}>
                Staff Control
              </Link>
            )}
            
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              style={{ backgroundColor: '#x', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginLeft: '8px', background: 'transparent' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ef4444'; }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <span style={{ height: '16px', width: '1px', backgroundColor: '#334155', margin: '0 4px' }} />
            
            <Link to="/login" onMouseEnter={() => setHoveredLink('login')} onMouseLeave={() => setHoveredLink(null)} style={linkStyle('login')}>
              Login
            </Link>
            
            <Link to="/register" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}