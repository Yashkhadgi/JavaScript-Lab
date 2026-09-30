// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckSquare, Star, Calendar, Clock, BarChart2, Bell,
  Plus, Settings, LogOut, ChevronDown, ChevronRight,
  Users, Layout, Activity, Briefcase, Home, List,
} from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { Avatar } from '../common/Avatar';

export function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = useTaskStore((s) => s.mode);
  const setMode = useTaskStore((s) => s.setMode);
  const lists = useTaskStore((s) => s.lists);
  const tasks = useTaskStore((s) => s.tasks);
  const alertLog = useTaskStore((s) => s.alertLog);
  const workspace = useTaskStore((s) => s.workspace);
  const addList = useTaskStore((s) => s.addList);
  const [listsExpanded, setListsExpanded] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [showNewList, setShowNewList] = useState(false);

  const base = mode === 'individual' ? '/individual' : '/enterprise';
  const activeClass = (path) => location.pathname === path || location.pathname.startsWith(path + '/') ? 'sidebar-nav-item active' : 'sidebar-nav-item';

  const overdueCount = tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
  const unreadAlerts = alertLog.filter((a) => !a.read).length;

  const go = (path) => { navigate(path); onClose?.(); };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const id = addList(newListName.trim());
    setNewListName('');
    setShowNewList(false);
    go(`${base}/list/${id}`);
  };

  return (
    <nav
      className="sidebar"
      style={{ padding: '12px 0' }}
    >
      {/* Logo */}
      <div style={{ padding: '8px 16px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <CheckSquare size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>SmartTodo</div>
            <div style={{ fontSize: 10, color: 'var(--brand-light)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {mode === 'enterprise' ? (workspace?.name || 'Enterprise') : 'Individual'}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div style={{ padding: '0 8px', flex: 1 }}>
        {mode === 'individual' ? (
          <>
            <SidebarItem icon={Home}      label="My Tasks"  path={`${base}`}           onClick={() => go(base)} active={location.pathname === base} />
            <SidebarItem icon={Star}      label="Starred"   path={`${base}/starred`}    onClick={() => go(`${base}/starred`)} active={location.pathname === `${base}/starred`} />
            <SidebarItem icon={Clock}     label="Today"     path={`${base}/today`}      onClick={() => go(`${base}/today`)} active={location.pathname === `${base}/today`} badge={tasks.filter(t => !t.completed && t.deadline && isToday(t.deadline)).length || null} />
            <SidebarItem icon={Calendar}  label="Upcoming"  path={`${base}/upcoming`}   onClick={() => go(`${base}/upcoming`)} active={location.pathname === `${base}/upcoming`} />
            <SidebarItem icon={BarChart2} label="Analytics" path={`${base}/analytics`}  onClick={() => go(`${base}/analytics`)} active={location.pathname === `${base}/analytics`} />
            <SidebarItem icon={Bell}      label="Alerts"    path={`${base}/alerts`}     onClick={() => go(`${base}/alerts`)} active={location.pathname === `${base}/alerts`} badge={overdueCount || null} />

            {/* Lists */}
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setListsExpanded(!listsExpanded)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                <span>My Lists</span>
                {listsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {listsExpanded && (
                <div style={{ marginTop: 4 }}>
                  {lists.map((list) => (
                    <SidebarItem
                      key={list.id}
                      label={list.name}
                      emoji={list.icon}
                      dotColor={list.color}
                      onClick={() => go(`${base}/list/${list.id}`)}
                      active={location.pathname === `${base}/list/${list.id}`}
                      count={tasks.filter((t) => t.listId === list.id && !t.completed).length}
                    />
                  ))}
                  {showNewList ? (
                    <form onSubmit={handleAddList} style={{ padding: '4px 8px' }}>
                      <input
                        className="input"
                        placeholder="List name..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        autoFocus
                        onBlur={() => !newListName && setShowNewList(false)}
                        style={{ fontSize: 13, padding: '6px 10px' }}
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowNewList(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, borderRadius: 'var(--radius-sm)', transition: 'color 0.2s' }}
                    >
                      <Plus size={12} /> New List
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <SidebarItem icon={Layout}   label="Dashboard"  onClick={() => go(base)} active={location.pathname === base} />
            <SidebarItem icon={List}     label="All Tasks"  onClick={() => go(`${base}/tasks`)} active={location.pathname === `${base}/tasks`} badge={overdueCount || null} />
            <SidebarItem icon={Briefcase} label="Board"     onClick={() => go(`${base}/board`)} active={location.pathname === `${base}/board`} />
            <SidebarItem icon={Users}    label="Members"    onClick={() => go(`${base}/members`)} active={location.pathname === `${base}/members`} />
            <SidebarItem icon={Activity} label="Activity"   onClick={() => go(`${base}/activity`)} active={location.pathname === `${base}/activity`} />
            <SidebarItem icon={BarChart2} label="Analytics" onClick={() => go(`${base}/analytics`)} active={location.pathname === `${base}/analytics`} />
            <SidebarItem icon={Bell}     label="Alerts"     onClick={() => go(`${base}/alerts`)} active={location.pathname === `${base}/alerts`} badge={overdueCount || null} />
          </>
        )}
      </div>

      {/* Bottom */}
      <div style={{ padding: '12px 8px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
        <SidebarItem icon={LogOut} label="Switch Mode" onClick={() => { setMode(null); navigate('/'); }} />
      </div>
    </nav>
  );
}

function SidebarItem({ icon: Icon, label, emoji, dotColor, onClick, active, badge, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '7px 8px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        background: active ? 'var(--brand-glow)' : 'transparent',
        color: active ? 'var(--brand-light)' : 'var(--text-secondary)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
      {dotColor ? (
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      ) : emoji ? (
        <span style={{ fontSize: 14, flexShrink: 0 }}>{emoji}</span>
      ) : Icon ? (
        <Icon size={15} style={{ flexShrink: 0 }} />
      ) : null}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{ background: 'var(--accent-red)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
          {badge}
        </span>
      )}
      {count != null && count > 0 && !badge && (
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{count}</span>
      )}
    </button>
  );
}

function isToday(deadline) {
  const d = new Date(deadline); const today = new Date();
  return d.toDateString() === today.toDateString();
}
