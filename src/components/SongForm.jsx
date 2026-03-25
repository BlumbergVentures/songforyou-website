import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const genreOptions = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Folk', 'Jazz', 'Electronic',
  'EDM', 'Soul', 'Reggae', 'Latin', 'Classical', 'Indie', 'Metal', 'Punk',
  'Blues', 'Funk', 'Disco', 'House', 'Lo-Fi', 'Acoustic'
];

const moodOptions = [
  'Happy', 'Sad', 'Romantic', 'Energetic', 'Chill', 'Nostalgic',
  'Uplifting', 'Melancholic', 'Playful', 'Dramatic', 'Peaceful', 'Intense'
];

const voiceOptions = [
  'Male', 'Female', 'Duet', 'Choir', 'Instrumental Only'
];

const occasions = [
  { id: 'wedding', name: 'Wedding', icon: '\u{1F492}' },
  { id: 'birthday', name: 'Birthday', icon: '\u{1F382}' },
  { id: 'anniversary', name: 'Anniversary', icon: '\u{1F49D}' },
  { id: 'proposal', name: 'Proposal', icon: '\u{1F48D}' },
  { id: 'memorial', name: 'Memorial', icon: '\u{1F56F}\uFE0F' },
  { id: 'graduation', name: 'Graduation', icon: '\u{1F393}' },
  { id: 'baby', name: 'New Baby', icon: '\u{1F476}' },
  { id: 'friendship', name: 'Friendship', icon: '\u{1F91D}' },
  { id: 'apology', name: 'Apology', icon: '\u{1F490}' },
  { id: 'thankyou', name: 'Thank You', icon: '\u{1F64F}' },
  { id: 'motivation', name: 'Motivation', icon: '\u{1F4AA}' },
  { id: 'other', name: 'Other', icon: '\u2728' },
];

