"use client";

import { useState, useEffect } from "react";
import type { StrudelMirror } from "@strudel/codemirror";
import { useStore } from "@/lib/store";

const TICKER_MESSAGES = [
  "PULSE.CITY · THE CITY IS PLAYING · TUNE IN",
  "IPE VILLAGE 2026 · JURERE INTERNACIONAL · FLORIANOPOLIS",
  "OPEN · AUTONOMOUS · COLLECTIVE · LIVING SOUNDTRACK",
  "POWERED BY STRUDEL · LIVE CODED MUSIC · AI EVOLVED",
  "A LIVING RADIO FOR POP-UP CITIES",
];

interface TransportBarProps {
  editorRef: React.RefObject<StrudelMirror | null>;
}

export function TransportBar({ editorRef }: TransportBarProps) {
  const { playing, mode } = useStore();
  const isAutopilot = mode === "autopilot";
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_MESSAGES.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="flex items-center justify-between px-3 py-1.5 border-t border-border shrink-0">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => editorRef.current?.toggle()}
          className="px-3 py-1.5 rounded-full bg-lime text-bg font-heading font-semibold text-[0.68rem] tracking-wide cursor-pointer hover:brightness-110 transition"
        >
          {playing ? "⏸ PAUSE" : "▶ PLAY"}
        </button>
        <button
          onClick={() => editorRef.current?.stop()}
          className="px-3 py-1.5 rounded-full bg-surface text-text border border-border font-heading font-semibold text-[0.68rem] tracking-wide hover:bg-surface-2 cursor-pointer transition"
        >
          ■ STOP
        </button>
      </div>

      <div className="flex-1 text-center overflow-hidden">
        <span className="text-[0.55rem] text-text-dim tracking-wide whitespace-nowrap transition-opacity duration-500">
          ▓▒░ {TICKER_MESSAGES[tickerIdx]} ░▒▓
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {isAutopilot && (
          <button className="px-3 py-1.5 rounded-full bg-violet/20 text-violet border border-violet/30 font-heading font-semibold text-[0.68rem] tracking-wide hover:bg-violet/30 cursor-pointer transition">
            ⟳ EVOLVE
          </button>
        )}
        <button
          onClick={() => editorRef.current?.evaluate()}
          className="px-3 py-1.5 rounded-full bg-surface text-text border border-border font-heading font-semibold text-[0.68rem] tracking-wide hover:bg-surface-2 cursor-pointer transition"
        >
          ↻ RE-RUN
        </button>
      </div>
    </footer>
  );
}
