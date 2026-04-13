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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-md mx-4 p-5 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            My Patterns
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text text-xl cursor-pointer"
          >
            x
          </button>
        </div>

        {loading && (
          <p className="text-text-dim text-xs text-center py-8">Loading...</p>
        )}

        {error && (
          <p className="text-red text-xs text-center py-4">{error}</p>
        )}

        {!loading && !error && patterns.length === 0 && (
          <p className="text-text-dim text-xs text-center py-8">
            No saved patterns yet. Hit SAVE to store your first one.
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-1">
          {patterns.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-2 group"
            >
              <button
                onClick={() => handleLoad(p.id)}
                className="flex-1 text-left cursor-pointer"
              >
                <span className="font-heading text-xs text-text block">
                  {p.title}
                </span>
                <span className="text-[0.55rem] text-text-dim">
                  {p.mode.toUpperCase()} · {new Date(p.updated_at).toLocaleDateString()}
                </span>
              </button>
              <button
                onClick={() => handleShare(p.id)}
                className="font-heading text-[0.45rem] tracking-widest text-text-dim px-1.5 py-0.5 rounded border border-border hover:bg-surface-2 hover:text-sky cursor-pointer opacity-0 group-hover:opacity-100 transition"
                title={p.is_public ? "Make private" : "Share (copy link)"}
              >
                {p.is_public ? "UNSHARE" : "SHARE"}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="font-heading text-[0.45rem] tracking-widest text-text-dim px-1.5 py-0.5 rounded border border-border hover:bg-surface-2 hover:text-red cursor-pointer opacity-0 group-hover:opacity-100 transition"
                title="Delete"
              >
                DEL
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
