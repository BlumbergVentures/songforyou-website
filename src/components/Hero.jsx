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
        color: '#a78bfa',
        marginBottom: '24px',
      }}>
        🎁 7-Day Free Trial • 10 Songs/Month
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
        color: 'rgba(255,255,255,0.6)',
        maxWidth: '600px',
        margin: '0 auto 16px',
        lineHeight: '1.6',
      }}>
        Create a one-of-a-kind song for weddings, birthdays, anniversaries, or any special moment. Just share your story — we'll handle the rest.
      </p>
      <p style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#8b5cf6',
        marginBottom: '32px',
      }}>
        Start Free — Then $9.99/week
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onGetStarted}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          🎤 Start Your Free Trial
        </button>
      </div>
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.4)',
        marginTop: '16px',
      }}>
        No credit card required to browse. Cancel anytime.
      </p>
    </section>
  );
}
