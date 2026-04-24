import Link from "next/link";

export default function IntroductionPage() {
  return (
    <article className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-micro text-[10px] tracking-widest uppercase text-text-dim">
        <span>Docs</span>
        <span>›</span>
        <span className="text-creator">Introduction</span>
      </nav>

      {/* Hero */}
      <section>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-text tracking-tight leading-tight mb-5">
          Code is the instrument.
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
          pulse.city is a web studio for making algorithmic music with{" "}
          <span className="font-mono text-creator">Strudel</span> — a JavaScript port of
          TidalCycles. An AI agent composes, evolves, and explains the code in real
          time. Everything you hear is a live pattern you can edit.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/quick-start"
            className="font-micro text-[11px] tracking-widest uppercase px-5 py-2.5 bg-creator text-base hover:brightness-110 transition-all active:scale-95"
          >
            Quick start →
          </Link>
          <Link
            href="/studio"
            className="font-micro text-[11px] tracking-widest uppercase px-5 py-2.5 border border-white/10 text-text hover:bg-white/5 transition-colors"
          >
            Open Studio
          </Link>
          <Link
            href="/radio"
            className="font-micro text-[11px] tracking-widest uppercase px-5 py-2.5 border border-listener/30 text-listener hover:bg-listener/10 transition-colors"
          >
            Listen to Radio
          </Link>
        </div>
      </section>

      {/* Two docs */}
      <section className="border border-white/10 bg-surface-1 rounded px-5 py-4">
        <div className="font-micro text-[10px] tracking-widest text-creator uppercase mb-3">
          Two kinds of documentation
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="font-micro text-[10px] tracking-widest text-text uppercase mb-1">
              This site — /docs
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Product-level: what pulse.city is, how it fits together,
              architecture, the agent skills spec, roadmap. Long-form, linkable.
            </p>
          </div>
          <div>
            <div className="font-micro text-[10px] tracking-widest text-text uppercase mb-1">
              In-studio panel — F1
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Task-focused: Strudel reference, pattern library with audio
              preview, livecoding techniques, prompt recipes for the AI. Opens
              as a side drawer, stays out of your way.
            </p>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="border border-signal-warn/30 bg-signal-warn/5 rounded px-5 py-4">
        <div className="font-micro text-[10px] tracking-widest text-signal-warn uppercase mb-2">
          Pre-alpha
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          pulse.city is in active development for the Ipê Village 2026 pop-up city.
          Expect rough edges, breaking changes, and experimental features. Server-side
          AI is shared across visitors — rate limits apply. Code is AGPL-3.0; any
          public deployment must share source.
        </p>
      </section>

      {/* Core concept */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-6">
          Core concepts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Two surfaces, one scheduler",
              body:
                "Studio is where you livecode — editor first, AI as diff-based copilot, optional AUTO toggle for 30s mutations. Radio is the always-on broadcast, where the AI composes solo. Both feed the same audio scheduler, so listening on Radio and editing on Studio share one clock.",
            },
            {
              title: "Live from radio",
              body:
                "The /radio page broadcasts whatever the AI is currently composing. Open Studio while Radio is live and the editor auto-tunes to the playing pattern. Your first edit forks the stream locally.",
            },
            {
              title: "Diff-based chat",
              body:
                "When the AI suggests a code change, it's shown as a diff with Listen / Keep / Reject actions. You preview before committing — same flow as Cursor, scoped to Strudel patterns.",
            },
            {
              title: "DJ deck for intent",
              body:
                "Press Cmd+J. Pick genre, key, BPM, energy. The deck builds a structured prompt so the composer AI hits the vibe you want without you describing it in prose.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border border-white/10 bg-surface-1 p-5 rounded"
            >
              <h3 className="font-micro text-[11px] tracking-widest text-creator uppercase mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Strudel */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-4">
          What is Strudel?
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl mb-4">
          <a
            href="https://strudel.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-creator hover:underline"
          >
            Strudel
          </a>{" "}
          is a JavaScript live-coding environment for music. It ports the TidalCycles
          pattern language to the browser — you describe events as mini-notation
          strings and chain effects as method calls. The result is compact, readable,
          and hot-swappable: re-evaluating a pattern mid-playback keeps the beat.
        </p>
        <pre className="bg-surface-1 border border-white/10 p-4 font-mono text-[12px] text-text leading-relaxed overflow-x-auto">
{`$: s("bd*4").bank('RolandTR909').gain(.9)
$: s("~ cp ~ cp").bank('RolandTR909').gain(.5)
$: s("hh*8").gain(perlin.range(.2,.45))
$: note("<c2 c2 eb2 g1>").struct("x(5,8)")
  .s('sawtooth').decay(.15).lpf(800).gain(.5)`}
        </pre>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl mt-4">
          Four lines, a full house track. pulse.city wraps Strudel in a studio so you
          can iterate with an AI companion rather than alone at a blank editor.
        </p>
      </section>

      {/* Licensing */}
      <section className="border-t border-white/10 pt-8">
        <h2 className="font-micro text-[11px] tracking-widest text-text-dim uppercase mb-3">
          Legal
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
          pulse.city is{" "}
          <span className="font-mono text-text">AGPL-3.0-or-later</span>, same as
          upstream Strudel. Any public deployment must share source. AI-generated
          music is documented as{" "}
          <span className="font-mono text-text">CC0</span> — public domain. Samples
          follow the license of the source pack.
        </p>
      </section>
    </article>
  );
}
