"use client";

import { useState } from "react";

interface EmbedWidgetProps {
  title: string;
  author: string;
  code: string;
  patternId: string;
}

export function EmbedWidget({ title, author, code, patternId }: EmbedWidgetProps) {
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleToggle() {
    if (playing) {
      setPlaying(false);
      return;
    }
    try {
      const { initStrudelAudio } = await import("@/lib/strudel/init");
      await initStrudelAudio();
      setPlaying(true);
    } catch (err) {
      console.error("Embed play failed:", err);
    }
  }

  if (collapsed) {
    return (
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setCollapsed(false)}
          className="w-3 h-3 bg-listener rounded-full cursor-pointer shadow-[0_0_8px_rgba(58,165,255,0.4)]"
          style={playing ? { animation: "pulse-dot 1.5s ease-in-out infinite" } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-surface-1 border border-white/10 shadow-2xl flex flex-col gap-3 p-5">
      {/* Top Row: Wordmark + Close */}
      <div className="flex justify-between items-center">
        <span className="font-heading text-[10px] tracking-widest text-text-dim uppercase">
          PULSE<span className="text-listener">·</span>CITY
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-text-dim hover:text-text cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Title + Author */}
      <div className="flex flex-col gap-0.5">
        <h1 className="font-heading text-base text-text leading-tight">
          {title}
        </h1>
        <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
          by {author}
        </p>
      </div>

      {/* Waveform */}
      <div className="w-full h-8 flex items-center">
        <svg className="w-full h-full" viewBox="0 0 280 32" preserveAspectRatio="none">
          <path
            d="M0,16 Q10,16 20,8 T40,16 T60,24 T80,16 T100,4 T120,16 T140,28 T160,16 T180,8 T200,16 T220,24 T240,16 T260,12 T280,16"
            fill="none"
            stroke="#3aa5ff"
            strokeWidth="1.5"
            opacity={playing ? 0.8 : 0.3}
          />
          <path d="M0,16 L280,16" stroke="#3aa5ff" strokeWidth="0.5" opacity="0.2" />
        </svg>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="w-8 h-8 rounded-full bg-listener flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
              {playing ? (
                <>
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </>
              ) : (
                <polygon points="5 3 19 12 5 21 5 3" />
              )}
            </svg>
          </button>
          {playing && (
            <span className="font-micro text-[9px] tracking-widest text-listener uppercase flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-listener inline-block"
                style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
              />
              LIVE
            </span>
          )}
        </div>
        <a
          href={`/p/${patternId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-micro text-[10px] tracking-widest text-listener hover:opacity-80 transition-opacity"
        >
          [ OPEN ]
        </a>
      </div>
    </div>
  );
}
