"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useStore,
  type EditorSettings,
  type Keybindings,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_DEFAULT,
} from "@/lib/store";
import {
  enumerateAudioOutputs,
  isSinkIdSupported,
  requestAudioPermission,
  setAudioOutput as setSinkIdOnContext,
  type OutputDevice,
} from "@/lib/audio/output-devices";

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SectionLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  return (
    <h3
      className={`font-micro text-[10px] tracking-widest uppercase mb-3 ${
        variant === "destructive" ? "text-destructive" : "text-text-dim"
      }`}
    >
      {children}
    </h3>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
        {label}
      </span>
      <span className="font-mono text-xs text-text-muted">{value}</span>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-2 group cursor-pointer text-left"
    >
      <div className="min-w-0">
        <div className="font-micro text-[10px] tracking-widest text-text uppercase group-hover:text-creator transition-colors">
          {label}
        </div>
        {hint && (
          <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5">
            {hint}
          </div>
        )}
      </div>
      <span
        className={`relative inline-flex w-9 h-4 rounded-full transition-colors shrink-0 ml-4 ${
          checked ? "bg-creator" : "bg-surface-3"
        }`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

const EDITOR_TOGGLES: {
  key: keyof Omit<EditorSettings, "keybindings" | "fontSize">;
  label: string;
  hint: string;
}[] = [
  { key: "autocomplete", label: "Autocomplete", hint: "Suggest functions, banks, chords as you type" },
  { key: "tooltips", label: "Hover docs", hint: "Show function docs on hover" },
  { key: "bracketMatching", label: "Bracket matching", hint: "Highlight matching brackets" },
  { key: "activeLine", label: "Active line", hint: "Highlight current line + gutter" },
  { key: "tabIndent", label: "Tab indent", hint: "Tab key indents (disabled: moves focus)" },
  { key: "multiCursor", label: "Multi-cursor", hint: "Cmd/Ctrl+Click adds cursor" },
  { key: "lineWrapping", label: "Line wrapping", hint: "Wrap long lines instead of scrolling" },
];

const KEYBINDING_OPTIONS: { value: Keybindings; label: string }[] = [
  { value: "codemirror", label: "CodeMirror" },
  { value: "vscode", label: "VSCode" },
  { value: "vim", label: "Vim" },
  { value: "emacs", label: "Emacs" },
];

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const {
    reset,
    editor,
    setEditorSetting,
    resetEditorSettings,
    audio,
    setAudioOutput,
  } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [devices, setDevices] = useState<OutputDevice[]>([]);
  const sinkSupported = typeof window !== "undefined" && isSinkIdSupported();

  const refreshDevices = useCallback(async () => {
    const list = await enumerateAudioOutputs();
    setDevices(list);
    return list.length > 0 && list.some((d) => !d.label.startsWith("Output "));
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const ok = await refreshDevices();
      if (!ok && !cancelled && sinkSupported) {
        const granted = await requestAudioPermission();
        if (granted && !cancelled) await refreshDevices();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, refreshDevices, sinkSupported]);

  useEffect(() => {
    if (!open) return;
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
    const handler = () => refreshDevices();
    navigator.mediaDevices.addEventListener("devicechange", handler);
    return () => navigator.mediaDevices.removeEventListener("devicechange", handler);
  }, [open, refreshDevices]);

  if (!open) return null;

  const bumpFontSize = (delta: number) => {
    const next = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, editor.fontSize + delta));
    setEditorSetting("fontSize", next);
  };

  const handleMainChange = async (deviceId: string) => {
    setAudioOutput("mainDeviceId", deviceId);
    // Apply immediately so main output follows the selection
    if (sinkSupported) {
      await setSinkIdOnContext(deviceId);
    }
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    reset();
    localStorage.removeItem("pc.store");
    setConfirmClear(false);
    onClose();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-md mx-4 p-6 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text transition-colors cursor-pointer p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* AUDIO ENGINE */}
        <div className="mb-6">
          <SectionLabel>AUDIO ENGINE</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-2">
            <InfoRow label="Runtime" value="Strudel v1.2.6" />
            <div className="h-px bg-white/5 my-1" />
            <InfoRow label="Output" value="WebAudio API" />
          </div>
        </div>

        {/* AUDIO OUTPUT */}
        <div className="mb-6">
          <SectionLabel>AUDIO OUTPUT</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3 space-y-3">
            {!sinkSupported && (
              <div className="font-micro text-[10px] tracking-wide text-signal-warn">
                This browser does not support output device selection. Both main
                and cue will use the system default output.
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-micro text-[10px] tracking-widest text-text uppercase">
                  Main
                </div>
                <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5">
                  Speakers — the audience hears this.
                </div>
              </div>
              <select
                value={audio.mainDeviceId}
                onChange={(e) => handleMainChange(e.target.value)}
                disabled={!sinkSupported}
                className="bg-base border border-white/10 text-text text-xs font-mono px-2 py-1.5 focus:outline-none focus:border-creator/40 disabled:opacity-40 max-w-[220px]"
              >
                <option value="">System default</option>
                {devices.map((d) => (
                  <option key={`main-${d.deviceId}`} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-micro text-[10px] tracking-widest text-text uppercase">
                  Cue
                </div>
                <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5">
                  Headphones — for private preview. Toggle{" "}
                  <span className="text-text">CUE</span> on any docs example
                  to route its preview here.
                </div>
              </div>
              <select
                value={audio.cueDeviceId}
                onChange={(e) => setAudioOutput("cueDeviceId", e.target.value)}
                disabled={!sinkSupported}
                className="bg-base border border-white/10 text-text text-xs font-mono px-2 py-1.5 focus:outline-none focus:border-listener/40 disabled:opacity-40 max-w-[220px]"
              >
                <option value="">System default</option>
                {devices.map((d) => (
                  <option key={`cue-${d.deviceId}`} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
                {devices.length} device(s) detected
              </span>
              <button
                onClick={refreshDevices}
                className="font-micro text-[9px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
              >
                [ REFRESH ]
              </button>
            </div>
          </div>
        </div>

        {/* EDITOR */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>EDITOR</SectionLabel>
            <button
              onClick={resetEditorSettings}
              className="font-micro text-[9px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
              title="Reset editor settings"
            >
              [ RESET ]
            </button>
          </div>
          <div className="bg-surface-2 border border-white/10 px-4 py-2 divide-y divide-white/5">
            {EDITOR_TOGGLES.map(({ key, label, hint }) => (
              <ToggleRow
                key={key}
                label={label}
                hint={hint}
                checked={editor[key]}
                onChange={(v) => setEditorSetting(key, v)}
              />
            ))}

            {/* Keybindings */}
            <div className="py-3">
              <div className="font-micro text-[10px] tracking-widest text-text uppercase mb-2">
                Keybindings
              </div>
              <div className="grid grid-cols-4 gap-1">
                {KEYBINDING_OPTIONS.map(({ value, label }) => {
                  const active = editor.keybindings === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setEditorSetting("keybindings", value)}
                      className={`font-micro text-[10px] tracking-widest uppercase py-2 border transition-colors cursor-pointer ${
                        active
                          ? "bg-creator/10 border-creator text-creator"
                          : "bg-transparent border-white/10 text-text-dim hover:text-text hover:border-white/20"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="font-micro text-[9px] tracking-wide text-text-dim mt-2">
                Vim: :w eval · :q stop · gc toggle comment
              </div>
            </div>

            {/* Font size */}
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-micro text-[10px] tracking-widest text-text uppercase">
                  Font size
                </div>
                <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5">
                  Ctrl+= larger · Ctrl+- smaller · Ctrl+0 reset
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => bumpFontSize(-1)}
                  disabled={editor.fontSize <= FONT_SIZE_MIN}
                  className="w-7 h-7 flex items-center justify-center border border-white/10 text-text-dim hover:text-text hover:border-white/20 disabled:opacity-30 disabled:cursor-default cursor-pointer font-mono"
                  aria-label="Decrease font size"
                >
                  –
                </button>
                <span className="font-mono text-xs text-text w-9 text-center">
                  {editor.fontSize}px
                </span>
                <button
                  onClick={() => bumpFontSize(1)}
                  disabled={editor.fontSize >= FONT_SIZE_MAX}
                  className="w-7 h-7 flex items-center justify-center border border-white/10 text-text-dim hover:text-text hover:border-white/20 disabled:opacity-30 disabled:cursor-default cursor-pointer font-mono"
                  aria-label="Increase font size"
                >
                  +
                </button>
                <button
                  onClick={() => setEditorSetting("fontSize", FONT_SIZE_DEFAULT)}
                  className="font-micro text-[9px] tracking-widest text-text-dim hover:text-text ml-1 cursor-pointer"
                  title="Reset font size"
                >
                  [ {FONT_SIZE_DEFAULT} ]
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI CONFIGURATION */}
        <div className="mb-6">
          <SectionLabel>AI CONFIGURATION</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3">
            <p className="text-xs text-text-dim leading-relaxed">
              API keys are configured server-side via environment variables. Set{" "}
              <code className="font-mono text-creator">GROQ_API_KEY</code> for
              free tier or{" "}
              <code className="font-mono text-creator">ANTHROPIC_API_KEY</code>{" "}
              for Claude models.
            </p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mb-6">
          <SectionLabel>ABOUT</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3">
            <p className="font-mono text-xs text-text-muted">
              pulse.city{" "}
              <span className="text-listener">v2.4.0</span>
            </p>
            <p className="font-micro text-[10px] tracking-widest text-text-dim mt-1">
              DEEGA LABS — AGPL-3.0
            </p>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="border-t border-white/10 pt-5">
          <SectionLabel variant="destructive">DANGER ZONE</SectionLabel>
          <button
            onClick={handleClear}
            className="w-full py-2.5 bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 font-micro text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
          >
            {confirmClear
              ? "CONFIRM — CLEAR ALL DATA"
              : "CLEAR ALL DATA"}
          </button>
          <p className="font-micro text-[10px] tracking-widest text-text-dim mt-2">
            Removes saved state, mode, and chat history.
          </p>
        </div>
      </div>
    </div>
  );
}
