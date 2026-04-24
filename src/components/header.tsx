"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { UserMenu } from "@/components/auth/user-menu";
import { LoginModal } from "@/components/auth/login-modal";

interface HeaderProps {
  onSettingsClick?: () => void;
  onSaveClick?: () => void;
  onLoadClick?: () => void;
  onSnippetsClick?: () => void;
  onDeckClick?: () => void;
  onDocsClick?: () => void;
  onSoundsClick?: () => void;
  docsActive?: boolean;
  soundsActive?: boolean;
}

function SnippetsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DeckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
      <path d="M11 12h2" />
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function SoundsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export function Header({ onSettingsClick, onSaveClick, onLoadClick, onSnippetsClick, onDeckClick, onDocsClick, onSoundsClick, docsActive, soundsActive }: HeaderProps) {
  const pathname = usePathname();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center w-full px-6 h-14 bg-base border-b border-white/10 z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tighter text-text font-heading">
            PULSE<span className="text-listener">·</span>CITY
          </h1>
          <nav className="hidden md:flex gap-6">
            {([
              { href: "/studio", label: "STUDIO", color: "creator" },
              { href: "/radio", label: "RADIO", color: "listener" },
              { href: "/library", label: "LIBRARY", color: "creator" },
            ] as const).map(({ href, label, color }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-heading font-bold tracking-tight transition-colors ${
                    active
                      ? `text-${color} border-b border-${color} pb-1`
                      : "text-text-dim hover:text-text pb-1"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right side (unified) ── */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex gap-1 md:gap-2 items-center">
            {onDocsClick && (
              <button
                onClick={onDocsClick}
                className={`font-micro text-[10px] tracking-widest text-creator uppercase border px-2 py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  docsActive
                    ? "border-creator bg-creator/15"
                    : "border-creator/40 hover:bg-creator/10"
                }`}
                title={docsActive ? "Close docs (F1)" : "Open docs (F1)"}
                aria-label={docsActive ? "Close docs" : "Open docs"}
                aria-pressed={!!docsActive}
              >
                <DocsIcon />
                <span className="hidden sm:inline">DOCS</span>
              </button>
            )}
            {onSoundsClick && (
              <button
                onClick={onSoundsClick}
                className={`font-micro text-[10px] tracking-widest text-listener uppercase border px-2 py-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  soundsActive
                    ? "border-listener bg-listener/15"
                    : "border-listener/40 hover:bg-listener/10"
                }`}
                title={soundsActive ? "Close sounds browser" : "Open sounds browser"}
                aria-label={soundsActive ? "Close sounds" : "Open sounds"}
                aria-pressed={!!soundsActive}
              >
                <SoundsIcon />
                <span className="hidden sm:inline">SOUNDS</span>
              </button>
            )}
            {onDeckClick && (
              <button
                onClick={onDeckClick}
                className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text transition-colors cursor-pointer flex items-center"
                title="DJ Deck (Cmd+J)"
                aria-label="DJ Deck"
              >
                <span className="hidden sm:inline">[ DECK ]</span>
                <span className="sm:hidden"><DeckIcon /></span>
              </button>
            )}
            {onSnippetsClick && (
              <button
                onClick={onSnippetsClick}
                className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text transition-colors cursor-pointer flex items-center"
                title="Snippets (Cmd+K)"
                aria-label="Snippets"
              >
                <span className="hidden sm:inline">[ SNIPPETS ]</span>
                <span className="sm:hidden"><SnippetsIcon /></span>
              </button>
            )}
            {onLoadClick && (
              <button
                onClick={onLoadClick}
                className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text transition-colors cursor-pointer flex items-center"
                title="Patterns"
                aria-label="Patterns"
              >
                <span className="hidden sm:inline">[ PATTERNS ]</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                  <path d="M20 7H4" />
                  <path d="M20 12H4" />
                  <path d="M20 17H4" />
                </svg>
              </button>
            )}
            {onSaveClick && (
              <button
                onClick={onSaveClick}
                className="font-micro text-[10px] tracking-widest text-creator hover:brightness-110 transition-colors cursor-pointer flex items-center"
                title="Save (Cmd+S)"
                aria-label="Save"
              >
                <span className="hidden sm:inline">[ SAVE ]</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 ml-2 md:ml-4 border-l border-white/10 pl-2 md:pl-4">
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="text-text-dim hover:text-text transition-transform active:scale-95 duration-150 cursor-pointer"
                title="Settings"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
            <UserMenu onLoginClick={() => setLoginOpen(true)} />
          </div>
        </div>
      </header>


      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
