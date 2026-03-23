import { colors } from '../styles/shared';

export default function CTA({ onGetStarted }) {
  return (
    <section style={{
      padding: '80px 48px',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '32px',
        padding: '60px 48px',
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          Ready to Create Something Special?
        </h2>
        <p style={{ color: colors.textMuted, fontSize: '18px', marginBottom: '32px' }}>
          7-day free trial &bull; 10 songs/month &bull; Cancel anytime
        </p>
        <button
          onClick={onGetStarted}
          style={{
            padding: '18px 48px',
            background: colors.gradient,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
          Create Your First Song
        </button>
        <p style={{
          color: colors.textFaint,
          fontSize: '13px',
          marginTop: '16px',
        }}>
          Secure checkout via Stripe. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
