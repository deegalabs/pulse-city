# ADR 001: StrudelMirror over custom textarea editor

**Date**: 2026-04-12
**Status**: accepted

## Context

The initial POC used a plain `<textarea>` with a `<pre>` overlay for syntax highlighting. This worked but lacked the native Strudel REPL features: inline pattern visualizations (`._scope()`, `._punchcard()`), mini-notation source location highlighting, and Ctrl+Enter evaluation.

## Decision

Replace the custom textarea editor with `StrudelMirror` from `@strudel/codemirror`, which wraps CodeMirror 6 with all Strudel-specific extensions.

## Consequences

**Positive:**
- Inline waveform (scope) and rhythm (punchcard) visualizations per `$:` block
- Live highlighting of active notes during playback
- Native Ctrl+Enter evaluation
- Proper syntax highlighting tied to mini-notation
- Line numbers, selection, undo/redo — all from CodeMirror

**Negative:**
- Heavier dependency tree (@strudel/codemirror + CodeMirror 6 + extensions)
- Required solving duplicate @strudel/core issue (see ADR 003)
- Less control over editor styling (must work within CodeMirror's theme system)
