# Sprint Alpha-04 — UI Polish + Responsive

**Goal**: Visual parity with POC, shadcn/ui, responsive
**Status**: planned

## Tasks

- [ ] Tailwind theme matching POC palette (navy/lime/sky/violet)
- [ ] shadcn/ui components: Button, Input, Dialog, Badge, ScrollArea
- [ ] Settings dialog (AI backend selector, API key, clear data)
- [ ] Ticker component (rotating city events)
- [ ] Presence counter (simulated, later Supabase Realtime)
- [ ] Responsive: mobile stacks vertically, autopilot-only on small screens
- [ ] Boot overlay animations
- [ ] Loading states and error boundaries
- [ ] Keyboard shortcuts (Ctrl+Enter, Escape for settings)

## Acceptance criteria

- Visually matches POC (dark theme, same colors, same layout)
- Works on mobile (autopilot + spectrum, no editor)
- Settings dialog opens/closes properly
- Smooth animations on mode switch
- No visual regressions from POC

## Technical notes

- shadcn/ui uses Tailwind + Radix primitives
- Mobile breakpoint: hide editor below 700px, show autopilot-only view
- Use `next/font/google` for font loading optimization
