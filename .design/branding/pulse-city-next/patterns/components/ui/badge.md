# ui/badge.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/ui/badge.tsx`
> Category: UI primitive
> Status: spec — builder implements in Phase 5

## Purpose
Status chips. Small, uppercase, tracked-widest micro-labels that describe **the state of the room, the code, or the agent** — never an action. If a user can click it, it is not a Badge; it is a `Button`. The Badge is the visual form of pulse.city's single-signal constraint: a screen may display many rest states, but one and only one signal may be loudly firing.

## Hard rules
- **Status only. Never interactive.** No `onClick`, no `hover` visual response, no `cursor-pointer`. If the user presses a Badge, nothing happens.
- **Space Mono, uppercase, `tracking-[0.12em]`.** This is the micro-label grammar.
- **Always `text-micro` (12px) minimum.** The `ok`/text-dim variant enforces a `text-body-sm` (14px) floor because text-dim at 12px fails contrast on every surface tier.
- **Border: `1px solid currentColor`.** Background is transparent. The color is the message.
- **No icons inside.** The Badge is type-only. For icon + label, compose with a neighbouring Lucide `<Icon />` element outside the Badge.
- **No shadows, no radius above `--radius-sm` (2px).**
- **At most one `live` badge per screen.** Enforced in review, not code. The yml constraint is `signal.max_per_screen: 1`.
- **`agent` variant is forbidden on `surface-1` and `surface-2`.** Agent on chrome only, per the warmed-violet contrast budget (3.6:1). Same rule as the Button primitive.

## Variants

| variant | color | bracketed default | use |
|---|---|---|---|
| `live` | `creator` (lime) | false | "the room is awake" — header status pill on /studio + /radio |
| `playing` | `creator` (lime) | false | "audio is playing" — near the transport, pairs with a pulse-dot |
| `agent` | `agent` (warmed violet) | true | "the DJ is speaking / thinking" — chrome only |
| `autopilot` | `agent` (warmed violet) | false | "/studio is in AI autopilot mode" — chrome only |
| `ok` | `text-dim` | true | "saved", "ready", "idle" — least loud, 14px floor |
| `err` | `destructive` (red) | true | "failed to save", "disconnected" — rare, one per screen |

`bracketed default` above applies when the caller does not pass `bracketed` explicitly. Opt out or in per call site with the `bracketed` prop.

## Sizes
The Badge has **one size** by default (`text-micro` = 12px). The only exception is the `ok` variant, which upshifts to `text-body-sm` (14px) to clear the text-dim contrast floor.

| variant | font size | padding |
|---|---|---|
| `live` / `playing` / `agent` / `autopilot` / `err` | `text-micro` (12px) | `px-2 py-0.5` |
| `ok` | `text-body-sm` (14px) | `px-2 py-0.5` |

## Props

```ts
import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { badgeVariants } from "./badge";

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    children: React.ReactNode;
    bracketed?: boolean; // default depends on variant — see table above
  };
```

## Reference implementation

```tsx
// src/components/ui/badge.tsx
//
// Status-only micro-label. Never a button.
// Variants: live / playing / agent / autopilot / ok / err.
//
// Forbidden: onClick, hover, cursor-pointer, icons inside, more than one `live`
// badge on a screen at a time.
//
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  [
    "inline-flex items-center select-none",
    "font-micro uppercase tracking-[0.12em] leading-none",
    "border rounded-[var(--radius-sm)] bg-transparent",
    "px-2 py-0.5",
  ].join(" "),
  {
    variants: {
      variant: {
        live: "text-creator border-creator",
        playing: "text-creator border-creator",
        // agent: render on --color-base surfaces only.
        agent: "text-agent border-agent",
        autopilot: "text-agent border-agent",
        // ok: text-dim fails contrast under 14px — upshift to text-body-sm.
        ok: "text-text-dim border-text-dim text-body-sm",
        err: "text-destructive border-destructive",
      },
      size: {
        // The only size. Exists so cva has a key; Badge does not expose this.
        default: "text-micro",
      },
    },
    compoundVariants: [
      // ok enforces its own size — the base default does not apply.
      { variant: "ok", size: "default", class: "text-body-sm" },
    ],
    defaultVariants: {
      variant: "live",
      size: "default",
    },
  }
);

const BRACKETED_BY_DEFAULT: Record<
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>,
  boolean
> = {
  live: false,
  playing: false,
  agent: true,
  autopilot: false,
  ok: true,
  err: true,
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    bracketed?: boolean;
  };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "live", bracketed, children, ...props }, ref) => {
    const v = variant ?? "live";
    const bracket = bracketed ?? BRACKETED_BY_DEFAULT[v];

    if (process.env.NODE_ENV !== "production" && (v === "agent" || v === "autopilot")) {
      // eslint-disable-next-line no-console
      console.debug(
        "[Badge] agent/autopilot variant — verify parent surface is --color-base."
      );
    }

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant: v }), className)}
        role="status"
        {...props}
      >
        {bracket ? (
          <>
            <span aria-hidden="true" className="mr-1.5">[</span>
            <span>{children}</span>
            <span aria-hidden="true" className="ml-1.5">]</span>
          </>
        ) : (
          children
        )}
      </span>
    );
  }
);
Badge.displayName = "Badge";
```

### Notes for the builder
- `role="status"` is set by default. For live-region announcements (e.g. "[ ERR ] failed to save"), add `aria-live="polite"` at the call site — do not hardcode it into the primitive.
- `live` and `playing` are visually identical (both use `creator`). The split exists for semantic clarity at call sites and to allow future divergence (e.g. `playing` may pair with a `pulse-dot` child; `live` never does).
- `playing` typically appears next to an inline `<span className="animate-pulse-dot">•</span>` — the dot is not part of the Badge because the Badge is type-only.
- The `ok` variant is the quiet idle badge. It is acceptable for every card to show a single `[ OK ]` at 14px. It is not acceptable for a card to show two different ok-tier badges; consolidate.
- Never use the Badge as a count indicator (`3 new`). Use a plain `<span>` in `font-mono` for numeric chrome.
- Do not extend the variant list without updating `pulse-city.yml` and the STYLE.md state vocabulary. Today the room has six status words. That is enough.
