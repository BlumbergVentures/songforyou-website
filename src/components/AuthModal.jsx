import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp, signIn, resetPassword, signInWithGoogle } = useAuth();

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
        await signUp(email, password, displayName.trim() || undefined);
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

        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={async () => {
                setError('');
                setIsLoading(true);
                try {
                  await signInWithGoogle();
                } catch (err) {
                  setError(err.message);
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#ffffff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#1f2937',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '4px 0',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>
          </>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          {mode === 'signup' && (
            <div>
              <label style={styles.label}>Display Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}

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
