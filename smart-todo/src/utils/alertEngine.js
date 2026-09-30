// src/utils/alertEngine.js
import { msRemaining, isPast } from './dateUtils';

const MIN = 60 * 1000;
const HR = 60 * MIN;
const DAY = 24 * HR;

// Thresholds for deadline-based tasks
export const DEADLINE_THRESHOLDS = [
  { key: 'd3d', label: '3 days',  ms: 3 * DAY,   level: 'info',     title: '📋 Task Due in 3 Days',  body: (t) => `"${t.title}" is due in 3 days.` },
  { key: 'd1d', label: '1 day',   ms: 1 * DAY,   level: 'warning',  title: '⚠️ Task Due Tomorrow',   body: (t) => `"${t.title}" is due tomorrow. Get on it!` },
  { key: 'd3h', label: '3 hours', ms: 3 * HR,    level: 'danger',   title: '🔴 3 Hours Left!',        body: (t) => `Only 3 hours left for "${t.title}".` },
  { key: 'd1h', label: '1 hour',  ms: 1 * HR,    level: 'urgent',   title: '🚨 1 Hour Left!',         body: (t) => `URGENT: "${t.title}" is due in 1 hour!` },
  { key: 'd0',  label: 'Overdue', ms: 0,         level: 'critical', title: '💀 Task Overdue!',        body: (t) => `"${t.title}" is now OVERDUE.` },
];

// Thresholds for duration-based tasks (timer started)
export const DURATION_THRESHOLDS = [
  { key: 'r1h',  label: '1 hour',   ms: 1 * HR,    level: 'info',     title: '⏳ 1 Hour Remaining',     body: (t) => `1 hour left on "${t.title}".` },
  { key: 'r30m', label: '30 mins',  ms: 30 * MIN,  level: 'warning',  title: '⚠️ 30 Minutes Left',      body: (t) => `Only 30 minutes left on "${t.title}".` },
  { key: 'r10m', label: '10 mins',  ms: 10 * MIN,  level: 'danger',   title: '🔴 10 Minutes Left!',     body: (t) => `${t.title}" wraps up in 10 minutes!` },
  { key: 'r3m',  label: '3 mins',   ms: 3 * MIN,   level: 'urgent',   title: '🚨 3 Minutes Left!',      body: (t) => `CRITICAL: Only 3 minutes left on "${t.title}"!` },
  { key: 'r1m',  label: '1 min',    ms: 1 * MIN,   level: 'critical', title: '💀 Final Minute!',        body: (t) => `"${t.title}" — 1 MINUTE REMAINING. NOW!` },
];

/**
 * Core alert engine tick — call every 60 seconds.
 * Returns array of alerts that need to fire.
 *
 * KEY FIX: Only fire thresholds that are RELEVANT to the task's total timespan.
 * e.g. a 5-hour task should NEVER fire "3 days" or "1 day" alerts.
 *      a 5-minute task should NEVER fire "1 hour" or "30 min" alerts.
 *
 * @param {Array} tasks - All active tasks
 * @param {Set} firedAlerts - Set of already-fired alert keys
 * @returns {Array} newAlerts
 */
export function tickAlertEngine(tasks, firedAlerts) {
  const newAlerts = [];

  for (const task of tasks) {
    if (task.completed) continue;

    const effectiveDeadline = task.deadline;
    if (!effectiveDeadline) continue;

    const msLeft = msRemaining(effectiveDeadline);

    // ── Compute total task timespan ──────────────────────────────────────────
    // For duration-based tasks: the declared duration in ms
    // For deadline-based tasks: time from when the task was created to deadline
    let totalMs;
    if (task.durationType === 'duration' && task.durationHours) {
      totalMs = Number(task.durationHours) * 60 * 60 * 1000;
    } else {
      // createdAt → deadline
      const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : Date.now();
      const deadlineMs = new Date(effectiveDeadline).getTime();
      totalMs = deadlineMs - createdAt;
    }

    // ── Pick threshold set ───────────────────────────────────────────────────
    const thresholds = task.durationType === 'duration' ? DURATION_THRESHOLDS : DEADLINE_THRESHOLDS;

    for (const threshold of thresholds) {
      const alertKey = `${task.id}::${threshold.key}`;
      if (firedAlerts.has(alertKey)) continue;

      // ✅ SMART FILTER: skip this threshold if it's bigger than the total task time.
      //    e.g. don't fire "3 days" for a 5-hour task, don't fire "1 hr" for a 5-min task.
      //    The overdue threshold (ms=0) is always allowed.
      if (threshold.ms > 0 && threshold.ms >= totalMs) continue;

      // Fire if current time has crossed below this threshold
      if (msLeft <= threshold.ms) {
        newAlerts.push({
          id: alertKey,
          taskId: task.id,
          threshold,
          title: threshold.title,
          body: threshold.body(task),
          level: threshold.level,
          taskTitle: task.title,
        });
        firedAlerts.add(alertKey);
      }
    }
  }

  return newAlerts;
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Fire a browser push notification
 */
export function fireBrowserNotification(title, body, level = 'info', uniqueKey = '') {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const icons = { info: '📋', warning: '⚠️', danger: '🔴', urgent: '🚨', critical: '💀' };
  // Use uniqueKey as tag so each alert shows individually (not replacing the previous one)
  new Notification(`${icons[level] || '🔔'} ${title}`, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: uniqueKey || `smarttodo-${level}-${Date.now()}`,
  });
}
