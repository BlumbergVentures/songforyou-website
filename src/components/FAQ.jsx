import { useState } from 'react';
import { colors, sectionHeading } from '../styles/shared';

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    { q: 'How long does it take to receive my song?', a: 'Songs are generated automatically using AI and typically delivered to your email and dashboard within minutes of submission.' },
    { q: 'How does the subscription work?', a: 'Start with a 7-day free trial. After that, it\'s $9.99/week (about $43/month) for up to 10 custom songs per month. Cancel anytime from your account page — no questions asked.' },
    { q: 'What artist styles are available?', a: 'Choose from 10 pre-built artist templates including Ed Sheeran, Taylor Swift, Adele, Drake, and more — or create a fully custom style with your choice of genre, mood, and voice.' },
    { q: 'Can I request changes to my song?', a: 'Yes! If you\'d like adjustments, just reply to your delivery email and we\'ll make revisions.' },
    { q: 'What format will I receive?', a: 'You\'ll receive a high-quality MP3 file that you can play on any device.' },
    { q: 'How are the songs created?', a: 'Your songs are created using AI music generation technology. The AI composes original music and vocals based on your story, producing professional-quality songs in minutes rather than days.' },
    { q: 'Do I need a credit card to start?', a: 'Yes. When you subscribe, you\'ll be redirected to Stripe (our secure payment processor) to set up your 7-day free trial. You won\'t be charged during the trial period, and you can cancel anytime from your account page.' },
    { q: 'What\'s your refund policy?', a: 'You can cancel your subscription anytime from your account page. Since each song is uniquely generated for you, we\'re unable to offer refunds on individual songs, but your free trial gives you the chance to try the service risk-free.' },
  ];

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{
      padding: '80px 48px',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <h2 style={{ ...sectionHeading, marginBottom: '48px' }}>
        Questions & Answers
      </h2>

      {faqs.map((faq, i) => {
        const isExpanded = expandedIndex === i;
        return (
          <div key={i} style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '16px',
            marginBottom: '12px',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease',
            ...(isExpanded ? { borderColor: colors.cardBorderHover } : {}),
          }}>
            <button
              onClick={() => toggleFaq(i)}
              style={{
                width: '100%',
                padding: '20px 24px',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span>{faq.q}</span>
              <span style={{
                fontSize: '20px',
                color: colors.textMuted,
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
              }}>
                ▾
              </span>
            </button>
            <div style={{
              maxHeight: isExpanded ? '300px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
              <p style={{
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: '1.6',
                margin: 0,
                padding: '0 24px 20px',
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
