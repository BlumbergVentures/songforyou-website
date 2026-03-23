import { colors, cardHoverHandlers } from '../styles/shared';

export default function Features() {
  const features = [
    { icon: '🎵', title: 'Full Song', desc: '2-3 minutes' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Minutes, not days' },
    { icon: '🎧', title: 'MP3 Download', desc: 'Yours forever' },
    { icon: '✨', title: 'Fully Custom', desc: 'Your story, your style' },
    { icon: '🎤', title: '10 Artist Styles', desc: 'Pre-built templates' },
  ];

  return (
    <section style={{
      padding: '40px 48px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '24px',
        textAlign: 'center',
      }}>
        {features.map((item, i) => (
          <div key={i} style={{
            padding: '24px 16px',
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            cursor: 'default',
          }} {...cardHoverHandlers}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: colors.textMuted }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
