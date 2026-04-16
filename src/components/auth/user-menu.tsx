"use client";

import { useState, useEffect, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface UserMenuProps {
  onLoginClick: () => void;
}

export function UserMenu({ onLoginClick }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const configured = isSupabaseConfigured();
  const supabase = useMemo(
    () => (configured ? createClient() : null),
    [configured]
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!configured) return null;

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text border border-white/10 px-3 py-1 transition-colors cursor-pointer"
      >
        SIGN IN
      </button>
    );
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "user";

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-micro text-[10px] tracking-widest text-text-dim">
        {name.toUpperCase()}
      </span>
      <button
        onClick={handleSignOut}
        className="font-micro text-[9px] text-text-dim hover:text-destructive border border-white/10 px-2 py-0.5 transition-colors cursor-pointer"
        title="Sign out"
      >
        [ OUT ]
      </button>
    </div>
  );
}
