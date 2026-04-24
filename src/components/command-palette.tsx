"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface Command {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  hint?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter((c) => {
    const haystack = `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      const cmd = results[activeIndex];
      onClose();
      cmd.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-xl max-h-[70dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <span className="font-micro text-[10px] tracking-widest text-creator uppercase shrink-0">
            ⌘
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Run a command…"
            className="flex-1 bg-transparent outline-none font-mono text-sm text-text placeholder:text-text-dim"
          />
          <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase shrink-0">
            {results.length}
          </span>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center font-micro text-[10px] tracking-widest text-text-dim">
              No commands match.
            </div>
          ) : (
            <ul>
              {results.map((c, i) => {
                const active = i === activeIndex;
                return (
                  <li key={c.id} data-index={i}>
                    <button
                      onClick={() => {
                        onClose();
                        c.run();
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-4 py-2.5 border-b border-white/5 flex items-center gap-3 transition-colors cursor-pointer ${
                        active ? "bg-surface-2" : "hover:bg-surface-2/50"
                      }`}
                    >
                      <span
                        className={`font-micro text-[8px] tracking-widest uppercase px-1.5 py-0.5 border shrink-0 ${
                          active
                            ? "border-creator/50 text-creator"
                            : "border-white/10 text-text-dim"
                        }`}
                      >
                        {c.group}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-micro text-[11px] tracking-widest text-text uppercase">
                          {c.label}
                        </div>
                        {c.hint && (
                          <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5 truncate">
                            {c.hint}
                          </div>
                        )}
                      </div>
                      {c.shortcut && (
                        <span className="font-mono text-[10px] text-text-dim shrink-0 whitespace-nowrap">
                          {c.shortcut}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 font-micro text-[9px] tracking-widest text-text-dim uppercase">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="text-text">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="text-text">↵</kbd> run
            </span>
            <span>
              <kbd className="text-text">esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
