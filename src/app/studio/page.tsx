"use client";

import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { StrudelEditor } from "@/components/editor/strudel-editor";
import { Header } from "@/components/header";
// Live Dashboard hidden — see roadmap Phase 2.6 (Returning features)
// import { Sidebar } from "@/components/sidebar";
import { TransportBar } from "@/components/transport-bar";
// ChatPanel hidden — see roadmap Phase 2.5
// import { ChatPanel } from "@/components/chat/chat-panel";
import { SpectrumAnalyzer } from "@/components/spectrum/spectrum-analyzer";
import { PadGrid } from "@/components/pad-grid";
import { previewPlay, previewStop } from "@/lib/strudel/preview-engine";
import { SoundsBrowser } from "@/components/sounds-browser";
import { SettingsOverlay } from "@/components/settings-overlay";
import { PatternsModal } from "@/components/patterns/patterns-modal";
import { LiveTransitionToast } from "@/components/live-transition-toast";
import { SnippetsPalette } from "@/components/snippets-palette";
import { CommandPalette, type Command } from "@/components/command-palette";
import { ShortcutsOverlay } from "@/components/shortcuts-overlay";
import { DjDeck } from "@/components/dj-deck";
import { DocsModal } from "@/components/docs/docs-modal";
// CueAgent hidden — cue routing moved to Settings → Audio Output + per-example CUE toggle in docs
// import { CueAgent } from "@/components/cue-agent";
import { buildDeckComposePrompt, buildLayerPrompt } from "@/lib/ai/deck-prompt";
import type { Snippet } from "@/lib/snippets";
import {
  useStore,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_DEFAULT,
} from "@/lib/store";
import { useAutopilotEvolve } from "@/lib/hooks/use-autopilot-evolve";
import { initialized as audioReady, initStrudelAudio } from "@/lib/strudel/init";
import { INITIAL_CODE } from "@/lib/strudel/constants";
import type { StrudelMirror } from "@strudel/codemirror";

