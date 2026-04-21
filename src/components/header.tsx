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
}

export function Header({ onSettingsClick, onSaveClick, onLoadClick }: HeaderProps) {
  const { mode, toggleMode } = useStore();
  const isAutopilot = mode === "autopilot";
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

        {isAutopilot ? (
          /* ── Autopilot right side ── */
          <div className="flex items-center gap-4">
            <div className="font-micro text-[10px] tracking-widest text-agent border border-agent/30 px-2 py-0.5 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-agent rounded-full pulse-dot" />
              AI CONTROLLED
            </div>
            <button
              onClick={toggleMode}
              className="font-micro text-xs tracking-widest text-agent uppercase border border-agent/20 px-3 py-1 hover:bg-agent/10 transition-colors cursor-pointer"
            >
              [ AGENT ]
            </button>
          </div>
        ) : (
          /* ── Manual right side ── */
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {onLoadClick && (
                <button
                  onClick={onLoadClick}
                  className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text transition-colors cursor-pointer"
                >
                  [ PATTERNS ]
                </button>
              )}
              {onSaveClick && (
                <button
                  onClick={onSaveClick}
                  className="font-micro text-[10px] tracking-widest text-creator hover:brightness-110 transition-colors cursor-pointer"
                >
                  [ SAVE ]
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-4">
              {onSettingsClick && (
                <button
                  onClick={onSettingsClick}
                  className="text-text-dim hover:text-text transition-transform active:scale-95 duration-150 cursor-pointer"
                  title="Settings"
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
        )}
      </header>

      {/* Sub-header — manual mode only */}
      {!isAutopilot && (
        <div className="flex items-center justify-between px-6 py-2 bg-surface-1/50 glass-line border-t-0 border-x-0">
          <div className="flex items-center gap-3">
            <div className="bg-creator/10 text-creator px-2 py-0.5 rounded text-[10px] font-micro font-bold tracking-widest">
              [LIVE] YOU CONTROL
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span className="font-micro text-[10px] tracking-widest text-text-dim">
              STRUDEL CODE EDITOR v2.4.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-creator pulse-dot text-[10px]">●</span>
            <span className="font-micro text-[10px] tracking-widest text-text-dim">
              SYNCED TO MAIN CLOCK
            </span>
          </div>
        </div>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
