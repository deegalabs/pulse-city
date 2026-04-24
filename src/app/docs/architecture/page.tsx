import Link from "next/link";

interface Piece {
  title: string;
  role: string;
  tech: string;
  notes: string;
}

const PIECES: Piece[] = [
  {
    title: "Editor",
    role: "Where code is written and evaluated",
    tech: "CodeMirror 6 · @strudel/codemirror (StrudelMirror)",
    notes:
      "Autocomplete, hover docs, multi-cursor, vim/vscode/emacs keybindings. onChange is wired to the Zustand store so code stays in sync with persistence.",
  },
  {
    title: "Audio scheduler",
    role: "Single global clock, shared across the app",
    tech: "@strudel/core Cyclist · Web Audio API",
    notes:
      "The scheduler is module-level, not per-component. Navigating /radio → /studio doesn't stop audio — the pattern keeps playing until something replaces it. That's what enables 'live from radio' sync.",
  },
  {
    title: "Zustand store",
    role: "State for the whole studio session",
    tech: "zustand with persist middleware",
    notes:
      "Persists: mode, code, trackTitle, editor settings, DJ deck. Not persisted: playing flag, broadcast state (radio). localStorage key: pc.store.",
  },
  {
    title: "AI backend",
    role: "Compose, evolve, chat",
    tech: "Vercel AI SDK · @ai-sdk/anthropic · @ai-sdk/groq",
    notes:
      "Routes at /api/compose, /api/evolve, /api/chat, /api/patterns. Server-side keys. Rate limited per IP. Model router picks Haiku for small changes and Sonnet for composition.",
  },
  {
    title: "Chat diff flow",
    role: "AI changes are proposals, not commits",
    tech: "Custom LCS line diff · CodeDiff component",
    notes:
      "AI returns JSON with { code, message }. Chat extracts the code and renders it as a diff. Listen temporarily swaps via editor.setCode + evaluate, saving a snapshot. Keep finalizes, Reject restores the snapshot.",
  },
  {
    title: "DJ deck",
    role: "Structured prompt builder",
    tech: "buildDeckComposePrompt (lib/ai/deck-prompt.ts)",
    notes:
      "Turns UI state (genre + key + BPM + energy/space/brightness sliders) into a deterministic prompt string that gets passed to /api/compose.",
  },
  {
    title: "Radio",
    role: "A page that composes and broadcasts live",
    tech: "Self-contained React page · shares the global scheduler",
    notes:
      "Composes on Play, evolves every 30s, writes broadcastCode/broadcastTitle/broadcastActive into the store. Studio reads these on mount to auto-tune to the live pattern. First edit forks.",
  },
  {
    title: "Supabase",
    role: "Auth + pattern persistence",
    tech: "@supabase/ssr · Postgres with RLS",
    notes:
      "Graceful fallback when env vars are missing — the app still works with localStorage-only state. Auth via email / Google OAuth. Patterns are private by default; toggle Public for /p/[id] links.",
  },
];

const FLOW = [
  {
    step: "1",
    title: "User hits Play",
    body:
      "Transport bar calls editor.toggle(). First-time: AudioContext resumes (user gesture), prebake promise awaits sample loading + evalScope registration.",
  },
  {
    step: "2",
    title: "Code evaluates",
    body:
      "Strudel's transpiler rewrites the code, evalScope executes it, the resulting pattern is installed in the global scheduler. Hap highlighting kicks in on played notes.",
  },
  {
    step: "3",
    title: "User types a chat message",
    body:
      "ChatPanel POSTs to /api/chat with { mode, currentCode }. Model router picks a model. Response streams back as JSON with { message, code }.",
  },
  {
    step: "4",
    title: "Diff renders",
    body:
      "CodeDiff computes line-level LCS between current code and AI's code, renders +/-/context with line numbers. Three buttons: Listen / Keep / Reject.",
  },
  {
    step: "5",
    title: "User clicks Listen",
    body:
      "Studio saves a snapshot ref, calls editor.setCode(proposed), editor.evaluate(). The scheduler swaps patterns at the next cycle boundary — no audio glitch.",
  },
  {
    step: "6",
    title: "User clicks Keep or Reject",
    body:
      "Keep: snapshot cleared, proposed code stays. Reject: editor.setCode(snapshot), editor.evaluate(), scheduler restores original.",
  },
];

export default function ArchitecturePage() {
  return (
    <article className="space-y-12">
      <nav className="flex items-center gap-2 font-micro text-[10px] tracking-widest uppercase text-text-dim">
        <span>Docs</span>
        <span>›</span>
        <span className="text-creator">Architecture</span>
      </nav>

      <section>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tight leading-tight mb-3">
          Architecture
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
          How the pieces fit together. The short version: one audio scheduler
          shared globally, state in Zustand, AI behind a rate-limited API, every
          code change is a proposal until the user confirms.
        </p>
      </section>

      {/* Component map */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-5">
          Components
        </h2>
        <ul className="space-y-3">
          {PIECES.map((p) => (
            <li key={p.title} className="border border-white/10 bg-surface-1 p-5 rounded">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-micro text-[11px] tracking-widest text-creator uppercase">
                  {p.title}
                </h3>
                <span className="font-mono text-[10px] text-text-dim">{p.tech}</span>
              </div>
              <p className="text-sm text-text-muted mb-2">{p.role}</p>
              <p className="text-sm text-text-muted leading-relaxed">{p.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Flow */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-5">
          A typical flow
        </h2>
        <ol className="space-y-3">
          {FLOW.map((f) => (
            <li key={f.step} className="flex items-start gap-4">
              <div className="font-mono text-2xl text-creator/70 shrink-0 w-8 tabular-nums">
                {f.step}
              </div>
              <div className="min-w-0">
                <h3 className="font-micro text-[11px] tracking-widest text-text uppercase mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Design principles */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-5">
          Design principles
        </h2>
        <ul className="space-y-3 text-sm text-text-muted leading-relaxed max-w-2xl">
          <li>
            <span className="font-micro text-[11px] tracking-widest text-creator uppercase block mb-1">
              State survives navigation
            </span>
            Zustand + persist means refreshing the page keeps the user where they are, with their code intact. No redirects to landing.
          </li>
          <li>
            <span className="font-micro text-[11px] tracking-widest text-creator uppercase block mb-1">
              One scheduler, many views
            </span>
            The audio clock is shared. /radio and /studio aren't separate audio apps — they're two views onto the same pattern engine. That's what makes radio → studio feel seamless.
          </li>
          <li>
            <span className="font-micro text-[11px] tracking-widest text-creator uppercase block mb-1">
              AI is a collaborator, not a narrator
            </span>
            Every code change from the AI is a diff the user can Listen to before committing. No surprises, no irreversible rewrites.
          </li>
          <li>
            <span className="font-micro text-[11px] tracking-widest text-creator uppercase block mb-1">
              Fallbacks over failures
            </span>
            Supabase env missing? Fall back to localStorage. AI rate-limited? Return a graceful message. Audio init fails? Editor still works.
          </li>
        </ul>
      </section>

      <section className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/docs/quick-start"
          className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase"
        >
          ← Quick start
        </Link>
        <Link
          href="/docs/studio-guide"
          className="font-micro text-[10px] tracking-widest text-creator uppercase border border-creator/40 hover:bg-creator/10 px-4 py-2 transition-colors"
        >
          Studio guide →
        </Link>
      </section>
    </article>
  );
}
