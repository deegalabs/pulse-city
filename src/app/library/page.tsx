"use client";

import Link from "next/link";
import { useState } from "react";

type FilterTab = "ALL" | "AUTOPILOT" | "MANUAL" | "RECENT" | "POPULAR";

interface Pattern {
  id: string;
  title: string;
  author: string;
  mode: "autopilot" | "manual";
  date: string;
}

const MOCK_PATTERNS: Pattern[] = [
  { id: "1", title: "Midnight Bass Protocol", author: "autopilot", mode: "autopilot", date: "2 hours ago" },
  { id: "2", title: "Solar Drift", author: "dj_synth", mode: "manual", date: "5 hours ago" },
  { id: "3", title: "Neural Groove v3", author: "autopilot", mode: "autopilot", date: "8 hours ago" },
  { id: "4", title: "Ambient Cluster 7", author: "luna_beats", mode: "manual", date: "12 hours ago" },
  { id: "5", title: "Deep Resonance", author: "autopilot", mode: "autopilot", date: "1 day ago" },
  { id: "6", title: "Pulse Sequence", author: "code_wave", mode: "manual", date: "1 day ago" },
  { id: "7", title: "Evolving Textures", author: "autopilot", mode: "autopilot", date: "2 days ago" },
  { id: "8", title: "City Nights", author: "beat_maker", mode: "manual", date: "3 days ago" },
  { id: "9", title: "Generative Dawn", author: "autopilot", mode: "autopilot", date: "3 days ago" },
];

const FILTER_TABS: FilterTab[] = ["ALL", "AUTOPILOT", "MANUAL", "RECENT", "POPULAR"];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  const filteredPatterns = MOCK_PATTERNS.filter((pattern) => {
    // Search filter
    if (search && !pattern.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Mode filter
    if (activeFilter === "AUTOPILOT" && pattern.mode !== "autopilot") return false;
    if (activeFilter === "MANUAL" && pattern.mode !== "manual") return false;
    // RECENT and POPULAR show all (placeholder)
    return true;
  });

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
          <span className="text-creator cursor-default">
            [ LIBRARY ]
          </span>
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
          browse community patterns
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mt-8 relative">
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
        <div className="mt-6 flex gap-2 flex-wrap">
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
        </div>
      </div>

      {/* Pattern grid */}
      <div className="px-8 pb-16 max-w-7xl mx-auto">
        {filteredPatterns.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="bg-surface-1 border border-white/10 p-5 hover:bg-surface-2 transition-colors group group-hover:border-white/15"
              >
                <h3 className="font-heading text-sm text-text font-bold">
                  {pattern.title}
                </h3>
                <p className="font-micro text-[10px] text-text-dim tracking-widest mt-1">
                  BY {pattern.author.toUpperCase()}
                </p>
                <span
                  className={`font-micro text-[9px] tracking-widest px-2 py-0.5 mt-3 inline-block ${
                    pattern.mode === "autopilot"
                      ? "text-agent bg-agent/10"
                      : "text-creator bg-creator/10"
                  }`}
                >
                  {pattern.mode.toUpperCase()}
                </span>
                <p className="font-micro text-[9px] text-text-dim tracking-widest mt-2">
                  {pattern.date.toUpperCase()}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/p/${pattern.id}`}
                    className="text-listener font-micro text-[10px] tracking-widest hover:underline"
                  >
                    [ OPEN ]
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="font-micro text-[10px] tracking-widest text-text-dim">
              NO PATTERNS FOUND
            </p>
            <div
              className="w-1.5 h-1.5 rounded-full bg-text-dim"
              style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}
            />
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
            &copy; PULSE&middot;CITY &mdash; THE CITY IS PLAYING
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a
              href="https://github.com"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ GITHUB ]
            </a>
            <a className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors cursor-pointer">
              [ DISCORD ]
            </a>
            <a className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors cursor-pointer">
              [ SIGNAL ]
            </a>
          </div>
          <div className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim opacity-80">
            AGPL-3.0-or-later &middot; deega labs &middot; ip&ecirc; village 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
