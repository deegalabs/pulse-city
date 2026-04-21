import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Pattern, Profile } from "@/lib/supabase/types";
import { PatternPlayer } from "./pattern-player";
import { CopyCodeButton } from "./copy-code-button";

export default async function SharedPatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patternData } = await supabase
    .from("patterns")
    .select()
    .eq("id", id)
    .eq("is_public", true)
    .single();

  const pattern = patternData as Pattern | null;

  if (!pattern) {
    redirect("/?error=not_found");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select()
    .eq("id", pattern.user_id)
    .single();

  const profile = profileData as Profile | null;
  const author = profile?.display_name || profile?.username || "anonymous";

  const isAutopilot = pattern.mode === "autopilot";

  return (
    <div className="min-h-dvh bg-base text-text font-body selection:bg-listener selection:text-base overflow-y-auto">
      {/* Header */}
      <header className="bg-base flex justify-between items-center w-full px-6 py-4 border-b border-white/10 sticky top-0 z-50">
        <Link href="/" className="font-heading text-[10px] tracking-widest text-text-dim uppercase">
          PULSE<span className="text-listener">·</span>CITY
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 font-micro text-[10px] tracking-widest">
            <Link href="/" className="text-text-dim hover:text-listener transition-colors">EXPLORE</Link>
          </nav>
          <Link
            href={`/?load=${pattern.id}`}
            className="font-micro text-[10px] tracking-widest text-creator hover:opacity-80 transition-opacity"
          >
            [ OPEN IN STUDIO ]
          </Link>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Punchcard */}
        <PunchcardHero />

        {/* Content */}
        <article className="max-w-[640px] mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="font-heading text-3xl text-text font-bold tracking-tight mb-2">
                {pattern.title}
              </h1>
              <p className="font-micro text-[10px] text-text-dim tracking-widest uppercase mb-3">
                by {author}
              </p>
              {isAutopilot ? (
                <span className="font-micro text-[10px] tracking-widest text-agent bg-agent/10 px-2 py-0.5 uppercase">
                  AUTOPILOT
                </span>
              ) : (
                <span className="font-micro text-[10px] tracking-widest text-creator bg-creator/10 px-2 py-0.5 uppercase">
                  MANUAL
                </span>
              )}
            </div>
            <PatternPlayer code={pattern.code} />
          </div>

          {/* Code Block */}
          <section className="mb-12">
            <label className="font-micro text-[10px] tracking-widest text-text-dim uppercase block mb-3">
              CODE
            </label>
            <div className="bg-base border border-white/10 p-6">
              <pre className="font-mono text-xs leading-relaxed text-text overflow-x-auto">
                <code>{pattern.code}</code>
              </pre>
            </div>
          </section>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 py-8 border-y border-white/10">
            <div>
              <span className="font-micro text-[10px] text-text-dim tracking-widest uppercase block mb-1">
                MODE
              </span>
              <span className="font-body text-sm">{pattern.mode}</span>
            </div>
            <div>
              <span className="font-micro text-[10px] text-text-dim tracking-widest uppercase block mb-1">
                CREATED
              </span>
              <span className="font-body text-sm">
                {new Date(pattern.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-micro text-[10px] text-text-dim tracking-widest uppercase block mb-1">
                AUTHOR
              </span>
              <span className="font-body text-sm">{author}</span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-wrap gap-4 mb-20">
            <Link
              href={`/?load=${pattern.id}`}
              className="font-micro text-[10px] tracking-widest text-creator py-2 px-4 border border-creator/20 hover:bg-creator/5 transition-colors uppercase"
            >
              [ OPEN IN STUDIO ]
            </Link>
            <CopyCodeButton code={pattern.code} />
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-base border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <Link href="/" className="font-heading text-[10px] tracking-widest text-text-dim uppercase">
            PULSE<span className="text-listener">·</span>CITY
          </Link>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10">
          <p className="font-micro text-[10px] text-text-dim tracking-widest text-center md:text-left">
            © PULSE·CITY — THE CITY IS PLAYING. AGPL-3.0-OR-LATER.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PunchcardHero() {
  const colors = ["bg-creator", "bg-listener", "bg-agent"];
  const dots = Array.from({ length: 120 }, (_, i) => {
    const seeded = ((i * 37) % 100) / 100;
    const opacity = seeded > 0.3 ? 0.2 + seeded * 0.8 : 0.05;
    const color = colors[i % 3];
    return { opacity, color };
  });

  return (
    <section className="w-full bg-base py-12 px-6 flex justify-center items-center overflow-hidden border-b border-white/10">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-2">
          {dots.map((dot, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${dot.color}`}
              style={{ opacity: dot.opacity }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
