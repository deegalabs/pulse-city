# ADR 003: Vite resolve.dedupe for @strudel/core

**Date**: 2026-04-12
**Status**: accepted

## Context

When using multiple `@strudel/*` packages, `@strudel/web`'s dist bundles its own copy of `@strudel/core` inline, while `@strudel/codemirror`'s dist imports `@strudel/core` as an external dependency. This creates two separate `Pattern` classes.

The `repl()` function from `@strudel/core` sets `Pattern.prototype.p` (needed for `$:` block syntax) on one Pattern class, but the eval scope uses a different Pattern class — causing `.p is not a function` errors.

## Decision

1. Install individual `@strudel/*` packages as direct dependencies instead of using the `@strudel/web` barrel
2. Import from individual packages (`@strudel/core`, `@strudel/transpiler`, `@strudel/webaudio`)
3. Use `resolve.dedupe` in Vite config to ensure all packages resolve to the same `@strudel/core`

## Alternatives considered

- **Exclude all from optimizeDeps**: Failed because transitive CJS deps (escodegen, chord-voicings) don't have proper ESM exports
- **Include all in optimizeDeps**: Vite pre-bundles each separately, still creates duplicates
- **Import everything from @strudel/web**: The barrel re-export of @strudel/tonal pulls in chord-voicings which has broken ESM default export

## Consequences

More packages in package.json but reliable single-instance Pattern class across all modules.
