# brand/wordmark.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/brand/wordmark.tsx`
> Category: brand primitive
> Status: spec — builder implements in Phase 5

## Purpose
Typographic lockup of the brand name. Two forms:
- `display` — `PULSE·CITY` (Chakra Petch 700, uppercase, listener sky middot)
- `prose` — `pulse.city` (lowercase, period separator, Chakra Petch 500)

The display form is the website hero. The prose form is everywhere the name appears inside a sentence.

## Hard rules
- **Minimum cap-height: 14px.** Below that, do not render the wordmark — render the Logomark alone.
- **Only the display form uses the middot.** The prose form uses a real period. Never mix.
- **Font family is always `--font-display` (Chakra Petch)** — the only place Chakra Petch appears below 1.25rem. This is the single exception to the display-font floor, because the wordmark is a logo, not body copy.
- **Letter-spacing is `-0.015em`** for the display form. Do not tighten or loosen.
- **Never animate the wordmark.** The room breathes through the logomark, not the letters.

## Props

```ts
type WordmarkProps = {
  form?: "display" | "prose";   // default "display"
  size?: "sm" | "md" | "lg";    // display: 20/32/56; prose: 14/16/20
  className?: string;
  as?: "span" | "h1" | "div";   // default "span"
};
```

### Size ramp
| size | display (px) | prose (px) |
|---|---|---|
| `sm` | 20 | 14 (floor) |
| `md` | 32 | 16 |
| `lg` | 56 | 20 |

## Reference implementation

```tsx
// src/components/brand/wordmark.tsx
//
// PULSE·CITY (display) — middot is listener sky.
// pulse.city  (prose)  — real period, no color accent.
//
import { cn } from "@/lib/utils";

type WordmarkProps = {
  form?: "display" | "prose";
  size?: "sm" | "md" | "lg";
  className?: string;
  as?: "span" | "h1" | "div";
};

const DISPLAY_SIZES = { sm: "text-[20px]", md: "text-[32px]", lg: "text-[56px]" } as const;
const PROSE_SIZES   = { sm: "text-[14px]", md: "text-[16px]", lg: "text-[20px]" } as const;

export function Wordmark({
  form = "display",
  size = "md",
  className,
  as: Tag = "span",
}: WordmarkProps) {
  if (form === "display") {
    return (
      <Tag
        className={cn(
          "font-display font-bold uppercase tracking-[-0.015em] leading-none text-text",
          DISPLAY_SIZES[size],
          className
        )}
        aria-label="pulse.city"
      >
        PULSE
        <span aria-hidden="true" className="text-listener">·</span>
        CITY
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(
        "font-display font-medium tracking-[-0.015em] leading-none text-text lowercase",
        PROSE_SIZES[size],
        className
      )}
    >
      pulse.city
    </Tag>
  );
}
```

### Notes for the builder
- The `<span aria-hidden="true">` around the middot keeps the accessible name as `pulse.city` (read as one word) while the visible glyph is `PULSE·CITY`.
- `leading-none` is required — otherwise Chakra Petch's default line-height pushes the wordmark into adjacent chrome.
- For `as="h1"`, pair with `size="lg"` only (H1 floor).
- Do not give the wordmark a background, border, or hover state. It is typography, not a button.
