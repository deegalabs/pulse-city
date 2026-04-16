"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

interface SettingsOverlayProps {
  open: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
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
  );
}

function SectionLabel({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  return (
    <h3
      className={`font-micro text-[10px] tracking-widest uppercase mb-3 ${
        variant === "destructive" ? "text-destructive" : "text-text-dim"
      }`}
    >
      {children}
    </h3>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
        {label}
      </span>
      <span className="font-mono text-xs text-text-muted">{value}</span>
    </div>
  );
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
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text transition-colors cursor-pointer p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* AUDIO ENGINE */}
        <div className="mb-6">
          <SectionLabel>AUDIO ENGINE</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-2">
            <InfoRow label="Runtime" value="Strudel v1.2.6" />
            <div className="h-px bg-white/5 my-1" />
            <InfoRow label="Output" value="WebAudio API" />
          </div>
        </div>

        {/* AI CONFIGURATION */}
        <div className="mb-6">
          <SectionLabel>AI CONFIGURATION</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3">
            <p className="text-xs text-text-dim leading-relaxed">
              API keys are configured server-side via environment variables. Set{" "}
              <code className="font-mono text-creator">GROQ_API_KEY</code> for
              free tier or{" "}
              <code className="font-mono text-creator">ANTHROPIC_API_KEY</code>{" "}
              for Claude models.
            </p>
          </div>
        </div>

        {/* DISPLAY */}
        <div className="mb-6">
          <SectionLabel>DISPLAY</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3">
            <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
              Theme and font settings coming soon.
            </p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mb-6">
          <SectionLabel>ABOUT</SectionLabel>
          <div className="bg-surface-2 border border-white/10 px-4 py-3">
            <p className="font-mono text-xs text-text-muted">
              pulse.city{" "}
              <span className="text-listener">v2.4.0</span>
            </p>
            <p className="font-micro text-[10px] tracking-widest text-text-dim mt-1">
              DEEGA LABS — AGPL-3.0
            </p>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="border-t border-white/10 pt-5">
          <SectionLabel variant="destructive">DANGER ZONE</SectionLabel>
          <button
            onClick={handleClear}
            className="w-full py-2.5 bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 font-micro text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
          >
            {confirmClear
              ? "CONFIRM — CLEAR ALL DATA"
              : "CLEAR ALL DATA"}
          </button>
          <p className="font-micro text-[10px] tracking-widest text-text-dim mt-2">
            Removes saved state, mode, and chat history.
          </p>
        </div>
      </div>
    </div>
  );
}
