# ui/dialog.md

> Pass 2 · Phase 4 · pulse-city-next
> Path: `src/components/ui/dialog.tsx`
> Category: UI primitive
> Status: spec — builder implements in Phase 5
> Base: `@radix-ui/react-dialog`

## Purpose
Modal overlay primitive. All heavy in-app panels (settings, login, patterns browser, agent intervention prompts) open through this primitive. Radix gives focus-trap, escape-to-close, and return-focus for free; the brand layer gives scrim, surface-1 container, and the 120ms opacity-only entrance per `pulse-city.yml` effects.dialog.

## Hard rules
- **Radix is the base.** The project installs `@radix-ui/react-dialog` as the one and only modal engine. Do not hand-roll portals, focus trapping, or escape handling.
- **Entrance motion: opacity 120ms ONLY.** No slide, no scale, no spring. The dialog does not "fly in." It fades in, 120ms, ease-out, done. This is a hard constraint from `pulse-city.yml` → `effects.dialog.duration_ms: 120` / `motion: fade`.
- **Backdrop: `var(--color-scrim)`.** Exactly `rgba(10, 14, 23, 0.72)`. Never black, never a blur, never a gradient.
- **Container surface: `bg-surface-1`.** Never `surface-2` (reserved for elevated in-page cards), never `base` (reserved for page body).
- **Border: `1px solid var(--color-border)`.** Radius `--radius-md` (4px).
- **No shadows.** The scrim is the elevation.
- **Max width: `max-w-[560px]` by default.** Larger dialogs are a warning sign — the brand prefers surfaces over modals.
- **Close affordance: one `DialogClose` per dialog.** Either the bracketed `[ CLOSE ]` button in the footer or the `×` in the top-right, not both. Default is the footer button; the `×` is only for dismissable-without-confirmation states.
- **motion-reduce: zero duration.** `motion-reduce:duration-0` applied to the content + overlay.
- **Never trap non-modal flows.** If a surface needs "temporary attention without focus capture," it is a `Card` with a backdrop, not a Dialog.

## Compound parts
Following the Radix + shadcn pattern — every part is a named export. Most are thin brand wrappers over `DialogPrimitive.*`.

- `Dialog` — the root (`DialogPrimitive.Root`)
- `DialogTrigger` — re-export of `DialogPrimitive.Trigger`
- `DialogPortal` — re-export of `DialogPrimitive.Portal`
- `DialogClose` — re-export of `DialogPrimitive.Close`
- `DialogOverlay` — the scrim
- `DialogContent` — the surface-1 container
- `DialogHeader` — padded top region with optional `border-b`
- `DialogTitle` — `font-display` 700 at `text-subheading`
- `DialogDescription` — `text-text-muted`, `text-body-sm`
- `DialogFooter` — bottom region, usually hosts a `[ CONFIRM ]` + `[ CANCEL ]` pair

## Install

```sh
pnpm add @radix-ui/react-dialog
```

## Reference implementation

```tsx
// src/components/ui/dialog.tsx
//
// Modal primitive. Radix base; brand layer adds scrim, surface-1, and the
// 120ms opacity-only entrance. No slide, no scale, no spring.
//
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Backdrop — exactly --color-scrim, nothing else.
      "fixed inset-0 z-50 bg-scrim",
      // Opacity-only motion, 120ms, ease-out. No blur transition.
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[120ms]",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[120ms]",
      "motion-reduce:duration-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-[92vw] max-w-[560px]",
        // Surface + chrome
        "bg-surface-1 border border-border rounded-[var(--radius-md)]",
        "p-0 text-text font-body",
        // Opacity-only motion. No slide, no scale, no spring.
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-[120ms]",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-[120ms]",
        "motion-reduce:duration-0",
        // Focus ring: none on container itself — DialogClose carries focus.
        "outline-none",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-5 py-4 border-b border-border",
        className
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-display font-bold leading-tight tracking-tight text-text",
      "text-subheading",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("font-body text-body-sm text-text-muted", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 text-body text-text", className)} {...props} />;
}
DialogBody.displayName = "DialogBody";

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 px-5 py-3 border-t border-border",
        className
      )}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";
```

## Minimal usage example

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">[ SETTINGS ]</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>
        Studio preferences. Autosaves on close.
      </DialogDescription>
    </DialogHeader>
    <DialogBody>{/* form fields */}</DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">[ CLOSE ]</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Notes for the builder
- The `animate-in` / `fade-in-0` utility names assume `tailwindcss-animate` is not installed. If it is, the class names above already match. If not, replace with a manual keyframe: `@keyframes pc-fade-in { from { opacity: 0; } to { opacity: 1; } }` and apply via arbitrary value `data-[state=open]:animate-[pc-fade-in_120ms_ease-out]`.
- Do **not** add `zoom-in-95` or `slide-in-from-bottom-4`. The brand forbids those motion shapes. Only fade.
- `DialogBody` is an extra compound part not present in shadcn's reference — it exists because the brand's dialogs almost always have a three-row layout (header / body / footer) and we want the body spacing as a named primitive, not an ad-hoc `<div>`.
- The scrim is `z-50`. If the app ever shows two stacked dialogs, that is a design smell — reconsider the flow instead of bumping z-index.
- The existing `SettingsOverlay`, `LoginModal`, and `PatternsModal` components in `src/components/` must eventually migrate to this primitive. That migration is **out of scope for Phase 4** — the specs above only define what they will target.
- When the Dialog opens, the first focusable child receives focus automatically (Radix default). Do not set `autoFocus` on anything inside — Radix handles it.
- Close-on-outside-click is enabled by default (Radix default). To force confirmation, pass `onPointerDownOutside={e => e.preventDefault()}` on `DialogContent` at the call site.
- `AGENTS.md` reminder: before touching `src/app/layout.tsx` to portal-mount anything Dialog-related, read `node_modules/next/dist/docs/` — the Next.js 16 app router has breaking changes around portals and the root layout that are not reflected in the assistant's training data.
