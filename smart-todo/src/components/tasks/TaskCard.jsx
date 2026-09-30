// src/components/tasks/TaskCard.jsx
import { useState } from 'react';
import { Check, Star, Trash2, Edit, ChevronDown, ChevronRight, Users, Tag, RefreshCw } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { formatDate, getDayLabel, isPast } from '../../utils/dateUtils';
import { CountdownChip } from '../common/CountdownChip';
import { Avatar, AvatarGroup } from '../common/Avatar';
import { TaskModal } from './TaskModal';

const PRIORITY_COLORS = { p1: 'var(--p1)', p2: 'var(--p2)', p3: 'var(--p3)', p4: 'var(--p4)' };

export function TaskCard({ task }) {
  const completeTask = useTaskStore((s) => s.completeTask);
  const uncompleteTask = useTaskStore((s) => s.uncompleteTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleStar = useTaskStore((s) => s.toggleStar);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const members = useTaskStore((s) => s.members);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOverdue = !task.completed && task.deadline && isPast(new Date(task.deadline));
  const assigneeNames = (task.assigneeIds || [])
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean);

  const subtasksDone = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtasksTotal = task.subtasks?.length || 0;

  const handleComplete = (e) => {
    e.stopPropagation();
    if (task.completed) uncompleteTask(task.id);
    else completeTask(task.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDeleting(true);
    setTimeout(() => deleteTask(task.id), 200);
  };

  return (
    <>
      <div
        className="card"
        style={{
          cursor: 'pointer',
          borderLeft: `3px solid ${PRIORITY_COLORS[task.priority] || 'var(--border)'}`,
          opacity: task.completed ? 0.6 : 1,
          transition: 'all 0.2s var(--ease)',
          transform: deleting ? 'scale(0.95) translateX(20px)' : 'none',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Checkbox */}
          <button
            onClick={handleComplete}
            style={{
              width: 20, height: 20, borderRadius: 6, border: `2px solid ${task.completed ? 'var(--brand)' : 'var(--border-strong)'}`,
              background: task.completed ? 'var(--brand)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, marginTop: 2,
              transition: 'all 0.2s',
            }}
          >
            {task.completed && <Check size={12} color="#fff" strokeWidth={3} style={{ animation: 'checkPop 0.3s var(--ease)' }} />}
          </button>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 14, fontWeight: 500,
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {task.title}
              </span>
              {task.recurring && (
                <RefreshCw size={11} color="var(--text-muted)" title={`Recurring: ${task.recurring}`} />
              )}
              {task.starred && <Star size={12} fill="var(--accent-yellow)" color="var(--accent-yellow)" />}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {/* Priority badge */}
              <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLORS[task.priority], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {task.priority?.toUpperCase()}
              </span>

              {/* Deadline */}
              {task.deadline && !task.completed && (
                <>
                  <span style={{ fontSize: 11, color: isOverdue ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    {getDayLabel(task.deadline)} · {formatDate(task.deadline, 'h:mm a')}
                  </span>
                  <CountdownChip deadline={task.deadline} />
                </>
              )}

              {/* Subtasks progress */}
              {subtasksTotal > 0 && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  ☑ {subtasksDone}/{subtasksTotal}
                </span>
              )}

              {/* Assignees */}
              {assigneeNames.length > 0 && <AvatarGroup names={assigneeNames} size={20} max={3} />}

              {/* Labels */}
              {(task.labels || []).slice(0, 2).map((l) => (
                <span key={l} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--brand-glow)', color: 'var(--brand-light)', border: '1px solid var(--brand)40' }}>
                  {l}
                </span>
              ))}
            </div>

            {/* Subtask progress bar */}
            {subtasksTotal > 0 && (
              <div className="progress-bar" style={{ marginTop: 8, width: '100%' }}>
                <div className="progress-bar-fill" style={{ width: `${(subtasksDone / subtasksTotal) * 100}%` }} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); toggleStar(task.id); }} title="Star">
              <Star size={13} fill={task.starred ? 'var(--accent-yellow)' : 'none'} color={task.starred ? 'var(--accent-yellow)' : 'var(--text-muted)'} />
            </button>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setEditing(true); }} title="Edit">
              <Edit size={13} />
            </button>
            <button className="btn btn-icon btn-danger btn-sm" onClick={handleDelete} title="Delete">
              <Trash2 size={13} />
            </button>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
              {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded subtasks */}
        {expanded && subtasksTotal > 0 && (
          <div style={{ marginTop: 12, paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); toggleSubtask(task.id, st.id); }}
              >
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${st.completed ? 'var(--brand)' : 'var(--border-strong)'}`, background: st.completed ? 'var(--brand)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {st.completed && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 13, color: st.completed ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: st.completed ? 'line-through' : 'none' }}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Description preview */}
        {expanded && task.description && (
          <p style={{ marginTop: 10, paddingLeft: 32, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {task.description}
          </p>
        )}
      </div>

      {editing && <TaskModal task={task} onClose={() => setEditing(false)} />}
    </>
  );
}
