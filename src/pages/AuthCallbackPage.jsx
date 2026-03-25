import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/shared';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        setError('Failed to confirm your email. Please try signing in again.');
        return;
      }
      // Redirect to dashboard after successful email confirmation
      navigate('/dashboard', { replace: true });
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <h1 style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            Confirmation failed
          </h1>
          <p style={{ color: colors.red, fontSize: '15px', marginBottom: '24px' }}>{error}</p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: colors.gradient,
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.purple,
      fontSize: '18px',
    }}>
      Confirming your email...
    </div>
  );
}
