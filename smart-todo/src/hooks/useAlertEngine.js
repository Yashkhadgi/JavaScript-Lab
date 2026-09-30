// src/hooks/useAlertEngine.js
import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { tickAlertEngine, fireBrowserNotification, requestNotificationPermission } from '../utils/alertEngine';

export function useAlertEngine(onAlert) {
  const tasks = useTaskStore((s) => s.tasks);
  const addToAlertLog = useTaskStore((s) => s.addToAlertLog);
  const markAlertFired = useTaskStore((s) => s.markAlertFired);
  const firedSet = useRef(new Set());

  // Load already-fired alerts from tasks into the set
  useEffect(() => {
    tasks.forEach((task) => {
      (task.firedAlerts || []).forEach((key) => firedSet.current.add(key));
    });
  }, []); // eslint-disable-line

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Tick every 60 seconds
  useEffect(() => {
    const tick = () => {
      const newAlerts = tickAlertEngine(tasks, firedSet.current);
      for (const alert of newAlerts) {
        // Persist to store
        markAlertFired(alert.taskId, alert.id);
        addToAlertLog(alert);
        // In-app callback
        if (onAlert) onAlert(alert);
        // Browser push (pass unique id so each alert appears separately)
        fireBrowserNotification(alert.title, alert.body, alert.level, alert.id);
      }
    };

    tick(); // immediate check on mount / task change
    const interval = setInterval(tick, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]); // eslint-disable-line
}
