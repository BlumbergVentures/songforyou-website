import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, signIn, resetPassword } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSignUpSuccess(false);
    setResetSent(false);
    setAgreedToTerms(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (mode === 'signup' && !agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
        setSignUpSuccess(true);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
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
    setResetSent(false);
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
          <button style={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
          <div style={styles.title}>Check your email</div>
          <div style={styles.success}>
            Check your email to confirm your account
          </div>
        </div>
      </div>
    );
  }

  if (resetSent) {
    return (
      <div style={styles.overlay} onClick={handleOverlayClick}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
          <div style={styles.title}>Check your email</div>
          <div style={styles.success}>
            If an account exists for {email}, you'll receive a password reset link.
          </div>
          <div style={styles.toggleText}>
            <button style={styles.toggleLink} onClick={() => { setMode('signin'); setResetSent(false); }}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const titles = {
    signin: 'Welcome Back',
    signup: 'Create Account',
    forgot: 'Reset Password',
  };

  const subtitles = {
    signin: 'Sign in to your account',
    signup: 'Sign up to get started',
    forgot: 'Enter your email to receive a reset link',
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
        <div style={styles.title}>{titles[mode]}</div>
        <div style={styles.subtitle}>{subtitles[mode]}</div>

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

          {mode !== 'forgot' && (
            <div>
              <label style={styles.label}>Password{mode === 'signup' ? ' (min 8 characters)' : ''}</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 8 : undefined}
              />
            </div>
          )}

          {mode === 'signup' && (
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
            }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: '3px', accentColor: '#8b5cf6' }}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" style={{ color: '#8b5cf6', textDecoration: 'none' }} onClick={onClose}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={{ color: '#8b5cf6', textDecoration: 'none' }} onClick={onClose}>
                  Privacy Policy
                </Link>
              </span>
            </label>
          )}

          <button style={styles.button} type="submit" disabled={isLoading}>
            {isLoading
              ? 'Loading...'
              : mode === 'signin'
              ? 'Sign In'
              : mode === 'forgot'
              ? 'Send Reset Link'
              : 'Sign Up'}
          </button>
        </form>

        {mode === 'signin' && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              style={{ ...styles.toggleLink, fontSize: '13px', fontWeight: 400 }}
              onClick={() => { setMode('forgot'); setError(''); }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {mode === 'forgot' ? (
          <div style={styles.toggleText}>
            <button style={styles.toggleLink} onClick={() => { setMode('signin'); setError(''); }}>
              Back to Sign In
            </button>
          </div>
        ) : (
          <div style={styles.toggleText}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button style={styles.toggleLink} onClick={toggleMode}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
