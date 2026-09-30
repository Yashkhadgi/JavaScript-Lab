// src/components/common/CountdownChip.jsx
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { secondsRemaining, formatCountdown, getAlertLevel, isPast } from '../../utils/dateUtils';

export function CountdownChip({ deadline }) {
  const [seconds, setSeconds] = useState(() => secondsRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(secondsRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const overdue = seconds <= 0;
  const level = overdue ? 'overdue' : getAlertLevel(seconds * 1000);

  return (
    <span className={`countdown-chip level-${level}`}>
      <Clock size={10} />
      {overdue ? 'OVERDUE' : formatCountdown(seconds)}
    </span>
  );
}
