"use client";

import { useEffect, useState } from "react";

const BASE_LISTENERS = 12;
const VARIANCE = 8;
const TICK_MS = 4500;

export function usePresence(): number {
  const [count, setCount] = useState(BASE_LISTENERS);

  useEffect(() => {
    const tick = () => {
      const drift = Math.floor((Math.random() - 0.5) * 2 * VARIANCE);
      setCount(Math.max(1, BASE_LISTENERS + drift));
    };
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return count;
}
