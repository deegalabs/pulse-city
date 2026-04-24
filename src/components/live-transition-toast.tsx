"use client";

import { useEffect, useState } from "react";

interface LiveTransitionToastProps {
  title: string;
  onDone?: () => void;
  durationMs?: number;
}

export function LiveTransitionToast({
  title,
  onDone,
  durationMs = 4000,
}: LiveTransitionToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const appear = window.setTimeout(() => setVisible(true), 30);
    const hide = window.setTimeout(() => setVisible(false), durationMs - 400);
    const done = window.setTimeout(() => onDone?.(), durationMs);
    return () => {
      window.clearTimeout(appear);
      window.clearTimeout(hide);
      window.clearTimeout(done);
    };
  }, [durationMs, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3 bg-surface-1/95 border border-listener/40 backdrop-blur-sm px-4 py-2 rounded shadow-lg">
        <span className="w-1.5 h-1.5 bg-listener rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
        <span className="font-micro text-[10px] tracking-widest text-listener uppercase">
          Tuned in
        </span>
        <span className="h-3 w-px bg-white/10" />
        <span className="font-micro text-[10px] tracking-widest text-text max-w-[220px] truncate">
          {title}
        </span>
        <span className="font-micro text-[9px] tracking-widest text-text-dim">
          · edit to fork
        </span>
      </div>
    </div>
  );
}