export default function SongForm({ onAuthRequired }) {
  const { user, customer } = useAuth();

  // Artist templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Form fields
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [story, setStory] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [artistRef, setArtistRef] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [songsRemaining, setSongsRemaining] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  // Fetch artist templates on mount
  useEffect(() => {
    if (!supabase) {
      setTemplatesLoading(false);
      return;
    }
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('artist_templates')
          .select('*')
          .eq('active', true)
          .order('name');
        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        console.error('Error fetching artist templates:', err);
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  // When a template is selected, pre-fill fields (unless custom)
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setErrorMessage('');
    setSuccessMessage('');

    if (template.slug !== 'custom') {
      setSelectedGenres(template.genres || []);
      setSelectedMoods(template.moods || []);
      setSelectedVoice(template.voice_type || '');
      setArtistRef(template.artist_reference || '');
    } else {
      // Reset to manual entry
      setSelectedGenres([]);
      setSelectedMoods([]);
      setSelectedVoice('');
      setArtistRef('');
    }
  };

  const isCustom = selectedTemplate?.slug === 'custom';

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

  // Validation
  const hasGenres = selectedTemplate && selectedTemplate.slug !== 'custom'
    ? true
    : selectedGenres.length > 0;
  const hasStory = story.length > 10;
  const canSubmit = hasGenres && hasStory && selectedTemplate;

  const hasActiveSubscription = customer &&
    (customer.subscription_status === 'active' || customer.subscription_status === 'trialing');

  // Handle subscribe
  const handleSubscribe = async () => {
    setSubscribing(true);
    setErrorMessage('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onAuthRequired?.();
        return;
      }
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create subscription');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }

    if (!hasActiveSubscription) {
      // Should not reach here because the button changes, but just in case
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onAuthRequired?.();
        return;
      }

      const body = {
        occasion: selectedOccasion || null,
        recipientName: recipientName || null,
        genres: selectedGenres,
        moods: selectedMoods,
        voiceType: selectedVoice || null,
        artistReference: artistRef || null,
        story,
        artistTemplateSlug: (selectedTemplate && selectedTemplate.slug !== 'custom')
          ? selectedTemplate.slug
          : null,
      };

      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-song-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create song request');
      }

      const remaining = data.songsRemaining ?? data.songs_remaining ?? null;
      setSongsRemaining(remaining);
      setSuccessMessage("Song request submitted! Your song is being generated and will be delivered to your email in minutes.");

      // Reset form
      setSelectedOccasion('');
      setRecipientName('');
      setStory('');
      setSelectedGenres([]);
      setSelectedMoods([]);
      setSelectedVoice('');
      setArtistRef('');
      setSelectedTemplate(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Determine which action button to show
  const renderActionButton = () => {
    // Not authenticated
    if (!user) {
      return (
        <button
          onClick={() => onAuthRequired?.()}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: '18px',
            background: canSubmit
              ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
              : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '12px',
            color: canSubmit ? '#fff' : 'rgba(255,255,255,0.4)',
            fontSize: '18px',
            fontWeight: '700',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
          }}
        >
          Sign Up Free to Create Your Song
        </button>
      );
    }

    // Authenticated but no subscription
    if (!hasActiveSubscription) {
      return (
        <>
          <button
            onClick={handleSubscribe}
            disabled={subscribing || !canSubmit}
            style={{
              width: '100%',
              padding: '18px',
              background: (canSubmit && !subscribing)
                ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: (canSubmit && !subscribing) ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: '18px',
              fontWeight: '700',
              cursor: (canSubmit && !subscribing) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
            }}
          >
            {subscribing ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Redirecting...
              </>
            ) : (
              'Start Free Trial & Create This Song'
            )}
          </button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>
            You'll be redirected to Stripe to set up your 7-day free trial.
          </p>
        </>
      );
    }

    // Authenticated with active subscription
    return (
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        style={{
          width: '100%',
          padding: '18px',
          background: (canSubmit && !submitting)
            ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
            : 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '12px',
          color: (canSubmit && !submitting) ? '#fff' : 'rgba(255,255,255,0.4)',
          fontSize: '18px',
          fontWeight: '700',
          cursor: (canSubmit && !submitting) ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
        }}
      >
        {submitting ? (
          <>
            <span style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Creating Your Song...
          </>
        ) : (
          '\u{1F3B5} Create My Custom Song'
        )}
      </button>
    );
  };

  return (
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
          \u2728 Create Your Song
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', textAlign: 'center' }}>
          Fill out the details below and we'll craft a unique song just for you
        </p>

        {/* Artist Template Selection */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
            Choose an Artist Style
          </label>
          {templatesLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
            }}>
              Loading styles...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}>
              {templates.map(template => {
                const isSelected = selectedTemplate?.slug === template.slug;
                const isCustomTemplate = template.slug === 'custom';
                return (
                  <button
                    key={template.slug}
                    onClick={() => handleTemplateSelect(template)}
                    style={{
                      padding: '16px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)'
                        : 'rgba(255,255,255,0.05)',
                      border: isSelected
                        ? '2px solid #8b5cf6'
                        : isCustomTemplate
                          ? '2px dashed rgba(255,255,255,0.25)'
                          : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '6px',
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {template.description}
                    </div>
                    {template.voice_type && (
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        background: 'rgba(139,92,246,0.2)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#a78bfa',
                      }}>
                        {template.voice_type}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

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
            Tell us your story \u270D\uFE0F <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>&mdash; The more details, the better!</span>
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

        {/* Custom-only fields: Genre, Mood, Voice, Artist Reference */}
        {isCustom && (
          <>
            {/* Genre Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#8b5cf6' }}>
                Style / Genre <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>&mdash; Select one or more</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {genreOptions.map(genre => (
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
                {moodOptions.map(mood => (
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
                {voiceOptions.map(voice => (
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
                Artist Reference <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>&mdash; Optional</span>
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
          </>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '20px' }}>\u2705</span>
            <div>
              <p style={{ margin: 0, color: '#4ade80', fontSize: '15px', fontWeight: '600' }}>
                {successMessage}
              </p>
              {songsRemaining !== null && (
                <p style={{ margin: '4px 0 0', color: 'rgba(74,222,128,0.7)', fontSize: '13px' }}>
                  Songs remaining this month: {songsRemaining}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '20px' }}>\u274C</span>
            <p style={{ margin: 0, color: '#f87171', fontSize: '14px' }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Action Button */}
        {renderActionButton()}

        {!canSubmit && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' }}>
            {!selectedTemplate
              ? 'Please choose an artist style, then tell us your story to continue'
              : !hasStory
                ? 'Please tell us your story (more than 10 characters) to continue'
                : 'Please select at least one genre to continue'}
          </p>
        )}
      </div>

    </section>
  );
}
