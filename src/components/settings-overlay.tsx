"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsOverlay({ open, onClose }: SettingsOverlayProps) {
  const { reset } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!open) return null;

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    reset();
    localStorage.removeItem("pc.store");
    setConfirmClear(false);
    onClose();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-md mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text text-xl cursor-pointer"
          >
            x
          </button>
        </div>

        {/* API Keys info */}
        <div className="mb-5">
          <h3 className="font-heading text-[0.65rem] tracking-widest text-text-dim mb-2">
            AI CONFIGURATION
          </h3>
          <p className="text-xs text-text-dim leading-relaxed">
            API keys are configured server-side via environment variables.
            Set <code className="text-lime">GROQ_API_KEY</code> for free tier
            or <code className="text-lime">ANTHROPIC_API_KEY</code> for Claude models.
          </p>
        </div>

        {/* About */}
        <div className="mb-5">
          <h3 className="font-heading text-[0.65rem] tracking-widest text-text-dim mb-2">
            ABOUT
          </h3>
          <p className="text-xs text-text-dim leading-relaxed">
            pulse.city — a living soundtrack for Ipe Village 2026.
            <br />
            Built with Strudel, Next.js, and AI.
          </p>
        </div>

        {/* Danger zone */}
        <div className="border-t border-border pt-4">
          <h3 className="font-heading text-[0.65rem] tracking-widest text-red mb-2">
            DANGER ZONE
          </h3>
          <button
            onClick={handleClear}
            className="w-full py-2 rounded-lg bg-red/15 text-red border border-red/30 font-heading font-semibold text-xs tracking-wide hover:bg-red/25 transition cursor-pointer"
          >
            {confirmClear
              ? "CONFIRM — CLEAR ALL DATA"
              : "CLEAR ALL DATA"}
          </button>
          <p className="text-[0.6rem] text-text-dim mt-1.5">
            Removes saved state, mode, and chat history.
          </p>
        </div>
      </div>
    </div>
  );
}
