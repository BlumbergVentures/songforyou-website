import { colors } from '../styles/shared';

export default function Hero({ onGetStarted }) {
  return (
    <section style={{
      padding: '80px 48px 60px',
      textAlign: 'center',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-block',
        padding: '8px 16px',
        background: 'rgba(139,92,246,0.2)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '20px',
        fontSize: '14px',
        color: colors.purpleLight,
        marginBottom: '24px',
      }}>
        7-Day Free Trial &bull; 10 Songs/Month
      </div>
      <h1 style={{
        fontSize: '56px',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Turn Your Story Into<br />A Custom Song
      </h1>
      <p style={{
        fontSize: '20px',
        color: colors.textMuted,
        maxWidth: '600px',
        margin: '0 auto 16px',
        lineHeight: '1.6',
      }}>
        Create a one-of-a-kind song for weddings, birthdays, anniversaries, or any special moment. Just share your story — we'll handle the rest.
      </p>
      <p style={{
        fontSize: '28px',
        fontWeight: '700',
        color: colors.purple,
        marginBottom: '32px',
      }}>
        Try free for 7 days, then $9.99/week <span style={{ fontSize: '18px', fontWeight: '500', color: colors.textFaint }}>(~$43/month)</span>
      </p>
      <button
        onClick={onGetStarted}
        style={{
          padding: '16px 36px',
          background: colors.gradient,
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '17px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        Create Your First Song
      </button>
      <p style={{
        fontSize: '14px',
        color: colors.textFaint,
        marginTop: '16px',
      }}>
        7-day free trial. Cancel anytime. Credit card required at checkout.
      </p>
    </section>
  );
}
