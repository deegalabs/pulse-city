"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { CodeDiff } from "@/components/chat/code-diff";
import { extractCode, extractMessage } from "@/lib/ai/extract-ai-response";
import {
  DEFAULT_DEVICE_ID,
  enumerateAudioOutputs,
  getCurrentOutputSinkId,
  isSinkIdSupported,
  requestAudioPermission,
  setAudioOutput,
  type OutputDevice,
} from "@/lib/audio/output-devices";

interface CueAgentProps {
  open: boolean;
  onClose: () => void;
  onCodeApply: (code: string) => void;
  onCodePreview: (code: string) => void;
  onCodeRevert: () => void;
}

// System prompt is set server-side via `variant: "cue"`.
// Per-message text is just the DJ's intent.

const SUGGESTION_PRESETS = [
  "Add a filter sweep on the bass",
  "Introduce a snare fill every 8 bars",
  "Duck the bass when the kick hits",
  "Brighten the lead with a bit more delay",
  "Build a short breakdown",
  "Swap the hats for a tighter closed pattern",
];

export function CueAgent({
  open,
  onClose,
  onCodeApply,
  onCodePreview,
  onCodeRevert,
}: CueAgentProps) {
  const { code } = useStore();
  const [input, setInput] = useState("");

  // Audio routing state
  const sinkSupported = useMemo(() => (open ? isSinkIdSupported() : false), [open]);
  const [devices, setDevices] = useState<OutputDevice[]>([]);
  const [cueDeviceId, setCueDeviceId] = useState<string>(DEFAULT_DEVICE_ID);
  const [needsPermission, setNeedsPermission] = useState(false);
  const originalSinkRef = useRef<string | null>(null);

  // Preview state
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(() => new Set());
  const baselineRef = useRef<Map<string, string>>(new Map());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      // Function body runs at send time — reads fresh state, not stale closure.
      body: () => ({
        mode: "manual",
        variant: "cue",
        currentCode: useStore.getState().code,
      }),
    }),
  });
  const isLoading = status === "streaming" || status === "submitted";

  const refreshDevices = useCallback(async () => {
    const list = await enumerateAudioOutputs();
    setDevices(list);
    // Labels blank when permission hasn't been granted — use that as the signal
    const blankLabels = list.length === 0 || list.every((d) => d.label.startsWith("Output "));
    setNeedsPermission(blankLabels);
    return !blankLabels;
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const ok = await refreshDevices();
      // Auto-request permission if labels are blank (but only if the browser supports sinkId)
      if (!ok && !cancelled && isSinkIdSupported()) {
        const granted = await requestAudioPermission();
        if (granted && !cancelled) await refreshDevices();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, refreshDevices]);

  // React to devices being plugged in / unplugged while popup is open
  useEffect(() => {
    if (!open) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
    const handler = () => refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", handler);
    return () => navigator.mediaDevices.removeEventListener("devicechange", handler);
  }, [open, refreshDevices]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Revert any active cue routing when the popup closes
  useEffect(() => {
    if (open) return;
    const restore = originalSinkRef.current;
    if (restore !== null) {
      setAudioOutput(restore).catch(() => {});
      originalSinkRef.current = null;
    }
    setPreviewingId(null);
  }, [open]);

  if (!open) return null;

  const handleGrantPermission = async () => {
    const ok = await requestAudioPermission();
    if (ok) refreshDevices();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handlePreset = (text: string) => {
    if (isLoading) return;
    sendMessage({ text });
  };

  const getBaseline = (messageId: string, current: string): string => {
    const existing = baselineRef.current.get(messageId);
    if (existing !== undefined) return existing;
    baselineRef.current.set(messageId, current);
    return current;
  };

  const startPreview = async (messageId: string, proposedCode: string) => {
    if (sinkSupported && cueDeviceId !== DEFAULT_DEVICE_ID && originalSinkRef.current === null) {
      const prev = getCurrentOutputSinkId();
      originalSinkRef.current = prev;
      await setAudioOutput(cueDeviceId);
    }
    onCodePreview(proposedCode);
    setPreviewingId(messageId);
  };

  const stopPreview = async () => {
    onCodeRevert();
    setPreviewingId(null);
    if (originalSinkRef.current !== null) {
      await setAudioOutput(originalSinkRef.current);
      originalSinkRef.current = null;
    }
  };

  const handleListen = async (messageId: string, proposedCode: string) => {
    if (previewingId === messageId) {
      await stopPreview();
      return;
    }
    await startPreview(messageId, proposedCode);
  };

  const handleKeep = async (messageId: string, proposedCode: string) => {
    // Route audio back to main before committing
    if (originalSinkRef.current !== null) {
      await setAudioOutput(originalSinkRef.current);
      originalSinkRef.current = null;
    }
    onCodeApply(proposedCode);
    setPreviewingId((curr) => (curr === messageId ? null : curr));
    setAppliedIds((prev) => {
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
  };

  const handleReject = async (messageId: string) => {
    if (previewingId === messageId) {
      await stopPreview();
    }
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
  };

  const cueLabel =
    cueDeviceId === DEFAULT_DEVICE_ID
      ? "System default (same as main)"
      : devices.find((d) => d.deviceId === cueDeviceId)?.label ?? "Selected device";

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-3xl max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-baseline gap-3">
            <h2 className="font-heading font-bold text-base text-text tracking-tight">
              CUE AGENT
            </h2>
            <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              Suggest · audition · commit
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
            aria-label="Close"
          >
            [ ESC ]
          </button>
        </div>

        {/* Audio routing */}
        <div className="px-5 py-3 border-b border-white/10 bg-surface-2/40 shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-micro text-[10px] tracking-widest text-listener uppercase mb-1">
                Cue output
              </div>
              <div className="font-micro text-[9px] tracking-wide text-text-dim">
                {sinkSupported
                  ? "Preview routes here. Your main speakers go silent while previewing (Phase 1)."
                  : "This browser does not support output device selection — preview will play on the current output."}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {needsPermission && sinkSupported && (
                <button
                  onClick={handleGrantPermission}
                  className="font-micro text-[10px] tracking-widest uppercase px-2 py-1 border border-signal-warn/40 text-signal-warn hover:bg-signal-warn/10 cursor-pointer"
                >
                  Grant device access
                </button>
              )}
              <select
                value={cueDeviceId}
                onChange={(e) => setCueDeviceId(e.target.value)}
                disabled={!sinkSupported}
                className="bg-base border border-white/10 text-text text-xs font-mono px-2 py-1.5 focus:outline-none focus:border-listener/40 disabled:opacity-40 max-w-[240px]"
                title={`${devices.length} device(s) detected`}
              >
                <option value={DEFAULT_DEVICE_ID}>System default</option>
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </select>
              <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
                {devices.length}
              </span>
              <button
                onClick={refreshDevices}
                className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
                title="Refresh device list"
              >
                ↻
              </button>
            </div>
          </div>
          {previewingId && (
            <div className="mt-2 font-micro text-[10px] tracking-widest text-listener uppercase inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-listener rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
              Live preview on: {cueLabel}
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="px-5 py-3 border-b border-white/10 shrink-0">
          <div className="font-micro text-[10px] tracking-widest text-text-dim uppercase mb-2">
            Quick suggestions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTION_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                disabled={isLoading}
                className="font-micro text-[10px] tracking-wide uppercase text-text-dim hover:text-text border border-white/10 hover:border-white/20 px-2 py-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Messages + diffs */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              Ask for a suggestion or pick a preset above. The agent returns a
              diff you can preview on your cue device before committing.
            </p>
          )}

          {messages.map((message) => {
            const text = message.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            const isUser = message.role === "user";
            const proposedCode = !isUser ? extractCode(text) : null;
            const displayText = isUser ? text : extractMessage(text);
            const showDiff = !!proposedCode && !rejectedIds.has(message.id);

            return (
              <div key={message.id} className="flex gap-3 items-start">
                <span
                  className={`font-micro text-[10px] pt-1 shrink-0 tracking-widest uppercase ${
                    isUser ? "text-listener" : "text-creator"
                  }`}
                >
                  {isUser ? "DJ" : "CUE"}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed ${
                      isUser ? "text-text" : "text-text-muted italic"
                    }`}
                  >
                    {displayText}
                  </p>
                  {showDiff && proposedCode && (
                    <CodeDiff
                      oldCode={getBaseline(message.id, code)}
                      newCode={proposedCode}
                      previewing={previewingId === message.id}
                      applied={appliedIds.has(message.id)}
                      onListen={() => handleListen(message.id, proposedCode)}
                      onKeep={() => handleKeep(message.id, proposedCode)}
                      onReject={() => handleReject(message.id)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <span className="font-micro text-[10px] pt-1 text-creator tracking-widest uppercase">
                CUE
              </span>
              <p className="text-sm text-text-dim italic animate-pulse">
                thinking up a suggestion…
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the change you want…"
            disabled={isLoading}
            className="flex-1 bg-base border border-white/10 px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-creator/40 transition-colors placeholder:text-text-dim/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="font-micro text-[10px] font-bold tracking-widest uppercase bg-creator text-base px-4 py-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
          >
            Suggest
          </button>
        </form>
      </div>
    </div>
  );
}
