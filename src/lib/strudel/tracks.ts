export interface TrackLine {
  index: number; // zero-based index within the code
  lineNumber: number; // 1-based line number for editor jumping
  raw: string; // full line including comment prefix
  expression: string; // just the part after `$:`
  muted: boolean; // starts with `//`
  preview: string; // first ~40 chars of expression for display
}

const TRACK_LINE_RE = /^(\s*)(\/\/\s*)?\$:(.*)$/;

/**
 * Parse a Strudel session into its `$:` track lines.
 * A track is either live (`$: ...`) or muted (`// $: ...`).
 *
 * Everything else (blank lines, comments without $:, top-level expressions)
 * is ignored — the track surface only shows what the scheduler treats as
 * independent patterns.
 */
export function parseTrackLines(code: string): TrackLine[] {
  const lines = code.split("\n");
  const tracks: TrackLine[] = [];
  lines.forEach((raw, i) => {
    const match = raw.match(TRACK_LINE_RE);
    if (!match) return;
    const muted = !!match[2];
    const expression = match[3].trim();
    tracks.push({
      index: tracks.length,
      lineNumber: i + 1,
      raw,
      expression,
      muted,
      preview: expression.length > 44 ? expression.slice(0, 44) + "…" : expression,
    });
  });
  return tracks;
}

/**
 * Toggle mute on the line at the given 1-based line number. Returns the new
 * full code string. If the line doesn't look like a `$:` track, returns the
 * original code unchanged.
 */
export function toggleMuteAtLine(code: string, lineNumber: number): string {
  const lines = code.split("\n");
  const idx = lineNumber - 1;
  if (idx < 0 || idx >= lines.length) return code;
  const raw = lines[idx];
  const match = raw.match(TRACK_LINE_RE);
  if (!match) return code;
  const [, indent, commentPrefix, rest] = match;
  if (commentPrefix) {
    // currently muted — remove the // prefix
    lines[idx] = `${indent}$:${rest}`;
  } else {
    // currently live — add // prefix
    lines[idx] = `${indent}// $:${rest}`;
  }
  return lines.join("\n");
}

/**
 * Solo one track: mute every OTHER `$:` line, keep the target live.
 * If the target is currently muted, unmute it first.
 */
export function soloAtLine(code: string, lineNumber: number): string {
  const lines = code.split("\n");
  const idx = lineNumber - 1;
  if (idx < 0 || idx >= lines.length) return code;
  lines.forEach((raw, i) => {
    const match = raw.match(TRACK_LINE_RE);
    if (!match) return;
    const [, indent, commentPrefix, rest] = match;
    if (i === idx) {
      // Target: always live
      lines[i] = `${indent}$:${rest}`;
    } else {
      // Others: mute if not already
      if (!commentPrefix) {
        lines[i] = `${indent}// $:${rest}`;
      }
    }
  });
  return lines.join("\n");
}

/**
 * Remove a `$:` track line (and optionally its preceding blank line).
 */
export function deleteTrackAtLine(code: string, lineNumber: number): string {
  const lines = code.split("\n");
  const idx = lineNumber - 1;
  if (idx < 0 || idx >= lines.length) return code;
  lines.splice(idx, 1);
  // Collapse double blank lines left behind
  const cleaned = lines.join("\n").replace(/\n{3,}/g, "\n\n");
  return cleaned;
}

/**
 * Append a new empty `$:` track line to the end of the code. Returns the
 * new code plus the 1-based line number the new track occupies so callers
 * can focus it.
 */
export function appendEmptyTrack(code: string): { code: string; lineNumber: number } {
  const template = `$: s("bd*4").gain(.8)`;
  const trimmed = code.replace(/\n+$/, "");
  const next = trimmed ? `${trimmed}\n${template}` : template;
  return { code: next, lineNumber: next.split("\n").length };
}

/**
 * Unmute every `$:` line — useful to exit solo.
 */
export function unmuteAll(code: string): string {
  return code
    .split("\n")
    .map((raw) => {
      const match = raw.match(TRACK_LINE_RE);
      if (!match) return raw;
      const [, indent, commentPrefix, rest] = match;
      if (!commentPrefix) return raw;
      return `${indent}$:${rest}`;
    })
    .join("\n");
}
