import { colors, sectionStyle, sectionHeading, sectionSubheading } from '../styles/shared';

const features = [
  'Up to 10 custom songs per month',
  'AI-generated in minutes, not days',
  'High-quality MP3 downloads',
  '10+ artist style templates',
  'Custom genre, mood & voice options',
  'Delivered to your email & dashboard',
  'Cancel anytime — no questions asked',
];

export default function Pricing({ onGetStarted }) {
  return (
    <section id="pricing" style={sectionStyle}>
      <h2 style={sectionHeading}>Simple, Transparent Pricing</h2>
      <p style={sectionSubheading}>One plan. Everything included.</p>

      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)',
        border: `1px solid ${colors.cardBorderHover}`,
        borderRadius: '24px',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: 'rgba(139,92,246,0.2)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px',
          fontSize: '13px',
          color: colors.purpleLight,
          marginBottom: '24px',
          fontWeight: '600',
        }}>
          SongForYou Pro
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '48px', fontWeight: '800', color: '#fff' }}>$9.99</span>
          <span style={{ fontSize: '20px', color: colors.textMuted, fontWeight: '500' }}>/week</span>
        </div>
        <p style={{ color: colors.textFaint, fontSize: '15px', marginBottom: '8px' }}>
          ~$43/month
        </p>
        <p style={{
          color: colors.green,
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '32px',
        }}>
          Start with a 7-day free trial
        </p>

        <div style={{
          textAlign: 'left',
          marginBottom: '32px',
        }}>
          {features.map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              borderBottom: i < features.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{
                color: colors.green,
                fontSize: '16px',
                flexShrink: 0,
              }}>✓</span>
              <span style={{
                color: colors.textSecondary,
                fontSize: '15px',
              }}>{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onGetStarted}
          style={{
            width: '100%',
            padding: '16px',
            background: colors.gradient,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          Start Your 7-Day Free Trial
        </button>
        <p style={{
          color: colors.textFaint,
          fontSize: '13px',
          margin: 0,
        }}>
          Secure checkout via Stripe. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
