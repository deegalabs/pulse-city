"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { href: "/docs/introduction", label: "Introduction" },
      { href: "/docs/quick-start", label: "Quick start" },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/docs/architecture", label: "Architecture" },
      { href: "/docs/studio-guide", label: "Studio guide" },
      { href: "/docs/agent-skills", label: "Agent skills" },
    ],
  },
  {
    title: "Task-focused docs",
    items: [{ href: "/studio", label: "Studio → press F1" }],
  },
];

function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <>
      <div className="mb-6 px-4">
        <h2 className="font-heading text-lg font-bold text-text tracking-tight">
          pulse<span className="text-listener">·</span>city
        </h2>
        <p className="font-micro text-[9px] tracking-widest text-text-dim uppercase mt-1">
          Documentation v0.1
        </p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="px-4 mb-1.5 font-micro text-[9px] tracking-widest uppercase text-text-dim">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`block font-micro text-[10px] tracking-widest uppercase px-4 py-2 border-l-2 transition-colors ${
                        active
                          ? "text-creator border-creator bg-creator/5"
                          : "text-text-dim hover:text-text border-transparent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-6 pt-4 border-t border-white/10">
        <Link
          href="/studio"
          className="flex items-center gap-2 px-4 py-2 font-micro text-[10px] tracking-widest uppercase text-listener hover:text-text transition-colors"
        >
          Open Studio ↗
        </Link>
        <a
          href="https://strudel.cc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 font-micro text-[10px] tracking-widest uppercase text-text-dim hover:text-text transition-colors"
        >
          strudel.cc ↗
        </a>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-64 flex-col p-4 bg-surface-1 border-r border-white/10">
        {content}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-scrim backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col p-4 pt-16 bg-surface-1 border-r border-white/10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-base text-text">
      {/* Top nav */}
      <header className="fixed top-0 z-50 w-full flex items-center justify-between px-4 sm:px-6 h-14 bg-base/80 backdrop-blur border-b border-white/10">
        <div className="flex items-center gap-3 lg:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-text-dim hover:text-text p-1"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
          <Link
            href="/"
            className="font-heading text-base sm:text-lg font-bold tracking-tight text-text"
          >
            PULSE<span className="text-listener">·</span>CITY
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/studio" className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase">
              Studio
            </Link>
            <Link href="/radio" className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase">
              Radio
            </Link>
            <Link href="/library" className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase">
              Library
            </Link>
            <span className="font-micro text-[10px] tracking-widest text-creator uppercase border-b border-creator pb-0.5">
              Docs
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://codeberg.org/uzu/strudel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase"
          >
            Strudel ↗
          </a>
          <Link
            href="/studio"
            className="font-micro text-[10px] tracking-widest text-creator border border-creator/40 hover:bg-creator/10 px-3 py-1 uppercase transition-colors"
          >
            Open Studio
          </Link>
        </div>
      </header>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="lg:ml-64 pt-14 px-4 sm:px-6 lg:px-12 py-10 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
