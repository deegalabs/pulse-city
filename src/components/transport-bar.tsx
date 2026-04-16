"use client";

import type { StrudelMirror } from "@strudel/codemirror";
import { useStore } from "@/lib/store";

const MANUAL_TICKER =
  "▓▒░ PULSE.CITY · THE CITY IS PLAYING · TUNE IN · BROADCASTING LIVE FROM VIRTUAL CLUSTER 7 · RE-SEQUENCING AUDIO BUFFER... · PULSE.CITY · THE CITY IS PLAYING · TUNE IN ░▒▓";

const AUTOPILOT_TICKER =
  "▓▒░ AUTOPILOT ACTIVE · AGENT IS COMPOSING ░▒▓       ▓▒░ AUTOPILOT ACTIVE · AGENT IS COMPOSING ░▒▓";

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
}

export function TransportBar({ editorRef, onEvolve }: TransportBarProps) {
  const { playing, mode } = useStore();
  const isAutopilot = mode === "autopilot";

  if (isAutopilot) {
    return (
      <footer className="fixed bottom-0 w-full h-14 bg-surface-1 border-t border-white/10 flex items-center z-50">
        {/* Left: Pause + Evolve */}
        <div className="flex items-center h-full px-6 gap-6">
          <button
            onClick={() => editorRef.current?.toggle()}
            className="w-10 h-10 flex items-center justify-center hover:bg-agent/10 transition-colors border border-agent/20 cursor-pointer"
          >
            {playing ? (
              <PauseIcon className="text-agent" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-agent">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
          <button
            onClick={onEvolve}
            className="h-10 px-6 font-micro text-xs tracking-widest bg-agent/10 text-agent border border-agent hover:bg-agent hover:text-base transition-all flex items-center gap-3 cursor-pointer"
          >
            <span className="w-2 h-2 bg-agent rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
            EVOLVE
          </button>
        </div>

        {/* Center: Marquee ticker */}
        <div className="flex-1 h-full flex items-center bg-base/50 overflow-hidden relative">
          <div className="whitespace-nowrap font-micro text-[10px] tracking-[0.3em] text-agent/80 px-8 animate-[marquee_10s_linear_infinite]">
            {AUTOPILOT_TICKER}
          </div>
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface-1 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-1 to-transparent" />
        </div>

        {/* Right: Clock + Volume */}
        <div className="px-6 flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-micro text-[9px] text-text-dim tracking-widest">CLOCK</span>
            <span className="font-mono text-xs text-text">124.00 BPM</span>
          </div>
          <div className="h-10 w-px bg-white/5" />
          <div className="flex items-center gap-3">
            <VolumeIcon />
            <div className="w-24 h-1 bg-surface-3 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-3/4 bg-agent" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  /* ── Manual mode ── */
  return (
    <footer className="fixed bottom-0 w-full z-50 flex justify-between items-center h-16 bg-surface-1 border-t border-white/5 px-6">
      {/* Left: Play/Stop */}
      <div className="flex items-center gap-3 w-1/4">
        <button
          onClick={() => editorRef.current?.toggle()}
          className="flex items-center gap-2 bg-creator text-base px-6 py-2 rounded-full hover:brightness-110 transition-transform active:scale-95 cursor-pointer"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span className="font-micro text-[10px] font-bold tracking-widest">
            {playing ? "PAUSE" : "PLAY"}
          </span>
        </button>
        <button
          onClick={() => editorRef.current?.stop()}
          className="flex items-center gap-2 bg-transparent glass-line text-text px-4 py-2 rounded-sm hover:bg-white/5 transition-transform active:scale-95 cursor-pointer"
        >
          <StopIcon />
        </button>
      </div>

      {/* Center: Scrolling Ticker */}
      <div className="flex-1 overflow-hidden mx-8 h-full flex items-center bg-base/50">
        <div className="whitespace-nowrap font-micro text-[10px] tracking-[0.2em] text-text-dim uppercase animate-[ticker_30s_linear_infinite]">
          {MANUAL_TICKER}
        </div>
      </div>

      {/* Right: Re-run / Evolve */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        <button
          onClick={() => editorRef.current?.evaluate()}
          className="flex items-center gap-2 text-text-dim hover:text-text font-micro text-[10px] tracking-widest transition-colors cursor-pointer"
        >
          <RefreshIcon />
          RE-RUN
        </button>
        <button
          onClick={onEvolve}
          className="flex items-center gap-2 bg-agent/10 border border-agent/30 text-agent px-4 py-2 rounded-sm hover:bg-agent/20 transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <SparkleIcon />
          <span className="font-micro text-[10px] font-bold tracking-widest">EVOLVE</span>
        </button>
      </div>
    </footer>
  );
}
