import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSignIn, onSignUp }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      padding: '20px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10,10,15,0.8)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        }}>🎵</div>
        <span style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>SongForYou</span>
      </div>
      <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {user ? (
          <>
            <button onClick={() => navigate('/?scrollTo=create')} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Create Song</button>
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Dashboard</Link>
            <Link to="/account" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Account</Link>
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
            <a href="#create" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Create Song</a>
            <a href="#how" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>How It Works</a>
            <a href="#reviews" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Reviews</a>
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
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>Start Free Trial</button>
          </>
        )}
      </nav>
    </header>
  );
}
