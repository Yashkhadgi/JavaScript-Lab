// src/hooks/useLiveClock.js
import { useState, useEffect } from 'react';

export function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
}
