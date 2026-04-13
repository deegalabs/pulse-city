"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { UserMenu } from "@/components/auth/user-menu";
import { LoginModal } from "@/components/auth/login-modal";

interface HeaderProps {
  onSettingsClick?: () => void;
  onSaveClick?: () => void;
  onLoadClick?: () => void;
}

export function Header({ onSettingsClick, onSaveClick, onLoadClick }: HeaderProps) {
  const { mode, playing, toggleMode, patternId } = useStore();
  const isAutopilot = mode === "autopilot";
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-bold text-xl text-lime tracking-tight">
          PULSE<span className="text-sky">·</span>CITY
        </h1>
        <span className="flex items-center gap-1.5 font-heading text-[0.58rem] tracking-widest text-text-dim bg-surface px-2 py-0.5 rounded-full border border-border">
          <span
            className={`w-1.5 h-1.5 rounded-full ${playing ? "bg-lime animate-[pulse-dot_1.5s_ease-in-out_infinite]" : "bg-text-dim"}`}
          />
          {playing ? "PLAYING" : "READY"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <UserMenu onLoginClick={() => setLoginOpen(true)} />
        {onSaveClick && (
          <button
            onClick={onSaveClick}
            className="font-heading text-[0.55rem] tracking-widest text-text-dim px-2 py-1 rounded-full border border-border hover:bg-surface-2 hover:text-sky transition cursor-pointer"
            title={patternId ? "Save changes" : "Save pattern"}
          >
            {patternId ? "SAVE" : "SAVE AS"}
          </button>
        )}
        {onLoadClick && (
          <button
            onClick={onLoadClick}
            className="font-heading text-[0.55rem] tracking-widest text-text-dim px-2 py-1 rounded-full border border-border hover:bg-surface-2 hover:text-sky transition cursor-pointer"
            title="Load pattern"
          >
            LOAD
          </button>
        )}
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="font-heading text-[0.55rem] tracking-widest text-text-dim px-2 py-1 rounded-full border border-border hover:bg-surface-2 transition cursor-pointer"
            title="Settings"
          >
            SETTINGS
          </button>
        )}
        <button
          onClick={toggleMode}
          className="font-heading text-[0.55rem] tracking-widest px-2.5 py-1 rounded-full border transition-colors hover:brightness-110 cursor-pointer"
          style={{
            color: isAutopilot
              ? "var(--color-violet)"
              : "var(--color-lime)",
            backgroundColor: isAutopilot
              ? "rgba(107, 70, 255, 0.15)"
              : "rgba(162, 215, 41, 0.15)",
            borderColor: isAutopilot
              ? "rgba(107, 70, 255, 0.3)"
              : "rgba(162, 215, 41, 0.3)",
          }}
          title={
            isAutopilot ? "Switch to manual mode" : "Switch to autopilot mode"
          }
        >
          {isAutopilot ? "AUTOPILOT" : "MANUAL"}
        </button>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
