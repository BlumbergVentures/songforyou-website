import { colors, cardHoverHandlers, sectionHeading, sectionSubheading } from '../styles/shared';

export default function Testimonials() {
  const testimonials = [
    { name: 'Sarah M.', occasion: 'Wedding Song', text: "I surprised my husband with a custom song for our first dance. There wasn't a dry eye in the house! The song captured our story perfectly.", avatar: 'S' },
    { name: 'Marcus T.', occasion: 'Birthday Song', text: "Made a song for my mom's 60th birthday with all our family memories. She plays it every day now. Best gift I've ever given.", avatar: 'M' },
    { name: 'Emily R.', occasion: 'Friendship Song', text: "Created a friendship anthem for my bestie. We've been friends for 20 years and this song says everything words couldn't.", avatar: 'E' },
    { name: 'James L.', occasion: 'Anniversary Song', text: "Used this for my anniversary. My wife was speechless. The song mentioned our first date, our kids, everything. Absolutely magical.", avatar: 'J' },
  ];

  return (
    <section id="reviews" style={{
      padding: '80px 48px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <h2 style={sectionHeading}>Stories From Our Users</h2>
      <p style={sectionSubheading}>
        Real moments made unforgettable with a custom song
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '20px',
            padding: '28px',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }} {...cardHoverHandlers}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: colors.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '600',
              }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: '600' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: colors.textMuted }}>{t.occasion}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: colors.yellow }}>★★★★★</div>
            </div>
            <p style={{ color: colors.textSecondary, fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              "{t.text}"
            </p>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: '12px',
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: '24px',
      }}>
        These testimonials represent typical experiences. Individual results may vary.
      </p>
    </section>
  );
}
