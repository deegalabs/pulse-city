"use client";

import { useCallback, useEffect, useState } from "react";
import { ALL_PADS, DEFAULT_PADS, type Pad, type PadAccent } from "@/lib/pads";

interface PadGridProps {
  /** Called when the user wants to add the pad's pattern to the editor (shift+click or + button). */
  onInsert: (code: string) => void;
  /** Called with the one-shot sound pattern when the pad is tapped. */
  onPreview: (sound: string) => void;
  /** Stops any preview currently running (used to toggle pad off). */
  onPreviewStop: () => void;
}

const ACCENT_STYLES: Record<
  PadAccent,
  { label: string; border: string; bg: string; glow: string }
> = {
  drum: {
    label: "text-creator",
    border: "border-creator/30",
    bg: "hover:bg-creator/5",
    glow: "shadow-[0_0_16px_rgba(162,215,41,0.35)]",
  },
  percussion: {
    label: "text-agent",
    border: "border-agent/30",
    bg: "hover:bg-agent/5",
    glow: "shadow-[0_0_16px_rgba(138,102,255,0.35)]",
  },
  cymbal: {
    label: "text-listener",
    border: "border-listener/30",
    bg: "hover:bg-listener/5",
    glow: "shadow-[0_0_16px_rgba(58,165,255,0.35)]",
  },
  bass: {
    label: "text-signal-warn",
    border: "border-signal-warn/30",
    bg: "hover:bg-signal-warn/5",
    glow: "shadow-[0_0_16px_rgba(242,184,74,0.35)]",
  },
  lead: {
    label: "text-text",
    border: "border-white/20",
    bg: "hover:bg-white/5",
    glow: "shadow-[0_0_16px_rgba(226,232,240,0.25)]",
  },
};

export function PadGrid({ onInsert, onPreview, onPreviewStop }: PadGridProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(() => new Set());
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  const triggerPress = useCallback(
    (pad: Pad, modifiers: { shift: boolean }) => {
      if (modifiers.shift) {
        // Explicit insert workflow — writes the full track line into the editor
        onInsert(pad.insertCode);
      } else if (currentKey === pad.key) {
        // Tapping the same pad again stops the preview
        onPreviewStop();
        setCurrentKey(null);
      } else {
        onPreview(pad.sound);
        setCurrentKey(pad.key);
      }
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(pad.key);
        return next;
      });
      window.setTimeout(() => {
        setActiveKeys((prev) => {
          if (!prev.has(pad.key)) return prev;
          const next = new Set(prev);
          next.delete(pad.key);
          return next;
        });
      }, 160);
    },
    [onInsert, onPreview, onPreviewStop, currentKey]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (target.closest(".cm-editor")) return;
        if (target.isContentEditable) return;
      }
      const key = e.key.toLowerCase();
      const pad = ALL_PADS.find((p) => p.key === key);
      if (!pad) return;
      e.preventDefault();
      triggerPress(pad, { shift: e.shiftKey });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerPress]);

  return (
    <div className="bg-surface-1 border-b border-white/10 px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-micro text-[10px] tracking-widest text-text-dim">
          PAD GRID
        </span>
        <span className="font-micro text-[9px] tracking-widest text-text-dim">
          tap = play · ⇧+tap = insert
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {DEFAULT_PADS.flat().map((pad) => {
          const active = activeKeys.has(pad.key);
          const current = currentKey === pad.key;
          const style = ACCENT_STYLES[pad.accent];
          return (
            <button
              key={pad.key}
              onClick={(e) => triggerPress(pad, { shift: e.shiftKey })}
              title={`${pad.description}\n\nClick: preview · Shift+Click: insert into code · key: ${pad.key.toUpperCase()}`}
              className={`relative aspect-square bg-surface-2 border ${style.border} ${style.bg} flex flex-col items-center justify-between py-1.5 px-1 cursor-pointer transition-all duration-150 ${
                active ? `scale-95 bg-surface-3 ${style.glow}` : ""
              } ${
                current
                  ? `ring-1 ring-inset ${pad.accent === "drum" ? "ring-creator" : pad.accent === "cymbal" ? "ring-listener" : pad.accent === "percussion" ? "ring-agent" : pad.accent === "bass" ? "ring-signal-warn" : "ring-white/40"}`
                  : ""
              }`}
            >
              <span className="font-mono text-[8px] text-text-dim leading-none">
                {pad.key.toUpperCase()}
              </span>
              <span
                className={`font-micro text-[8px] tracking-widest text-center leading-tight ${style.label}`}
              >
                {pad.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 font-micro text-[8px] tracking-widest text-text-dim">
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-creator rounded-full" />
          drum
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-listener rounded-full" />
          cymbal
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-agent rounded-full" />
          perc
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-signal-warn rounded-full" />
          bass
        </span>
      </div>
    </div>
  );
}
