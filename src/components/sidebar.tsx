"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StrudelMirror } from "@strudel/codemirror";
import {
  useStore,
  type DashboardPanel,
  type HistoryEntry,
} from "@/lib/store";
import { Ticker, CITY_EVENTS } from "@/components/ticker";
import {
  parseTrackLines,
  toggleMuteAtLine,
  soloAtLine,
  unmuteAll,
  deleteTrackAtLine,
  appendEmptyTrack,
  type TrackLine,
} from "@/lib/strudel/tracks";

interface SidebarProps {
  editorRef: React.RefObject<StrudelMirror | null>;
  onSave?: () => void;
}

/* ── Icons ── */

function NowIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TracksIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function SessionIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  );
}

const NAV: { key: DashboardPanel; label: string; icon: typeof NowIcon }[] = [
  { key: "NOW", label: "NOW", icon: NowIcon },
  { key: "TRACKS", label: "TRACKS", icon: TracksIcon },
  { key: "HISTORY", label: "HISTORY", icon: HistoryIcon },
  { key: "SESSION", label: "SESSION", icon: SessionIcon },
];

/* ── Shared row ── */

function InfoRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "dim" | "creator" | "listener" | "agent" | "warn";
}) {
  const toneClass =
    tone === "dim"
      ? "text-text-dim"
      : tone === "creator"
        ? "text-creator"
        : tone === "listener"
          ? "text-listener"
          : tone === "agent"
            ? "text-agent"
            : tone === "warn"
              ? "text-signal-warn"
              : "text-text";
  return (
    <div className="flex items-center justify-between py-1">
      <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
        {label}
      </span>
      <span className={`font-mono text-[11px] ${toneClass}`}>{value}</span>
    </div>
  );
}

