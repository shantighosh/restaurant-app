import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tracking hover states for interactive button feedback
  const [hoveredLink, setHoveredLink] = useState(null);

  const scrollToSection = (id) => {
    // If user is on a different page, take them home first, then scroll
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Account for fixed navbar height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const linkStyle = (id) => ({
    background: 'none',
    border: 'none',
    color: hoveredLink === id ? '#2563eb' : '#cbd5e1', // High interactivity hover pop
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    padding: '4px 8px'
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
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
    }}>
      {/* Branding */}
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.03em' }}>
        BISTRO<span style={{ color: '#3b82f6' }}>FLOW</span>
      </Link>
      
      {/* Right Link Group */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => setHoveredLink('home')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('home')}
        >
          Home
        </button>

        <button 
          onClick={() => scrollToSection('about-section')}
          onMouseEnter={() => setHoveredLink('about')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('about')}
        >
          About
        </button>

        <button 
          onClick={() => scrollToSection('contact-section')}
          onMouseEnter={() => setHoveredLink('contact')}
          onMouseLeave={() => setHoveredLink(null)}
          style={linkStyle('contact')}
        >
          Contact
        </button>
        
        {user ? (
          <>
            <Link to="/reserve" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '15px' }}>Book Table</Link>
            <Link to="/my-reservations" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '15px' }}>My Bookings</Link>
            <Link to="/waitlist" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '15px' }}>Waitlist</Link>
            
            {(user.role === 'staff' || user.role === 'admin') && (
              <Link to="/staff/dashboard" style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                Staff Dashboard
              </Link>
            )}
            
            <button onClick={() => { logout(); navigate('/login'); }} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '15px' }}>Login</Link>
            <Link to="/register" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}