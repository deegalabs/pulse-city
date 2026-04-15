# ui/button.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/ui/button.tsx`
> Category: UI primitive
> Status: spec — builder implements in Phase 5

## Purpose
The bracketed-grammar action primitive. Every interactive action in pulse.city wears brackets: `[ SAVE ]`, `[ LIVE ]`, `[ AGENT ]`. The brackets are not chrome — they are the language. This component is the only legitimate source of bracketed action labels across the product.

## Hard rules
- **Bracketed label only.** The children of `<Button>` are always wrapped in `[ ... ]`. If you need a plain action label, use a different primitive.
- **Space Mono uppercase, `tracking-[0.12em]`.** Always.
- **Font size is `--text-micro` or `--text-micro-sm`.** Never larger. Buttons are chrome.
- **No shadows.** No gradients. No border-radius above `--radius-md` (4px).
- **`agent` variant is forbidden on `surface-1` and `surface-2`.** It only renders on `base` (`#0a0e17`). The builder must enforce this at the type level where practical, and with a runtime dev-mode warning otherwise.
- **Hover is bracket-fill.** Background: transparent → variant color. Text: variant color → base (`#0a0e17`). 120ms.
- **Active: `translate-y-[1px]` 100ms.** The button drops 1px on press. That is the only tactile feedback.
- **Focus-visible: 1px outline `--color-listener`, 2px offset.** Never a glow, never a double ring.
- **No disabled state shadow or pattern fill.** Disabled = `opacity-40`, `cursor-not-allowed`, hover suppressed.

## Variants

| variant | border | text (rest) | bg (hover) | text (hover) | surface constraint |
|---|---|---|---|---|---|
| `primary` | `creator` | `creator` | `creator` | `base` | any |
| `secondary` | `border` (glass-line) | `text` | `surface-2` | `text` | any |
| `agent` | `agent` | `agent` | `agent` | `base` | **base only** |
| `destructive` | `destructive` | `destructive` | `destructive` | `base` | any |

`primary` is the default and should be used for the main action on a screen. `secondary` is the neutral alternate — never as the primary action, never more than 2 per screen. `agent` is the agent-as-actor voice — rare, reserved for "the DJ did something." `destructive` is for delete/leave/end-session; max one per screen per yml.

## Sizes

| size | font-size var | padding-x | padding-y |
|---|---|---|---|
| `sm` | `--text-micro` (11px) | `px-2.5` | `py-1` |
| `md` | `--text-micro-sm` (12px) | `px-3.5` | `py-1.5` |
| `lg` | `--text-micro-sm` (12px) | `px-5` | `py-2.5` |

`md` is the default. `sm` is for dense toolbars (TransportBar). `lg` is for hero CTAs — use sparingly.

## Props

```ts
import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { buttonVariants } from "./button"; // self-import for type pull

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode; // wrapped in [ ... ] at render time
    bracketed?: boolean;       // default true — set false only for embed contexts
  };
```

## Reference implementation

```tsx
// src/components/ui/button.tsx
//
// The bracketed action primitive. Labels are wrapped in [ ... ] by default.
// Use `bracketed={false}` only in embeds where the bracket grammar is absent.
//
"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  // base
  [
    "inline-flex items-center justify-center select-none",
    "font-micro uppercase tracking-[0.12em] leading-none",
    "rounded-[var(--radius-md)] border",
    "transition-[background-color,color,transform] duration-[120ms] ease-out",
    "active:translate-y-[1px] active:duration-[100ms]",
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-listener",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "border-creator text-creator bg-transparent hover:bg-creator hover:text-base",
        secondary:
          "border-border text-text bg-transparent hover:bg-surface-2 hover:text-text",
        // agent: forbidden on surface-1 / surface-2 — render on base only.
        agent:
          "border-agent text-agent bg-transparent hover:bg-agent hover:text-base",
        destructive:
          "border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-base",
      },
      size: {
        sm: "text-micro px-2.5 py-1",
        md: "text-micro-sm px-3.5 py-1.5",
        lg: "text-micro-sm px-5 py-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    bracketed?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, bracketed = true, children, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production" && variant === "agent") {
      // Dev-mode reminder. Static checks live in the call-site surface wrapper.
      // eslint-disable-next-line no-console
      console.debug(
        "[Button] agent variant — verify parent surface is --color-base (#0a0e17)."
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {bracketed ? (
          <>
            <span aria-hidden="true" className="mr-1.5">[</span>
            <span>{children}</span>
            <span aria-hidden="true" className="ml-1.5">]</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
```

### Notes for the builder
- `class-variance-authority` must be installed: `pnpm add class-variance-authority`.
- The brackets are visual, not part of the accessible name — `aria-hidden` on the bracket spans keeps screen readers reading only the action verb.
- The hover bracket-fill is an entire background fill, not an animation of the brackets alone. If a future variant wants bracket-only hover, spec it separately.
- The `agent` variant dev warning is a reminder, not a guardrail. The real guardrail is code review: agent buttons live only inside `/base` surface wrappers.
- Do not compose with `asChild` in Phase 5 — if the project needs link-styled buttons later, add a separate `ButtonLink` primitive rather than pulling in Radix Slot.
