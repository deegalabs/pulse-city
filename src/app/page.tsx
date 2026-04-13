"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBoot() {
    setLoading(true);
    try {
      // Lazy import — only loads Strudel audio on click (client-only)
      const { initStrudelAudio } = await import("@/lib/strudel/init");
      await initStrudelAudio();
      router.push("/studio");
    } catch (err) {
      console.error("Boot error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <h1 className="font-heading font-bold text-5xl text-lime tracking-tight">
          PULSE<span className="text-sky">·</span>CITY
        </h1>
        <p className="font-heading text-sm text-text-dim tracking-widest mt-2">
          the city is playing
        </p>
        <p className="text-sm text-text-dim leading-relaxed mt-5">
          A living soundtrack for Ipe Village 2026.
          <br />
          Open. Autonomous. Collective.
        </p>
        <button
          onClick={handleBoot}
          disabled={loading}
          className="mt-8 w-full py-3.5 rounded-full bg-lime text-bg font-heading font-bold text-base tracking-wide hover:brightness-110 transition disabled:opacity-60"
        >
          {loading ? "LOADING..." : "TUNE IN →"}
        </button>
      </div>
    </div>
  );
}
