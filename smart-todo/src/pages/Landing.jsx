// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { CheckSquare, Users, Zap, Bell, Shield, Clock, ArrowRight, Star } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const setMode = useTaskStore((s) => s.setMode);

  const choose = (mode) => {
    setMode(mode);
    navigate(`/${mode}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', overflow: 'auto' }}>
      {/* Glow BG */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,111,247,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 680 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--brand-glow)', border: '1px solid var(--brand)40', fontSize: 12, fontWeight: 600, color: 'var(--brand-light)', marginBottom: 28, letterSpacing: '0.05em' }}>
          <Zap size={12} /> SMART TASK MANAGEMENT
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, background: 'linear-gradient(135deg, #fff 0%, var(--brand-light) 50%, var(--accent-cyan) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Tasks that alert you<br />before it's too late.
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
          The only task manager with an intelligent escalating alert system. From 3 days out to the final minute — you'll never miss a deadline again.
        </p>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
          <ModeCard
            icon={CheckSquare}
            title="Individual"
            subtitle="Personal task tracking"
            description="Your tasks, your deadlines, your smart alerts. Track personal productivity, streaks, and never miss what matters."
            color="var(--brand)"
            features={['Personal lists & categories', 'Smart countdown alerts', 'Today / Upcoming views', 'Productivity analytics']}
            onClick={() => choose('individual')}
            id="choose-individual"
          />
          <ModeCard
            icon={Users}
            title="Enterprise"
            subtitle="Team task management"
            description="Assign tasks to team members with individual deadlines. Each person gets their own smart alerts. You see everything."
            color="var(--accent-cyan)"
            features={['Multi-member workspaces', 'Per-assignee smart alerts', 'Team Kanban & analytics', 'Activity feed & roles']}
            onClick={() => choose('enterprise')}
            id="choose-enterprise"
            highlight
          />
        </div>

        {/* Features strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 40 }}>
          {[
            { icon: Bell,   text: 'Escalating smart alerts' },
            { icon: Clock,  text: 'Real-time countdown timers' },
            { icon: Shield, text: 'No past dates allowed' },
            { icon: Star,   text: 'PWA installable' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
              <f.icon size={14} color="var(--brand)" />
              {f.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeCard({ icon: Icon, title, subtitle, description, color, features, onClick, id, highlight }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        background: highlight ? `linear-gradient(135deg, rgba(34,211,238,0.06), rgba(34,211,238,0.02))` : 'var(--bg-card)',
        border: `1px solid ${highlight ? 'rgba(34,211,238,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: 28,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.3s var(--ease)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: highlight ? '0 0 40px rgba(34,211,238,0.1)' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 20px 60px ${color}20`;
        e.currentTarget.style.borderColor = `${color}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = highlight ? '0 0 40px rgba(34,211,238,0.1)' : 'none';
        e.currentTarget.style.borderColor = highlight ? 'rgba(34,211,238,0.3)' : 'var(--border)';
      }}
    >
      {/* Icon */}
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={22} color={color} />
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{subtitle}</div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{description}</p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color }}>
        Get started <ArrowRight size={14} />
      </div>
    </button>
  );
}
