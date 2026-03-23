import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/shared';

export default function Header({ onSignIn, onSignUp }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  const handleMobileLink = (action) => {
    closeMobile();
    if (typeof action === 'function') action();
  };

  return (
    <>
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${colors.cardBorder}`,
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: colors.headerBg,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: colors.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>🎵</div>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            background: colors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>SongForYou</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {user ? (
            <>
              <button onClick={() => navigate('/?scrollTo=create')} style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Create Song</button>
              <Link to="/dashboard" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Dashboard</Link>
              <Link to="/account" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Account</Link>
              <button
                onClick={signOut}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>Sign Out</button>
            </>
          ) : (
            <>
              <a href="#how" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>How It Works</a>
              <a href="#pricing" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Pricing</a>
              <a href="#reviews" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Reviews</a>
              <button
                onClick={onSignIn}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>Sign In</button>
              <button
                onClick={onSignUp}
                style={{
                  padding: '10px 24px',
                  background: colors.gradient,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>Get Started</button>
            </>
          )}
        </nav>

        {/* Hamburger Button (mobile) */}
        <button
          className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeMobile(); }}>
          {user ? (
            <>
              <button onClick={() => handleMobileLink(() => navigate('/?scrollTo=create'))}>Create Song</button>
              <Link to="/dashboard" onClick={closeMobile}>Dashboard</Link>
              <Link to="/account" onClick={closeMobile}>Account</Link>
              <button onClick={() => handleMobileLink(signOut)}>Sign Out</button>
            </>
          ) : (
            <>
              <a href="#how" onClick={closeMobile}>How It Works</a>
              <a href="#pricing" onClick={closeMobile}>Pricing</a>
              <a href="#reviews" onClick={closeMobile}>Reviews</a>
              <a href="#create" onClick={closeMobile}>Create Song</a>
              <button onClick={() => handleMobileLink(onSignIn)}>Sign In</button>
              <button className="mobile-cta" onClick={() => handleMobileLink(onSignUp)}>Get Started</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
