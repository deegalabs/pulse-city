"use client";

import { useMemo, useState } from "react";
import { diffLines, hasChanges } from "@/lib/diff";

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
  previewing?: boolean;
  applied?: boolean;
  onListen?: () => void;
  onKeep?: () => void;
  onReject?: () => void;
}

export function CodeDiff({
  oldCode,
  newCode,
  previewing,
  applied,
  onListen,
  onKeep,
  onReject,
}: CodeDiffProps) {
  const [expanded, setExpanded] = useState(false);

  const { lines, stats } = useMemo(() => diffLines(oldCode, newCode), [oldCode, newCode]);
  const changed = hasChanges(stats);

  // Visible lines: collapse long unchanged sections unless expanded
  const visibleLines = useMemo(() => {
    if (expanded || lines.length <= 24) return lines.map((l, i) => ({ line: l, index: i }));
    // Keep changed lines + 1 line of context on each side
    const marked = new Set<number>();
    lines.forEach((l, i) => {
      if (l.kind !== "kept") {
        marked.add(i);
        marked.add(i - 1);
        marked.add(i + 1);
      }
    });
    return lines
      .map((line, index) => ({ line, index }))
      .filter(({ index }) => marked.has(index));
  }, [lines, expanded]);

  const needsCollapse = !expanded && visibleLines.length < lines.length;

  return (
    <div className="mt-2 border border-white/10 bg-base/60 rounded overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-1 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase shrink-0">
            Diff
          </span>
          {changed ? (
            <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
              <span className="text-creator">+{stats.added}</span>
              <span className="text-destructive">-{stats.removed}</span>
              <span className="text-text-dim">~{stats.unchanged}</span>
            </div>
          ) : (
            <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase">
              No change
            </span>
          )}
          {previewing && (
            <span className="font-micro text-[9px] tracking-widest text-listener uppercase inline-flex items-center gap-1 shrink-0">
              <span className="w-1 h-1 bg-listener rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
              Listening
            </span>
          )}
          {applied && (
            <span className="font-micro text-[9px] tracking-widest text-creator uppercase shrink-0">
              Kept
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {changed && (
            <>
              {!applied && (
                <button
                  onClick={onListen}
                  className={`font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border cursor-pointer transition-colors ${
                    previewing
                      ? "bg-listener/15 border-listener text-listener"
                      : "border-listener/40 text-listener hover:bg-listener/10"
                  }`}
                  title="Preview the proposed code live"
                >
                  {previewing ? "▪ Stop" : "▶ Listen"}
                </button>
              )}
              {!applied && (
                <button
                  onClick={onKeep}
                  className="font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border border-creator/40 text-creator hover:bg-creator/10 cursor-pointer transition-colors"
                  title="Apply this change"
                >
                  ✓ Keep
                </button>
              )}
              {!applied && (
                <button
                  onClick={onReject}
                  className="font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border border-white/10 text-text-dim hover:text-text hover:border-white/20 cursor-pointer transition-colors"
                  title="Discard this change"
                >
                  ✕ Reject
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lines */}
      <div className="font-mono text-[11px] leading-relaxed overflow-x-auto">
        {visibleLines.map(({ line, index }) => {
          const marker =
            line.kind === "added" ? "+" : line.kind === "removed" ? "-" : " ";
          const textClass =
            line.kind === "added"
              ? "text-creator"
              : line.kind === "removed"
                ? "text-destructive"
                : "text-text-dim";
          const bgClass =
            line.kind === "added"
              ? "bg-creator/5"
              : line.kind === "removed"
                ? "bg-destructive/5"
                : "";
          return (
            <div
              key={`${line.kind}-${index}`}
              className={`px-3 flex items-start gap-3 ${bgClass}`}
            >
              <span className="text-text-dim/60 w-8 text-right shrink-0 select-none">
                {line.newNum ?? line.oldNum ?? ""}
              </span>
              <span className={`w-3 shrink-0 select-none ${textClass}`}>{marker}</span>
              <span className={`whitespace-pre ${textClass}`}>{line.text}</span>
            </div>
          );
        })}
        {needsCollapse && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full px-3 py-1 text-center font-micro text-[9px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer border-t border-white/5"
          >
            Show all {lines.length} lines
          </button>
        )}
      </div>
    </div>
  );
}
