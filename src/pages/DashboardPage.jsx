import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UsageMeter from '../components/UsageMeter';

const MONTHLY_LIMIT = 10;

function StatusBadge({ status }) {
  if (status === 'trialing') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(139,92,246,0.15)',
        border: '1px solid rgba(139,92,246,0.3)',
        color: '#8b5cf6',
        fontSize: '13px',
        fontWeight: '600',
      }}>Trialing</span>
    );
  }
  if (status === 'active') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(34,197,94,0.15)',
        border: '1px solid rgba(34,197,94,0.3)',
        color: '#22c55e',
        fontSize: '13px',
        fontWeight: '600',
      }}>Active</span>
    );
  }
  if (status === 'past_due') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#ef4444',
        fontSize: '13px',
        fontWeight: '600',
      }}>Past Due</span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '13px',
      fontWeight: '600',
    }}>{status || 'Inactive'}</span>
  );
}

function SongCard({ song }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const isDelivered = song.status === 'delivered' && song.song_url;

  const handlePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(song.song_url);
      audioRef.current.addEventListener('ended', () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const occasionLabel = song.occasion
    ? song.occasion.charAt(0).toUpperCase() + song.occasion.slice(1)
    : 'Song';

  const title = song.recipient_name
    ? `${occasionLabel} Song for ${song.recipient_name}`
    : `${occasionLabel} Song`;

  const createdDate = new Date(song.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isDelivered ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              color: '#22c55e',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              <span style={{ fontSize: '10px' }}>&#10003;</span> Delivered
            </span>
          ) : song.status === 'failed' ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              ✕ Failed
            </span>
          ) : song.status === 'generating' ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                border: '2px solid rgba(167,139,250,0.3)',
                borderTopColor: '#a78bfa',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} /> Generating
            </span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              color: '#fbbf24',
              fontSize: '12px',
              fontWeight: '600',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#fbbf24',
                display: 'inline-block',
                animation: 'pulse 2s infinite',
              }} /> Pending
            </span>
          )}
          <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: '600', margin: 0 }}>
            {title}
          </h3>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
          {createdDate}
        </span>
      </div>

      {song.genres && song.genres.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {song.genres.map((genre) => (
            <span key={genre} style={{
              padding: '3px 10px',
              borderRadius: '10px',
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#a78bfa',
              fontSize: '12px',
              fontWeight: '500',
            }}>
              {genre}
            </span>
          ))}
        </div>
      )}

      {song.status === 'failed' && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '10px',
          color: '#f87171',
          fontSize: '14px',
        }}>
          Something went wrong generating this song. Please try creating a new request.
        </div>
      )}

      {isDelivered && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '10px',
              background: playing
                ? 'rgba(139,92,246,0.2)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: playing ? '1px solid rgba(139,92,246,0.4)' : 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <a
            href={song.song_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            ↓ Download
          </a>
        </div>
      )}

      {isDelivered && playing && (
        <div style={{
          marginTop: '14px',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <audio
            src={song.song_url}
            controls
            autoPlay
            onEnded={() => setPlaying(false)}
            style={{ width: '100%', height: '36px' }}
          />
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{
        width: '60%',
        height: '18px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.08)',
        marginBottom: '12px',
      }} />
      <div style={{
        width: '40%',
        height: '14px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.05)',
        marginBottom: '8px',
      }} />
      <div style={{
        width: '30%',
        height: '14px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.05)',
      }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user, customer } = useAuth();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyUsage, setMonthlyUsage] = useState(0);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching songs:', error);
      } else {
        setSongs(data || []);
        const thisMonth = (data || []).filter(
          (s) => s.billing_month === currentMonth
        );
        setMonthlyUsage(thisMonth.length);
      }
      setLoading(false);
    }

    fetchSongs();
  }, [currentMonth]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const subscriptionStatus = customer?.subscription_status || 'none';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onSignIn={() => {}} onSignUp={() => {}} />

      <main style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '48px 24px',
      }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 6px 0' }}>
                Welcome back!
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0 }}>
                {user?.email}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatusBadge status={subscriptionStatus} />
              {subscriptionStatus === 'trialing' && customer?.trial_end && (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                  Trial ends {formatDate(customer.trial_end)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Usage Meter */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '32px',
        }}>
          {loading ? (
            <div style={{
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
            }} />
          ) : (
            <UsageMeter used={monthlyUsage} limit={MONTHLY_LIMIT} />
          )}
        </div>

        {/* Create Song Button */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/?scrollTo=create')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(139,92,246,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 32px rgba(139,92,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,92,246,0.3)';
            }}
          >
            🎵 Create a New Song
          </button>
        </div>

        {/* Song History */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
            Your Songs
          </h2>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : songs.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '60px 32px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎶</div>
              <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                You haven't created any songs yet!
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '15px',
                marginBottom: '24px',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
                Start by creating your first custom song. Tell us your story and we'll turn it into music.
              </p>
              <button
                onClick={() => navigate('/?scrollTo=create')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                Create Your First Song
              </button>
            </div>
          ) : (
            songs.map((song) => <SongCard key={song.id} song={song} />)
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
