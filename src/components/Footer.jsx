export default function Footer() {
  return (
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
        © 2026 SongForYou. Creating memories through music.
      </p>
    </footer>
  );
}
