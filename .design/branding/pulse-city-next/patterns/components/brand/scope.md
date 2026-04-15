# brand/scope.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/brand/scope.tsx`
> Category: brand primitive — oscilloscope chrome
> Status: **stub spec** — interface locked; audio wiring deferred to Phase 5

## Purpose
The still-moment primitive. A breathing oscilloscope strip that anchors `/radio` and `/embed` when nothing else is happening. It is the brand's "still except when something happened" bet, given physical form: even at rest, the room is alive — but only just.

Scope is the brand chrome wrapper around the existing `SpectrumAnalyzer` logic. The existing analyzer is a raw visualizer; Scope gives it a branded container (1px glass-line border, radius-md, correct surface flavor, color binding to the three brand channels).

## Hard rules
- **Always `--color-listener` unless explicitly overridden.** The room's voice is sky, not lime or violet.
- **No dither on `/radio`.** The radio surface forbids texture per `pulse-city.yml` per-surface flavor.
- **No loops other than the audio itself.** Scope never adds its own animation — the waveform is the motion.
- **1px `border-border` only.** No shadow, no radius beyond `--radius-md`, no gradient background.
- **`strip` size max height: 40px.** `full` size is free-form but respects the surface container.

## Props

```ts
type ScopeProps = {
  audioContext?: AudioContext;              // if absent, shows idle waveform placeholder
  source?: MediaStreamAudioSourceNode | AudioNode; // optional explicit node
  size?: "strip" | "full";                  // default "strip"
  color?: "listener" | "creator" | "agent"; // default "listener"
  surface?: "radio" | "studio" | "embed";   // default "radio" — affects dither rule
  className?: string;
  ariaLabel?: string;
};
```

## Size rules
| size | height | width | use |
|---|---|---|---|
| `strip` | 40px | 100% | /radio top chrome, /embed footer |
| `full` | container | container | /radio hero when a listener is actively tuned in |

## Color binding
| `color` | stroke | use |
|---|---|---|
| `listener` | `var(--color-listener)` | default — room presence |
| `creator` | `var(--color-creator)` | /studio preview only |
| `agent` | `var(--color-agent)` | agent-spoken-to moments — respects 3.6:1 contrast budget |

## Idle state
When no `audioContext` is provided (or the browser is not yet unlocked), Scope renders a static sine wave at 0.55 opacity — the same trough as `pulse-dot`. This is the "still" form. It is not animated. The only way the idle sine moves is if the user taps to unlock audio.

## Stub reference implementation

```tsx
// src/components/brand/scope.tsx
//
// Oscilloscope chrome strip — brand wrapper around SpectrumAnalyzer logic.
// Audio wiring lands in Phase 5. This stub renders the branded container
// and an idle sine placeholder.
//
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ScopeColor = "listener" | "creator" | "agent";
type ScopeSurface = "radio" | "studio" | "embed";

type ScopeProps = {
  audioContext?: AudioContext;
  source?: AudioNode;
  size?: "strip" | "full";
  color?: ScopeColor;
  surface?: ScopeSurface;
  className?: string;
  ariaLabel?: string;
};

const STROKE: Record<ScopeColor, string> = {
  listener: "var(--color-listener)",
  creator: "var(--color-creator)",
  agent: "var(--color-agent)",
};

export function Scope({
  audioContext,
  source,
  size = "strip",
  color = "listener",
  surface = "radio",
  className,
  ariaLabel = "audio scope",
}: ScopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Idle path — static sine at trough opacity.
    // Phase 5 replaces this with live analyser data from `source`.
    if (!audioContext || !source) {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = STROKE[color];
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const t = (x / width) * Math.PI * 2;
        const y = height / 2 + Math.sin(t) * (height / 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      return;
    }

    // Live path — Phase 5 wires AnalyserNode requestAnimationFrame loop here.
  }, [audioContext, source, color]);

  const heightClass = size === "strip" ? "h-10" : "h-full min-h-[120px]";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-1",
        surface === "radio" && "bg-surface-3", // /radio quiet tier, no dither
        heightClass,
        className
      )}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        // width/height set by ResizeObserver in Phase 5 — stub omits for brevity
      />
    </div>
  );
}
```

### Phase 5 integration notes (for the builder)
- Reuse the existing `SpectrumAnalyzer` AnalyserNode setup; Scope is purely the branded wrapper.
- Wire `ResizeObserver` to keep `canvas.width`/`canvas.height` matched to devicePixelRatio.
- The live path should draw waveform (time-domain) data, not frequency bins. This is a scope, not a spectrum.
- Never draw a grid, ruler, or axis behind the waveform. The chrome is the 1px border; the waveform is the only mark.
- If the audio is silent for more than 1.5 seconds (one pulse-dot period), cross-fade back to the idle sine at 0.55 opacity.
