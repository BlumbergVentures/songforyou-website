export default function FAQ() {
  const faqs = [
    { q: 'How long does it take to receive my song?', a: 'Your custom song will be delivered to your email within 48 hours of submission.' },
    { q: 'How does the subscription work?', a: 'Start with a 7-day free trial. After that, it\'s $9.99/week for up to 10 custom songs per month. Cancel anytime from your account page.' },
    { q: 'What artist styles are available?', a: 'Choose from 10 pre-built artist templates including Ed Sheeran, Taylor Swift, Adele, Drake, and more — or create a fully custom style.' },
    { q: 'Can I request changes to my song?', a: 'Yes! If you\'d like adjustments, just reply to your delivery email and we\'ll make revisions.' },
    { q: 'What format will I receive?', a: 'You\'ll receive a high-quality MP3 file that you can play on any device.' },
    { q: 'Is this a real song or AI-generated?', a: 'We use advanced AI music technology to create professional-quality songs based on your unique story.' },
  ];

  return (
    <section style={{
      padding: '80px 48px',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
        Questions & Answers
      </h2>

      {faqs.map((faq, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '12px' }}>{faq.q}</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
        </div>
      ))}
    </section>
  );
}
