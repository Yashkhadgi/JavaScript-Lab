// src/pages/EnterpriseApp.jsx
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastContainer } from '../components/common/Toast';
import { useAlertEngine } from '../hooks/useAlertEngine';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { Avatar } from '../components/common/Avatar';
import { genId } from '../utils/dateUtils';
import {
  Plus, Users, CheckSquare, AlertTriangle, Clock,
  TrendingUp, Activity, Briefcase, ArrowRight,
  Trash2, Edit, Star, BarChart2,
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export function EnterpriseApp() {
  const [toasts, setToasts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const workspace = useTaskStore((s) => s.workspace);
  const setWorkspace = useTaskStore((s) => s.setWorkspace);
  const navigate = useNavigate();

  const onAlert = (alert) => {
    setToasts((prev) => [{ ...alert, id: alert.id + Date.now() }, ...prev].slice(0, 5));
  };

  useAlertEngine(onAlert);

  // Workspace setup gate
  if (!workspace) {
    return <WorkspaceSetup onComplete={(ws) => { setWorkspace(ws); navigate('/enterprise'); }} />;
  }

  return (
    <div className="app-layout">
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>
      <div className="main-content">
        <Header onMenuToggle={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
        <Routes>
          <Route path="/" element={<EnterpriseDashboard />} />
          <Route path="/tasks" element={<EnterpriseTasksView />} />
          <Route path="/board" element={<KanbanView />} />
          <Route path="/members" element={<MembersView />} />
          <Route path="/activity" element={<ActivityView />} />
          <Route path="/analytics" element={<EnterpriseAnalytics />} />
          <Route path="/alerts" element={<EnterpriseAlerts />} />
          <Route path="/member/:memberId" element={<MemberDetailView />} />
        </Routes>
      </div>
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}

/* ─── Workspace Setup ─── */
function WorkspaceSetup({ onComplete }) {
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Workspace name is required'); return; }
    onComplete({ id: genId(), name: name.trim(), createdAt: new Date().toISOString() });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--accent-cyan), #0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(34,211,238,0.2)' }}>
          <Briefcase size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Create Workspace</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
          Set up your enterprise workspace to start assigning tasks to your team.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          <div className="input-group">
            <label className="input-label">Workspace / Company Name</label>
            <input
              id="workspace-name"
              className="input"
              placeholder="e.g. Acme Corp, Dev Team..."
              value={name}
              onChange={(e) => { setName(e.target.value); setErr(''); }}
              autoFocus
            />
            {err && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{err}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), #0e7490)', boxShadow: '0 4px 20px rgba(34,211,238,0.3)' }}>
            Create Workspace <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Enterprise Dashboard ─── */
function EnterpriseDashboard() {
  const tasks = useTaskStore((s) => s.tasks);
  const members = useTaskStore((s) => s.members);
  const activities = useTaskStore((s) => s.activities);
  const workspace = useTaskStore((s) => s.workspace);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
  const active = tasks.filter((t) => !t.completed).length;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>👋 {workspace?.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Enterprise workspace · {members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} id="dash-new-task">
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total', value: total,     color: 'var(--brand)',        icon: CheckSquare },
          { label: 'Active', value: active,   color: 'var(--accent-cyan)',  icon: Clock },
          { label: 'Done',  value: completed, color: 'var(--accent-green)', icon: CheckSquare },
          { label: 'Overdue',value: overdue,  color: 'var(--accent-red)',   icon: AlertTriangle },
          { label: 'Members',value: members.length, color: 'var(--accent-pink)', icon: Users },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <s.icon size={20} color={s.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Members workload */}
      {members.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Team Workload</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/enterprise/members')}>View all</button>
          </div>
          {members.slice(0, 5).map((m) => {
            const mTasks = tasks.filter((t) => t.assigneeIds?.includes(m.id));
            const mDone = mTasks.filter((t) => t.completed).length;
            const mActive = mTasks.filter((t) => !t.completed).length;
            const mOverdue = mTasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
            const rate = mTasks.length > 0 ? Math.round((mDone / mTasks.length) * 100) : 0;
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, cursor: 'pointer' }} onClick={() => navigate(`/enterprise/member/${m.id}`)}>
                <Avatar name={m.name} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mActive} active · {rate}% done</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${rate}%` }} />
                  </div>
                </div>
                {mOverdue > 0 && (
                  <span style={{ background: 'rgba(248,113,113,0.15)', color: 'var(--accent-red)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                    {mOverdue} overdue
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Recent activity */}
      {activities.slice(0, 5).length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Activity</h3>
          {activities.slice(0, 5).map((a) => (
            <div key={a.id} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', marginTop: 5, flexShrink: 0 }} />
              <div>
                <span style={{ color: 'var(--text-primary)' }}>{a.type === 'created' ? 'Created' : 'Updated'} </span>
                <span style={{ color: 'var(--brand-light)', fontWeight: 600 }}>"{a.taskTitle}"</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 6 }}>{formatDate(a.ts, 'h:mm a')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Enterprise Tasks ─── */
function EnterpriseTasksView() {
  const tasks = useTaskStore((s) => s.tasks);
  const members = useTaskStore((s) => s.members);
  const [showModal, setShowModal] = useState(false);
  const [filterMember, setFilterMember] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');

  let filtered = tasks;
  if (filterMember !== 'all') filtered = filtered.filter((t) => t.assigneeIds?.includes(filterMember));
  if (filterStatus === 'active') filtered = filtered.filter((t) => !t.completed);
  else if (filterStatus === 'completed') filtered = filtered.filter((t) => t.completed);

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>All Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> New Task</button>
      </div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="input" style={{ width: 'auto' }} value={filterMember} onChange={(e) => setFilterMember(e.target.value)}>
          <option value="all">All Members</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <div className="tab-nav">
          {['active', 'completed', 'all'].map((f) => (
            <button key={f} className={`tab-btn ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><CheckSquare size={24} color="var(--text-muted)" /></div><p>No tasks found</p></div>
        ) : filtered.map((t) => <TaskCard key={t.id} task={t} />)}
      </div>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Kanban ─── */
function KanbanView() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const [showModal, setShowModal] = useState(false);

  const cols = [
    { id: 'todo',       label: 'To Do',       color: 'var(--text-muted)' },
    { id: 'inprogress', label: 'In Progress',  color: 'var(--accent-cyan)' },
    { id: 'done',       label: 'Done',         color: 'var(--accent-green)' },
  ];

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>🗂 Board</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={14} /> New Task</button>
      </div>
      <div className="kanban-board">
        {cols.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id || (col.id === 'done' && t.completed));
          return (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ color: col.color }}>{col.label}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{colTasks.length}</span>
              </div>
              <div className="kanban-items">
                {colTasks.map((t) => (
                  <div key={t.id} className="card" style={{ padding: '10px 12px', cursor: 'grab', borderLeft: `3px solid ${({ p1: 'var(--p1)', p2: 'var(--p2)', p3: 'var(--p3)', p4: 'var(--p4)' })[t.priority] || 'var(--border)'}` }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
                    {t.deadline && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        📅 {formatDate(t.deadline, 'MMM d, h:mm a')}
                      </div>
                    )}
                    {col.id !== 'done' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {cols.filter((c) => c.id !== col.id).map((c) => (
                          <button key={c.id} className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
                            onClick={() => updateTask(t.id, { status: c.id, completed: c.id === 'done' })}>
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Members ─── */
function MembersView() {
  const members = useTaskStore((s) => s.members);
  const addMember = useTaskStore((s) => s.addMember);
  const deleteMember = useTaskStore((s) => s.deleteMember);
  const tasks = useTaskStore((s) => s.tasks);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'member', email: '' });
  const [err, setErr] = useState('');

  const ROLES = ['admin', 'manager', 'member'];

  const handleAdd = () => {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    addMember({ name: form.name.trim(), role: form.role, email: form.email.trim() });
    setForm({ name: '', role: 'member', email: '' });
    setShowForm(false);
    setErr('');
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>👥 Team Members</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="add-member-btn">
          <Plus size={14} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--brand)40' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>New Member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="input-group">
              <label className="input-label">Name *</label>
              <input className="input" placeholder="Full name" value={form.name} onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErr(''); }} />
              {err && <span style={{ fontSize: 11, color: 'var(--accent-red)' }}>{err}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Email (optional)</label>
              <input className="input" placeholder="email@company.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleAdd}>Add Member</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Users size={24} color="var(--text-muted)" /></div>
          <p>No team members yet. Add your first member to start assigning tasks.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {members.map((m) => {
            const mTasks = tasks.filter((t) => t.assigneeIds?.includes(m.id));
            const mDone = mTasks.filter((t) => t.completed).length;
            const mOverdue = mTasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
            const ROLE_COLORS = { admin: 'var(--accent-red)', manager: 'var(--accent-orange)', member: 'var(--brand)' };
            return (
              <div key={m.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar name={m.name} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${ROLE_COLORS[m.role]}20`, color: ROLE_COLORS[m.role], border: `1px solid ${ROLE_COLORS[m.role]}40`, textTransform: 'uppercase' }}>
                      {m.role}
                    </span>
                  </div>
                  {m.email && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{m.email}</div>}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {mTasks.length} tasks · {mDone} done
                    {mOverdue > 0 && <span style={{ color: 'var(--accent-red)', marginLeft: 8 }}>· {mOverdue} overdue</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/enterprise/member/${m.id}`)}>
                    View Tasks <ArrowRight size={12} />
                  </button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteMember(m.id)} title="Remove member">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Member Detail ─── */
import { useParams } from 'react-router-dom';
function MemberDetailView() {
  const { memberId } = useParams();
  const members = useTaskStore((s) => s.members);
  const getTasksByAssignee = useTaskStore((s) => s.getTasksByAssignee);
  const [showModal, setShowModal] = useState(false);
  const member = members.find((m) => m.id === memberId);
  const tasks = getTasksByAssignee(memberId);
  if (!member) return <div className="page-content"><p>Member not found</p></div>;
  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Avatar name={member.name} size={56} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>{member.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{member.role} · {tasks.filter(t => !t.completed).length} active tasks</p>
        </div>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowModal(true)}>
          <Plus size={14} /> Assign Task
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.length === 0 ? (
          <div className="empty-state"><div className="empty-icon"><CheckSquare size={24} color="var(--text-muted)" /></div><p>No tasks assigned to {member.name} yet.</p></div>
        ) : tasks.map((t) => <TaskCard key={t.id} task={t} />)}
      </div>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Activity ─── */
function ActivityView() {
  const activities = useTaskStore((s) => s.activities);
  return (
    <div className="page-content">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>📋 Activity Feed</h1>
      {activities.length === 0 ? (
        <div className="empty-state"><div className="empty-icon"><Activity size={24} color="var(--text-muted)" /></div><p>No activity yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {activities.map((a) => (
            <div key={a.id} className="card" style={{ padding: '10px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.type === 'created' ? 'var(--accent-green)' : 'var(--brand)', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13 }}>
                  {a.type === 'created' ? '✅ Created' : '✏️ Updated'} task{' '}
                  <strong style={{ color: 'var(--brand-light)' }}>"{a.taskTitle}"</strong>
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{formatDate(a.ts, 'MMM d, h:mm a')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Enterprise Analytics ─── */
function EnterpriseAnalytics() {
  const tasks = useTaskStore((s) => s.tasks);
  const members = useTaskStore((s) => s.members);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="page-content">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>📊 Team Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { l: 'Total', v: total,     c: 'var(--brand)', i: CheckSquare },
          { l: 'Done',  v: completed, c: 'var(--accent-green)', i: CheckSquare },
          { l: 'Rate',  v: `${rate}%`, c: 'var(--brand-light)', i: TrendingUp },
          { l: 'Overdue', v: overdue,  c: 'var(--accent-red)', i: AlertTriangle },
          { l: 'Members', v: members.length, c: 'var(--accent-pink)', i: Users },
        ].map((s) => (
          <div key={s.l} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <s.i size={20} color={s.c} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 28, fontWeight: 800 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>Completion Rate</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-light)' }}>{rate}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar-fill" style={{ width: `${rate}%` }} />
        </div>
      </div>

      {/* Per-member breakdown */}
      {members.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Per Member</h3>
          {members.map((m) => {
            const mt = tasks.filter((t) => t.assigneeIds?.includes(m.id));
            const md = mt.filter((t) => t.completed).length;
            const mr = mt.length > 0 ? Math.round((md / mt.length) * 100) : 0;
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Avatar name={m.name} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500, width: 120 }}>{m.name}</span>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${mr}%` }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 60, textAlign: 'right' }}>{md}/{mt.length} · {mr}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Enterprise Alerts ─── */
function EnterpriseAlerts() {
  const alertLog = useTaskStore((s) => s.alertLog);
  const LEVEL_COLORS = { info: 'var(--alert-info)', warning: 'var(--alert-warning)', danger: 'var(--alert-danger)', urgent: 'var(--alert-urgent)', critical: 'var(--alert-critical)' };
  return (
    <div className="page-content">
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>🔔 Alert History</h1>
      {alertLog.length === 0 ? (
        <div className="empty-state"><div className="empty-icon"><AlertTriangle size={24} color="var(--text-muted)" /></div><p>No alerts yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alertLog.map((a, i) => (
            <div key={i} className="card" style={{ borderLeft: `3px solid ${LEVEL_COLORS[a.level] || 'var(--brand)'}`, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.title}</div>
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
