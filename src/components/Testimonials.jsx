export default function Testimonials() {
  const testimonials = [
    { name: 'Sarah M.', role: 'Bride', text: "I surprised my husband with a custom song for our first dance. There wasn't a dry eye in the house! The song captured our story perfectly.", avatar: 'S' },
    { name: 'Marcus T.', role: 'Son', text: "Made a song for my mom's 60th birthday with all our family memories. She plays it every day now. Best gift I've ever given.", avatar: 'M' },
    { name: 'Emily R.', role: 'Best Friend', text: "Created a friendship anthem for my bestie. We've been friends for 20 years and this song says everything words couldn't.", avatar: 'E' },
    { name: 'James L.', role: 'Husband', text: "Used this for my anniversary. My wife was speechless. The song mentioned our first date, our kids, everything. Absolutely magical.", avatar: 'J' },
  ];

  return (
    <section id="reviews" style={{
      padding: '80px 48px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '16px' }}>
        Loved by Thousands
      </h2>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '48px', fontSize: '18px' }}>
        See what our customers are saying
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '600',
              }}>{t.avatar}</div>
              <div>
                <div style={{ fontWeight: '600' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{t.role}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#fbbf24' }}>★★★★★</div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              "{t.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
