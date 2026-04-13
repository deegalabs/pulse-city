"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StrudelEditor } from "@/components/editor/strudel-editor";
import { Header } from "@/components/header";
import { TransportBar } from "@/components/transport-bar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { SpectrumAnalyzer } from "@/components/spectrum/spectrum-analyzer";
import { ToolsPanel } from "@/components/tools-panel";
import { SettingsOverlay } from "@/components/settings-overlay";
import { PatternsModal } from "@/components/patterns/patterns-modal";
import { useStore } from "@/lib/store";
import { initialized as audioReady } from "@/lib/strudel/init";
import type { StrudelMirror } from "@strudel/codemirror";

export default function StudioPage() {
  const editorRef = useRef<StrudelMirror | null>(null);
  const { setPlaying, mode, code, trackTitle, setCode, setTrackTitle, setPatternId, patternId, setMode } = useStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [isBeat, setIsBeat] = useState(false);

  useEffect(() => {
    if (!audioReady) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

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

  const handleSave = useCallback(async () => {
    const currentCode = code;
    if (!currentCode.trim()) return;

    try {
      if (patternId) {
        // Update existing
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
        // Create new
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
      // Tools send a prompt to chat describing what to add/change
      const prompts: Record<string, string> = {
        DRUMS: "Add or improve the drum pattern — make it groove",
        BASS: "Add or improve the bassline — make it deep",
        CHORDS: "Add or change the chord progression",
        LEAD: "Add a lead melody or arpeggio",
        FX: "Add some effects — reverb, delay, filter sweeps",
        FILTER: "Add a filter sweep or LFO modulation",
        TEMPO: "Change the tempo — try a different BPM",
        DROP: "Create a drop — build tension then release",
      };
      const prompt = prompts[tool];
      if (prompt) {
        // Dispatch a custom event that the chat panel can listen to
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

  return (
    <>
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        onSaveClick={handleSave}
        onLoadClick={() => setPatternsOpen(true)}
      />

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
              <span
                className="font-heading text-[0.45rem] tracking-widest px-1.5 py-0.5 rounded-full border"
                style={{
                  color:
                    mode === "autopilot"
                      ? "var(--color-violet)"
                      : "var(--color-lime)",
                  borderColor:
                    mode === "autopilot"
                      ? "rgba(107, 70, 255, 0.3)"
                      : "rgba(162, 215, 41, 0.3)",
                }}
              >
                {mode === "autopilot" ? "AI CONTROLLED" : "YOU CONTROL"}
              </span>
            </div>
            <StrudelEditor
              onToggle={handleToggle}
              onError={handleError}
              editorRef={editorRef}
            />
          </div>

          {/* Chat */}
          <div className="shrink-0 border-t border-border h-48 min-h-32 max-h-64 flex flex-col">
            <div className="flex items-center gap-2 px-3 py-1 border-b border-border shrink-0">
              <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
                CHAT
              </span>
              <span className="font-heading text-[0.45rem] tracking-widest text-text-dim">
                {mode === "autopilot" ? "STEER MODE" : "COPILOT MODE"}
              </span>
            </div>
            <ChatPanel onCodeApply={handleCodeApply} />
          </div>
        </div>

        {/* Right: spectrum + tools */}
        <div className="w-[40%] max-w-[480px] min-w-[280px] flex flex-col overflow-hidden max-md:hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border shrink-0">
            <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
              SPECTRUM ANALYZER
            </span>
            <span className="font-mono text-[0.5rem] text-text-dim">
              ENERGY {energy}%{isBeat ? "  ● BEAT" : ""}
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <SpectrumAnalyzer onEnergy={handleEnergy} />
          </div>
          <ToolsPanel onToolClick={handleToolClick} />
        </div>
      </div>

      <TransportBar editorRef={editorRef} />

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <PatternsModal
        open={patternsOpen}
        onClose={() => setPatternsOpen(false)}
        onLoad={handleLoadPattern}
      />
    </>
  );
}
