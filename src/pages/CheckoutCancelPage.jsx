import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { colors, sectionStyle } from '../styles/shared';

export default function CheckoutCancelPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      <Header />
      <div style={{ ...sectionStyle, paddingTop: '140px', textAlign: 'center', maxWidth: '560px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(251,191,36,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 24px',
        }}>
          ←
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: colors.textPrimary, marginBottom: '12px' }}>
          Checkout cancelled
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: '17px', lineHeight: 1.6, marginBottom: '12px' }}>
          No worries — you weren't charged. Your song request has been saved.
        </p>
        <p style={{ color: colors.textMuted, fontSize: '15px', lineHeight: 1.6, marginBottom: '36px' }}>
          When you're ready, you can start your free trial and create your first custom song.
        </p>
        <Link
          to="/#pricing"
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: colors.gradient,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View Pricing
        </Link>
      </div>
      <Footer />
    </div>
  );
}
