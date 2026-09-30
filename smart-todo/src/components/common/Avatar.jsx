// src/components/common/Avatar.jsx

const COLORS = [
  ['#7c6ff7', '#3a34b0'],
  ['#22d3ee', '#0e7490'],
  ['#f472b6', '#be185d'],
  ['#4ade80', '#15803d'],
  ['#fb923c', '#c2410c'],
  ['#facc15', '#a16207'],
  ['#a78bfa', '#5b21b6'],
  ['#34d399', '#065f46'],
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name = '', size = 32, style = {} }) {
  const [fg, bg] = getColor(name || '?');
  const initials = getInitials(name);

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${fg}, ${bg})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.1)',
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({ names = [], size = 28, max = 3 }) {
  const visible = names.slice(0, max);
  const rest = names.length - max;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((name, i) => (
        <Avatar
          key={i}
          name={name}
          size={size}
          style={{ marginLeft: i > 0 ? -8 : 0, border: '2px solid var(--bg-card)' }}
        />
      ))}
      {rest > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            border: '2px solid var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.3,
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginLeft: -8,
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
