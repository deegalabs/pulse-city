"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { SpectrumAnalyzer } from "@/components/spectrum/spectrum-analyzer";
import { StrudelEditor } from "@/components/editor/strudel-editor";
import type { StrudelMirror } from "@strudel/codemirror";
import { useStore } from "@/lib/store";

const FALLBACK_CODE = `$: s("bd*4").bank('RolandTR909').gain(.8).analyze(1)
$: s("~ cp ~ cp").bank('RolandTR909').room(.3).gain(.5)
$: s("hh*8").bank('RolandTR909').gain(perlin.range(.2,.45))
$: note("<c2 c2 eb2 g1>").struct("x(5,8)")
  .s('sawtooth').decay(.15).sustain(0)
  .lpf(800).lpq(8).gain(.5).analyze(1)
$: note("<[c4,eb4,g4] [ab3,c4,eb4]>/2")
  .s('square').decay(.3).sustain(.1).release(.5)
  .lpf(1200).gain(.2).delay(.4).delaytime(.375).delayfeedback(.4)
`;

export default function RadioPage() {
  const editorRef = useRef<StrudelMirror | null>(null);
  const bootedRef = useRef(false);
  const [radioCode, setRadioCode] = useState(FALLBACK_CODE);
  const [radioTitle, setRadioTitle] = useState("pulse.city radio");
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [booting, setBooting] = useState(false);
  const [uptime, setUptime] = useState("00:00:00");
  const [codeOpen, setCodeOpen] = useState(false);
  const { setBroadcast, setBroadcastActive } = useStore();

  // Mark broadcast active while radio is playing.
  // Do NOT clear on unmount — Strudel's audio scheduler keeps running the
  // pattern after we navigate away, so the broadcast is still "live".
  useEffect(() => {
    if (playing) setBroadcastActive(true);
  }, [playing, setBroadcastActive]);

  // Uptime counter
  useEffect(() => {
    if (!playing) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(tick);
  }, [playing]);

  const handleToggle = useCallback((isPlaying: boolean) => {
    setPlaying(isPlaying);
  }, []);

  // Wait for editor ref to be available
  function waitForEditor(): Promise<StrudelMirror> {
    return new Promise((resolve, reject) => {
      if (editorRef.current) {
        resolve(editorRef.current);
        return;
      }
      const check = setInterval(() => {
        if (editorRef.current) {
          clearInterval(check);
          resolve(editorRef.current);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        reject(new Error("Editor timeout"));
      }, 10000);
    });
  }

  // Boot audio + compose + play
  async function handlePlay() {
    if (booting) return;

    // Already booted: toggle play/pause
    if (bootedRef.current) {
      const editor = editorRef.current;
      if (!editor) return;
      if (playing) {
        editor.stop();
        setBroadcastActive(false);
      } else {
        editor.evaluate();
        setBroadcastActive(true);
      }
      return;
    }

    // First time: init audio, then mount editor, then compose + play
    setBooting(true);
    try {
      // 1. Init audio + evalScope (registers s, note, etc.)
      const { initStrudelAudio } = await import("@/lib/strudel/init");
      await initStrudelAudio();

      // 2. Now safe to mount the editor (evalScope done)
      setReady(true);
      setCodeOpen(true);

      // 3. Wait for StrudelEditor to mount
      const editor = await waitForEditor();
      bootedRef.current = true;

      // 4. Compose via AI (fallback to default code)
      let code = FALLBACK_CODE;
      let title = "Ambient Signal";
      try {
        const res = await fetch("/api/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            code?: string | null;
            title?: string;
          };
          if (data.code && typeof data.code === "string") {
            code = data.code;
            if (data.title) title = data.title;
          }
        }
      } catch {
        // fallback
      }

      // Trim leading/trailing whitespace from AI responses
      code = code.trim();
      setRadioCode(code);
      setRadioTitle(title);
      setBroadcast(code, title);
      setBroadcastActive(true);
      editor.setCode(code);
      editor.evaluate();
    } catch (err) {
      console.error("Radio boot failed:", err);
      bootedRef.current = false;
    } finally {
      setBooting(false);
    }
  }

  // Skip to next track
  async function handleSkip() {
    const editor = editorRef.current;
    if (!editor || !bootedRef.current) return;

    let code = FALLBACK_CODE;
    let title = "Ambient Signal";
    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          code?: string | null;
          title?: string;
        };
        if (data.code && typeof data.code === "string") {
          code = data.code;
          if (data.title) title = data.title;
        }
      }
    } catch {
      // fallback
    }
    code = code.trim();
    setRadioCode(code);
    setRadioTitle(title);
    setBroadcast(code, title);
    editor.setCode(code);
    editor.evaluate();
  }

  // Auto-evolve every 30s
  useEffect(() => {
    if (!playing || !bootedRef.current) return;
    const interval = setInterval(async () => {
      const editor = editorRef.current;
      if (!editor || !radioCode.trim()) return;
      try {
        const res = await fetch("/api/evolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentCode: radioCode }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.code) {
            const evolved = data.code.trim();
            setRadioCode(evolved);
            setBroadcast(evolved, radioTitle);
            editor.setCode(evolved);
            editor.evaluate();
          }
        }
      } catch {
        // silently fail
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [playing, radioCode, radioTitle, setBroadcast]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden relative bg-base text-text font-body selection:bg-listener selection:text-base">
      {/* Background: Spectrum Analyzer */}
      <div className="absolute inset-0 z-0">
        <SpectrumAnalyzer />
      </div>

      {/* Gradient scrim */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #0a0e17 25%, rgba(10,14,23,0.85) 55%, rgba(10,14,23,0.35) 100%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-4 bg-base/30 backdrop-blur-sm border-b border-white/10 font-micro tracking-wider uppercase text-sm">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-text font-heading"
        >
          PULSE<span className="text-listener">·</span>CITY
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/studio"
            className="text-text-dim hover:text-creator transition-colors duration-200"
          >
            [ STUDIO ]
          </Link>
          <span className="text-listener cursor-default">
            [ RADIO ]
          </span>
          <Link
            href="/library"
            className="text-text-dim hover:text-creator transition-colors duration-200"
          >
            [ LIBRARY ]
          </Link>
        </div>
        <Link
          href="/studio"
          className="text-creator scale-95 active:scale-90 transition-all cursor-pointer"
        >
          [ JOIN ]
        </Link>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        {/* Player area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full bg-listener"
              style={
                playing
                  ? { animation: "pulse-dot 1.5s ease-in-out infinite" }
                  : { opacity: 0.3 }
              }
            />
            <span className="font-micro text-[10px] tracking-widest text-listener uppercase">
              {booting
                ? "TUNING IN..."
                : playing
                  ? "LIVE · BROADCASTING"
                  : "READY"}
            </span>
          </div>

          {playing && (
            <span className="font-micro text-[10px] tracking-[0.2em] text-text-dim uppercase">
              NOW PLAYING
            </span>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-text text-center tracking-tight leading-tight">
            {radioTitle}
          </h1>
          <span className="font-micro text-[10px] text-text-dim tracking-widest uppercase">
            {playing ? "BY AUTOPILOT" : "THE CITY IS PLAYING"}
          </span>

          {/* Transport */}
          <div className="flex items-center gap-6 mt-4">
            {/* Previous */}
            <button
              onClick={handleSkip}
              disabled={!playing}
              className="text-text-dim hover:text-text disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-default"
              title="New track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="19 20 9 12 19 4 19 20" />
                <rect x="5" y="4" width="2" height="16" />
              </svg>
            </button>

            {/* Play / Pause */}
            <button
              onClick={handlePlay}
              disabled={booting}
              className="w-16 h-16 border-2 border-listener/30 rounded-full flex items-center justify-center transition-all hover:border-listener hover:bg-listener/5 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 group"
            >
              {booting ? (
                <span className="w-6 h-6 border-2 border-listener/30 border-t-listener rounded-full animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="text-listener group-hover:brightness-110"
                >
                  {playing ? (
                    <>
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </>
                  ) : (
                    <polygon points="7 3 21 12 7 21 7 3" />
                  )}
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={handleSkip}
              disabled={!playing}
              className="text-text-dim hover:text-text disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-default"
              title="Skip track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="5 4 15 12 5 20 5 4" />
                <rect x="17" y="4" width="2" height="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible code drawer */}
        <div
          className="shrink-0 bg-base/80 backdrop-blur-md border-t border-white/10 flex flex-col overflow-hidden transition-[height] duration-300 ease-in-out"
          style={{ height: codeOpen ? "35vh" : 0 }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 shrink-0">
            <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              code
            </span>
            {playing && (
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-agent"
                  style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
                />
                <span className="font-micro text-[9px] tracking-widest text-agent uppercase">
                  AI CONTROLLED · READONLY
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 relative">
            {ready ? (
              <>
                {/* Readonly overlay — blocks input, lets visuals through */}
                <div className="absolute inset-0 z-10 cursor-default" />
                <StrudelEditor
                  editorRef={editorRef}
                  onToggle={handleToggle}
                  initialCode=""
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="font-micro text-[10px] tracking-widest text-text-dim">
                  PRESS PLAY TO START
                </span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-2.5 bg-base/90 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">LISTENERS</span>
            <span className="font-mono text-xs text-text">1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">STREAM</span>
            <span className={`font-mono text-xs ${playing ? "text-listener" : "text-text-dim"}`}>
              {playing ? "LIVE" : "IDLE"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCodeOpen((o) => !o)}
            className={`font-micro text-[9px] tracking-widest uppercase cursor-pointer transition-colors ${
              codeOpen ? "text-creator" : "text-text-dim hover:text-text"
            }`}
          >
            [ CODE ]
          </button>
          <div className="flex items-center gap-2">
            <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">UPTIME</span>
            <span className="font-mono text-xs text-text">{uptime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
