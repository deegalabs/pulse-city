import Link from "next/link";

interface Skill {
  id: string;
  label: string;
  category: "compose" | "edit" | "explain" | "transform";
  description: string;
  triggers: string[];
  output: "code" | "text" | "code+text";
  status: "planned" | "in-progress" | "shipped";
}

const SKILLS: Skill[] = [
  // ── Compose ──
  {
    id: "compose-genre",
    label: "Compose by genre",
    category: "compose",
    description:
      "Generate a full track in a named genre (deep-house, techno, trap, ambient, jazz…). Respects key and BPM if provided.",
    triggers: ["DJ deck → COMPOSE", "chat: \"make a deep house track\""],
    output: "code+text",
    status: "shipped",
  },
  {
    id: "compose-evolve",
    label: "Evolve current pattern",
    category: "compose",
    description:
      "Small mutation of the current code — same structure, tweaked details. Used by autopilot every 30s and by the EVOLVE button.",
    triggers: ["Transport bar EVOLVE", "autopilot interval", "chat: \"evolve this\""],
    output: "code",
    status: "shipped",
  },
  {
    id: "compose-layer",
    label: "Add a specific layer",
    category: "compose",
    description:
      "Add a kick, hats, snare, bass, lead, pad, or FX chain to the current code while preserving the rest. Driven by deck layer buttons.",
    triggers: ["DJ deck → [+ Kick/Hats/…]", "chat: \"add a bassline\""],
    output: "code",
    status: "shipped",
  },

  // ── Edit ──
  {
    id: "edit-filter",
    label: "Tweak a parameter",
    category: "edit",
    description:
      "Modify a specific effect or parameter — filter cutoff, reverb amount, delay feedback, gain, pan — without rewriting structure.",
    triggers: ["chat: \"darker filter on the lead\""],
    output: "code",
    status: "shipped",
  },
  {
    id: "edit-swap",
    label: "Swap / mute a layer",
    category: "edit",
    description:
      "Replace a sound bank, silence a track, or comment out a line. Keeps everything else intact.",
    triggers: ["chat: \"mute the hats\", \"swap 909 for 808\""],
    output: "code",
    status: "shipped",
  },
  {
    id: "edit-transpose",
    label: "Transpose / change key",
    category: "transform",
    description:
      "Shift pitched content to a new key while respecting mode (minor/major/phrygian etc.).",
    triggers: ["chat: \"transpose to F minor\""],
    output: "code",
    status: "planned",
  },
  {
    id: "edit-tempo",
    label: "Change BPM or time feel",
    category: "transform",
    description:
      "Re-time the pattern (halftime, double-time, swing). Recomputes eighth/sixteenth ratios.",
    triggers: ["chat: \"half-time\"", "chat: \"add 60% swing\""],
    output: "code",
    status: "planned",
  },

  // ── Explain ──
  {
    id: "explain-function",
    label: "Explain a function",
    category: "explain",
    description:
      "Describe what a Strudel function does, with examples. Complements the on-hover JSDoc tooltip with a conversational answer.",
    triggers: ["chat: \"what does perlin.range do?\""],
    output: "text",
    status: "planned",
  },
  {
    id: "explain-pattern",
    label: "Explain current pattern",
    category: "explain",
    description:
      "Walk the user through what each line of the current code is doing, in plain language. Good for learners.",
    triggers: ["chat: \"explain this code\""],
    output: "text",
    status: "planned",
  },
  {
    id: "explain-debug",
    label: "Debug an error",
    category: "explain",
    description:
      "Look at the current error state (from Strudel's evaluator) and suggest a fix. Covers syntax, unknown banks, mismatched parens.",
    triggers: ["auto: on eval error", "chat: \"why is this broken?\""],
    output: "code+text",
    status: "planned",
  },

  // ── Transform ──
  {
    id: "transform-drop",
    label: "Build a drop",
    category: "transform",
    description:
      "Construct a tension/release moment — mute / low-pass sweep / reintroduce — either inline or as labeled sections.",
    triggers: ["ToolsPanel DROP button", "chat: \"build a drop\""],
    output: "code",
    status: "in-progress",
  },
  {
    id: "transform-variation",
    label: "Create a variation",
    category: "transform",
    description:
      "Derive a named alternate section (A/B, intro, bridge) from the current pattern. Used for live arrangement.",
    triggers: ["chat: \"give me a B section\""],
    output: "code",
    status: "planned",
  },
];

