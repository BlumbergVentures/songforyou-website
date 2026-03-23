import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const { signUp, signIn } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSignUpSuccess(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSignUpSuccess(true);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSignUpSuccess(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '4px',
      lineHeight: 1,
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 700,
      marginBottom: '8px',
      textAlign: 'center',
    },
    subtitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '14px',
      marginBottom: '32px',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    label: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '13px',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '8px',
      opacity: isLoading ? 0.7 : 1,
    },
    error: {
      color: '#ef4444',
      fontSize: '13px',
      textAlign: 'center',
      padding: '8px',
      background: 'rgba(239,68,68,0.1)',
      borderRadius: '8px',
    },
    success: {
      color: '#22c55e',
      fontSize: '14px',
      textAlign: 'center',
      padding: '16px',
      background: 'rgba(34,197,94,0.1)',
      borderRadius: '8px',
    },
    toggleText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '20px',
    },
    toggleLink: {
      color: '#8b5cf6',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      fontWeight: 600,
      padding: 0,
    },
  };

  if (signUpSuccess) {
    return (
      <div style={styles.overlay} onClick={handleOverlayClick}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>
          <div style={styles.title}>Check your email</div>
          <div style={styles.success}>
            Check your email to confirm your account
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>
        <div style={styles.title}>
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </div>
        <div style={styles.subtitle}>
          {mode === 'signin'
            ? 'Sign in to your account'
            : 'Sign up to get started'}
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={isLoading}>
            {isLoading
              ? 'Loading...'
              : mode === 'signin'
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        <div style={styles.toggleText}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button style={styles.toggleLink} onClick={toggleMode}>
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
