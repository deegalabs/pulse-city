"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  onLoginClick: () => void;
}

export function UserMenu({ onLoginClick }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="font-heading text-[0.55rem] tracking-widest text-text-dim px-2 py-1 rounded-full border border-border hover:bg-surface-2 hover:text-lime transition cursor-pointer"
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
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
        {name.toUpperCase()}
      </span>
      <button
        onClick={handleSignOut}
        className="font-heading text-[0.5rem] tracking-widest text-text-dim px-1.5 py-0.5 rounded border border-border hover:bg-surface-2 hover:text-red transition cursor-pointer"
        title="Sign out"
      >
        OUT
      </button>
    </div>
  );
}
