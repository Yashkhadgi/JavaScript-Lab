// src/components/common/Toast.jsx
import { useEffect, useState } from 'react';
import { X, Bell, AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';

const LEVEL_CONFIG = {
  info:     { icon: Info,         color: '#22d3ee', bg: 'rgba(34,211,238,0.12)'  },
  warning:  { icon: AlertTriangle, color: '#facc15', bg: 'rgba(250,204,21,0.12)' },
  danger:   { icon: AlertCircle,  color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  urgent:   { icon: Zap,          color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  critical: { icon: Bell,         color: '#ff4444', bg: 'rgba(255,68,68,0.18)'  },
  overdue:  { icon: AlertCircle,  color: '#f87171', bg: 'rgba(248,113,113,0.18)' },
};

export function Toast({ alert, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const cfg = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.info;
  const Icon = cfg.icon;

  useEffect(() => {
    const timeout = setTimeout(() => handleDismiss(), 4000);
    return () => clearTimeout(timeout);
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.color}40`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        minWidth: '300px',
        maxWidth: '380px',
        pointerEvents: 'all',
        animation: exiting ? 'slideOut 0.3s var(--ease) forwards' : 'slideInRight 0.3s var(--ease)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <Icon size={16} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
          {alert.title}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {alert.body}
        </p>
      </div>
      <button
        onClick={handleDismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} alert={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}
