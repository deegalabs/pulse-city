export type DiffKind = "kept" | "added" | "removed";

export interface DiffLine {
  kind: DiffKind;
  text: string;
  oldNum?: number;
  newNum?: number;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

/**
 * Line-based Longest Common Subsequence diff.
 * Good enough for Strudel code, which is typically <50 lines.
 */
export function diffLines(oldText: string, newText: string): {
  lines: DiffLine[];
  stats: DiffStats;
} {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const m = oldLines.length;
  const n = newLines.length;

  // Build LCS matrix
  const lcs: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }
  }

  // Walk the matrix to produce a diff
  const out: DiffLine[] = [];
  const stats: DiffStats = { added: 0, removed: 0, unchanged: 0 };
  let i = 0;
  let j = 0;
  let oldNum = 1;
  let newNum = 1;

  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      out.push({ kind: "kept", text: oldLines[i], oldNum, newNum });
      stats.unchanged++;
      i++;
      j++;
      oldNum++;
      newNum++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ kind: "removed", text: oldLines[i], oldNum });
      stats.removed++;
      i++;
      oldNum++;
    } else {
      out.push({ kind: "added", text: newLines[j], newNum });
      stats.added++;
      j++;
      newNum++;
    }
  }
  while (i < m) {
    out.push({ kind: "removed", text: oldLines[i], oldNum });
    stats.removed++;
    i++;
    oldNum++;
  }
  while (j < n) {
    out.push({ kind: "added", text: newLines[j], newNum });
    stats.added++;
    j++;
    newNum++;
  }

  return { lines: out, stats };
}

export function hasChanges(stats: DiffStats): boolean {
  return stats.added > 0 || stats.removed > 0;
}
