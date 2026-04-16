"use client";

import { useState } from "react";

interface PatternPlayerProps {
  code: string;
}

export function PatternPlayer({ code }: PatternPlayerProps) {
  const [playing, setPlaying] = useState(false);

  async function handlePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }

    try {
      const { initStrudelAudio } = await import("@/lib/strudel/init");
      await initStrudelAudio();
      setPlaying(true);
    } catch (err) {
      console.error("Play failed:", err);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePlay}
        className="w-16 h-16 rounded-full bg-listener flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="white"
          stroke="none"
          className="ml-1"
        >
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
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-listener"
          style={playing ? { animation: "pulse-dot 1.5s ease-in-out infinite" } : { opacity: 0.3 }}
        />
        <span className="font-micro text-[10px] tracking-widest text-listener uppercase">
          {playing ? "[OK] PLAYING" : "PLAY"}
        </span>
      </div>
    </div>
  );
}
