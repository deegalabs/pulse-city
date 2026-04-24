"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SNIPPETS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  filterSnippets,
  type Snippet,
  type SnippetCategory,
} from "@/lib/snippets";

interface SnippetsPaletteProps {
  open: boolean;
  onClose: () => void;
  onInsert: (snippet: Snippet) => void;
}

export function SnippetsPalette({ open, onClose, onInsert }: SnippetsPaletteProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SnippetCategory | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => filterSnippets(query, category),
    [query, category]
  );

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCategory(null);
    setActiveIndex(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, category]);

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
      onInsert(results[activeIndex]);
      onClose();
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
        className="bg-surface-1 border border-white/10 w-full max-w-2xl max-h-[75dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-dim shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search snippets — drums, bass, acid, jazz…"
            className="flex-1 bg-transparent outline-none font-mono text-sm text-text placeholder:text-text-dim"
          />
          <span className="font-micro text-[9px] tracking-widest text-text-dim uppercase shrink-0">
            {results.length} / {SNIPPETS.length}
          </span>
        </div>

        {/* Category chips */}
        <div className="flex gap-1 px-4 py-2 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setCategory(null)}
            className={`font-micro text-[9px] tracking-widest uppercase px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
              category === null
                ? "bg-creator/10 border-creator text-creator"
                : "bg-transparent border-white/10 text-text-dim hover:text-text"
            }`}
          >
            All
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? null : cat)}
              className={`font-micro text-[9px] tracking-widest uppercase px-2 py-1 border whitespace-nowrap cursor-pointer transition-colors ${
                category === cat
                  ? "bg-creator/10 border-creator text-creator"
                  : "bg-transparent border-white/10 text-text-dim hover:text-text"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center font-micro text-[10px] tracking-widest text-text-dim">
              No snippets match.
            </div>
          ) : (
            <ul>
              {results.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <li key={s.id} data-index={i}>
                    <button
                      onClick={() => {
                        onInsert(s);
                        onClose();
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-4 py-2.5 border-b border-white/5 flex items-start gap-3 transition-colors cursor-pointer ${
                        active ? "bg-surface-2" : "hover:bg-surface-2/50"
                      }`}
                    >
                      <span
                        className={`font-micro text-[8px] tracking-widest uppercase px-1.5 py-0.5 mt-0.5 border shrink-0 ${
                          active
                            ? "border-creator/50 text-creator"
                            : "border-white/10 text-text-dim"
                        }`}
                      >
                        {CATEGORY_LABELS[s.category]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-micro text-[11px] tracking-widest text-text uppercase">
                          {s.label}
                        </div>
                        <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5 truncate">
                          {s.description}
                        </div>
                      </div>
                      {active && (
                        <span className="font-micro text-[9px] tracking-widest text-creator shrink-0">
                          ↵ INSERT
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 font-micro text-[9px] tracking-widest text-text-dim uppercase">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="text-text">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="text-text">↵</kbd> insert
            </span>
            <span>
              <kbd className="text-text">esc</kbd> close
            </span>
          </div>
          <span>inserts at cursor</span>
        </div>
      </div>
    </div>
  );
}