/* ── NOW panel ── */

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function NowPanel({ editorRef }: { editorRef: React.RefObject<StrudelMirror | null> }) {
  const {
    playing,
    sessionStartedAt,
    lastError,
    lastEvaluatedAt,
    setLastError,
    broadcastActive,
    broadcastCode,
    code,
  } = useStore();
  const [uptime, setUptime] = useState(0);
  const [bpm, setBpm] = useState<number | null>(null);
  const [bpmDraft, setBpmDraft] = useState<string>("");
  const [lastEvalAgo, setLastEvalAgo] = useState<string>("—");
  const [audioInfo, setAudioInfo] = useState<{
    sampleRate?: number;
    baseLatency?: number;
  }>({});

  // Uptime ticker
  useEffect(() => {
    if (!sessionStartedAt) {
      setUptime(0);
      return;
    }
    const tick = () => setUptime(Date.now() - sessionStartedAt);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [sessionStartedAt]);

  // Last evaluated — relative time
  useEffect(() => {
    if (!lastEvaluatedAt) {
      setLastEvalAgo("—");
      return;
    }
    const tick = () => {
      const diff = Date.now() - lastEvaluatedAt;
      if (diff < 2000) setLastEvalAgo("just now");
      else if (diff < 60_000) setLastEvalAgo(`${Math.floor(diff / 1000)}s ago`);
      else if (diff < 3_600_000) setLastEvalAgo(`${Math.floor(diff / 60_000)}m ago`);
      else setLastEvalAgo(`${Math.floor(diff / 3_600_000)}h ago`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lastEvaluatedAt]);

  // BPM polling
  useEffect(() => {
    const tick = () => {
      const mirror = editorRef.current as unknown as {
        repl?: { scheduler?: { cps?: number } };
      } | null;
      const cps = mirror?.repl?.scheduler?.cps;
      if (typeof cps === "number" && cps > 0) {
        setBpm(Math.round(cps * 60 * 4));
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [editorRef]);

  // Audio context info — once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getAudioContext } = await import("@strudel/webaudio");
        const ctx = getAudioContext();
        if (!ctx || cancelled) return;
        setAudioInfo({
          sampleRate: ctx.sampleRate,
          baseLatency: ctx.baseLatency,
        });
      } catch {
        // silently fail
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyBpm = (value: number) => {
    if (!value || value < 30 || value > 300) return;
    const mirror = editorRef.current as unknown as {
      repl?: { setCps?: (cps: number) => void };
    } | null;
    const cps = value / 240; // 4 beats per cycle
    mirror?.repl?.setCps?.(cps);
    setBpm(value);
  };

  const handleBpmCommit = () => {
    const n = Number(bpmDraft);
    if (Number.isFinite(n)) applyBpm(n);
    setBpmDraft("");
  };

  const isListeningLive =
    broadcastActive && broadcastCode.length > 0 && code === broadcastCode;

  return (
    <div className="px-4 py-3 space-y-1 overflow-y-auto">
      {lastError && (
        <div className="mb-3 border border-destructive/40 bg-destructive/10 rounded p-2">
          <div className="flex items-center justify-between">
            <span className="font-micro text-[9px] tracking-widest text-destructive uppercase">
              Eval error
            </span>
            <button
              onClick={() => setLastError(null)}
              className="font-micro text-[8px] tracking-widest text-destructive hover:text-text uppercase cursor-pointer"
            >
              clear
            </button>
          </div>
          <p className="font-mono text-[10px] text-destructive mt-1 break-words">
            {lastError}
          </p>
        </div>
      )}

      {isListeningLive && (
        <div className="mb-3 border border-listener/40 bg-listener/10 rounded p-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-listener rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
          <span className="font-micro text-[9px] tracking-widest text-listener uppercase">
            Listening live from radio
          </span>
        </div>
      )}

      <InfoRow
        label="Status"
        value={
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                playing
                  ? "bg-creator animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                  : "bg-text-dim"
              }`}
            />
            {playing ? "PLAYING" : "IDLE"}
          </span>
        }
        tone={playing ? "creator" : "dim"}
      />

      {/* BPM — editable */}
      <div className="flex items-center justify-between py-1 gap-2">
        <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
          BPM
        </span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={30}
            max={300}
            value={bpmDraft || (bpm ?? "")}
            placeholder={bpm != null ? String(bpm) : "—"}
            onChange={(e) => setBpmDraft(e.target.value)}
            onBlur={handleBpmCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleBpmCommit();
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={`w-14 bg-base border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-right focus:outline-none focus:border-creator/40 ${
              playing ? "text-creator" : "text-text-dim"
            }`}
          />
        </div>
      </div>

      <InfoRow
        label="Uptime"
        value={formatUptime(uptime)}
        tone={sessionStartedAt ? "default" : "dim"}
      />
      <InfoRow label="Last eval" value={lastEvalAgo} tone="dim" />

      <div className="h-px bg-white/5 my-2" />
      <InfoRow
        label="Sample rate"
        value={audioInfo.sampleRate ? `${audioInfo.sampleRate} Hz` : "—"}
        tone="dim"
      />
      <InfoRow
        label="Latency"
        value={
          audioInfo.baseLatency != null
            ? `${Math.round(audioInfo.baseLatency * 1000)} ms`
            : "—"
        }
        tone="dim"
      />
    </div>
  );
}

/* ── TRACKS panel ── */

function TracksPanel({ editorRef }: { editorRef: React.RefObject<StrudelMirror | null> }) {
  const { code, setCode } = useStore();
  const tracks = useMemo(() => parseTrackLines(code), [code]);

  const applyCodeChange = (newCode: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.setCode(newCode);
    editor.evaluate();
    setCode(newCode);
  };

  const handleToggleMute = (track: TrackLine) => {
    applyCodeChange(toggleMuteAtLine(code, track.lineNumber));
  };

  const handleSolo = (track: TrackLine) => {
    applyCodeChange(soloAtLine(code, track.lineNumber));
  };

  const handleUnmuteAll = () => {
    applyCodeChange(unmuteAll(code));
  };

  const handleDelete = (track: TrackLine) => {
    applyCodeChange(deleteTrackAtLine(code, track.lineNumber));
  };

  const handleAddTrack = () => {
    const { code: next, lineNumber } = appendEmptyTrack(code);
    applyCodeChange(next);
    // Focus the newly added line
    const editor = editorRef.current as unknown as {
      editor?: {
        state: { doc: { line: (n: number) => { from: number; to: number } } };
        dispatch: (tr: unknown) => void;
        focus: () => void;
      };
    } | null;
    try {
      const view = editor?.editor;
      if (view) {
        const line = view.state.doc.line(lineNumber);
        view.dispatch({ selection: { anchor: line.to } });
        view.focus();
      }
    } catch {
      // swallow
    }
  };

  const handleJump = (track: TrackLine) => {
    const editor = editorRef.current as unknown as {
      editor?: {
        state: { doc: { line: (n: number) => { from: number } } };
        dispatch: (tr: unknown) => void;
        focus: () => void;
      };
    } | null;
    try {
      const view = editor?.editor;
      if (!view) return;
      const line = view.state.doc.line(track.lineNumber);
      view.dispatch({ selection: { anchor: line.from } });
      view.focus();
    } catch {
      // swallow
    }
  };

  const mutedCount = tracks.filter((t) => t.muted).length;
  const liveCount = tracks.length - mutedCount;

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col min-h-0 h-full">
        <div className="flex-1 px-4 py-6 text-center">
          <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase mb-2">
            No tracks
          </p>
          <p className="font-micro text-[9px] tracking-wide text-text-dim">
            Insert a pad or snippet to see tracks here. Each <code className="font-mono text-text">$:</code> line becomes a channel.
          </p>
        </div>
        <div className="px-3 py-2 border-t border-white/10">
          <button
            onClick={handleAddTrack}
            className="w-full font-micro text-[10px] tracking-widest uppercase text-creator border border-creator/40 hover:bg-creator/10 py-1.5 cursor-pointer transition-colors"
          >
            [ + ADD TRACK ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="px-4 pt-3 pb-2 border-b border-white/5 flex items-center justify-between shrink-0">
        <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
          {liveCount} live · {mutedCount} muted
        </span>
        {mutedCount > 0 && (
          <button
            onClick={handleUnmuteAll}
            className="font-micro text-[9px] tracking-widest text-creator hover:underline uppercase cursor-pointer"
          >
            unmute all
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tracks.map((track, i) => (
          <div
            key={`${track.lineNumber}-${i}`}
            className={`px-3 py-2 border-b border-white/5 ${
              track.muted ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-mono text-[10px] text-text-dim w-6 text-right tabular-nums shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => handleJump(track)}
                className="flex-1 min-w-0 text-left font-mono text-[10px] text-text hover:text-creator cursor-pointer truncate"
                title={`${track.expression}\n\nClick to jump to line ${track.lineNumber} in editor`}
              >
                {track.preview || "(empty)"}
              </button>
            </div>
            <div className="flex items-center gap-1 mt-1.5 pl-8">
              <button
                onClick={() => handleToggleMute(track)}
                className={`font-micro text-[9px] tracking-widest uppercase px-1.5 py-0.5 border cursor-pointer transition-colors ${
                  track.muted
                    ? "border-signal-warn/50 text-signal-warn bg-signal-warn/10"
                    : "border-white/10 text-text-dim hover:text-text hover:border-white/20"
                }`}
                title={track.muted ? "Unmute" : "Mute"}
              >
                {track.muted ? "UNMUTE" : "MUTE"}
              </button>
              <button
                onClick={() => handleSolo(track)}
                className="font-micro text-[9px] tracking-widest uppercase px-1.5 py-0.5 border border-white/10 text-text-dim hover:text-creator hover:border-creator/30 cursor-pointer transition-colors"
                title="Solo — mute all other tracks"
              >
                SOLO
              </button>
              <button
                onClick={() => handleDelete(track)}
                className="ml-auto font-micro text-[9px] tracking-widest uppercase px-1.5 py-0.5 border border-white/10 text-text-dim hover:text-destructive hover:border-destructive/30 cursor-pointer transition-colors"
                title="Delete this track"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 border-t border-white/10 shrink-0">
        <button
          onClick={handleAddTrack}
          className="w-full font-micro text-[10px] tracking-widest uppercase text-creator border border-creator/40 hover:bg-creator/10 py-1.5 cursor-pointer transition-colors"
        >
          [ + ADD TRACK ]
        </button>
      </div>
    </div>
  );
}

/* ── HISTORY panel ── */

function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function HistoryPanel({ editorRef }: { editorRef: React.RefObject<StrudelMirror | null> }) {
  const { history, clearHistory, setCode, code, pushHistory } = useStore();

  const handleRewind = (entry: HistoryEntry) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.setCode(entry.code);
    editor.evaluate();
    setCode(entry.code);
  };

  const handleSnapshot = () => {
    if (!code.trim()) return;
    const firstLine = code.split("\n")[0].replace(/^\s*\$:\s*/, "").slice(0, 40);
    pushHistory({ code, label: `Snapshot · ${firstLine || "…"}` });
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="px-3 py-2 border-b border-white/10 shrink-0">
        <button
          onClick={handleSnapshot}
          disabled={!code.trim()}
          className="w-full font-micro text-[10px] tracking-widest uppercase text-creator border border-creator/40 hover:bg-creator/10 disabled:opacity-40 disabled:cursor-not-allowed py-1.5 cursor-pointer transition-colors"
          title="Save the current editor content as a history entry"
        >
          📸 Snapshot now
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 px-4 py-6 text-center">
          <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase mb-2">
            No history yet
          </p>
          <p className="font-micro text-[9px] tracking-wide text-text-dim">
            Inserts, evaluations, AI composes, and pattern loads get logged here so you can rewind.
          </p>
        </div>
      ) : (
        <>
      <div className="px-4 pt-3 pb-2 border-b border-white/5 flex items-center justify-between shrink-0">
        <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
          {history.length} entr{history.length === 1 ? "y" : "ies"}
        </span>
        <button
          onClick={clearHistory}
          className="font-micro text-[9px] tracking-widest text-text-dim hover:text-destructive uppercase cursor-pointer"
        >
          clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="px-4 py-2 border-b border-white/5 hover:bg-surface-2/50 transition-colors"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-micro text-[10px] tracking-widest text-text uppercase truncate">
                {entry.label}
              </span>
              <span className="font-micro text-[9px] tracking-wide text-text-dim shrink-0">
                {formatRelative(entry.timestamp)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 gap-2">
              <code className="font-mono text-[10px] text-text-dim truncate flex-1">
                {entry.code.split("\n")[0] || "(empty)"}
              </code>
              <button
                onClick={() => handleRewind(entry)}
                className="font-micro text-[9px] tracking-widest uppercase text-listener hover:underline cursor-pointer shrink-0"
                title="Restore this code into the editor"
              >
                ↩ rewind
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

/* ── SESSION panel ── */

function SessionPanel({ onSave }: { onSave?: () => void }) {
  const { trackTitle, setTrackTitle, code, sessionStartedAt, patternId } = useStore();
  const [copied, setCopied] = useState(false);

  const lineCount = code.split("\n").length;
  const charCount = code.length;
  const sessionDuration = sessionStartedAt
    ? formatUptime(Date.now() - sessionStartedAt)
    : "—";

  const handleCopyLink = async () => {
    if (!patternId || typeof navigator === "undefined") return;
    const url = `${window.location.origin}/p/${patternId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // swallow
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <div>
        <label className="font-micro text-[9px] tracking-widest text-text-dim uppercase block mb-1">
          Title
        </label>
        <input
          type="text"
          value={trackTitle}
          onChange={(e) => setTrackTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-base border border-white/10 px-2 py-1.5 font-mono text-xs text-text focus:outline-none focus:border-creator/40 placeholder:text-text-dim/60"
        />
      </div>

      <div className="space-y-1 border-t border-white/5 pt-2">
        <InfoRow label="Lines" value={String(lineCount)} tone="dim" />
        <InfoRow label="Characters" value={String(charCount)} tone="dim" />
        <InfoRow label="Session time" value={sessionDuration} tone="dim" />
        <InfoRow
          label="Pattern ID"
          value={patternId ? patternId.slice(0, 8) + "…" : "(unsaved)"}
          tone={patternId ? "listener" : "dim"}
        />
      </div>

      <div className="space-y-1 border-t border-white/5 pt-2">
        {onSave && (
          <button
            onClick={onSave}
            className="w-full font-micro text-[10px] tracking-widest uppercase text-creator border border-creator/40 hover:bg-creator/10 py-1.5 cursor-pointer transition-colors"
          >
            [ SAVE PATTERN ]
          </button>
        )}
        {patternId && (
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={handleCopyLink}
              className="font-micro text-[10px] tracking-widest uppercase text-listener border border-listener/30 hover:bg-listener/10 py-1.5 cursor-pointer transition-colors"
              title="Copy share URL to clipboard"
            >
              {copied ? "COPIED ✓" : "COPY LINK"}
            </button>
            <Link
              href={`/p/${patternId}`}
              target="_blank"
              className="block text-center font-micro text-[10px] tracking-widest uppercase text-listener border border-listener/30 hover:bg-listener/10 py-1.5 cursor-pointer transition-colors"
            >
              OPEN ↗
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main sidebar ── */

export function Sidebar({ editorRef, onSave }: SidebarProps) {
  const { dashboardPanel, setDashboardPanel, playing, history } = useStore();

  return (
    <aside className="bg-surface-1 fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[220px] border-r border-border flex-col hidden lg:flex z-40">
      {/* Global header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              playing
                ? "bg-creator animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                : "bg-text-dim"
            }`}
          />
          <span className="font-micro text-[10px] tracking-widest text-text uppercase">
            DASHBOARD
          </span>
        </div>
        {history.length > 0 && (
          <span
            className="font-micro text-[9px] tracking-widest text-text-dim"
            title={`${history.length} history ${history.length === 1 ? "entry" : "entries"}`}
          >
            {history.length}
          </span>
        )}
      </div>

      {/* Tabs */}
      <nav className="grid grid-cols-4 border-b border-white/10 shrink-0">
        {NAV.map(({ key, label, icon: Icon }) => {
          const active = key === dashboardPanel;
          return (
            <button
              key={key}
              onClick={() => setDashboardPanel(key)}
              className={`py-2.5 flex flex-col items-center gap-1 cursor-pointer transition-colors border-b-2 ${
                active
                  ? "text-creator border-creator bg-creator/5"
                  : "text-text-dim border-transparent hover:text-text"
              }`}
              title={label}
            >
              <Icon />
              <span className="font-micro text-[8px] tracking-widest uppercase">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Active panel */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {dashboardPanel === "NOW" && <NowPanel editorRef={editorRef} />}
        {dashboardPanel === "TRACKS" && <TracksPanel editorRef={editorRef} />}
        {dashboardPanel === "HISTORY" && <HistoryPanel editorRef={editorRef} />}
        {dashboardPanel === "SESSION" && <SessionPanel onSave={onSave} />}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-white/10 shrink-0">
        <div className="mb-2 h-3 overflow-hidden">
          <Ticker events={CITY_EVENTS} />
        </div>
        <Link
          href="/radio"
          className="block w-full text-center font-micro text-[10px] tracking-widest text-listener border border-listener/40 py-1.5 hover:bg-listener/10 transition-colors cursor-pointer uppercase"
          title="Listen to the live AI broadcast"
        >
          ◉ LISTEN · RADIO
        </Link>
      </div>
    </aside>
  );
}
