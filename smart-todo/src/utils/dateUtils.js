// src/utils/dateUtils.js
import { format, formatDistance, isAfter, isBefore, addMinutes, addHours, addDays, parseISO, differenceInMilliseconds, differenceInSeconds } from 'date-fns';

export const NOW = () => new Date();

/** Prevents past date selection — returns min datetime-local string */
export function minDateTimeLocal() {
  const now = new Date();
  // round up to next minute
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);
  return toDateTimeLocal(now);
}

/** Convert Date to datetime-local string */
export function toDateTimeLocal(date) {
  const d = date instanceof Date ? date : new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 16);
}

/** Parse datetime-local string to Date */
export function fromDateTimeLocal(str) {
  if (!str) return null;
  return new Date(str);
}

/** Is the given date in the past? */
export function isPast(date) {
  return isBefore(new Date(date), NOW());
}

/** Is the given date in the future? */
export function isFuture(date) {
  return isAfter(new Date(date), NOW());
}

/** Format date nicely */
export function formatDate(date, fmt = 'MMM d, yyyy h:mm a') {
  if (!date) return '—';
  return format(new Date(date), fmt);
}

/** Time remaining as human string */
export function timeRemaining(deadline) {
  const d = new Date(deadline);
  if (isPast(d)) return null; // overdue
  return formatDistance(d, NOW(), { addSuffix: true });
}

/** Milliseconds remaining */
export function msRemaining(deadline) {
  return differenceInMilliseconds(new Date(deadline), NOW());
}

/** Seconds remaining */
export function secondsRemaining(deadline) {
  return differenceInSeconds(new Date(deadline), NOW());
}

/** Format HH:MM:SS from seconds */
export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return 'OVERDUE';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

/** Get alert urgency level based on ms remaining */
export function getAlertLevel(msLeft) {
  if (msLeft <= 0) return 'overdue';
  if (msLeft <= 60 * 1000) return 'critical';       // 1 min
  if (msLeft <= 3 * 60 * 1000) return 'urgent';     // 3 min
  if (msLeft <= 10 * 60 * 1000) return 'danger';    // 10 min
  if (msLeft <= 30 * 60 * 1000) return 'danger';    // 30 min
  if (msLeft <= 60 * 60 * 1000) return 'warning';   // 1 hr
  if (msLeft <= 3 * 60 * 60 * 1000) return 'danger';// 3 hr
  if (msLeft <= 24 * 60 * 60 * 1000) return 'warning'; // 1 day
  if (msLeft <= 3 * 24 * 60 * 60 * 1000) return 'info'; // 3 days
  return 'info';
}

/** Generate unique id */
export function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Validate deadline: must be in future */
export function validateDeadline(deadlineStr) {
  if (!deadlineStr) return 'Deadline is required';
  const d = fromDateTimeLocal(deadlineStr);
  if (!d) return 'Invalid date';
  if (isPast(d)) return 'Deadline cannot be in the past';
  return null; // valid
}

/** Get day label */
export function getDayLabel(date) {
  const d = new Date(date);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = addDays(today, 1);
  const dd = new Date(d); dd.setHours(0,0,0,0);
  if (dd.getTime() === today.getTime()) return 'Today';
  if (dd.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return format(d, 'MMM d');
}
