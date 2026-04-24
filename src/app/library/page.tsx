"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Scope = "community" | "mine";
type FilterTab = "ALL" | "AUTOPILOT" | "MANUAL" | "RECENT";

interface Pattern {
  id: string;
  title: string;
  mode: "autopilot" | "manual";
  is_public: boolean;
  updated_at: string;
  user_id?: string;
}

const FILTER_TABS: FilterTab[] = ["ALL", "AUTOPILOT", "MANUAL", "RECENT"];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function LibraryPage() {
  const [scope, setScope] = useState<Scope>("community");
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  const fetchPatterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = scope === "community" ? "/api/patterns?public=1" : "/api/patterns";
      const res = await fetch(url);
      if (res.status === 401) {
        setError("Sign in to see your patterns");
        setPatterns([]);
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Pattern[];
      setPatterns(data);
    } catch {
      setError("Failed to load patterns");
      setPatterns([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchPatterns();
  }, [fetchPatterns]);

  const filtered = useMemo(() => {
    let out = patterns;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (activeFilter === "AUTOPILOT") out = out.filter((p) => p.mode === "autopilot");
    if (activeFilter === "MANUAL") out = out.filter((p) => p.mode === "manual");
    if (activeFilter === "RECENT") {
      const dayAgo = Date.now() - 86_400_000;
      out = out.filter((p) => new Date(p.updated_at).getTime() > dayAgo);
    }
    return out;
  }, [patterns, search, activeFilter]);

  return (
    <div className="min-h-dvh bg-base text-text font-body overflow-y-auto">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-none bg-base border-b border-white/10 font-micro tracking-wider uppercase text-sm">
        <Link href="/" className="text-xl font-bold tracking-tighter text-text font-heading">
          PULSE<span className="text-listener">·</span>CITY
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/studio"
            className="text-text-dim hover:text-creator transition-colors duration-200 cursor-pointer"
          >
            [ STUDIO ]
          </Link>
          <Link href="/radio" className="text-text-dim hover:text-creator transition-colors duration-200">
            [ RADIO ]
          </Link>
          <span className="text-creator cursor-default">[ LIBRARY ]</span>
        </div>
        <Link
          href="/studio"
          className="text-creator scale-95 active:scale-90 transition-all cursor-pointer"
        >
          [ JOIN ]
        </Link>
      </nav>

      {/* Page header */}
      <div className="pt-24 pb-8 px-8 max-w-7xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-text tracking-tight">
          PATTERN LIBRARY
        </h1>
        <p className="font-micro text-[10px] tracking-widest text-text-dim mt-2 uppercase">
          {scope === "community"
            ? "public patterns shared by the community"
            : "your saved patterns"}
        </p>

        {/* Scope toggle */}
        <div className="flex gap-1 mt-6 border-b border-white/10">
          {(["community", "mine"] as Scope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`font-micro text-[11px] tracking-widest uppercase px-3 py-2 border-b-2 cursor-pointer transition-colors ${
                scope === s
                  ? "text-creator border-creator"
                  : "text-text-dim border-transparent hover:text-text"
              }`}
            >
              {s === "community" ? "Community" : "My patterns"}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={fetchPatterns}
            className="font-micro text-[10px] tracking-widest uppercase text-text-dim hover:text-text px-2 cursor-pointer"
            title="Refresh"
          >
            ↻
          </button>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mt-6 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim/50"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH PATTERNS..."
            className="bg-surface-1 border border-white/10 pl-11 pr-4 py-3 font-micro text-xs text-text w-full focus:border-creator/50 focus:outline-none placeholder:text-text-dim/50"
          />
        </div>

        {/* Filter tabs */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`font-micro text-[10px] tracking-widest px-3 py-1.5 cursor-pointer transition-colors ${
                activeFilter === tab
                  ? "bg-creator/10 text-creator border border-creator/20"
                  : "bg-surface-2 text-text-dim border border-white/5 hover:bg-surface-3 hover:text-text"
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="ml-auto font-micro text-[10px] tracking-widest text-text-dim self-center">
            {filtered.length} / {patterns.length}
          </span>
        </div>
      </div>

      {/* Pattern grid */}
      <div className="px-8 pb-16 max-w-7xl mx-auto">
        {loading && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase animate-pulse">
              LOADING...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="font-micro text-[10px] tracking-widest text-destructive uppercase">
              {error}
            </p>
            {scope === "mine" && error.includes("Sign in") && (
              <Link
                href="/studio"
                className="font-micro text-[10px] tracking-widest text-listener border border-listener/30 hover:bg-listener/10 px-3 py-1.5 uppercase"
              >
                Open studio to sign in
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              {patterns.length === 0
                ? scope === "community"
                  ? "no public patterns yet — be the first to share one"
                  : "no saved patterns yet"
                : "no patterns match the filter"}
            </p>
            <div
              className="w-1.5 h-1.5 rounded-full bg-text-dim"
              style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
            />
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pattern) => (
              <div
                key={pattern.id}
                className="bg-surface-1 border border-white/10 p-5 hover:bg-surface-2 transition-colors group group-hover:border-white/15"
              >
                <h3 className="font-heading text-sm text-text font-bold truncate">
                  {pattern.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`font-micro text-[9px] tracking-widest px-2 py-0.5 ${
                      pattern.mode === "autopilot"
                        ? "text-agent bg-agent/10"
                        : "text-creator bg-creator/10"
                    }`}
                  >
                    {pattern.mode.toUpperCase()}
                  </span>
                  {pattern.is_public && (
                    <span className="font-micro text-[9px] tracking-widest text-listener bg-listener/10 px-2 py-0.5">
                      PUBLIC
                    </span>
                  )}
                </div>
                <p className="font-micro text-[9px] text-text-dim tracking-widest mt-2 uppercase">
                  {relativeTime(pattern.updated_at)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href={`/p/${pattern.id}`}
                    className="text-listener font-micro text-[10px] tracking-widest hover:underline"
                  >
                    [ OPEN ]
                  </Link>
                  {pattern.is_public && (
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/p/${pattern.id}`;
                        navigator.clipboard.writeText(url).catch(() => {});
                      }}
                      className="text-text-dim font-micro text-[10px] tracking-widest hover:text-text cursor-pointer"
                    >
                      [ COPY LINK ]
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-base border-t border-white/5 mt-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-lg font-bold text-text font-heading">
            PULSE<span className="text-listener">·</span>CITY
          </span>
          <p className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim">
            © PULSE·CITY — THE CITY IS PLAYING
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a
              href="https://github.com/deegalabs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ GITHUB ]
            </a>
            <Link
              href="/docs/introduction"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ DOCS ]
            </Link>
          </div>
          <div className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim opacity-80">
            AGPL-3.0-or-later · deega labs · ipê village 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
