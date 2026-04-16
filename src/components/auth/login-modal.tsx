"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-sm mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
            ACCESS TERMINAL
          </span>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="font-micro text-[10px] tracking-widest text-creator mb-2">
              CHECK YOUR EMAIL
            </p>
            <p className="text-xs text-text-dim">
              We sent a magic link to <strong className="text-text">{email}</strong>.
              <br />
              Click the link to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 font-micro text-[10px] tracking-widest text-text-dim hover:text-text transition-colors cursor-pointer"
            >
              [ TRY DIFFERENT EMAIL ]
            </button>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 bg-surface-2 border border-white/10 font-micro text-[10px] tracking-widest text-text hover:bg-surface-3 transition cursor-pointer disabled:opacity-50 mb-3"
            >
              [ CONTINUE WITH GOOGLE ]
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-micro text-[10px] tracking-widest text-text-dim">
                OR
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                required
                disabled={loading}
                className="w-full bg-base border border-white/10 font-micro text-xs px-4 py-2.5 text-text placeholder:text-text-dim focus:border-creator outline-none mb-3 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-2.5 bg-creator text-base font-micro text-[10px] tracking-widest font-bold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "[ SENDING... ]" : "[ SEND MAGIC LINK ]"}
              </button>
            </form>

            {error && (
              <p className="text-destructive text-xs mt-2 text-center">{error}</p>
            )}

            <p className="font-micro text-[9px] text-text-dim text-center mt-3">
              sign in to save patterns and sync
            </p>
          </>
        )}
      </div>
    </div>
  );
}
