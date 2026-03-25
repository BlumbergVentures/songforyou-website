import { useState, useRef, useEffect } from 'react';
import { colors, sectionStyle, sectionHeading, sectionSubheading, cardBase } from '../styles/shared';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const EXAMPLES = [
  {
    occasion: 'Birthday',
    prompt: 'A fun, upbeat birthday song for Sarah turning 30, celebrating her love of adventure and travel',
    genres: 'Pop, Funk',
    moods: 'Joyful, Energetic',
    file: 'examples/birthday.mp3',
  },
  {
    occasion: 'Wedding',
    prompt: 'A heartfelt love song for Emma & James\'s wedding day, about growing old together',
    genres: 'Acoustic, Soul',
    moods: 'Romantic, Emotional',
    file: 'examples/wedding.mp3',
  },
  {
    occasion: 'Anniversary',
    prompt: 'A warm anniversary song for Mom & Dad\'s 25 years together, remembering their journey',
    genres: 'Folk, Country',
    moods: 'Nostalgic, Warm',
    file: 'examples/anniversary.mp3',
  },
];

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: colors.gradient,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <rect x="2" y="1" width="3.5" height="12" rx="1" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <path d="M3 1.5v11l9-5.5z" />
          </svg>
        )}
      </button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          onClick={seek}
          style={{
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: colors.gradient,
              borderRadius: '3px',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.textMuted }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function SongExamples() {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionHeading}>Hear What We Create</h2>
      <p style={sectionSubheading}>Real AI-generated songs from our platform</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
      }}>
        {EXAMPLES.map((ex) => (
          <div key={ex.occasion} style={{ ...cardBase }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: colors.gradientSubtle,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              color: colors.purple,
              marginBottom: '12px',
            }}>
              {ex.occasion}
            </div>

            <p style={{
              color: colors.textSecondary,
              fontSize: '14px',
              fontStyle: 'italic',
              lineHeight: 1.5,
              marginBottom: '8px',
              minHeight: '63px',
            }}>
              &ldquo;{ex.prompt}&rdquo;
            </p>

            <p style={{
              color: colors.textMuted,
              fontSize: '12px',
              marginBottom: '16px',
            }}>
              {ex.genres} &middot; {ex.moods}
            </p>

            <AudioPlayer
              src={`${SUPABASE_URL}/storage/v1/object/public/songs/${ex.file}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
