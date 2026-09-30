// src/components/layout/Header.jsx
import { useState } from 'react';
import { Search, Sun, Moon, Bell, Menu, X, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useLiveClock } from '../../hooks/useLiveClock';
import { format } from 'date-fns';
import { TaskModal } from '../tasks/TaskModal';

export function Header({ onMenuToggle, menuOpen }) {
  const theme = useTaskStore((s) => s.theme);
  const toggleTheme = useTaskStore((s) => s.toggleTheme);
  const alertLog = useTaskStore((s) => s.alertLog);
  const mode = useTaskStore((s) => s.mode);
  const now = useLiveClock();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const unread = alertLog.slice(0, 5);

  return (
    <>
      <header className="header">
        {/* Left: menu + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <button className="btn btn-icon btn-ghost" onClick={onMenuToggle} style={{ display: 'none' }} id="mobile-menu-btn">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="search-bar" style={{ maxWidth: 320, flex: 1 }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="global-search"
            />
          </div>
        </div>

        {/* Center: live clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'var(--bg-tertiary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              letterSpacing: '0.05em',
            }}
          >
            🕐 {format(now, 'HH:mm:ss')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {format(now, 'EEE, MMM d yyyy')}
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* New task */}
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} id="new-task-btn">
            <Plus size={14} />
            New Task
          </button>

          {/* Alerts bell */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-icon btn-ghost"
              onClick={() => setShowAlerts(!showAlerts)}
              id="alerts-bell"
            >
              <Bell size={16} />
              {alertLog.length > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-red)', border: '2px solid var(--bg-secondary)' }} />
              )}
            </button>

            {showAlerts && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 320, background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 200 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>
                  🔔 Recent Alerts
                </div>
                {unread.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No alerts yet</div>
                ) : (
                  unread.map((a) => (
                    <div key={a.id} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{a.body}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button className="btn btn-icon btn-ghost" onClick={toggleTheme} id="theme-toggle" title="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {showModal && <TaskModal onClose={() => setShowModal(false)} />}

      {/* Close alerts dropdown on outside click */}
      {showAlerts && <div className="fixed inset-0 z-10" onClick={() => setShowAlerts(false)} style={{ background: 'transparent' }} />}

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
