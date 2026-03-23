import { colors, cardHoverHandlers, sectionHeading, sectionSubheading } from '../styles/shared';

export default function HowItWorks() {
  const steps = [
    { num: '1', title: 'Share Your Story', desc: 'Tell us about the person, your memories together, and the occasion.' },
    { num: '2', title: 'Choose Your Style', desc: 'Pick from 10 artist templates like Ed Sheeran or Adele, or fully customize your genre, mood, and voice.' },
    { num: '3', title: 'Receive Your Song', desc: 'Your custom song is created using AI and delivered to your email and dashboard in minutes.' },
  ];

  return (
    <section id="how" style={{
      padding: '80px 48px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <h2 style={sectionHeading}>How It Works</h2>
      <p style={{ ...sectionSubheading, marginBottom: '60px' }}>
        Get your personalized song in 3 simple steps
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }} {...cardHoverHandlers}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: colors.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 auto 20px',
            }}>{step.num}</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{step.title}</h3>
            <p style={{ color: colors.textMuted, fontSize: '15px', lineHeight: '1.6' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
