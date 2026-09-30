// src/pages/IndividualApp.jsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastContainer } from '../components/common/Toast';
import { useAlertEngine } from '../hooks/useAlertEngine';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { Plus, Star, Clock, CheckSquare, TrendingUp, AlertTriangle, Flame } from 'lucide-react';
import { formatDate, getDayLabel } from '../utils/dateUtils';
import { format, addDays, isToday } from 'date-fns';

export function IndividualApp() {
  const [toasts, setToasts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const onAlert = (alert) => {
    setToasts((prev) => [{ ...alert, id: alert.id + Date.now() }, ...prev].slice(0, 5));
  };

  useAlertEngine(onAlert);

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.5)', display: 'none' }}
          id="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>
      <div className="main-content">
        <Header onMenuToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
        <Routes>
          <Route path="/" element={<MyTasksView />} />
          <Route path="/starred" element={<StarredView />} />
          <Route path="/today" element={<TodayView />} />
          <Route path="/upcoming" element={<UpcomingView />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/alerts" element={<AlertsView />} />
          <Route path="/list/:listId" element={<ListDetailView />} />
        </Routes>
      </div>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      <style>{`@media(max-width:768px){#sidebar-overlay{display:block!important}}`}</style>
    </div>
  );
}

/* ─── Views ─── */

