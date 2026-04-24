"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const PUNCHCARD_ROW_1 = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1];
const PUNCHCARD_ROW_2 = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0];
const PUNCHCARD_ROW_3 = [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1];

const COLORS = ["bg-creator", "bg-listener", "bg-agent"];

function PunchcardDot({ filled, index }: { filled: boolean; index: number }) {
  if (!filled) {
    return <div className="w-1 h-1 rounded-full border border-border" />;
  }
  const color = COLORS[index % COLORS.length];
  return <div className={`w-1 h-1 rounded-full ${color}`} />;
}

export default function BootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBoot() {
    setLoading(true);
    try {
      const { initStrudelAudio } = await import("@/lib/strudel/init");
      await initStrudelAudio();
      router.push("/studio");
    } catch (err) {
      console.error("Boot error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-base text-text font-body overflow-y-auto selection:bg-creator selection:text-base">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-none bg-base border-b border-white/10 font-micro tracking-wider uppercase text-sm">
        <Link href="/" className="text-xl font-bold tracking-tighter text-text font-heading">
          PULSE<span className="text-listener">·</span>CITY
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={handleBoot}
            disabled={loading}
            className="text-text-dim hover:text-creator transition-colors duration-200 cursor-pointer"
          >
            [ STUDIO ]
          </button>
          <Link href="/radio" className="text-text-dim hover:text-creator transition-colors duration-200">
            [ RADIO ]
          </Link>
          <Link href="/library" className="text-text-dim hover:text-creator transition-colors duration-200">
            [ LIBRARY ]
          </Link>
        </div>
        <button
          onClick={handleBoot}
          disabled={loading}
          className="text-creator scale-95 active:scale-90 transition-all cursor-pointer"
        >
          [ JOIN ]
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        <div className="w-full max-w-5xl text-center flex flex-col items-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-heading font-bold text-text lowercase leading-none tracking-tight">
              the city is playing.
            </h1>
            <p className="text-lg md:text-xl text-text-dim max-w-2xl mx-auto font-body font-medium">
              a living soundtrack primitive. open. autonomous. collective.
            </p>
          </div>

          {/* Metric Strip — what the studio does */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            {[
              { label: "Livecoding", hint: "Strudel" },
              { label: "AI copilot", hint: "Haiku · Sonnet" },
              { label: "Sounds", hint: "500+ samples" },
              { label: "24/7 Radio", hint: "autopilot" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 bg-surface-1 border border-border flex flex-col items-center gap-1"
              >
                <span className="font-heading text-xs text-text tracking-tight uppercase">
                  {item.label}
                </span>
                <span className="font-micro text-[9px] text-text-dim tracking-[0.2em] uppercase">
                  {item.hint}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={handleBoot}
              disabled={loading}
              className="font-micro text-creator text-xl px-8 py-4 border border-creator/20 hover:bg-creator/5 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? "[ LOADING... ]" : "[ OPEN STUDIO ]"}
            </button>
          </div>

          {/* Punchcard Pattern Strip */}
          <div className="w-full max-w-xl py-12 flex flex-col gap-2 opacity-60">
            {[PUNCHCARD_ROW_1, PUNCHCARD_ROW_2, PUNCHCARD_ROW_3].map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5">
                {row.map((filled, ci) => (
                  <PunchcardDot key={ci} filled={!!filled} index={ri + ci} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
          <span className="font-micro text-[10px] text-text-dim tracking-[0.2em]">SYSTEM SCAN</span>
          <div className="w-px h-12 bg-border relative">
            <div className="absolute top-0 w-full h-4 bg-creator animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-32 px-6 bg-base relative">
        <div className="max-w-6xl mx-auto space-y-32">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text leading-tight max-w-4xl mx-auto text-center">
            the place is awake, and it remembers you were here.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 pt-16">
            <div className="space-y-4">
              <h3 className="font-micro text-xs tracking-widest text-creator uppercase">
                visible over magical
              </h3>
              <p className="text-lg text-text-dim leading-relaxed">
                the code is on the screen, because the code is the song.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-micro text-xs tracking-widest text-listener uppercase">
                shared over personalized
              </h3>
              <p className="text-lg text-text-dim leading-relaxed">
                the same song at the same second for everyone in the room.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-micro text-xs tracking-widest text-agent uppercase">
                alive over finished
              </h3>
              <p className="text-lg text-text-dim leading-relaxed">
                leave it running. step out. come back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-base border-t border-white/5">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-lg font-bold text-text font-heading">
            PULSE<span className="text-listener">·</span>CITY
          </span>
          <p className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim">
            © PULSE·CITY — THE CITY IS PLAYING
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a
              href="https://github.com/deegalabs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ GITHUB ]
            </a>
            <Link
              href="/docs/introduction"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ DOCS ]
            </Link>
            <a
              href="https://strudel.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim hover:text-text transition-colors"
            >
              [ STRUDEL ↗ ]
            </a>
          </div>
          <div className="font-micro uppercase tracking-[0.2em] text-[10px] text-text-dim opacity-80">
            AGPL-3.0-or-later · deega labs · ipê village 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
