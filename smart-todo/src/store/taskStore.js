// src/store/taskStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { genId } from '../utils/dateUtils';

const defaultIndividualLists = [
  { id: 'my-tasks', name: 'My Tasks', color: '#7c6ff7', icon: '✨' },
  { id: 'work', name: 'Work', color: '#22d3ee', icon: '💼' },
  { id: 'personal', name: 'Personal', color: '#f472b6', icon: '🏠' },
];

export const useTaskStore = create(
  persist(
    (set, get) => ({
      /* ─── App Mode ─── */
      mode: null, // 'individual' | 'enterprise'
      setMode: (mode) => set({ mode }),

      /* ─── Theme ─── */
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      /* ─── Lists (Individual) ─── */
      lists: defaultIndividualLists,
      addList: (name, color = '#7c6ff7', icon = '📝') => {
        const id = genId();
        set((s) => ({ lists: [...s.lists, { id, name, color, icon }] }));
        return id;
      },
      deleteList: (id) => set((s) => ({
        lists: s.lists.filter((l) => l.id !== id),
        tasks: s.tasks.filter((t) => t.listId !== id),
      })),
      updateList: (id, updates) => set((s) => ({
        lists: s.lists.map((l) => l.id === id ? { ...l, ...updates } : l),
      })),

      /* ─── Members (Enterprise) ─── */
      workspace: null,
      setWorkspace: (ws) => set({ workspace: ws }),
      members: [],
      addMember: (member) => set((s) => ({
        members: [...s.members, { id: genId(), ...member, createdAt: new Date().toISOString() }],
      })),
      updateMember: (id, updates) => set((s) => ({
        members: s.members.map((m) => m.id === id ? { ...m, ...updates } : m),
      })),
      deleteMember: (id) => set((s) => ({
        members: s.members.filter((m) => m.id !== id),
      })),

      /* ─── Tasks ─── */
      tasks: [],

      addTask: (taskData) => {
        const task = {
          id: genId(),
          title: '',
          description: '',
          priority: 'p3',
          deadline: null,
          durationType: 'deadline', // 'deadline' | 'duration'
          durationHours: null,
          durationStart: null,
          listId: 'my-tasks',
          assigneeIds: [],
          subtasks: [],
          labels: [],
          starred: false,
          recurring: null,
          status: 'todo', // 'todo' | 'inprogress' | 'done'
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          firedAlerts: [],
          ...taskData,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task.id;
      },

      updateTask: (id, updates) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
        ),
      })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      completeTask: (id) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id
            ? { ...t, completed: true, status: 'done', completedAt: new Date().toISOString() }
            : t,
        ),
      })),

      uncompleteTask: (id) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === id ? { ...t, completed: false, status: 'todo', completedAt: null } : t,
        ),
      })),

      toggleStar: (id) => set((s) => ({
        tasks: s.tasks.map((t) => t.id === id ? { ...t, starred: !t.starred } : t),
      })),

      addSubtask: (taskId, title) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: [...t.subtasks, { id: genId(), title, completed: false }] }
            : t,
        ),
      })),

      toggleSubtask: (taskId, subtaskId) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st,
                ),
              }
            : t,
        ),
      })),

      deleteSubtask: (taskId, subtaskId) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) }
            : t,
        ),
      })),

      markAlertFired: (taskId, alertKey) => set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, firedAlerts: [...(t.firedAlerts || []), alertKey] }
            : t,
        ),
      })),

      /* ─── Alert log ─── */
      alertLog: [],
      addToAlertLog: (alert) => set((s) => ({
        alertLog: [{ ...alert, receivedAt: new Date().toISOString() }, ...s.alertLog].slice(0, 100),
      })),

      /* ─── Activity feed (Enterprise) ─── */
      activities: [],
      addActivity: (activity) => set((s) => ({
        activities: [
          { id: genId(), ...activity, ts: new Date().toISOString() },
          ...s.activities,
        ].slice(0, 200),
      })),

      /* ─── Selectors ─── */
      getTaskById: (id) => get().tasks.find((t) => t.id === id),
      getTasksByList: (listId) => get().tasks.filter((t) => t.listId === listId),
      getTasksByAssignee: (memberId) => get().tasks.filter((t) => t.assigneeIds?.includes(memberId)),
      getActiveTasks: () => get().tasks.filter((t) => !t.completed),
      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < now);
      },
      getTodayTasks: () => {
        const today = new Date(); today.setHours(0,0,0,0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        return get().tasks.filter((t) => {
          if (!t.deadline) return false;
          const d = new Date(t.deadline);
          return d >= today && d < tomorrow;
        });
      },
      getUpcomingTasks: () => {
        const today = new Date(); today.setHours(0,0,0,0);
        const next7 = new Date(today); next7.setDate(next7.getDate() + 7);
        return get().tasks.filter((t) => {
          if (!t.deadline || t.completed) return false;
          const d = new Date(t.deadline);
          return d >= today && d <= next7;
        });
      },

      /* ─── Reset (Enterprise workspace switch) ─── */
      resetEnterprise: () => set({ members: [], activities: [], workspace: null }),
    }),
    {
      name: 'smarttodo-store',
      version: 1,
    },
  ),
);
