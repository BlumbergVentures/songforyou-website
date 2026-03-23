export const colors = {
  purple: '#8b5cf6',
  pink: '#ec4899',
  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  gradientSubtle: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
  gradientSelected: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.4)',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.1)',
  cardBorderHover: 'rgba(139,92,246,0.3)',
  inputBg: 'rgba(255,255,255,0.05)',
  inputBorder: 'rgba(255,255,255,0.15)',
  headerBg: 'rgba(10,10,15,0.8)',
  green: '#22c55e',
  yellow: '#fbbf24',
  red: '#ef4444',
  purpleLight: '#a78bfa',
};

export const cardBase = {
  background: colors.cardBg,
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: '20px',
  padding: '28px',
  transition: 'transform 0.2s ease, border-color 0.2s ease',
};

export const cardHoverHandlers = {
  onMouseEnter: (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = colors.cardBorderHover;
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = colors.cardBorder;
  },
};

export const sectionStyle = {
  padding: '80px 48px',
  maxWidth: '900px',
  margin: '0 auto',
};

export const primaryButton = {
  padding: '16px 32px',
  background: colors.gradient,
  border: 'none',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

export const sectionHeading = {
  fontSize: '36px',
  fontWeight: '700',
  textAlign: 'center',
  marginBottom: '16px',
};

export const sectionSubheading = {
  textAlign: 'center',
  color: colors.textMuted,
  marginBottom: '48px',
  fontSize: '18px',
};
