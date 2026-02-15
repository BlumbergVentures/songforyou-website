import { useState } from 'react';

// ============================================================
// ✅ YOUR STRIPE PAYMENT LINK
// ============================================================
const STRIPE_LINK = 'https://buy.stripe.com/3cI28sd6l7Ks3IQ1HF53O01';
// ============================================================

const genres = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Folk', 'Jazz', 'Electronic',
  'EDM', 'Soul', 'Reggae', 'Latin', 'Classical', 'Indie', 'Metal', 'Punk',
  'Blues', 'Funk', 'Disco', 'House', 'Lo-Fi', 'Acoustic'
];

const moods = [
  'Happy', 'Sad', 'Romantic', 'Energetic', 'Chill', 'Nostalgic', 
  'Uplifting', 'Melancholic', 'Playful', 'Dramatic', 'Peaceful', 'Intense'
];

const voices = [
  'Male', 'Female', 'Duet', 'Choir', 'Instrumental Only'
];

const occasions = [
  { id: 'wedding', name: 'Wedding', icon: '💒' },
  { id: 'birthday', name: 'Birthday', icon: '🎂' },
  { id: 'anniversary', name: 'Anniversary', icon: '💝' },
  { id: 'proposal', name: 'Proposal', icon: '💍' },
  { id: 'memorial', name: 'Memorial', icon: '🕯️' },
  { id: 'graduation', name: 'Graduation', icon: '🎓' },
  { id: 'baby', name: 'New Baby', icon: '👶' },
  { id: 'friendship', name: 'Friendship', icon: '🤝' },
  { id: 'apology', name: 'Apology', icon: '💐' },
  { id: 'thankyou', name: 'Thank You', icon: '🙏' },
  { id: 'motivation', name: 'Motivation', icon: '💪' },
  { id: 'other', name: 'Other', icon: '✨' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Bride', text: "I surprised my husband with a custom song for our first dance. There wasn't a dry eye in the house! The song captured our story perfectly.", avatar: 'S' },
  { name: 'Marcus T.', role: 'Son', text: "Made a song for my mom's 60th birthday with all our family memories. She plays it every day now. Best gift I've ever given.", avatar: 'M' },
  { name: 'Emily R.', role: 'Best Friend', text: "Created a friendship anthem for my bestie. We've been friends for 20 years and this song says everything words couldn't.", avatar: 'E' },
  { name: 'James L.', role: 'Husband', text: "Used this for my anniversary. My wife was speechless. The song mentioned our first date, our kids, everything. Absolutely magical.", avatar: 'J' },
];

export default function SongCreator() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [story, setStory] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [artistRef, setArtistRef] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleMood = (mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const canGenerate = selectedGenres.length > 0 && story.length > 10;

  // Generate order details
  const getOrderDetails = () => {
    return {
      occasion: occasions.find(o => o.id === selectedOccasion)?.name || 'Not specified',
      recipient: recipientName || 'Not specified',
      genres: selectedGenres.join(', ') || 'Not specified',
      moods: selectedMoods.join(', ') || 'Not specified',
      voice: selectedVoice || 'Not specified',
      artistReference: artistRef || 'None',
      story: story,
      customerEmail: customerEmail,
    };
  };

  // Handle checkout - redirects to Stripe
  const handleCheckout = () => {
    const orderDetails = getOrderDetails();
    
    // Save order details to localStorage
    localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
    
    // Add customer email to Stripe link if provided
    let checkoutUrl = STRIPE_LINK;
    if (customerEmail) {
      checkoutUrl += `?prefilled_email=${encodeURIComponent(customerEmail)}`;
    }
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
  };

  // Copy order details for manual processing
  const copyOrderDetails = () => {
    const details = getOrderDetails();
    const text = `
NEW SONG ORDER
==============
Customer Email: ${details.customerEmail}
Occasion: ${details.occasion}
For: ${details.recipient}
Genres: ${details.genres}
Moods: ${details.moods}
Voice: ${details.voice}
Artist Reference: ${details.artistReference}

STORY:
${details.story}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Order details copied! Paste this in the "Notes" field during checkout.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        right: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
      }} />

      {/* Header */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>🎵</div>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>SongForYou</span>
        </div>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#create" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Create Song</a>
          <a href="#how" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>How It Works</a>
          <a href="#reviews" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Reviews</a>
          <button 
            onClick={() => document.getElementById('create').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>Get Started</button>
        </nav>
      </header>

      {/* Hero Section */}
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
          🎁 The Perfect Personalized Gift
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
          Only $19
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => document.getElementById('create').scrollIntoView({ behavior: 'smooth' })}
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
            🎤 Create Your Song
          </button>
        </div>
      </section>

      {/* What You Get */}
      <section style={{
        padding: '40px 48px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          textAlign: 'center',
        }}>
          {[
            { icon: '🎵', title: 'Full Song', desc: '2-3 minutes' },
            { icon: '⚡', title: 'Fast Delivery', desc: '48 hours' },
            { icon: '🎧', title: 'MP3 Download', desc: 'Yours forever' },
            { icon: '✨', title: 'Fully Custom', desc: 'Your story' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '24px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Song Creator Section */}
      <section id="create" style={{
        padding: '60px 48px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
            ✨ Create Your Song
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', textAlign: 'center' }}>
            Fill out the details below and we'll craft a unique song just for you
          </p>

          {/* Occasion Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              What's the occasion?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {occasions.map(occ => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  style={{
                    padding: '10px 16px',
                    background: selectedOccasion === occ.id 
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedOccasion === occ.id 
                      ? '1px solid #8b5cf6'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    color: selectedOccasion === occ.id ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{occ.icon}</span>
                  {occ.name}
                </button>
              ))}
            </div>
          </div>

          {/* Who is it for */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Who is this song for?
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter their name..."
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Story */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Tell us your story ✍️ <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>— The more details, the better!</span>
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share the special memories, inside jokes, how you met, what makes them special, specific phrases you'd like included..."
              rows={5}
              style={{
                width: '100%',
                padding: '16px 18px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: '1.6',
              }}
            />
          </div>

          {/* Genre Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Style / Genre <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>— Select one or more</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  style={{
                    padding: '8px 16px',
                    background: selectedGenres.includes(genre) 
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Mood
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  style={{
                    padding: '8px 16px',
                    background: selectedMoods.includes(mood) 
                      ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
                      : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Voice Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {voices.map(voice => (
                <button
                  key={voice}
                  onClick={() => setSelectedVoice(voice)}
                  style={{
                    padding: '12px 24px',
                    background: selectedVoice === voice 
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedVoice === voice 
                      ? '2px solid #8b5cf6'
                      : '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>

          {/* Artist Reference */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
              Artist Reference <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>— Optional</span>
            </label>
            <input
              type="text"
              value={artistRef}
              onChange={(e) => setArtistRef(e.target.value)}
              placeholder="e.g., 'Like Ed Sheeran meets John Legend'"
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setShowCheckout(true)}
            disabled={!canGenerate}
            style={{
              width: '100%',
              padding: '18px',
              background: canGenerate 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: canGenerate ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: '18px',
              fontWeight: '700',
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
            }}
          >
            🎵 Get My Custom Song — $19
          </button>
          {!canGenerate && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' }}>
              Please select at least one genre and tell us your story to continue
            </p>
          )}
        </div>
      </section>

      {/* How It Works */}
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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { num: '1', title: 'Share Your Story', desc: 'Tell us about the person, your memories together, and the occasion.' },
            { num: '2', title: 'Choose Your Style', desc: 'Pick the genre, mood, and voice type you want for your song.' },
            { num: '3', title: 'Receive Your Song', desc: 'Get your custom song delivered to your email within 48 hours!' },
          ].map((step, i) => (
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

      {/* Testimonials */}
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

      {/* FAQ */}
      <section style={{
        padding: '80px 48px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
          Questions & Answers
        </h2>
        
        {[
          { q: 'How long does it take to receive my song?', a: 'Your custom song will be delivered to your email within 48 hours of purchase.' },
          { q: 'Can I request changes to my song?', a: 'Yes! If you\'d like adjustments, just reply to your delivery email and we\'ll make revisions.' },
          { q: 'What format will I receive?', a: 'You\'ll receive a high-quality MP3 file that you can play on any device.' },
          { q: 'Is this a real song or AI-generated?', a: 'We use advanced AI music technology to create professional-quality songs based on your unique story.' },
        ].map((faq, i) => (
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

      {/* CTA */}
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
            Turn your memories into a song they'll never forget
          </p>
          <button 
            onClick={() => document.getElementById('create').scrollIntoView({ behavior: 'smooth' })}
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
            Create My Song — $19
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>🎵</div>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>SongForYou</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          © 2025 SongForYou. Creating memories through music.
        </p>
      </footer>

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Almost There! 🎵</h2>
              <button 
                onClick={() => setShowCheckout(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}>×</button>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#8b5cf6' }}>
                Your Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                Your song will be delivered here within 48 hours
              </p>
            </div>

            {/* Order Summary */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <h4 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontWeight: '600' }}>YOUR SONG DETAILS</h4>
              
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Occasion:</strong> {occasions.find(o => o.id === selectedOccasion)?.name || 'Not selected'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>For:</strong> {recipientName || 'Not specified'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Style:</strong> {selectedGenres.join(', ') || 'Not selected'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Mood:</strong> {selectedMoods.join(', ') || 'Not selected'}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                <strong style={{ color: '#fff' }}>Voice:</strong> {selectedVoice || 'Not selected'}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>$19</span>
              </div>
            </div>

            {/* Important Note */}
            <div style={{
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
            }}>
              <p style={{ fontSize: '13px', color: '#fbbf24', margin: 0, lineHeight: '1.5' }}>
                <strong>Important:</strong> After clicking the button below, please copy your order details and paste them in the checkout notes so we can create your perfect song!
              </p>
            </div>

            {/* Copy Details Button */}
            <button
              onClick={copyOrderDetails}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              📋 Copy My Song Details
            </button>

            {/* Pay Button */}
            <button
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              🔒 Pay $19 with Stripe
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>
              Secure checkout • Your song delivered in 48 hours
            </p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        ::placeholder {
          color: rgba(255,255,255,0.3);
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        button:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          header {
            padding: 16px 20px !important;
          }
          header nav {
            display: none !important;
          }
          section {
            padding: 40px 20px !important;
          }
          h1 {
            font-size: 36px !important;
          }
          h2 {
            font-size: 28px !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
