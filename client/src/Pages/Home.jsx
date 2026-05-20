import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReservationForm from '../components/ReservationForm';

export default function Home() {
  const { user } = useAuth();
  
  // Interactive State for the Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API transmission reset
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', scrollBehavior: 'smooth' }}>
      
      {/* 1. HERO CANNER CANVAS SECTION */}
      <div style={{ 
        minHeight: '90vh', 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Hero Text Panel */}
          <div>
            <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
              Premium Culinary Spaces
            </span>
            <h1 style={{ fontSize: '52px', fontWeight: '400', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: '1.2', marginBottom: '24px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              "People who love to eat are always the best people."
            </h1>
            <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '32px', maxWidth: '520px' }}>
              Welcome to BistroFlow. Step into a world where seasonal pairings meet elegant atmospheres. Book your table or trace capacity structures below.
            </p>
            <button 
              onClick={() => document.getElementById('booking-portal').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 36px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)', transition: 'background 0.2s' }}
            >
              Secure Table Placement
            </button>
          </div>

          {/* Right Action Booking Form / Locked State Card */}
          <div id="booking-portal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {user ? (
              <ReservationForm />
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
                
                {/* Form Text Prompt Side */}
                <div style={{ padding: '36px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 10px 0', color: '#0f172a' }}>Secure System Portal</h3>
                  <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', margin: '0 0 24px 0' }}>Log in to view live floor assignments and grace period counters.</p>
                  <Link to="/login" style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', boxSizing: 'border-box' }}>Access Portal Login</Link>
                </div>
                
                {/* Embedded Food Signature Image Side */}
                <div style={{ backgroundImage: 'linear-gradient(to top, rgba(15,23,42,0.8), transparent), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', padding: '24px', display: 'flex', alignItems: 'flex-end' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '16px' }}>Chef's Selections</h4>
                    <p style={{ margin: '0', color: '#cbd5e1', fontSize: '11px' }}>Handcrafted arrays matched with reserve pairings.</p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. THE ABOUT STORY SECTION (CRITICAL: ID MUST MATCH NAVBAR TARGET) */}
      <div id="about-section" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '90px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ 
            height: '450px', 
            borderRadius: '20px', 
            backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
          }}></div>
          <div>
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Our Heritage & Passion</span>
            <h2 style={{ fontSize: '38px', fontWeight: '800', margin: '0 0 20px 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Redefining Contemporary Fine Dining Etiquette</h2>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '20px' }}>
              Founded with the vision to seamlessly bridge sophisticated kitchen craftsmanship with frictionless digital management, BistroFlow delivers an uninterrupted transition from booking confirmation to exceptional guest service.
            </p>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '32px' }}>
              Every single plate configuration that leaves our kitchen line is constructed using farm-to-table components gathered directly from regional organic cooperatives, guaranteeing pristine purity in every flavor balance.
            </p>
            <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
              <div><div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>100%</div><div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>Organic Ingredients</div></div>
              <div><div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>15 Min</div><div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>Strict Seating Grace Window</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CONTACT SECTION (CRITICAL: ID MUST MATCH NAVBAR TARGET) */}
      <div id="contact-section" style={{ backgroundColor: '#1e293b', padding: '90px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Connect With Our Concierge</span>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '8px 0 0 0', letterSpacing: '-0.01em' }}>We Would Love To Hear From You</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'stretch' }}>
            
            {/* Interactive Contact Form Box */}
            <form onSubmit={handleContactSubmit} style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px', color: '#0f172a', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              {submitted && (
                <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                  ✓ Message transmitted successfully! Our desk will reach out shortly.
                </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Your Name</label>
                <input type="text" required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} placeholder="e.g. Shanti Ghosh" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email Address</label>
                <input type="email" required value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} placeholder="yourname@domain.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Message / Special Inquiry</label>
                <textarea required value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', height: '120px', boxSizing: 'border-box', resize: 'vertical' }} placeholder="Tell us about catering, events, or private dining..." />
              </div>
              <button type="submit" style={{ padding: '14px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', marginTop: '10px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                Transmit Message
              </button>
            </form>

            {/* Support Information & Event Plating Graphic Panel */}
            <div style={{ 
              borderRadius: '20px', 
              overflow: 'hidden', 
              backgroundImage: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.95)), url("https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <div style={{ borderLeft: '4px solid #2563eb', paddingLeft: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Private Bookings & Banquet Events</h4>
                <p style={{ margin: '0 0 20px 0', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  Planning a corporate reception or a private gathering? Get in touch with our concierge directly to coordinate personalized multi-course arrangements.
                </p>
                <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '700' }}>📞 Hotline: +1 (555) 839-2721</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}