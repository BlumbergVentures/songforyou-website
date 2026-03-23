export default function HowItWorks() {
  const steps = [
    { num: '1', title: 'Share Your Story', desc: 'Tell us about the person, your memories together, and the occasion.' },
    { num: '2', title: 'Choose Your Style', desc: 'Pick from 10 artist templates like Ed Sheeran or Adele, or fully customize your genre, mood, and voice.' },
    { num: '3', title: 'Receive Your Song', desc: 'Your AI-generated song is delivered to your email and dashboard in minutes!' },
  ];

  return (
    <section id="how" style={{
      padding: '80px 48px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '16px' }}>
        How It Works
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '60px', fontSize: '18px' }}>
        Get your personalized song in 3 simple steps
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 auto 20px',
            }}>{step.num}</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{step.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