const CATEGORY_LABELS = {
  compose: "Compose",
  edit: "Edit",
  explain: "Explain",
  transform: "Transform",
};

const STATUS_STYLES: Record<Skill["status"], string> = {
  shipped: "border-creator/40 text-creator bg-creator/5",
  "in-progress": "border-signal-warn/40 text-signal-warn bg-signal-warn/5",
  planned: "border-white/10 text-text-dim bg-transparent",
};

export default function AgentSkillsPage() {
  const groups = (["compose", "edit", "explain", "transform"] as const).map((cat) => ({
    id: cat,
    label: CATEGORY_LABELS[cat],
    skills: SKILLS.filter((s) => s.category === cat),
  }));

  const shipped = SKILLS.filter((s) => s.status === "shipped").length;
  const inProgress = SKILLS.filter((s) => s.status === "in-progress").length;
  const planned = SKILLS.filter((s) => s.status === "planned").length;

  return (
    <article className="space-y-12">
      <nav className="flex items-center gap-2 font-micro text-[10px] tracking-widest uppercase text-text-dim">
        <span>Docs</span>
        <span>›</span>
        <span className="text-creator">Agent skills</span>
      </nav>

      <section>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-text tracking-tight leading-tight mb-3">
          Agent skills
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
          A <em className="text-text">skill</em> is a discrete capability the chat
          agent can invoke. This spec defines the catalog we're building toward —
          what the AI can do, how to trigger it, and what it returns.
        </p>
      </section>

      <section className="border border-white/10 bg-surface-1 rounded p-5">
        <h2 className="font-micro text-[11px] tracking-widest text-creator uppercase mb-4">
          Why skills?
        </h2>
        <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
          Today the chat agent is a single generalist prompt — the user types and
          hopes. Skills formalize the contract: each skill has a clear trigger,
          input shape, output (code vs text vs both), and a focused system prompt
          tuned to its job. This enables:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-text-muted leading-relaxed list-disc pl-5">
          <li>Cheaper routing — explain/debug skills use Haiku; compose uses Sonnet.</li>
          <li>Predictable UX — users know what to ask, the agent knows how to answer.</li>
          <li>Testable behaviors — each skill gets its own evals.</li>
          <li>Discoverability — skills appear as quick actions in the chat.</li>
        </ul>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "Shipped", value: shipped, color: "text-creator border-creator/40" },
          { label: "In progress", value: inProgress, color: "text-signal-warn border-signal-warn/40" },
          { label: "Planned", value: planned, color: "text-text-dim border-white/10" },
        ].map((s) => (
          <div key={s.label} className={`border ${s.color} p-4 rounded`}>
            <div className="font-mono text-3xl">{s.value}</div>
            <div className="font-micro text-[10px] tracking-widest uppercase mt-1 opacity-80">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Catalog */}
      {groups.map((group) => (
        <section key={group.id}>
          <h2 className="font-heading text-xl font-bold text-text tracking-tight mb-4">
            {group.label}
          </h2>
          <ul className="space-y-3">
            {group.skills.map((skill) => (
              <li
                key={skill.id}
                className="border border-white/10 bg-surface-1 rounded p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-micro text-[11px] tracking-widest text-text uppercase">
                      {skill.label}
                    </div>
                    <div className="font-mono text-[10px] text-text-dim mt-0.5">
                      {skill.id}
                    </div>
                  </div>
                  <span
                    className={`font-micro text-[9px] tracking-widest uppercase border px-2 py-0.5 shrink-0 ${STATUS_STYLES[skill.status]}`}
                  >
                    {skill.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-3">
                  {skill.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="font-micro text-[9px] tracking-widest text-text-dim uppercase mb-1">
                      Triggers
                    </div>
                    <ul className="font-mono text-[11px] text-text-muted space-y-0.5">
                      {skill.triggers.map((t) => (
                        <li key={t}>· {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-micro text-[9px] tracking-widest text-text-dim uppercase mb-1">
                      Returns
                    </div>
                    <div className="font-mono text-[11px] text-text-muted">
                      {skill.output}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/docs/studio-guide"
          className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase"
        >
          ← Studio guide
        </Link>
        <Link
          href="/studio"
          className="font-micro text-[10px] tracking-widest text-creator uppercase border border-creator/40 hover:bg-creator/10 px-4 py-2 transition-colors"
        >
          Open Studio →
        </Link>
      </section>
    </article>
  );
}
