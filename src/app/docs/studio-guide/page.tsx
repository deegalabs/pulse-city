import Link from "next/link";

interface UIArea {
  name: string;
  where: string;
  purpose: string;
  shortcuts?: string[];
}

const AREAS: UIArea[] = [
  {
    name: "Header",
    where: "Top of the page",
    purpose:
      "Left: nav (Studio / Radio / Library). Right: [ DOCS ] [ DECK ] [ SNIPPETS ] [ PATTERNS ] [ SAVE ] + settings + user menu. Changes slightly by mode.",
    shortcuts: ["Ctrl+S save", "Ctrl+J deck", "Ctrl+K snippets", "F1 docs"],
  },
  {
    name: "Sidebar (autopilot only)",
    where: "Fixed left rail on desktop",
    purpose:
      "Shows current state: COMPOSER (track title, mode, status), SIGNAL (audio stats), NETWORK (listener count + rotating events), HISTORY (mutation log). Bottom has a live ticker + [ LIVE ] button.",
  },
  {
    name: "Editor",
    where: "Main work surface",
    purpose:
      "Strudel code with hap highlighting (notes flash green as they play), autocomplete, hover docs, multi-cursor. onChange is wired to persistent state.",
    shortcuts: ["Ctrl+Enter eval", "Ctrl+Space autocomplete", "Ctrl+Click multi-cursor"],
  },
  {
    name: "Chat panel",
    where: "Below the editor",
    purpose:
      "AI assistant. Steer mode (autopilot) accepts directional prompts. Copilot mode (manual) returns diffs with Listen / Keep / Reject. Layer buttons from the DJ deck dispatch into this panel.",
  },
  {
    name: "Spectrum analyzer",
    where: "Right column on desktop",
    purpose:
      "Real-time FFT of the audio output. Energy + beat detection feed into the UI — the pulsing dots and ticker react to what's playing.",
  },
  {
    name: "Tools panel",
    where: "Below spectrum (autopilot)",
    purpose:
      "Quick AI prompts: DRUMS / BASS / CHORDS / LEAD / FX / FILTER / TEMPO / DROP. Each dispatches a pre-written prompt to the chat.",
  },
  {
    name: "Transport bar",
    where: "Fixed bottom",
    purpose:
      "Play / Pause / Stop / Evolve / Re-run + clock + volume. In autopilot mode has the scrolling marquee. Always visible.",
  },
  {
    name: "DJ deck (overlay)",
    where: "Opens full-screen on Cmd+J or [ DECK ]",
    purpose:
      "Genre grid, key selector, BPM + ENERGY / SPACE / BRIGHTNESS sliders, layer quick-add. COMPOSE button builds a structured prompt and sends to the AI.",
  },
  {
    name: "Snippets palette",
    where: "Opens on Cmd+K or [ SNIPPETS ]",
    purpose:
      "24 curated Strudel snippets across 8 categories, with fuzzy search. Click to insert at cursor.",
  },
  {
    name: "Command palette",
    where: "Opens on Cmd+Shift+P",
    purpose:
      "Every action in one searchable list — playback, AI, patterns, mode, editor, keybindings, font size.",
  },
  {
    name: "Docs panel",
    where: "Opens on F1 or Ctrl+/ — slides in from the right",
    purpose:
      "Non-blocking drawer. Strudel primer, pattern library with Listen buttons, livecoding techniques, AI prompt recipes. Studio stays fully interactive while docs are open.",
  },
  {
    name: "Shortcuts overlay",
    where: "Press ? (outside the editor)",
    purpose:
      "Keyboard cheat sheet, grouped by category. Four groups: Playback, Palettes, Editor, Vim mode.",
  },
  {
    name: "Patterns modal",
    where: "[ PATTERNS ] in header",
    purpose:
      "Your saved patterns + public patterns. Click to load into the editor.",
  },
  {
    name: "Settings overlay",
    where: "Gear icon in header",
    purpose:
      "Audio engine info, AI configuration notes, Editor toggles (autocomplete / tooltips / multi-cursor / etc.), Keybindings selector (codemirror/vscode/vim/emacs), font size, Clear all data.",
  },
];

export default function StudioGuidePage() {
  return (
    <article className="space-y-12">
      <nav className="flex items-center gap-2 font-micro text-[10px] tracking-widest uppercase text-text-dim">
        <span>Docs</span>
        <span>›</span>
        <span className="text-creator">Studio guide</span>
      </nav>

      <section>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tight leading-tight mb-3">
          Studio guide
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
          Every UI element in the studio, what it does, and how to reach it.
          Use this to get oriented — then reach for the in-studio docs panel
          (F1) for task-focused reference on Strudel and the AI.
        </p>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-5">
          Studio is one surface
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl mb-4">
          You're always at the keyboard. The editor, chat, deck, and snippets
          work together as a livecoding kit — no mode toggle, no read-only state.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-creator/30 bg-creator/5 p-5 rounded">
            <h3 className="font-micro text-[11px] tracking-widest text-creator uppercase mb-2">
              You drive
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Edit directly. Chat returns diffs with Listen / Keep / Reject.
              Keep the beat going while you iterate — Strudel hot-swaps code on the next cycle.
            </p>
          </div>
          <div className="border border-agent/30 bg-agent/5 p-5 rounded">
            <h3 className="font-micro text-[11px] tracking-widest text-agent uppercase mb-2">
              Opt in to AUTO
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Toggle <code className="font-mono text-xs text-text">AUTO</code>{" "}
              in the transport bar and the AI evolves your code every 30s —
              your editor stays fully interactive, you just get a steady stream
              of mutation ideas.
            </p>
          </div>
        </div>
        <p className="text-sm text-text-muted leading-relaxed mt-4">
          Want a pure-listening experience? Open{" "}
          <a href="/radio" className="text-listener hover:underline">/radio</a>{" "}
          — that's where the AI composes and broadcasts 24/7.
        </p>
      </section>

      {/* UI areas */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-text tracking-tight mb-5">
          UI map
        </h2>
        <ul className="space-y-3">
          {AREAS.map((area) => (
            <li
              key={area.name}
              className="border border-white/10 bg-surface-1 p-5 rounded"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                <h3 className="font-micro text-[11px] tracking-widest text-text uppercase">
                  {area.name}
                </h3>
                <span className="font-mono text-[10px] text-text-dim">{area.where}</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{area.purpose}</p>
              {area.shortcuts && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {area.shortcuts.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] bg-surface-2 border border-white/10 px-1.5 py-0.5 rounded text-text-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/docs/architecture"
          className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase"
        >
          ← Architecture
        </Link>
        <Link
          href="/docs/agent-skills"
          className="font-micro text-[10px] tracking-widest text-creator uppercase border border-creator/40 hover:bg-creator/10 px-4 py-2 transition-colors"
        >
          Agent skills →
        </Link>
      </section>
    </article>
  );
}
