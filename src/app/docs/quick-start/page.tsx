import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Boot the audio engine",
    body:
      "Open the landing page and hit BOOT. Browsers require a user gesture before they allow audio to play — this unlocks Web Audio for the rest of your session.",
  },
  {
    n: "02",
    title: "Land in the Studio",
    body:
      "You arrive at the livecoding studio. The editor starts empty (or with your last session's code). Drop in a snippet with Cmd+K, ask the chat to compose something, or open the DJ deck — then press Play in the transport bar.",
  },
  {
    n: "03",
    title: "Open the DJ deck · Cmd+J",
    body:
      "Pick a genre (Deep House, Techno, Ambient…), a key, a BPM, and drag the Energy / Space / Brightness sliders. Hit COMPOSE and the AI regenerates the track in that style.",
  },
  {
    n: "04",
    title: "Steer with chat",
    body:
      "Type into the chat panel: \"darker filter sweep on the bass, less delay on the hats\". The agent replies with a diff — click Listen to hear it, Keep to commit, Reject to revert.",
  },
  {
    n: "05",
    title: "Edit the code · Ctrl+Enter to evaluate",
    body:
      "Autocomplete is on by default, hover for docs, multi-cursor with Cmd+Click. Every time you press Ctrl+Enter the scheduler swaps your pattern on the next cycle — no audio dropout.",
  },
  {
    n: "06",
    title: "Browse snippets · Cmd+K",
    body:
      "24 curated patterns across drums, bass, melody, chords, FX, groove, modulation, and scales. Click any one to insert at the cursor.",
  },
  {
    n: "07",
    title: "Save what works · Cmd+S",
    body:
      "Hit SAVE to store the current pattern. Toggle Public to get a /p/<id> link anyone can open and play. Load past patterns from [ PATTERNS ] in the header.",
  },
  {
    n: "08",
    title: "Reference and escape hatches",
    body:
      "F1 opens the Docs modal with searchable reference. ? opens the keyboard shortcut cheatsheet. Cmd+Shift+P opens the command palette for every action.",
  },
];

export default function QuickStartPage() {
  return (
    <article className="space-y-10">
      <nav className="flex items-center gap-2 font-micro text-[10px] tracking-widest uppercase text-text-dim">
        <span>Docs</span>
        <span>›</span>
        <span className="text-creator">Quick start</span>
      </nav>

      <section>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tight leading-tight mb-3">
          Quick start
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
          Eight steps from cold boot to a track you can share. Total time:
          ~3 minutes if you're curious.
        </p>
      </section>

      <ol className="space-y-4">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="border border-white/10 bg-surface-1 p-5 rounded flex items-start gap-5"
          >
            <div className="font-mono text-2xl text-creator/70 shrink-0 w-10 tabular-nums">
              {step.n}
            </div>
            <div className="min-w-0">
              <h3 className="font-micro text-[11px] tracking-widest text-text uppercase mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/docs/introduction"
          className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase"
        >
          ← Introduction
        </Link>
        <Link
          href="/docs/architecture"
          className="font-micro text-[10px] tracking-widest text-creator uppercase border border-creator/40 hover:bg-creator/10 px-4 py-2 transition-colors"
        >
          Architecture →
        </Link>
      </section>
    </article>
  );
}
