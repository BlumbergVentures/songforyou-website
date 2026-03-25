import { Link } from 'react-router-dom';
import { colors } from '../styles/shared';

export default function NotFoundPage() {
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
        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.6 }}>404</div>
        <h1 style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Page not found
        </h1>
        <p style={{ color: colors.textMuted, fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
          This page doesn't exist. Let's get you back on track.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: colors.gradient,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
