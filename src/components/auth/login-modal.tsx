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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-lg w-full max-w-sm mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text text-xl cursor-pointer"
          >
            x
          </button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-lime font-heading text-sm mb-2">
              CHECK YOUR EMAIL
            </p>
            <p className="text-xs text-text-dim">
              We sent a magic link to <strong className="text-text">{email}</strong>.
              <br />
              Click the link to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-xs text-text-dim hover:text-text cursor-pointer"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-surface-2 text-text border border-border font-heading text-xs tracking-wide hover:bg-border transition cursor-pointer disabled:opacity-50 mb-3"
            >
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[0.6rem] text-text-dim tracking-wider">
                OR
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full py-2 px-3 bg-bg border border-border rounded-lg text-text text-xs focus:border-lime outline-none mb-3 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-2.5 rounded-lg bg-lime text-bg font-heading font-semibold text-xs tracking-wide hover:brightness-110 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "SENDING..." : "SEND MAGIC LINK"}
              </button>
            </form>

            {error && (
              <p className="text-red text-xs mt-2 text-center">{error}</p>
            )}

            <p className="text-[0.6rem] text-text-dim text-center mt-3">
              Sign in to save patterns, share tracks, and sync across devices.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
