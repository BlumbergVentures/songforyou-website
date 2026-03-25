import { Link } from 'react-router-dom';
import { colors } from '../styles/shared';

export default function Footer() {
  const linkStyle = {
    color: colors.textMuted,
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    marginBottom: '10px',
    transition: 'color 0.2s ease',
  };

  return (
    <footer style={{
      padding: '60px 48px 0',
      borderTop: `1px solid ${colors.cardBorder}`,
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: colors.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>🎵</div>
            <span style={{ fontSize: '20px', fontWeight: '700' }}>SongForYou</span>
          </div>
          <p style={{ color: colors.textMuted, fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
            Turn your story into a custom song.
          </p>
          <p style={{ color: colors.textFaint, fontSize: '13px' }}>
            Powered by AI music generation.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: colors.textSecondary }}>
            Navigate
          </h4>
          <a href="#how" style={linkStyle}>How It Works</a>
          <a href="#pricing" style={linkStyle}>Pricing</a>
          <a href="#create" style={linkStyle}>Create a Song</a>
          <a href="#faq" style={linkStyle}>FAQ</a>
        </div>

        {/* Legal & Contact */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: colors.textSecondary }}>
            Support
          </h4>
          <a href="mailto:support@songforyou.app" style={linkStyle}>support@songforyou.app</a>
          <Link to="/terms" style={linkStyle}>Terms of Service</Link>
          <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/refunds" style={linkStyle}>Refund Policy</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${colors.cardBorder}`,
        padding: '20px 0',
        textAlign: 'center',
      }}>
        <p style={{ color: colors.textFaint, fontSize: '13px', margin: 0 }}>
          &copy; 2026 SongForYou, operated by Blumberg Ventures. All rights reserved. Songs are generated using AI technology.
        </p>
      </div>
    </footer>
  );
}
