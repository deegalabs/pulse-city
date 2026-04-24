"use client";

import { useState } from "react";
import {
  useStore,
  BPM_MIN,
  BPM_MAX,
  type Genre,
} from "@/lib/store";
import { GENRE_LABELS } from "@/lib/ai/deck-prompt";

const GENRE_ORDER: Genre[] = [
  "deep-house",
  "techno",
  "house",
  "ambient",
  "ethereal",
  "psychedelic",
  "dnb",
  "trap",
  "lofi",
  "dub",
  "jazz",
  "industrial",
];

const KEY_OPTIONS = [
  "C minor",
  "A minor",
  "D minor",
  "E minor",
  "F# minor",
  "G minor",
  "C major",
  "G major",
  "D major",
  "A major",
  "F major",
  "Eb major",
];

const LAYERS: { key: "kick" | "hats" | "snare" | "bass" | "lead" | "pad" | "fx"; label: string }[] = [
  { key: "kick", label: "Kick" },
  { key: "hats", label: "Hats" },
  { key: "snare", label: "Snare / Clap" },
  { key: "bass", label: "Bass" },
  { key: "lead", label: "Lead" },
  { key: "pad", label: "Pad / Chords" },
  { key: "fx", label: "FX" },
];

interface DjDeckProps {
  open: boolean;
  onClose: () => void;
  onCompose: () => Promise<void> | void;
  onLayer: (layer: "kick" | "hats" | "snare" | "bass" | "lead" | "pad" | "fx") => void;
  composing?: boolean;
}

function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  suffix = "",
  color = "creator",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  color?: "creator" | "listener" | "agent";
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackColor =
    color === "creator" ? "bg-creator" : color === "listener" ? "bg-listener" : "bg-agent";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
          {label}
        </span>
        <span className="font-mono text-xs text-text">
          {value}
          {suffix}
        </span>
      </div>
      <div className="relative h-2 bg-surface-3 rounded-full">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${trackColor}/60`}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
}

export function DjDeck({ open, onClose, onCompose, onLayer, composing }: DjDeckProps) {
  const { deck, setDeck, resetDeck } = useStore();
  const [dispatchLayer, setDispatchLayer] = useState<string | null>(null);

  if (!open) return null;

  const handleLayer = (l: "kick" | "hats" | "snare" | "bass" | "lead" | "pad" | "fx") => {
    setDispatchLayer(l);
    onLayer(l);
    window.setTimeout(() => setDispatchLayer(null), 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-3xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-baseline gap-3">
            <h2 className="font-heading font-bold text-lg text-text tracking-tight">
              DECK
            </h2>
            <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              Shape the next composition
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetDeck}
              className="font-micro text-[9px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
            >
              [ RESET ]
            </button>
            <button
              onClick={onClose}
              className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
              aria-label="Close"
            >
              [ ESC ]
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* ── Left: Genre + Key ── */}
          <div className="space-y-5">
            {/* Genre grid */}
            <div>
              <h3 className="font-micro text-[10px] tracking-widest uppercase text-creator mb-3">
                Genre
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {GENRE_ORDER.map((g) => {
                  const active = deck.genre === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setDeck("genre", active ? null : g)}
                      className={`font-micro text-[10px] tracking-widest uppercase py-2.5 px-2 border transition-colors cursor-pointer text-left ${
                        active
                          ? "bg-creator/15 border-creator text-creator"
                          : "bg-surface-2 border-white/10 text-text-dim hover:text-text hover:border-white/20"
                      }`}
                    >
                      {GENRE_LABELS[g]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key selector */}
            <div>
              <h3 className="font-micro text-[10px] tracking-widest uppercase text-creator mb-3">
                Key
              </h3>
              <div className="grid grid-cols-4 gap-1">
                {KEY_OPTIONS.map((k) => {
                  const active = deck.key === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setDeck("key", k)}
                      className={`font-micro text-[9px] tracking-widest uppercase py-1.5 border transition-colors cursor-pointer ${
                        active
                          ? "bg-listener/15 border-listener text-listener"
                          : "bg-surface-2 border-white/10 text-text-dim hover:text-text"
                      }`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Sliders + Layers ── */}
          <div className="space-y-5">
            {/* Sliders */}
            <div>
              <h3 className="font-micro text-[10px] tracking-widest uppercase text-creator mb-3">
                Shape
              </h3>
              <div className="bg-surface-2 border border-white/10 p-4 space-y-4">
                <Slider
                  label="BPM"
                  value={deck.bpm}
                  onChange={(v) => setDeck("bpm", v)}
                  min={BPM_MIN}
                  max={BPM_MAX}
                  color="listener"
                />
                <Slider
                  label="Energy"
                  value={deck.energy}
                  onChange={(v) => setDeck("energy", v)}
                  suffix="%"
                  color="creator"
                />
                <Slider
                  label="Space"
                  value={deck.space}
                  onChange={(v) => setDeck("space", v)}
                  suffix="%"
                  color="listener"
                />
                <Slider
                  label="Brightness"
                  value={deck.brightness}
                  onChange={(v) => setDeck("brightness", v)}
                  suffix="%"
                  color="agent"
                />
              </div>
            </div>

            {/* Layer quick-add */}
            <div>
              <h3 className="font-micro text-[10px] tracking-widest uppercase text-creator mb-3">
                Add layer
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {LAYERS.map((l) => {
                  const active = dispatchLayer === l.key;
                  return (
                    <button
                      key={l.key}
                      onClick={() => handleLayer(l.key)}
                      className={`font-micro text-[10px] tracking-widest uppercase py-2 px-3 border flex items-center justify-between cursor-pointer transition-colors ${
                        active
                          ? "bg-agent/15 border-agent text-agent"
                          : "bg-surface-2 border-white/10 text-text-dim hover:text-text hover:border-white/20"
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[9px]">{active ? "…" : "+"}</span>
                    </button>
                  );
                })}
              </div>
              <p className="font-micro text-[9px] tracking-wide text-text-dim mt-2">
                Sends layer-specific AI request using current deck settings.
              </p>
            </div>
          </div>
        </div>

        {/* Compose bar */}
        <div className="border-t border-white/10 bg-surface-2/40 px-6 py-4 flex items-center justify-between gap-4">
          <div className="font-mono text-xs text-text-dim truncate">
            <span className="text-text">
              {deck.genre ? GENRE_LABELS[deck.genre] : "Any genre"}
            </span>
            {" · "}
            {deck.key}
            {" · "}
            {deck.bpm} BPM
            {" · "}
            E{deck.energy} S{deck.space} B{deck.brightness}
          </div>
          <button
            onClick={() => onCompose()}
            disabled={composing}
            className="font-micro text-xs tracking-widest uppercase px-6 py-2.5 bg-creator text-base hover:brightness-110 disabled:opacity-50 disabled:cursor-default cursor-pointer transition-all active:scale-95 shrink-0"
          >
            {composing ? "Composing…" : "▶ Compose"}
          </button>
        </div>
      </div>
    </div>
  );
}