function MyTasksView() {
  const tasks = useTaskStore((s) => s.tasks);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('active'); // active | completed | all

  const filtered = tasks.filter((t) =>
    filter === 'active' ? !t.completed :
    filter === 'completed' ? t.completed : true
  ).sort((a, b) => {
    if (a.starred && !b.starred) return -1;
    if (!a.starred && b.starred) return 1;
    const pa = { p1: 0, p2: 1, p3: 2, p4: 3 }[a.priority] ?? 2;
    const pb = { p1: 0, p2: 1, p3: 2, p4: 3 }[b.priority] ?? 2;
    return pa - pb;
  });

  return (
    <div className="page-content">
      <PageHeader title="My Tasks" subtitle={`${tasks.filter((t) => !t.completed).length} active tasks`}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-task-my">
          <Plus size={14} /> Add Task
        </button>
      </PageHeader>

      <div className="tab-nav" style={{ marginBottom: 20 }}>
        {['active', 'completed', 'all'].map((f) => (
          <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <TaskList tasks={filtered} />
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function StarredView() {
  const tasks = useTaskStore((s) => s.tasks).filter((t) => t.starred);
  return (
    <div className="page-content">
      <PageHeader title="⭐ Starred" subtitle={`${tasks.length} starred tasks`} />
      <TaskList tasks={tasks} emptyMsg="No starred tasks yet. Star a task to pin it here." emptyIcon={<Star size={24} color="var(--text-muted)" />} />
    </div>
  );
}

function TodayView() {
  const getTodayTasks = useTaskStore((s) => s.getTodayTasks);
  const tasks = getTodayTasks();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="page-content">
      <PageHeader title={`📅 Today — ${format(new Date(), 'EEE, MMM d')}`} subtitle={`${tasks.filter(t => !t.completed).length} tasks due today`}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Task
        </button>
      </PageHeader>
      <TaskList tasks={tasks} emptyMsg="You're all caught up for today! 🎉" emptyIcon={<CheckSquare size={24} color="var(--text-muted)" />} />
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function UpcomingView() {
  const getUpcomingTasks = useTaskStore((s) => s.getUpcomingTasks);
  const tasks = getUpcomingTasks();

  // Group by day
  const groups = {};
  for (const task of tasks) {
    const day = task.deadline ? getDayLabel(task.deadline) : 'No date';
    if (!groups[day]) groups[day] = [];
    groups[day].push(task);
  }

  return (
    <div className="page-content">
      <PageHeader title="📆 Upcoming" subtitle="Next 7 days" />
      {Object.keys(groups).length === 0 ? (
        <EmptyState msg="Nothing coming up. Add tasks with deadlines to see them here." icon={<Clock size={24} color="var(--text-muted)" />} />
      ) : (
        Object.entries(groups).map(([day, dayTasks]) => (
          <div key={day} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
              {day}
            </div>
            <TaskList tasks={dayTasks} />
          </div>
        ))
      )}
    </div>
  );
}

function AnalyticsView() {
  const tasks = useTaskStore((s) => s.tasks);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
  const starred = tasks.filter((t) => t.starred).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byPriority = { p1: 0, p2: 0, p3: 0, p4: 0 };
  tasks.forEach((t) => { if (byPriority[t.priority] !== undefined) byPriority[t.priority]++; });

  return (
    <div className="page-content">
      <PageHeader title="📊 Analytics" subtitle="Your productivity overview" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Tasks" value={total} icon={CheckSquare} color="var(--brand)" />
        <StatCard label="Completed" value={completed} icon={CheckSquare} color="var(--accent-green)" />
        <StatCard label="Active" value={active} icon={Clock} color="var(--accent-cyan)" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} color="var(--accent-red)" />
        <StatCard label="Starred" value={starred} icon={Star} color="var(--accent-yellow)" />
        <StatCard label="Done Rate" value={`${rate}%`} icon={TrendingUp} color="var(--brand-light)" />
      </div>

      {/* Completion bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Completion Rate</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-light)' }}>{rate}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar-fill" style={{ width: `${rate}%` }} />
        </div>
      </div>

      {/* By Priority */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>By Priority</h3>
        {[['p1', 'Critical', 'var(--p1)'], ['p2', 'High', 'var(--p2)'], ['p3', 'Medium', 'var(--p3)'], ['p4', 'Low', 'var(--p4)']].map(([k, l, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c, width: 60 }}>{l}</span>
            <div style={{ flex: 1, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (byPriority[k] / total) * 100 : 0}%`, background: c, borderRadius: 3, transition: 'width 0.8s var(--ease)' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>{byPriority[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsView() {
  const alertLog = useTaskStore((s) => s.alertLog);
  const LEVEL_COLORS = { info: 'var(--alert-info)', warning: 'var(--alert-warning)', danger: 'var(--alert-danger)', urgent: 'var(--alert-urgent)', critical: 'var(--alert-critical)' };

  return (
    <div className="page-content">
      <PageHeader title="🔔 Alert History" subtitle={`${alertLog.length} alerts received`} />
      {alertLog.length === 0 ? (
        <EmptyState msg="No alerts yet. Add tasks with deadlines to start receiving smart alerts." icon={<AlertTriangle size={24} color="var(--text-muted)" />} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alertLog.map((a, i) => (
            <div key={i} className="card" style={{ borderLeft: `3px solid ${LEVEL_COLORS[a.level] || 'var(--brand)'}`, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.body}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{a.receivedAt ? formatDate(a.receivedAt, 'h:mm a') : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListDetailView() {
  const { listId } = useParams();
  const lists = useTaskStore((s) => s.lists);
  const getTasksByList = useTaskStore((s) => s.getTasksByList);
  const [showModal, setShowModal] = useState(false);
  const list = lists.find((l) => l.id === listId);
  const tasks = getTasksByList(listId);

  return (
    <div className="page-content">
      <PageHeader
        title={list ? `${list.icon} ${list.name}` : 'List'}
        subtitle={`${tasks.filter((t) => !t.completed).length} tasks`}
      >
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Task
        </button>
      </PageHeader>
      <TaskList tasks={tasks} />
      {showModal && <TaskModal defaultListId={listId} onClose={() => setShowModal(false)} />}
    </div>
  );
}

// Add useParams import
import { useParams } from 'react-router-dom';

/* ─── Shared UI ─── */

function TaskList({ tasks, emptyMsg = 'No tasks yet. Add one to get started!', emptyIcon }) {
  if (tasks.length === 0) {
    return <EmptyState msg={emptyMsg} icon={emptyIcon || <CheckSquare size={24} color="var(--text-muted)" />} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tasks.map((t) => <TaskCard key={t.id} task={t} />)}
    </div>
  );
}

function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{children}</div>}
    </div>
  );
}

function EmptyState({ msg, icon }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p style={{ fontSize: 14, maxWidth: 280 }}>{msg}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
    </div>
  );
}