export default function StudioPage() {
  const editorRef = useRef<StrudelMirror | null>(null);
  const {
    setPlaying,
    mode,
    code,
    trackTitle,
    setCode,
    setTrackTitle,
    setPatternId,
    patternId,
    setMode,
    broadcastCode,
    broadcastTitle,
    broadcastActive,
    editor: editorSettings,
    setEditorSetting,
    deck,
    pushHistory,
    markSessionStarted,
    setLastError,
    markEvaluated,
    history,
  } = useStore();
  const [ready, setReady] = useState(false);
  const [transitionedFromLive, setTransitionedFromLive] = useState(false);

  const isListeningLive =
    broadcastActive && broadcastCode.length > 0 && code === broadcastCode;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(false);
  const [snippetsOpen, setSnippetsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [soundsOpen, setSoundsOpen] = useState(false);
  const [energy, setEnergy] = useState(0);
  const [isBeat, setIsBeat] = useState(false);

  const [autoEvolve, setAutoEvolve] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Auto-evolve code every 30s while AUTO toggle is on + playing
  useAutopilotEvolve({ editorRef, enabled: autoEvolve });

  // Boot audio on mount (e.g. after a page refresh). AudioContext can be
  // created without a user gesture — it stays suspended until the user hits
  // Play, which calls ctx.resume() via Strudel. Do NOT redirect to landing;
  // the user should stay where they are with their state intact.
  useEffect(() => {
    if (audioReady) {
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await initStrudelAudio();
        if (!cancelled) setReady(true);
      } catch (err) {
        console.error("Audio init failed:", err);
        if (!cancelled) setReady(true); // editor still usable without audio
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pick up the live radio broadcast on entry. Sync editor view with the
  // pattern that's already running in Strudel's scheduler — no re-evaluate,
  // otherwise the audio would blip on navigation.
  const hydratedFromBroadcastRef = useRef(false);
  useEffect(() => {
    if (!ready) return;
    if (hydratedFromBroadcastRef.current) return;
    if (!broadcastActive || !broadcastCode) return;
    if (code === broadcastCode) {
      hydratedFromBroadcastRef.current = true;
      return;
    }
    hydratedFromBroadcastRef.current = true;

    setCode(broadcastCode);
    if (broadcastTitle) setTrackTitle(broadcastTitle);
    setPatternId(null);
    setTransitionedFromLive(true);

    // Editor may still be mounting (dynamic import) — poll briefly.
    let cancelled = false;
    const trySeed = () => {
      const editor = editorRef.current;
      if (editor) {
        editor.setCode(broadcastCode);
        return;
      }
      if (!cancelled) window.setTimeout(trySeed, 80);
    };
    trySeed();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, broadcastActive, broadcastCode]);

  const handleToggle = useCallback(
    (isPlaying: boolean) => {
      setPlaying(isPlaying);
      if (isPlaying) markSessionStarted();
    },
    [setPlaying, markSessionStarted]
  );

  const handleError = useCallback(
    (error: string) => {
      console.error("Strudel error:", error);
      setLastError(error);
    },
    [setLastError]
  );

  const handleEvaluate = useCallback(
    (newCode: string) => {
      markEvaluated();
      const trimmed = newCode.trim();
      if (!trimmed) return;
      // Skip if the top of the history is already this exact code — avoid
      // double-logging repeated Ctrl+Enter presses on the same state.
      const last = history[0]?.code;
      if (last === newCode) return;
      const firstLine = newCode.split("\n")[0].replace(/^\s*\$:\s*/, "").slice(0, 40);
      pushHistory({ code: newCode, label: `Evaluate · ${firstLine || "…"}` });
    },
    [markEvaluated, history, pushHistory]
  );

  const handleEditorChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
    },
    [setCode]
  );

  const handleDeckCompose = useCallback(async () => {
    setComposing(true);
    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildDeckComposePrompt(deck) }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { code?: string; title?: string };
      if (data.code) {
        setCode(data.code);
        if (data.title) setTrackTitle(data.title);
        setPatternId(null);
        const editor = editorRef.current;
        if (editor) {
          editor.setCode(data.code);
          editor.evaluate();
        }
        pushHistory({
          code: data.code,
          label: `Deck compose · ${data.title ?? deck.genre ?? "untitled"}`,
        });
      }
      setDeckOpen(false);
    } catch (err) {
      console.error("Deck compose failed:", err);
    } finally {
      setComposing(false);
    }
  }, [deck, setCode, setTrackTitle, setPatternId, pushHistory]);

  const handleDeckLayer = useCallback(
    (layer: "kick" | "hats" | "snare" | "bass" | "lead" | "pad" | "fx") => {
      const prompt = buildLayerPrompt(layer, deck);
      window.dispatchEvent(
        new CustomEvent("pulse:tool", { detail: { prompt } })
      );
    },
    [deck]
  );

  const insertAtCursor = useCallback((code: string) => {
    const editor = editorRef.current as unknown as {
      editor: {
        state: { doc: { length: number; toString: () => string } };
        dispatch: (tr: unknown) => void;
      };
      code: string;
      getCursorLocation: () => number;
      setCursorLocation: (col: number) => void;
      setCode: (code: string) => void;
    } | null;
    if (!editor) return;
    try {
      const cursor = editor.getCursorLocation();
      const doc = editor.editor.state.doc.toString();
      const before = doc.slice(0, cursor);
      const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
      const insert = (needsLeadingNewline ? "\n" : "") + code + "\n";
      editor.editor.dispatch({
        changes: { from: cursor, to: cursor, insert },
      });
      editor.setCursorLocation(cursor + insert.length);
      // Snapshot after insert so HISTORY panel can rewind
      const previewLabel = code
        .split("\n")[0]
        .replace(/^\s*\$:\s*/, "")
        .slice(0, 40);
      pushHistory({
        code: editor.editor.state.doc.toString(),
        label: `Insert · ${previewLabel || "…"}`,
      });
    } catch (err) {
      console.error("Insert failed:", err);
    }
  }, [pushHistory]);

  const handleInsertSnippet = useCallback(
    (snippet: Snippet) => insertAtCursor(snippet.code),
    [insertAtCursor]
  );

  const handleDocsInsert = useCallback(
    (code: string) => {
      insertAtCursor(code);
    },
    [insertAtCursor]
  );

  const handleCodeApply = useCallback((newCode: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.setCode(newCode);
      editor.evaluate();
    }
    pushHistory({ code: newCode, label: "AI apply" });
  }, [pushHistory]);

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
      const isMod = e.metaKey || e.ctrlKey;

      // Font-size shortcuts work even when focused inside the editor
      if (isMod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        const next = Math.min(FONT_SIZE_MAX, editorSettings.fontSize + 1);
        setEditorSetting("fontSize", next);
        return;
      }
      if (isMod && e.key === "-") {
        e.preventDefault();
        const next = Math.max(FONT_SIZE_MIN, editorSettings.fontSize - 1);
        setEditorSetting("fontSize", next);
        return;
      }
      if (isMod && e.key === "0") {
        e.preventDefault();
        setEditorSetting("fontSize", FONT_SIZE_DEFAULT);
        return;
      }

      // Cmd/Ctrl+K — snippets palette (works even inside editor)
      if (isMod && e.key === "k") {
        e.preventDefault();
        setSnippetsOpen((o) => !o);
        return;
      }

      // Cmd/Ctrl+Shift+P — command palette (works even inside editor)
      if (isMod && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setCommandOpen((o) => !o);
        return;
      }

      // Cmd/Ctrl+J — DJ deck
      if (isMod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setDeckOpen((o) => !o);
        return;
      }

      // F1 or Cmd/Ctrl+/ — docs modal
      if (e.key === "F1" || (isMod && e.key === "/")) {
        e.preventDefault();
        setDocsOpen((o) => !o);
        return;
      }

      // Cmd/Ctrl+B — sounds browser
      if (isMod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSoundsOpen((o) => !o);
        return;
      }

      // Don't intercept the rest when typing inside CodeMirror editor
      const target = e.target as HTMLElement;
      if (target.closest(".cm-editor")) return;

      // ? — shortcuts reference (outside editor only)
      if (e.key === "?" && !isMod) {
        e.preventDefault();
        setShortcutsOpen((o) => !o);
        return;
      }

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
        setSnippetsOpen(false);
        setCommandOpen(false);
        setShortcutsOpen(false);
        setDeckOpen(false);
        setDocsOpen(false);
        setSoundsOpen(false);
        return;
      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, editorSettings.fontSize, setEditorSetting]);

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
      pushHistory({ code: pattern.code, label: `Load · ${pattern.title || "untitled"}` });
    },
    [setPatternId, setTrackTitle, setCode, setMode, pushHistory]
  );

  const commands: Command[] = useMemo(
    () => [
      {
        id: "playback.toggle",
        group: "Playback",
        label: "Play / Pause",
        shortcut: "Space",
        run: () => editorRef.current?.toggle(),
      },
      {
        id: "playback.stop",
        group: "Playback",
        label: "Stop",
        run: () => editorRef.current?.stop(),
      },
      {
        id: "playback.reeval",
        group: "Playback",
        label: "Re-evaluate",
        shortcut: "⌃↵",
        run: () => editorRef.current?.evaluate(),
      },
      {
        id: "ai.evolve",
        group: "AI",
        label: "Evolve current pattern",
        hint: "Ask the model to mutate the code",
        run: () => handleEvolve(),
      },
      {
        id: "ai.drums",
        group: "AI · Quick prompts",
        label: "Add or improve drums",
        hint: "Dispatches to chat: make the drums groove",
        run: () => dispatchAiPrompt("Add or improve the drum pattern -- make it groove"),
      },
      {
        id: "ai.bass",
        group: "AI · Quick prompts",
        label: "Add or improve bass",
        hint: "Dispatches to chat: make the bassline deep",
        run: () => dispatchAiPrompt("Add or improve the bassline -- make it deep"),
      },
      {
        id: "ai.chords",
        group: "AI · Quick prompts",
        label: "Add or change chord progression",
        run: () => dispatchAiPrompt("Add or change the chord progression"),
      },
      {
        id: "ai.lead",
        group: "AI · Quick prompts",
        label: "Add lead melody or arp",
        run: () => dispatchAiPrompt("Add a lead melody or arpeggio"),
      },
      {
        id: "ai.fx",
        group: "AI · Quick prompts",
        label: "Add effects (reverb / delay / filter)",
        run: () => dispatchAiPrompt("Add some effects -- reverb, delay, filter sweeps"),
      },
      {
        id: "ai.filter",
        group: "AI · Quick prompts",
        label: "Add filter sweep / LFO",
        run: () => dispatchAiPrompt("Add a filter sweep or LFO modulation"),
      },
      {
        id: "ai.tempo",
        group: "AI · Quick prompts",
        label: "Change the tempo",
        run: () => dispatchAiPrompt("Change the tempo -- try a different BPM"),
      },
      {
        id: "ai.drop",
        group: "AI · Quick prompts",
        label: "Build a drop",
        hint: "Tension build → release",
        run: () => dispatchAiPrompt("Create a drop -- build tension then release"),
      },
      {
        id: "ai.compose",
        group: "AI",
        label: "Compose new track",
        hint: "Replace the editor with a fresh AI composition",
        run: async () => {
          try {
            const res = await fetch("/api/compose", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            });
            if (!res.ok) return;
            const data = (await res.json()) as { code?: string; title?: string };
            if (data.code) {
              handleCodeApply(data.code);
              setCode(data.code);
              if (data.title) setTrackTitle(data.title);
              setPatternId(null);
            }
          } catch (err) {
            console.error("Compose failed:", err);
          }
        },
      },
      {
        id: "pattern.save",
        group: "Patterns",
        label: "Save pattern",
        shortcut: "⌘S",
        run: () => handleSave(),
      },
      {
        id: "pattern.load",
        group: "Patterns",
        label: "Load pattern…",
        run: () => setPatternsOpen(true),
      },
      {
        id: "pattern.new",
        group: "Patterns",
        label: "New empty pattern",
        hint: "Clear editor and detach current pattern",
        run: () => {
          setCode("");
          setTrackTitle("");
          setPatternId(null);
          editorRef.current?.setCode("");
        },
      },
      {
        id: "autoevolve.toggle",
        group: "Playback",
        label: autoEvolve ? "Disable auto-evolve" : "Enable auto-evolve",
        hint: "AI mutates your code every 30s while playing",
        run: () => setAutoEvolve((v) => !v),
      },
      {
        id: "snippets.open",
        group: "Editor",
        label: "Open snippets…",
        shortcut: "⌘K",
        run: () => setSnippetsOpen(true),
      },
      {
        id: "sounds.open",
        group: "Editor",
        label: "Open sounds browser…",
        shortcut: "⌘B",
        hint: "Browse all loaded samples / synths / drum-machines · click to preview",
        run: () => setSoundsOpen(true),
      },
      {
        id: "deck.open",
        group: "DJ Deck",
        label: "Open DJ deck…",
        shortcut: "⌘J",
        hint: "Genre, key, BPM, energy — compose in style",
        run: () => setDeckOpen(true),
      },
      {
        id: "deck.compose",
        group: "DJ Deck",
        label: "Compose with deck settings",
        hint: "Use current deck params without opening the panel",
        run: () => handleDeckCompose(),
      },
      {
        id: "shortcuts.open",
        group: "Editor",
        label: "Show keyboard shortcuts",
        shortcut: "?",
        run: () => setShortcutsOpen(true),
      },
      {
        id: "docs.open",
        group: "Help",
        label: "Open docs…",
        shortcut: "F1",
        hint: "Strudel primer, pattern library, deck guide",
        run: () => setDocsOpen(true),
      },
      {
        id: "settings.open",
        group: "Editor",
        label: "Open settings…",
        run: () => setSettingsOpen(true),
      },
      {
        id: "editor.autocomplete.toggle",
        group: "Editor",
        label: `${editorSettings.autocomplete ? "Disable" : "Enable"} autocomplete`,
        run: () => setEditorSetting("autocomplete", !editorSettings.autocomplete),
      },
      {
        id: "editor.tooltips.toggle",
        group: "Editor",
        label: `${editorSettings.tooltips ? "Disable" : "Enable"} hover docs`,
        run: () => setEditorSetting("tooltips", !editorSettings.tooltips),
      },
      {
        id: "editor.keybindings.codemirror",
        group: "Keybindings",
        label: "Use CodeMirror keybindings",
        run: () => setEditorSetting("keybindings", "codemirror"),
      },
      {
        id: "editor.keybindings.vscode",
        group: "Keybindings",
        label: "Use VSCode keybindings",
        run: () => setEditorSetting("keybindings", "vscode"),
      },
      {
        id: "editor.keybindings.vim",
        group: "Keybindings",
        label: "Use Vim keybindings",
        hint: ":w eval · :q stop · gc comment",
        run: () => setEditorSetting("keybindings", "vim"),
      },
      {
        id: "editor.keybindings.emacs",
        group: "Keybindings",
        label: "Use Emacs keybindings",
        run: () => setEditorSetting("keybindings", "emacs"),
      },
      {
        id: "editor.font.larger",
        group: "Editor",
        label: "Increase font size",
        shortcut: "⌘=",
        run: () => setEditorSetting("fontSize", Math.min(28, editorSettings.fontSize + 1)),
      },
      {
        id: "editor.font.smaller",
        group: "Editor",
        label: "Decrease font size",
        shortcut: "⌘-",
        run: () => setEditorSetting("fontSize", Math.max(10, editorSettings.fontSize - 1)),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editorSettings.autocomplete, editorSettings.tooltips, editorSettings.fontSize, autoEvolve, handleEvolve, handleSave, handleDeckCompose]
  );

  const dispatchAiPrompt = useCallback((prompt: string) => {
    window.dispatchEvent(new CustomEvent("pulse:tool", { detail: { prompt } }));
  }, []);

  if (!ready) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-dim text-sm">Initializing audio...</p>
      </div>
    );
  }

  const liveTransitionToast = transitionedFromLive ? (
    <LiveTransitionToast
      title={broadcastTitle || "radio broadcast"}
      onDone={() => setTransitionedFromLive(false)}
    />
  ) : null;

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        onSaveClick={handleSave}
        onLoadClick={() => setPatternsOpen((v) => !v)}
        onSnippetsClick={() => setSnippetsOpen((v) => !v)}
        onDeckClick={() => setDeckOpen((v) => !v)}
        onDocsClick={() => {
          setDocsOpen((v) => {
            if (!v) setSoundsOpen(false);
            return !v;
          });
        }}
        onSoundsClick={() => {
          setSoundsOpen((v) => {
            if (!v) setDocsOpen(false);
            return !v;
          });
        }}
        docsActive={docsOpen}
        soundsActive={soundsOpen}
      />

      {/* Main (Live Dashboard hidden — returns in Phase 2.6) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Transport toolbar — top of main, inline */}
          <TransportBar
            editorRef={editorRef}
            onEvolve={handleEvolve}
            autoEvolve={autoEvolve}
            onToggleAutoEvolve={() => setAutoEvolve((v) => !v)}
          />

          {/* Editor center + right stack */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* EDITOR */}
            <section className="flex-1 min-w-0 flex flex-col bg-base relative">
              <StrudelEditor
                onToggle={handleToggle}
                onError={handleError}
                onChange={handleEditorChange}
                onEvaluate={handleEvaluate}
                editorRef={editorRef}
              />
              <button
                onClick={() => setFocusMode((v) => !v)}
                title={focusMode ? "Exit focus — show side panels" : "Focus mode — hide side panels"}
                aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
                className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center border rounded transition-colors cursor-pointer ${
                  focusMode
                    ? "border-creator/50 text-creator bg-surface-1/90 hover:bg-creator/10"
                    : "border-white/10 text-text-dim bg-surface-1/70 hover:text-text hover:border-white/20 hover:bg-surface-1/90"
                }`}
              >
                {focusMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
            </section>

            {/* RIGHT STACK: spectrum + tools + chat */}
            {!focusMode && (
              <section className="w-96 xl:w-[420px] shrink-0 flex flex-col border-l border-white/10 bg-surface-1 max-md:hidden overflow-hidden">
                {/* Spectrum Analyzer */}
                <div className="shrink-0 flex flex-col bg-base px-4 py-3 border-b border-white/10 h-44">
                  <div className="flex justify-between items-center mb-2 shrink-0">
                    <span className="font-micro text-[10px] tracking-widest text-text-dim">
                      SPECTRUM
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[8px] animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                        style={{ color: "var(--color-creator)" }}
                      >
                        ●
                      </span>
                      <span className="font-micro text-[10px] tracking-widest text-text">
                        E {energy}%
                      </span>
                      {isBeat && (
                        <span className="font-micro text-[10px] tracking-widest text-text-dim">
                          BEAT
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <SpectrumAnalyzer onEnergy={handleEnergy} />
                  </div>
                </div>

                {/* Pad grid — tap or type key to insert a Strudel track line */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <PadGrid
                    onInsert={insertAtCursor}
                    onPreview={previewPlay}
                    onPreviewStop={previewStop}
                  />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <PatternsModal
        open={patternsOpen}
        onClose={() => setPatternsOpen(false)}
        onLoad={handleLoadPattern}
      />

      <SnippetsPalette
        open={snippetsOpen}
        onClose={() => setSnippetsOpen(false)}
        onInsert={handleInsertSnippet}
      />

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        commands={commands}
      />

      <ShortcutsOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <DjDeck
        open={deckOpen}
        onClose={() => setDeckOpen(false)}
        onCompose={handleDeckCompose}
        onLayer={handleDeckLayer}
        composing={composing}
      />

      <DocsModal
        open={docsOpen}
        onClose={() => setDocsOpen(false)}
        onInsert={handleDocsInsert}
      />

      <SoundsBrowser
        open={soundsOpen}
        onClose={() => setSoundsOpen(false)}
        onPreview={previewPlay}
        onPreviewStop={previewStop}
        onInsert={insertAtCursor}
      />

      {liveTransitionToast}
    </div>
  );
}
