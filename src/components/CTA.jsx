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
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '32px' }}>
          7-day free trial • 10 songs/month • Cancel anytime
        </p>
        <button
          onClick={onGetStarted}
          style={{
            padding: '18px 48px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
          }}>
          Start Free Trial
        </button>
      </div>
    </section>
  );
}
