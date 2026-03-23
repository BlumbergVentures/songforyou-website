export default function UsageMeter({ used, limit = 10 }) {
  const percentage = Math.min((used / limit) * 100, 100);
  const nearLimit = used >= 8;
  const atLimit = used >= limit;

  const barGradient = atLimit
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : nearLimit
      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)';

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
          {used} of {limit} songs used this month
        </span>
        {nearLimit && !atLimit && (
          <span style={{
            color: '#fbbf24',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            Approaching limit
          </span>
        )}
        {atLimit && (
          <span style={{
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: '500',
          }}>
            Limit reached
          </span>
        )}
      </div>
      <div style={{
        width: '100%',
        height: '12px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          borderRadius: '6px',
          background: barGradient,
          transition: 'width 0.6s ease-in-out',
        }} />
      </div>
    </div>
  );
}
