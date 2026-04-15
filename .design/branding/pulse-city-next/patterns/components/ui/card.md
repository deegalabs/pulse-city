# ui/card.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/ui/card.tsx`
> Category: UI primitive
> Status: spec — builder implements in Phase 5

## Purpose
Surface containers. pulse.city has **no shadows**, so elevation is expressed entirely by which surface tier a card sits in — `surface-1` is the default field, `surface-2` is "lifted," and `surface-3` is the /radio quiet tier (no dither allowed). A Card is how you move up or down the tier ramp.

Cards in this brand are **not decorative**. They are the container that says "this region of the page is a distinct surface." They do not carry shadows, gradients, borders-on-borders, or ASCII frames.

## Hard rules
- **Three tiers. No more.** `default` (surface-1), `elevated` (surface-2), `quiet` (surface-3, /radio only).
- **Single border.** Always `1px solid var(--color-border)`. Never a second nested border. Never a double-ring.
- **No shadows.** If a surface needs to feel "raised," move it to the next tier — never add a drop shadow.
- **Radius is `--radius-md` (4px) max.** Never `rounded-lg` or higher.
- **Header border is optional and bottom-only.** `CardHeader` may carry `border-b border-border`; never `border-t`, never top + bottom, never side dividers.
- **No ASCII frames.** The brand rejects terminal ASCII chrome. The border is the chrome.
- **`CardTitle` uses `font-display` (Chakra Petch 700) at `text-subheading` (20px) minimum.** Below 20px, a Card has no title — just content.
- **text-dim is forbidden inside Cards below 14px.** `CardContent` default text is `text-body` (16px) or `text-body-sm` (14px); never `text-caption` or `text-micro` unless wrapping in `font-micro` for an explicit chrome label.
- **`quiet` tier has no dither.** The /radio surface forbids texture. The builder must never paint a dither overlay over a `quiet` Card.

## Variants

| variant | background | border | dither allowed | use |
|---|---|---|---|---|
| `default` | `surface-1` (#111827) | `border` | yes (6% opacity tile) | default body card, /studio tool panels, /p editorial blocks |
| `elevated` | `surface-2` (#1e293b) | `border` | yes | nested cards, sidebar panels, dialog-adjacent surfaces |
| `quiet` | `surface-3` (#2a3347) | `border` | **no** | /radio surface only |

## Compound parts
Following the shadcn pattern — every part is a named export. They compose freely.

- `Card` — the outer container
- `CardHeader` — padded region at the top, optional `border-b`
- `CardTitle` — `font-display` 700 at `text-subheading`
- `CardDescription` — `text-text-muted`, `text-body-sm`
- `CardContent` — the body region (no padding collapse with header)
- `CardFooter` — bottom region, usually hosts Buttons

None of these carry their own background. All of them inherit from the `Card` variant.

## Props

```ts
import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cardVariants } from "./card";

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;
```

## Reference implementation

```tsx
// src/components/ui/card.tsx
//
// Surface-tiered container. No shadows — elevation via surface ramp.
// Compound parts: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
//
import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  [
    "relative flex flex-col",
    "border border-border rounded-[var(--radius-md)]",
    "text-text",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-surface-1",
        elevated: "bg-surface-2",
        // quiet: /radio only. Dither overlays are forbidden on this tier.
        quiet: "bg-surface-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      data-surface={variant ?? "default"}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1.5 px-5 py-4",
        // Header border is optional — opt in with `border-b` at the call site
        // or by passing `className="border-b border-border"`.
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display font-bold leading-tight tracking-tight text-text",
      "text-subheading", // 20px floor
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-body text-body-sm text-text-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-5 py-4 font-body text-body text-text", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-5 py-3 border-t border-border",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
```

### Notes for the builder
- The header `border-b` is opt-in at the call site — it is not in the default class list. Reason: many cards have a title row that flows into the content without a dividing line.
- The footer `border-t` is opt-in in the same way — remove it when the footer is flush with content.
- `data-surface` is a debug hook. It is useful in DevTools to verify that a `quiet` card never sits inside a `default` card (a visual inversion the brand forbids).
- Never nest a `Card variant="default"` inside a `Card variant="default"` — the tier is meant to signal change. If you need a sub-region without a tier change, use a plain `<div>`.
- `quiet` variant: paint no dither, place no pulse-dot, render no bracketed buttons. The /radio surface is the brand's still tier — only the scope moves.
- For padded-but-borderless sub-sections inside a CardContent, use a plain `<section className="py-3">` rather than another Card.
- The `text-title` / `text-subheading` token naming follows `pulse-city.yml` §type-scale. If the yml renames the step, update this file as well — the mapping is not hardcoded anywhere else.
