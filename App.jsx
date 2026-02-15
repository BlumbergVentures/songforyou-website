import { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState('create');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [story, setStory] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [artistRef, setArtistRef] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('one-time');

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
          <a href="#create" style={{ color: activeTab === 'create' ? '#8b5cf6' : 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Create Song</a>
          <a href="#how" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>How It Works</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Pricing</a>
          <button style={{
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
        <h1 style={{
          fontSize: '56px',
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Create Custom Songs<br />For Your Special Moments
        </h1>
        <p style={{
          fontSize: '20px',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
        }}>
          Turn your personal story into a professional, heartfelt song. Perfect for weddings, birthdays, anniversaries, and more.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
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
          <button style={{
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            ▶ Listen to Samples
          </button>
        </div>
      </section>

      {/* Song Creator Section */}
      <section id="create" style={{
        padding: '60px 48px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '40px',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            ✨ Create Your Personalized Song
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
            Tell us about your story and we'll craft a unique song just for you
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
              Tell us your story ✍️
            </label>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share the special memories, inside jokes, how you met, what makes them special... The more details, the more personal your song will be!"
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
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
              {story.length}/5000 characters
            </div>
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

          {/* Generate Button */}
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
            🎵 Continue to Checkout
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
        maxWidth: '1100px',
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
            { num: '1', title: 'Share Your Story', desc: 'Tell us about the person, your relationship, special memories, and the occasion. The more details, the more personal your song.' },
            { num: '2', title: 'Choose Your Style', desc: 'Select the genre, mood, and voice type. Want it to sound like your favorite artist? Let us know!' },
            { num: '3', title: 'Receive Your Song', desc: 'Our songwriters craft your custom song. Get your finished track delivered to your email within 48 hours.' },
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

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: '80px 48px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '16px' }}>
          Simple, Transparent Pricing
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '48px', fontSize: '18px' }}>
          Choose the plan that works for you
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* Single Song */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Single Song</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>Perfect for a one-time gift</p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700' }}>$10</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}> one-time</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
              {['1 custom song', 'Full-length track (2-3 min)', 'MP3 download', '1 revision included', 'Delivered in 48 hours'].map((feature, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => { setSelectedPlan('single'); setShowCheckout(true); }}
              style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              Get Started
            </button>
          </div>

          {/* 5 Songs Pack */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)',
            border: '2px solid #8b5cf6',
            borderRadius: '24px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>Most Popular</div>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>5-Song Pack</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>Best value for multiple occasions</p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700' }}>$15</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}> one-time</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
              {['5 custom songs', 'Full-length tracks (2-3 min each)', 'MP3 + WAV downloads', '2 revisions per song', 'Priority delivery (24 hours)', 'Credits never expire'].map((feature, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  <span style={{ color: '#ec4899' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => { setSelectedPlan('pack'); setShowCheckout(true); }}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}>
              Get Started
            </button>
          </div>

          {/* Unlimited */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Unlimited</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>For creators & power users</p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '48px', fontWeight: '700' }}>$19</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
              {['Unlimited songs', 'All formats (MP3, WAV, FLAC)', 'Unlimited revisions', 'Same-day delivery', 'Commercial license', 'Priority support'].map((feature, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  <span style={{ color: '#8b5cf6' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => { setSelectedPlan('unlimited'); setShowCheckout(true); }}
              style={{
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '80px 48px',
        maxWidth: '1100px',
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
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
          Frequently Asked Questions
        </h2>
        
        {[
          { q: 'How long does it take to receive my song?', a: 'Standard orders are delivered within 48 hours. Premium and Unlimited subscribers get priority delivery within 24 hours or same-day.' },
          { q: 'Can I request changes to my song?', a: 'Yes! All plans include at least one revision. Just let us know what you\'d like adjusted and we\'ll make it perfect.' },
          { q: 'What formats do I receive?', a: 'All songs come as high-quality MP3 files. Premium plans also include WAV and FLAC formats.' },
          { q: 'Can I use the song commercially?', a: 'The Unlimited plan includes a commercial license. For one-time purchases, the song is for personal use only.' },
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
          maxWidth: '700px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '32px',
          padding: '60px 48px',
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
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
            Start Creating — From $10
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
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Complete Your Order</h2>
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

            {/* Plan Selection in Modal */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
                Select Your Plan
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'single', name: '1 Song', price: '$10', desc: 'One-time purchase' },
                  { id: 'pack', name: '5 Songs', price: '$15', desc: 'Best value!', popular: true },
                  { id: 'unlimited', name: 'Unlimited', price: '$19/mo', desc: 'Monthly subscription' },
                ].map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    style={{
                      padding: '16px 20px',
                      background: selectedPlan === plan.id 
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: selectedPlan === plan.id 
                        ? '2px solid #8b5cf6'
                        : '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ color: '#fff', fontWeight: '600', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {plan.name}
                        {plan.popular && <span style={{ background: '#ec4899', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700' }}>POPULAR</span>}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{plan.desc}</div>
                    </div>
                    <div style={{ color: '#8b5cf6', fontWeight: '700', fontSize: '20px' }}>{plan.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#8b5cf6' }}>
                Email Address
              </label>
              <input
                type="email"
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
                Your song will be delivered here
              </p>
            </div>

            {/* Summary */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Plan</span>
                <span>{selectedPlan === 'single' ? '1 Song' : selectedPlan === 'pack' ? '5 Songs' : 'Unlimited'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>
                  {selectedPlan === 'single' ? '$10' : selectedPlan === 'pack' ? '$15' : '$19/mo'}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('This would connect to your payment processor!')}
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
              🔒 Complete Purchase
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' }}>
              Secure checkout powered by Stripe
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
      `}</style>
    </div>
  );
}
