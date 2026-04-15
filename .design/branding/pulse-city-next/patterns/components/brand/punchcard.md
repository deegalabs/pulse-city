# brand/punchcard.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/brand/punchcard.tsx`
> Category: brand primitive — imagery host
> Status: **stub spec** — interface locked; `@strudel/draw` wiring deferred to Phase 5/6

## Purpose
The canonical imagery primitive. Every picture in the brand system is a punchcard: a grid of cells where each cell is colored by its author (human, agent, or room). This component is the container for `@strudel/draw` output, used across:
- `/p/[id]` hero background
- OG card background (server-rendered SVG)
- `/radio` chrome strip
- Marketing hero background
- MCP resource preview

A punchcard is not a logomark. The Logomark is a 3×7 fixed punchcard; this component is a **variable-size** punchcard that visualizes real Strudel patterns.

## Authorship → color mapping

| authorship | color token | use |
|---|---|---|
| `human` | `--color-creator` (lime) | pattern authored by a person |
| `agent` | `--color-agent` (warmed violet) | pattern authored by the AI DJ |
| `room` | `--color-listener` (sky) | shared room state / listener-voted cell |

Mixed-authorship patterns show per-cell fills. The legend format is Space Mono micro-label:
`[ HUMAN ] [ AGENT ] [ ROOM ]`

## Props

```ts
type PunchcardProps = {
  pattern: string;                           // Strudel source code
  width?: number;                            // pixels, default 800
  height?: number;                           // pixels, default 200
  authorship?: "human" | "agent" | "room";   // single-author default fill
  cells?: PunchcardCell[];                   // optional per-cell override
  overlay?: boolean;                         // default true — dither tile over output
  renderer?: "svg" | "canvas";               // default "svg" for server-render
  className?: string;
  ariaLabel?: string;
};

type PunchcardCell = {
  x: number; // column index
  y: number; // row index
  authorship: "human" | "agent" | "room";
  intensity?: number; // 0..1, modulates alpha
};
```

## Rendering modes

### Server (`renderer: "svg"`)
- Static SVG, no JS required.
- Used for OG cards, `/p/[id]` initial hero, MCP resource previews.
- Renders `cells[]` directly. If `cells` is omitted and only `pattern` is provided, the server performs a headless `@strudel/draw` evaluation via dynamic import and caches the result by pattern hash.

### Client (`renderer: "canvas"`)
- Dynamically imports `@strudel/draw` on mount.
- Used for `/radio` chrome strip (breathing) and `/studio` when the user is actively coding.
- Falls back to static SVG if `@strudel/draw` fails to load (degraded but branded).

## Overlay dither
When `overlay={true}` (default), a 1px static dither tile is painted over the full canvas at 6% opacity. This is the brand's anti-glossy texture. **Exception:** the `/radio` surface forbids dither — pass `overlay={false}` there.

## Surface rules
- Never render a punchcard on `--color-surface-3` (the /radio quiet tier forbids texture).
- Minimum height: 80px. Below that, drop to a single-row strip.
- Maximum aspect ratio: 16:3 strip for `/radio`. Square for OG. 21:9 for hero.

## Stub reference implementation

```tsx
// src/components/brand/punchcard.tsx
//
// Imagery primitive — host for @strudel/draw output, cell-colored by authorship.
// Full @strudel/draw wiring lands in Phase 5/6. This stub accepts explicit `cells`
// and renders a static SVG grid in the correct brand colors.
//
import { cn } from "@/lib/utils";

type Authorship = "human" | "agent" | "room";

type PunchcardCell = {
  x: number;
  y: number;
  authorship: Authorship;
  intensity?: number;
};

type PunchcardProps = {
  pattern?: string;
  cells?: PunchcardCell[];
  width?: number;
  height?: number;
  authorship?: Authorship;
  overlay?: boolean;
  renderer?: "svg" | "canvas";
  className?: string;
  ariaLabel?: string;
};

const AUTHOR_FILL: Record<Authorship, string> = {
  human: "var(--color-creator)",
  agent: "var(--color-agent)",
  room:  "var(--color-listener)",
};

export function Punchcard({
  pattern,
  cells,
  width = 800,
  height = 200,
  authorship = "human",
  overlay = true,
  renderer = "svg",
  className,
  ariaLabel = "pattern visualization",
}: PunchcardProps) {
  // Stub: if no explicit cells are provided, produce an empty grid placeholder.
  // Phase 5 wires @strudel/draw to produce real cells from `pattern`.
  const safeCells = cells ?? [];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-1",
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label={ariaLabel}
      data-renderer={renderer}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="block"
      >
        {safeCells.map((cell) => {
          const fill = AUTHOR_FILL[cell.authorship ?? authorship];
          const alpha = cell.intensity ?? 1;
          return (
            <rect
              key={`${cell.x}-${cell.y}`}
              x={cell.x}
              y={cell.y}
              width={8}
              height={8}
              fill={fill}
              opacity={alpha}
            />
          );
        })}
      </svg>
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-text) 0.5px, transparent 0.5px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}
    </div>
  );
}
```

### Phase 5/6 integration notes (for the builder)
- `@strudel/draw` is a client-side library. Server render path requires a Node-compatible headless evaluator or a pre-computed `cells[]` payload produced at build time / API time.
- For OG cards, use Next.js OG Image API + the `cells` prop — do not try to load `@strudel/draw` in the edge runtime.
- The dither overlay is a pure CSS background (no image file). Do not replace with a PNG.
- When `@strudel/draw` produces a canvas, colorize post-hoc by mapping its palette indices to the three authorship tokens — do not use Strudel's default colors.
- Accessibility: punchcards are decorative by default. When a punchcard is the primary content (e.g. `/p/[id]` hero), set a meaningful `ariaLabel` describing the pattern.
