"use client";

import { useRef, useState, useCallback } from "react";
import { StrudelEditor } from "@/components/editor/strudel-editor";
import type { StrudelMirror } from "@strudel/codemirror";

export default function StudioPage() {
  const editorRef = useRef<StrudelMirror | null>(null);
  const [playing, setPlaying] = useState(false);

  const handleToggle = useCallback((isPlaying: boolean) => {
    setPlaying(isPlaying);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error("Strudel error:", error);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-bold text-xl text-lime tracking-tight">
            PULSE<span className="text-sky">·</span>CITY
          </h1>
          <span className="flex items-center gap-1.5 font-heading text-[0.58rem] tracking-widest text-text-dim bg-surface px-2 py-0.5 rounded-full border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
            {playing ? "PLAYING" : "READY"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading text-[0.55rem] tracking-widest text-violet bg-violet/15 px-2.5 py-0.5 rounded-full border border-violet/30 animate-[evolve-glow_1.5s_ease-in-out_infinite]">
            AUTOPILOT
          </span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: editor + chat */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          {/* Code panel */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border shrink-0">
              <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
                STRUDEL CODE
              </span>
            </div>
            <StrudelEditor
              onToggle={handleToggle}
              onError={handleError}
              editorRef={editorRef}
            />
          </div>

          {/* Chat placeholder */}
          <div className="shrink-0 border-t border-border max-h-32">
            <div className="px-3 py-2">
              <p className="text-xs text-text-dim">
                Ready. Hit Ctrl+Enter to play, or describe a vibe below.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-border">
              <span className="text-lime text-[0.6rem] shrink-0">&#9658;</span>
              <input
                type="text"
                placeholder="describe a vibe, give a direction..."
                className="flex-1 py-1.5 px-3 bg-surface border border-border rounded-full text-text text-xs focus:border-lime outline-none"
              />
              <button className="px-3 py-1 rounded-full bg-lime text-bg font-heading font-semibold text-[0.65rem] tracking-wide">
                SEND
              </button>
            </div>
          </div>
        </div>

        {/* Right: spectrum placeholder + tools */}
        <div className="w-[40%] max-w-[480px] min-w-[280px] flex flex-col overflow-hidden max-md:hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border shrink-0">
            <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
              SPECTRUM ANALYZER
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-bg text-surface-2 text-xs font-mono">
            NO SIGNAL
          </div>
          <div className="shrink-0 border-t border-border">
            <div className="px-3 py-1 border-b border-border">
              <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
                TOOLS
              </span>
            </div>
            <div className="grid grid-cols-4 gap-px bg-border">
              {[
                { icon: "🥁", name: "DRUMS" },
                { icon: "🔊", name: "BASS" },
                { icon: "🎹", name: "CHORDS" },
                { icon: "🎵", name: "LEAD" },
                { icon: "✨", name: "FX" },
                { icon: "🌀", name: "FILTER" },
                { icon: "⏱", name: "TEMPO" },
                { icon: "⚡", name: "DROP" },
              ].map((tool) => (
                <button
                  key={tool.name}
                  className="flex flex-col items-center justify-center gap-0.5 py-2 bg-surface text-text-dim hover:bg-surface-2 hover:text-text transition-all"
                >
                  <span className="text-lg leading-none">{tool.icon}</span>
                  <span className="font-heading text-[0.48rem] tracking-widest font-semibold">
                    {tool.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transport bar */}
      <footer className="flex items-center justify-between px-3 py-1.5 border-t border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => editorRef.current?.toggle()}
            className="px-3 py-1.5 rounded-full bg-lime text-bg font-heading font-semibold text-[0.68rem] tracking-wide"
          >
            {playing ? "⏸ PAUSE" : "▶ PLAY"}
          </button>
          <button
            onClick={() => editorRef.current?.stop()}
            className="px-3 py-1.5 rounded-full bg-surface text-text border border-border font-heading font-semibold text-[0.68rem] tracking-wide hover:bg-surface-2"
          >
            ■ STOP
          </button>
        </div>
        <div className="flex-1 text-center overflow-hidden">
          <span className="text-[0.55rem] text-text-dim tracking-wide whitespace-nowrap">
            ▓▒░ PULSE.CITY · THE CITY IS PLAYING · TUNE IN ░▒▓
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => editorRef.current?.evaluate()}
            className="px-3 py-1.5 rounded-full bg-surface text-text border border-border font-heading font-semibold text-[0.68rem] tracking-wide hover:bg-surface-2"
          >
            ↻ RE-RUN
          </button>
        </div>
      </footer>
    </>
  );
}
