"use client";

import type { StrudelMirror } from "@strudel/codemirror";
import { useStore } from "@/lib/store";

/* ── Inline SVG icons ── */

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25zM11.5 9.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/* ── Component ── */

interface TransportBarProps {
  editorRef: React.RefObject<StrudelMirror | null>;
  onEvolve?: () => void;
  autoEvolve?: boolean;
  onToggleAutoEvolve?: () => void;
}

export function TransportBar({
  editorRef,
  onEvolve,
  autoEvolve,
  onToggleAutoEvolve,
}: TransportBarProps) {
  const { playing } = useStore();

  return (
    <div className="w-full flex justify-between items-center h-12 bg-surface-1 border-b border-white/5 px-3 md:px-4 gap-2 md:gap-3 shrink-0">
      {/* Left: Play/Stop */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => editorRef.current?.toggle()}
          className="flex items-center gap-2 bg-creator text-base px-3 md:px-4 py-1.5 rounded-full hover:brightness-110 transition-transform active:scale-95 cursor-pointer"
          title="Play / Pause"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span className="font-micro text-[10px] font-bold tracking-widest hidden sm:inline">
            {playing ? "PAUSE" : "PLAY"}
          </span>
        </button>
        <button
          onClick={() => editorRef.current?.stop()}
          className="flex items-center gap-2 bg-transparent glass-line text-text px-2 md:px-3 py-1.5 rounded-sm hover:bg-white/5 transition-transform active:scale-95 cursor-pointer"
          title="Stop"
          aria-label="Stop"
        >
          <StopIcon />
        </button>
        <button
          onClick={() => editorRef.current?.evaluate()}
          className="flex items-center gap-1.5 text-text-dim hover:text-text font-micro text-[10px] tracking-widest transition-colors cursor-pointer px-2 py-1.5"
          title="Re-evaluate current code (Ctrl+Enter)"
        >
          <RefreshIcon />
          <span className="hidden md:inline">RE-RUN</span>
        </button>
      </div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Right: Evolve / Auto */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEvolve}
          className="flex items-center gap-1.5 bg-agent/10 border border-agent/30 text-agent px-2 md:px-3 py-1.5 rounded-sm hover:bg-agent/20 transition-all duration-150 active:scale-95 cursor-pointer"
          title="Evolve once"
        >
          <SparkleIcon />
          <span className="font-micro text-[10px] font-bold tracking-widest hidden sm:inline">
            EVOLVE
          </span>
        </button>
        {onToggleAutoEvolve && (
          <button
            onClick={onToggleAutoEvolve}
            className={`flex items-center gap-1.5 border px-2 md:px-3 py-1.5 rounded-sm transition-all duration-150 active:scale-95 cursor-pointer font-micro text-[10px] font-bold tracking-widest ${
              autoEvolve
                ? "bg-agent/20 border-agent text-agent"
                : "border-white/10 text-text-dim hover:text-text hover:border-white/20"
            }`}
            title="Auto-evolve: AI mutates your code every 30s while playing"
            aria-pressed={!!autoEvolve}
          >
            {autoEvolve && (
              <span className="w-1.5 h-1.5 bg-agent rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
            )}
            <span>AUTO</span>
          </button>
        )}
      </div>
    </div>
  );
}
