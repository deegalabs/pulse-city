"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StrudelEditor } from "@/components/editor/strudel-editor";
import { Header } from "@/components/header";
import { Sidebar, type NavItem } from "@/components/sidebar";
import { TransportBar } from "@/components/transport-bar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { SpectrumAnalyzer } from "@/components/spectrum/spectrum-analyzer";
import { ToolsPanel } from "@/components/tools-panel";
import { SettingsOverlay } from "@/components/settings-overlay";
import { PatternsModal } from "@/components/patterns/patterns-modal";
import { useStore } from "@/lib/store";
import { useAutopilotEvolve } from "@/lib/hooks/use-autopilot-evolve";
import { initialized as audioReady } from "@/lib/strudel/init";
import { INITIAL_CODE } from "@/lib/strudel/constants";
import type { StrudelMirror } from "@strudel/codemirror";

export default function StudioPage() {
  const editorRef = useRef<StrudelMirror | null>(null);
  const { setPlaying, mode, code, trackTitle, setCode, setTrackTitle, setPatternId, patternId, setMode, toggleMode } = useStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [isBeat, setIsBeat] = useState(false);
  const [activePanel, setActivePanel] = useState<NavItem>("COMPOSER");

  const isAutopilot = mode === "autopilot";

  // Auto-evolve code every 30s in autopilot mode while playing
  useAutopilotEvolve({ editorRef });

  useEffect(() => {
    if (audioReady) {
      setReady(true);
    } else {
      router.replace("/");
    }
  }, [router]);

  // Auto-compose initial track when entering autopilot with empty/default code
  useEffect(() => {
    if (mode !== "autopilot") return;
    const currentCode = code.trim();
    if (currentCode && currentCode !== INITIAL_CODE.trim() && !currentCode.startsWith("// pulse.city")) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/compose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { code?: string | null; title?: string };
        if (cancelled) return;
        if (data.code && typeof data.code === "string") {
          setCode(data.code);
          if (data.title) setTrackTitle(data.title);
          const editor = editorRef.current;
          if (editor) {
            editor.setCode(data.code);
            editor.evaluate();
          }
        }
      } catch {
        // silently fail — user can still interact
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleToggle = useCallback(
    (isPlaying: boolean) => {
      setPlaying(isPlaying);
    },
    [setPlaying]
  );

  const handleError = useCallback((error: string) => {
    console.error("Strudel error:", error);
  }, []);

  const handleCodeApply = useCallback((newCode: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.setCode(newCode);
      editor.evaluate();
    }
  }, []);

  const handleEnergy = useCallback((e: number, beat: boolean) => {
    setEnergy(e);
    setIsBeat(beat);
  }, []);

  const handleEvolve = useCallback(async () => {
    if (!code.trim()) return;
    try {
      const res = await fetch("/api/evolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentCode: code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code) {
          handleCodeApply(data.code);
        }
      }
    } catch (err) {
      console.error("Evolve failed:", err);
    }
  }, [code, handleCodeApply]);

  const handleSave = useCallback(async () => {
    const currentCode = code;
    if (!currentCode.trim()) return;

    try {
      if (patternId) {
        const res = await fetch(`/api/patterns/${patternId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: currentCode, title: trackTitle || "Untitled", mode }),
        });
        if (!res.ok && res.status === 401) {
          window.dispatchEvent(new CustomEvent("pulse:need-login"));
          return;
        }
      } else {
        const title = trackTitle || prompt("Pattern name:", "Untitled") || "Untitled";
        const res = await fetch("/api/patterns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: currentCode, title, mode }),
        });
        if (!res.ok && res.status === 401) {
          window.dispatchEvent(new CustomEvent("pulse:need-login"));
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPatternId(data.id);
          setTrackTitle(data.title);
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, [code, trackTitle, mode, patternId, setPatternId, setTrackTitle]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing inside CodeMirror editor
      const target = e.target as HTMLElement;
      if (target.closest(".cm-editor")) return;

      const isMod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd+S — save
      if (isMod && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Escape — close modals
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setPatternsOpen(false);
        return;
      }

      // Ctrl/Cmd+. — toggle mode
      if (isMod && e.key === ".") {
        e.preventDefault();
        toggleMode();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, toggleMode]);

  const handleLoadPattern = useCallback(
    (pattern: { id: string; title: string; code: string; mode: string }) => {
      setPatternId(pattern.id);
      setTrackTitle(pattern.title);
      setCode(pattern.code);
      setMode(pattern.mode as "autopilot" | "manual");
      const editor = editorRef.current;
      if (editor) {
        editor.setCode(pattern.code);
        editor.evaluate();
      }
    },
    [setPatternId, setTrackTitle, setCode, setMode]
  );

  const handleToolClick = useCallback(
    (tool: string) => {
      const prompts: Record<string, string> = {
        DRUMS: "Add or improve the drum pattern -- make it groove",
        BASS: "Add or improve the bassline -- make it deep",
        CHORDS: "Add or change the chord progression",
        LEAD: "Add a lead melody or arpeggio",
        FX: "Add some effects -- reverb, delay, filter sweeps",
        FILTER: "Add a filter sweep or LFO modulation",
        TEMPO: "Change the tempo -- try a different BPM",
        DROP: "Create a drop -- build tension then release",
      };
      const prompt = prompts[tool];
      if (prompt) {
        window.dispatchEvent(
          new CustomEvent("pulse:tool", { detail: { prompt } })
        );
      }
    },
    []
  );

  if (!ready) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-dim text-sm">Initializing audio...</p>
      </div>
    );
  }

  /* ── AUTOPILOT MODE ── */
  if (isAutopilot) {
    return (
      <div className="h-dvh flex flex-col overflow-hidden">
        <Header
          onSettingsClick={() => setSettingsOpen(true)}
          onSaveClick={handleSave}
          onLoadClick={() => setPatternsOpen(true)}
        />

        {/* Sidebar + Main wrapper */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />

          {/* Main content — offset for fixed sidebar on lg */}
          <main className="ml-0 lg:ml-64 flex-1 flex overflow-hidden pb-14">
            {/* LEFT COLUMN (60%) */}
            <section className="flex-1 md:w-[60%] flex flex-col border-r border-white/10">
              {/* Editor header bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-1 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="font-micro text-[10px] tracking-widest text-text-dim">
                    STRUDEL CODE
                  </span>
                  <div className="font-micro text-[10px] tracking-widest text-agent border border-agent/30 px-2 py-0.5 rounded flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-agent rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
                    AI CONTROLLED
                  </div>
                </div>
                <span className="font-micro text-[10px] text-signal-warn tracking-widest">
                  🔒 READ ONLY
                </span>
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <StrudelEditor
                  onToggle={handleToggle}
                  onError={handleError}
                  editorRef={editorRef}
                />
              </div>

              {/* Chat */}
              <div className="shrink-0 border-t border-border h-48 min-h-32 max-h-64 flex flex-col bg-base">
                <ChatPanel onCodeApply={handleCodeApply} />
              </div>
            </section>

            {/* RIGHT COLUMN (40%) */}
            <section className="md:w-[40%] flex flex-col bg-surface-1 max-md:hidden">
              {/* Spectrum Analyzer */}
              <div className="flex-1 flex flex-col min-h-0 p-6">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <span className="font-micro text-[10px] tracking-widest text-text-dim">
                    SIGNAL SPECTRUM // 0.88-V
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[8px] animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                      style={{ color: "var(--color-agent)" }}
                    >
                      ●
                    </span>
                    <span className="font-micro text-[10px] tracking-widest text-text">
                      ENERGY {energy}%
                    </span>
                    {isBeat && (
                      <span className="font-micro text-[10px] tracking-widest text-text-dim ml-2">
                        BEAT
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <SpectrumAnalyzer onEnergy={handleEnergy} />
                </div>
              </div>

              {/* Parameter sliders (REVERB / DELAY) */}
              <div className="shrink-0 border-t border-border px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-micro text-[9px] tracking-widest text-text-dim block mb-2">
                      REVERB
                    </span>
                    <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-agent/60 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <span className="font-micro text-[9px] tracking-widest text-text-dim block mb-2">
                      DELAY
                    </span>
                    <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-agent/60 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Locked Toolkit */}
              <ToolsPanel onToolClick={handleToolClick} />
            </section>
          </main>
        </div>

        <TransportBar editorRef={editorRef} onEvolve={handleEvolve} />

        <SettingsOverlay
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />

        <PatternsModal
          open={patternsOpen}
          onClose={() => setPatternsOpen(false)}
          onLoad={handleLoadPattern}
        />
      </div>
    );
  }

  /* ── MANUAL MODE ── */
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        onSaveClick={handleSave}
        onLoadClick={() => setPatternsOpen(true)}
      />

      {/* Main layout — pb-16 for fixed transport bar */}
      <main className="flex-1 flex overflow-hidden pb-16">
        {/* LEFT COLUMN (60%) */}
        <section className="w-3/5 flex flex-col border-r border-white/10">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <StrudelEditor
              onToggle={handleToggle}
              onError={handleError}
              editorRef={editorRef}
            />
          </div>

          {/* Chat */}
          <div className="shrink-0 border-t border-border h-[200px] min-h-32 max-h-64 flex flex-col bg-base">
            <ChatPanel onCodeApply={handleCodeApply} />
          </div>
        </section>

        {/* RIGHT COLUMN (40%) */}
        <section className="w-2/5 max-w-[480px] min-w-[280px] flex flex-col overflow-hidden max-md:hidden">
          {/* Spectrum Analyzer */}
          <div className="flex-1 flex flex-col min-h-0 bg-base p-6">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <span className="font-micro text-[10px] tracking-widest text-text-dim">
                SPECTRUM ANALYZER
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[8px] animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                  style={{ color: "var(--color-signal-warn)" }}
                >
                  ●
                </span>
                <span className="font-micro text-[10px] tracking-widest text-text">
                  ENERGY {energy}%
                </span>
                {isBeat && (
                  <span className="font-micro text-[10px] tracking-widest text-text-dim ml-2">
                    BEAT
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <SpectrumAnalyzer onEnergy={handleEnergy} />
            </div>
            {/* Metrics */}
            <div className="mt-4 grid grid-cols-4 gap-4 shrink-0">
              <div className="text-center">
                <div className="text-[10px] font-micro text-text-dim">RMS</div>
                <div className="text-xs font-mono text-creator">—</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-micro text-text-dim">PEAK</div>
                <div className="text-xs font-mono text-signal-warn">—</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-micro text-text-dim">LUFS</div>
                <div className="text-xs font-mono text-listener">—</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-micro text-text-dim">FREQ</div>
                <div className="text-xs font-mono text-text">—</div>
              </div>
            </div>
          </div>

          {/* Tools Panel */}
          <ToolsPanel onToolClick={handleToolClick} />
        </section>
      </main>

      <TransportBar editorRef={editorRef} onEvolve={handleEvolve} />

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <PatternsModal
        open={patternsOpen}
        onClose={() => setPatternsOpen(false)}
        onLoad={handleLoadPattern}
      />
    </div>
  );
}
