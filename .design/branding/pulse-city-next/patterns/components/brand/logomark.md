# brand/logomark.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/brand/logomark.tsx`
> Category: brand primitive
> Status: spec — builder implements in Phase 5

## Purpose
The pulse.city mark. A 3×7 punchcard of 21 circles. Row 2 column 4 (the geometric and optical center) is the **listener sky** dot — "the place is awake, and it remembers you were here." The only dot that may animate is the center one.

## Canonical geometry
- viewBox: `0 0 112 20`
- rows (cy): `[2, 10, 18]`
- cols (cx): `[8, 24, 40, 56, 72, 88, 104]`
- radius: `3`
- 3 × 7 = 21 circles exactly. No more. No less.
- Gap between cells: 16px. Outer padding: 8px.

## Props

```ts
type LogomarkProps = {
  size?: "sm" | "md" | "lg" | "xl"; // 16 / 24 / 48 / 112 px height
  variant?: "full" | "mono" | "inverted";
  animated?: boolean; // default true — animates center dot with pulse-dot
  className?: string;
  "aria-label"?: string; // default "pulse.city"
};
```

### Size rules
| size | height | width (full) | grid used |
|---|---|---|---|
| `sm` | 16 | ~40 | **5×3 crop** — drop cols 0 and 6, so 5×3 = 15 circles |
| `md` | 24 | ~60 | 5×3 crop |
| `lg` | 48 | ~120 | full 7×3 = 21 circles |
| `xl` | 112 | ~280 | full 7×3 = 21 circles |

At `sm` the outer columns become visually indistinguishable from the frame, so the 5-wide crop is the canonical compact mark.

### Variant rules

| variant | outer frame (12 dots) | inner (8 dots) | center (1 dot) |
|---|---|---|---|
| `full` | `var(--color-text)` | `var(--color-text-dim)` | `var(--color-listener)` |
| `mono` | `var(--color-text)` | `var(--color-text)` | `var(--color-text)` |
| `inverted` | `var(--color-base)` | `var(--color-base)` | `var(--color-base)` on `--color-signal-warn` background |

- Use `full` on product chrome, website body, app surfaces.
- Use `mono` inside color fields where the sky dot would clash (e.g. on `bg-creator` hero).
- Use `inverted` on amber signal-warn backgrounds (rare — one per screen max).
- `text-dim` inner dots are 4.1:1 AA Large — **do not ship `full` at under 24px** (fails contrast at micro sizes). The `sm` size should use `mono` by default.

## Center dot = the only animated element
`animated={true}` (default) applies `animate-pulse-dot` to the center `<circle>` only. Never animate the frame. Never animate all 21 dots. The identity is: the room breathes from the middle.

## ASCII fallback
A code-block ASCII form is rendered as a doc comment at the top of the component file, for plain-text contexts and OG card fallbacks:

```
. . . . . . .
. . . o . . .
. . . . . . .
```

Where `o` is `--color-listener` and `.` is `--color-text-dim` / `--color-text`.

## Reference implementation

```tsx
// src/components/brand/logomark.tsx
//
// pulse.city mark — 3×7 punchcard, center dot = listener sky.
// ASCII:
//   . . . . . . .
//   . . . o . . .
//   . . . . . . .
//
import { cn } from "@/lib/utils";

type LogomarkProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "mono" | "inverted";
  animated?: boolean;
  className?: string;
  "aria-label"?: string;
};

const SIZES: Record<NonNullable<LogomarkProps["size"]>, { h: number; cropped: boolean }> = {
  sm: { h: 16, cropped: true },
  md: { h: 24, cropped: true },
  lg: { h: 48, cropped: false },
  xl: { h: 112, cropped: false },
};

const ROWS = [2, 10, 18] as const;
const COLS_FULL = [8, 24, 40, 56, 72, 88, 104] as const;
const COLS_CROP = [24, 40, 56, 72, 88] as const;

export function Logomark({
  size = "md",
  variant = "full",
  animated = true,
  className,
  "aria-label": ariaLabel = "pulse.city",
}: LogomarkProps) {
  const { h, cropped } = SIZES[size];
  const cols = cropped ? COLS_CROP : COLS_FULL;
  const vbW = cropped ? 96 : 112; // trimmed viewBox when cropped
  const vbX = cropped ? 16 : 0;

  const frameFill =
    variant === "inverted" ? "var(--color-base)" : "var(--color-text)";
  const innerFill =
    variant === "full"
      ? "var(--color-text-dim)"
      : variant === "mono"
      ? "var(--color-text)"
      : "var(--color-base)";
  const centerFill =
    variant === "full"
      ? "var(--color-listener)"
      : variant === "mono"
      ? "var(--color-text)"
      : "var(--color-base)";

  const centerCx = 56;
  const centerCy = 10;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`${vbX} 0 ${vbW} 20`}
      height={h}
      width={(h * vbW) / 20}
      className={cn("shrink-0", className)}
    >
      {ROWS.map((cy, rowIdx) =>
        cols.map((cx) => {
          const isCenter = cx === centerCx && cy === centerCy;
          const isFrame = rowIdx === 0 || rowIdx === 2 || cx === cols[0] || cx === cols[cols.length - 1];
          const fill = isCenter ? centerFill : isFrame ? frameFill : innerFill;
          return (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={3}
              fill={fill}
              className={isCenter && animated ? "animate-pulse-dot origin-center" : undefined}
              style={isCenter && animated ? { transformBox: "fill-box" } : undefined}
            />
          );
        })
      )}
    </svg>
  );
}
```

### Notes for the builder
- `transformBox: "fill-box"` is required so the pulse animation scales around the dot center, not the SVG origin.
- `animate-pulse-dot` is the token-level animation emitted by the `@theme` block (see `token-mapping.md` §3). If Tailwind 4 does not auto-generate the utility, fall back to `animate-[pulse-dot_1.5s_ease-in-out_infinite]`.
- `mono` variant at `size="sm"` is the correct default for anything under 24px (contrast).
- Never use the `inverted` variant outside a signal-warn amber background — it is the only case where the mark sits on a warm field.
