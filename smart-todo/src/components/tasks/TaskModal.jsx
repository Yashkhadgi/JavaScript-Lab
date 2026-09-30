// src/components/tasks/TaskModal.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Star, Clock, Calendar, Users, Tag, RefreshCw } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { minDateTimeLocal, validateDeadline, genId } from '../../utils/dateUtils';
import { Avatar } from '../common/Avatar';

const PRIORITIES = [
  { value: 'p1', label: 'P1 — Critical', color: 'var(--p1)' },
  { value: 'p2', label: 'P2 — High',     color: 'var(--p2)' },
  { value: 'p3', label: 'P3 — Medium',   color: 'var(--p3)' },
  { value: 'p4', label: 'P4 — Low',      color: 'var(--p4)' },
];

const RECURRING_OPTIONS = [
  { value: '', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function TaskModal({ task = null, defaultListId, onClose }) {
  const mode = useTaskStore((s) => s.mode);
  const lists = useTaskStore((s) => s.lists);
  const members = useTaskStore((s) => s.members);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const addActivity = useTaskStore((s) => s.addActivity);

  const isEditing = !!task;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'p3',
    deadline: task?.deadline ? task.deadline : '',
    durationType: task?.durationType || 'deadline',
    durationHours: task?.durationHours || '',
    listId: task?.listId || defaultListId || 'my-tasks',
    assigneeIds: task?.assigneeIds || [],
    labels: task?.labels || [],
    starred: task?.starred || false,
    recurring: task?.recurring || '',
    status: task?.status || 'todo',
  });
  const [errors, setErrors] = useState({});
  const [labelInput, setLabelInput] = useState('');
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [saving, setSaving] = useState(false);

  const minDT = minDateTimeLocal();

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.durationType === 'deadline' && form.deadline) {
      const err = validateDeadline(form.deadline);
      if (err) errs.deadline = err;
    }
    if (form.durationType === 'duration' && form.durationHours) {
      if (isNaN(form.durationHours) || Number(form.durationHours) <= 0) {
        errs.durationHours = 'Enter a valid number of hours';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    // Compute effective deadline for duration-based tasks
    let effectiveDeadline = form.deadline || null;
    let durationStart = null;
    if (form.durationType === 'duration' && form.durationHours) {
      durationStart = new Date().toISOString();
      effectiveDeadline = new Date(
        Date.now() + Number(form.durationHours) * 60 * 60 * 1000
      ).toISOString();
    }

    const taskData = {
      ...form,
      deadline: effectiveDeadline,
      durationStart,
      subtasks,
      firedAlerts: isEditing ? (task.firedAlerts || []) : [],
    };

    if (isEditing) {
      updateTask(task.id, taskData);
      addActivity({ type: 'updated', taskId: task.id, taskTitle: form.title });
    } else {
      const id = addTask(taskData);
      addActivity({ type: 'created', taskId: id, taskTitle: form.title });
    }
    setSaving(false);
    onClose();
  };

  const addSubtaskItem = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks((prev) => [...prev, { id: genId(), title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const addLabel = () => {
    if (!labelInput.trim() || form.labels.includes(labelInput.trim())) return;
    set('labels', [...form.labels, labelInput.trim()]);
    setLabelInput('');
  };

  const toggleAssignee = (id) => {
    set('assigneeIds',
      form.assigneeIds.includes(id)
        ? form.assigneeIds.filter((a) => a !== id)
        : [...form.assigneeIds, id],
    );
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 580 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="#fff" />
            </div>
            <h3 style={{ fontSize: 16 }}>{isEditing ? 'Edit Task' : 'New Task'}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className={`btn btn-icon btn-ghost ${form.starred ? '' : ''}`}
              onClick={() => set('starred', !form.starred)}
              title="Star task"
            >
              <Star size={16} fill={form.starred ? 'var(--accent-yellow)' : 'none'} color={form.starred ? 'var(--accent-yellow)' : 'var(--text-muted)'} />
            </button>
            <button className="btn btn-icon btn-ghost" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div className="input-group">
            <label className="input-label">Task Title *</label>
            <input
              id="task-title"
              className="input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              autoFocus
            />
            {errors.title && <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="input"
              placeholder="Add details, notes, or links..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
            />
          </div>

          {/* Priority + List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="input-group">
              <label className="input-label">Priority</label>
              <select className="input" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">List</label>
              <select className="input" value={form.listId} onChange={(e) => set('listId', e.target.value)}>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Type Toggle */}
          <div className="input-group">
            <label className="input-label">Deadline Type</label>
            <div className="tab-nav">
              <button
                className={`tab-btn ${form.durationType === 'deadline' ? 'active' : ''}`}
                onClick={() => set('durationType', 'deadline')}
              >
                <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                Fixed Deadline
              </button>
              <button
                className={`tab-btn ${form.durationType === 'duration' ? 'active' : ''}`}
                onClick={() => set('durationType', 'duration')}
              >
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                Duration Timer
              </button>
            </div>
          </div>

          {/* Deadline / Duration */}
          {form.durationType === 'deadline' ? (
            <div className="input-group">
              <label className="input-label">Due Date & Time</label>
              <input
                id="task-deadline"
                className="input"
                type="datetime-local"
                min={minDT}
                value={form.deadline}
                onChange={(e) => set('deadline', e.target.value)}
              />
              {errors.deadline && (
                <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>⛔ {errors.deadline}</span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                📅 Past dates are not allowed
              </span>
            </div>
          ) : (
            <div className="input-group">
              <label className="input-label">Duration (hours)</label>
              <input
                id="task-duration"
                className="input"
                type="number"
                min="0.1"
                step="0.5"
                placeholder="e.g. 4 (hours)"
                value={form.durationHours}
                onChange={(e) => set('durationHours', e.target.value)}
              />
              {errors.durationHours && (
                <span style={{ fontSize: 12, color: 'var(--accent-red)' }}>{errors.durationHours}</span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                ⏱ Timer starts when task is saved. Smart alerts fire as time runs out.
              </span>
            </div>
          )}

          {/* Recurring */}
          <div className="input-group">
            <label className="input-label">
              <RefreshCw size={11} style={{ display: 'inline', marginRight: 4 }} />
              Recurring
            </label>
            <select className="input" value={form.recurring} onChange={(e) => set('recurring', e.target.value)}>
              {RECURRING_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Assignees (Enterprise only) */}
          {mode === 'enterprise' && members.length > 0 && (
            <div className="input-group">
              <label className="input-label">
                <Users size={11} style={{ display: 'inline', marginRight: 4 }} />
                Assignees
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {members.map((m) => {
                  const selected = form.assigneeIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleAssignee(m.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                        background: selected ? 'var(--brand-glow)' : 'transparent',
                        color: selected ? 'var(--brand-light)' : 'var(--text-secondary)',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Avatar name={m.name} size={20} />
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div className="input-group">
            <label className="input-label">Subtasks</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {subtasks.map((st, i) => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => setSubtasks((prev) => prev.map((s, idx) => idx === i ? { ...s, completed: !s.completed } : s))}
                    style={{ accentColor: 'var(--brand)' }}
                  />
                  <span style={{ fontSize: 13, flex: 1, textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {st.title}
                  </span>
                  <button onClick={() => setSubtasks((p) => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Add subtask..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubtaskItem()}
                  style={{ fontSize: 13 }}
                />
                <button className="btn btn-ghost btn-sm" onClick={addSubtaskItem}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="input-group">
            <label className="input-label">
              <Tag size={11} style={{ display: 'inline', marginRight: 4 }} />
              Labels
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
              {form.labels.map((l) => (
                <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--brand-glow)', color: 'var(--brand-light)', fontSize: 11, fontWeight: 500, border: '1px solid var(--brand)40' }}>
                  {l}
                  <X size={10} style={{ cursor: 'pointer' }} onClick={() => set('labels', form.labels.filter((x) => x !== l))} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Add label..." value={labelInput} onChange={(e) => setLabelInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLabel()} style={{ fontSize: 13 }} />
              <button className="btn btn-ghost btn-sm" onClick={addLabel}><Plus size={14} /></button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : '+ Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
