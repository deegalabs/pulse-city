"use client";

import { useState, useEffect, useCallback } from "react";

interface PatternSummary {
  id: string;
  title: string;
  mode: string;
  is_public: boolean;
  updated_at: string;
}

interface PatternsModalProps {
  open: boolean;
  onClose: () => void;
  onLoad: (pattern: { id: string; title: string; code: string; mode: string }) => void;
}

export function PatternsModal({ open, onClose, onLoad }: PatternsModalProps) {
  const [patterns, setPatterns] = useState<PatternSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatterns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/patterns");
      if (!res.ok) {
        setError(res.status === 401 ? "Sign in to load patterns" : "Failed to load");
        return;
      }
      setPatterns(await res.json());
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchPatterns();
  }, [open, fetchPatterns]);

  if (!open) return null;

  async function handleLoad(id: string) {
    try {
      const res = await fetch(`/api/patterns/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      onLoad({ id: data.id, title: data.title, code: data.code, mode: data.mode });
      onClose();
    } catch {
      setError("Failed to load pattern");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this pattern?")) return;
    await fetch(`/api/patterns/${id}`, { method: "DELETE" });
    setPatterns((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleShare(id: string) {
    const res = await fetch(`/api/patterns/${id}/share`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setPatterns((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_public: data.is_public } : p))
      );
      if (data.share_url) {
        navigator.clipboard.writeText(`${window.location.origin}${data.share_url}`);
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 rounded-sm w-full max-w-md mx-4 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
            PATTERNS
          </span>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text cursor-pointer transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-4 px-4 pt-3 border-b border-white/10">
          <button className="font-micro text-[10px] tracking-widest uppercase text-creator border-b-2 border-creator pb-2 cursor-pointer">
            MY PATTERNS
          </button>
          <button
            className="font-micro text-[10px] tracking-widest uppercase text-text-dim pb-2 cursor-pointer hover:text-text-muted transition-colors"
            disabled
          >
            COMMUNITY
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase animate-pulse">
                LOADING...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-8">
              <span className="font-micro text-[10px] tracking-widest text-destructive uppercase">
                {error}
              </span>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && patterns.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-12">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-text-dim"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
                no patterns saved yet
              </span>
            </div>
          )}

          {/* Pattern list */}
          {patterns.map((p) => (
            <div
              key={p.id}
              className="group bg-surface-2 border border-white/5 p-3 hover:bg-surface-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-heading text-sm text-text block truncate">
                    {p.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`font-micro text-[10px] tracking-widest uppercase ${
                        p.mode === "autopilot" ? "text-agent" : "text-creator"
                      }`}
                    >
                      {p.mode.toUpperCase()}
                    </span>
                    <span className="text-text-dim text-[10px]">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action buttons (visible on hover) */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleLoad(p.id)}
                    className="font-micro text-[10px] tracking-widest text-creator hover:text-creator/80 cursor-pointer transition-colors"
                  >
                    [ LOAD ]
                  </button>
                  <button
                    onClick={() => handleShare(p.id)}
                    className="font-micro text-[10px] tracking-widest text-listener hover:text-listener/80 cursor-pointer transition-colors"
                    title={p.is_public ? "Make private" : "Share (copy link)"}
                  >
                    {p.is_public ? "[ UNSHARE ]" : "[ SHARE ]"}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="font-micro text-[10px] tracking-widest text-destructive hover:text-destructive/80 cursor-pointer transition-colors"
                    title="Delete"
                  >
                    [ DEL ]
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
