import { SNIPPETS, type Snippet } from "@/lib/snippets";

export interface DocsExample {
  title: string;
  description?: string;
  code: string;
  snippetId?: string;
}

export interface DocsBlock {
  kind: "text" | "example" | "table" | "callout";
  text?: string;
  example?: DocsExample;
  headers?: string[];
  rows?: string[][];
  callout?: { tone: "info" | "warn"; title: string; body: string };
}

export interface DocsSection {
  id: string;
  title: string;
  tagline: string;
  blocks: DocsBlock[];
}

export interface DocsGroup {
  id: string;
  title: string;
  sections: DocsSection[];
}

function snippetAsExample(id: string, overrideTitle?: string): DocsExample {
  const snippet = SNIPPETS.find((s) => s.id === id) as Snippet;
  return {
    title: overrideTitle ?? snippet.label,
    description: snippet.description,
    code: snippet.code,
    snippetId: snippet.id,
  };
}

/**
 * Docs modal content — strictly focused on the Studio task:
 * Strudel, livecoding music, and the AI assistant.
 *
 * Product-level docs (what is pulse.city, architecture, roadmap) live at /docs.
 */
export const DOCS_GROUPS: DocsGroup[] = [
  {
    id: "strudel",
    title: "Strudel",
    sections: [
      {
        id: "mini-notation",
        title: "Mini notation",
        tagline: "The compact language of patterns",
        blocks: [
          {
            kind: "text",
            text:
              "Strudel's mini notation is a DSL for rhythmic patterns. Inside a string, you describe events over one cycle of time.",
          },
          {
            kind: "table",
            headers: ["Syntax", "Meaning"],
            rows: [
              ['"bd sd bd sd"', "Four events spread evenly across one cycle"],
              ['"bd*4"', "Four kick drums in one cycle"],
              ['"bd ~ sd ~"', "~ is a rest (silence)"],
              ['"<bd sd cp>"', "Alternate per cycle: bd → sd → cp → bd"],
              ['"[bd bd] sd"', "Brackets group — both bds fit in first half"],
              ['"bd(3,8)"', "Euclidean rhythm: 3 hits spread over 8 steps"],
              ['"bd/2"', "Slow down: one bd every 2 cycles"],
            ],
          },
          {
            kind: "example",
            example: {
              title: "Putting it together",
              description: "Kick + clap + hats euclidean",
              code: `$: s("bd*4").gain(.8)
$: s("~ cp ~ cp").gain(.6)
$: s("hh(7,8)").gain(.35)`,
            },
          },
        ],
      },
      {
        id: "sounds",
        title: "Sounds — s() and note()",
        tagline: "How to make noise",
        blocks: [
          {
            kind: "text",
            text:
              "s() triggers a sample. note() plays a pitched tone via a synth or sample. Both take a mini-notation string.",
          },
          {
            kind: "example",
            example: {
              title: "Samples from a bank",
              description: "bank() picks a sound library — RolandTR909 is a classic drum machine",
              code: `$: s("bd hh sd hh").bank('RolandTR909').gain(.8)`,
            },
          },
          {
            kind: "example",
            example: {
              title: "Synth notes",
              description: "sawtooth, square, sine, triangle — classic waveforms",
              code: `$: note("<c3 eb3 g3 c4>").s('sawtooth').gain(.4)`,
            },
          },
          {
            kind: "callout",
            callout: {
              tone: "info",
              title: "Autocomplete is your friend",
              body: "Type s(' and the editor lists every available sound bank. Hover any function name to see params + examples.",
            },
          },
        ],
      },
      {
        id: "effects",
        title: "Effects chain",
        tagline: "Everything is a method call",
        blocks: [
          {
            kind: "text",
            text:
              "Strudel uses method chaining — each effect returns a new pattern. Order matters: lpf(2000).gain(.5) and gain(.5).lpf(2000) produce different signal flows.",
          },
          {
            kind: "table",
            headers: ["Method", "What it does"],
            rows: [
              [".gain(x)", "Volume, 0-1"],
              [".pan(x)", "Stereo position, 0=left, 1=right"],
              [".lpf(hz).lpq(q)", "Low-pass filter + resonance"],
              [".room(x)", "Reverb amount, 0-1"],
              [".delay(x).delaytime(t).delayfeedback(fb)", "Delay with time + feedback"],
              [".attack, .decay, .sustain, .release", "ADSR envelope"],
              [".speed(x)", "Pitch + playback speed multiplier"],
              [".slow(n) / .fast(n)", "Time stretch the pattern"],
            ],
          },
          { kind: "example", example: snippetAsExample("dub-delay", "Dub throw effect chain") },
          { kind: "example", example: snippetAsExample("filter-sweep") },
        ],
      },
      {
        id: "continuous",
        title: "Continuous signals",
        tagline: "sine, perlin, rand — moving values",
        blocks: [
          {
            kind: "text",
            text:
              "Beyond discrete events, Strudel has continuous signals — functions of time you can feed into any parameter. They make patterns breathe.",
          },
          {
            kind: "table",
            headers: ["Signal", "Shape"],
            rows: [
              ["sine", "Smooth bipolar oscillation"],
              ["cosine", "Same as sine but shifted 90°"],
              ["square", "Alternates 0/1"],
              ["saw", "Rising ramp 0→1"],
              ["tri", "Triangle wave"],
              ["perlin", "Smooth pseudo-random noise"],
              ["rand", "Per-event random 0-1"],
            ],
          },
          {
            kind: "text",
            text:
              "Use .range(a, b) to map the signal to a custom range. .slow(n) stretches it over n cycles.",
          },
          { kind: "example", example: snippetAsExample("perlin-gain") },
          { kind: "example", example: snippetAsExample("wobble-bass") },
        ],
      },
    ],
  },

  {
    id: "patterns",
    title: "Pattern library",
    sections: [
      {
        id: "drums",
        title: "Drums",
        tagline: "Beats to build on",
        blocks: [
          { kind: "example", example: snippetAsExample("tr909-basic") },
          { kind: "example", example: snippetAsExample("tr808-boom-bap") },
          { kind: "example", example: snippetAsExample("breaks-amen") },
          { kind: "example", example: snippetAsExample("trap-hats") },
        ],
      },
      {
        id: "bass",
        title: "Bass",
        tagline: "Low-end templates",
        blocks: [
          { kind: "example", example: snippetAsExample("acid-303") },
          { kind: "example", example: snippetAsExample("sub-bass") },
          { kind: "example", example: snippetAsExample("wobble-bass") },
          { kind: "example", example: snippetAsExample("walking-bass") },
        ],
      },
      {
        id: "harmony",
        title: "Chords & melody",
        tagline: "Pitched material",
        blocks: [
          { kind: "example", example: snippetAsExample("jazz-ii-v-i") },
          { kind: "example", example: snippetAsExample("house-chords") },
          { kind: "example", example: snippetAsExample("pad-warm") },
          { kind: "example", example: snippetAsExample("pentatonic-lead") },
          { kind: "example", example: snippetAsExample("plucky-lead") },
        ],
      },
    ],
  },

  {
    id: "livecoding",
    title: "Livecoding",
    sections: [
      {
        id: "hot-swap",
        title: "Hot-swapping patterns",
        tagline: "Keep the beat, change the code",
        blocks: [
          {
            kind: "text",
            text:
              "Re-evaluating code mid-playback doesn't stop the clock — Strudel swaps in the new pattern at the next cycle boundary. This means you can rewrite entire sections live without a glitch.",
          },
          {
            kind: "table",
            headers: ["Action", "What happens"],
            rows: [
              ["Ctrl+Enter", "Evaluate the whole document — swaps all tracks"],
              ["Select + Ctrl+Enter", "Evaluate only the selection — leaves other tracks untouched"],
              ["Ctrl+.", "Stop everything"],
              ["$: prefix", "Each line gets its own track — evaluate only its line to swap just that"],
            ],
          },
          {
            kind: "callout",
            callout: {
              tone: "info",
              title: "Track-per-line trick",
              body: "Prefix each line with $: so each becomes an independent track. Then you can mute, edit, and re-evaluate individual layers without affecting the rest.",
            },
          },
        ],
      },
      {
        id: "energy-arc",
        title: "Building energy",
        tagline: "Sparse → dense, calm → peak",
        blocks: [
          {
            kind: "text",
            text:
              "A good track breathes. Start sparse, add layers, peak, strip back. Some techniques:",
          },
          {
            kind: "table",
            headers: ["Move", "How to do it"],
            rows: [
              ["Add density", "Increase the Euclidean N: bd(3,8) → bd(5,8)"],
              ["Filter-open", "lpf ramp: lpf(sine.range(400, 4000).slow(16))"],
              ["Sidechain feel", "gain(sine.range(.3, 1).slow(2)) on pads"],
              ["Build with hats", 'Rising: "hh(1,16)" → "hh(3,16)" → "hh(7,16)" → "hh*16"'],
              ["Release tension", "Mute kick, keep pad + reverb tail"],
            ],
          },
          {
            kind: "example",
            example: {
              title: "Sparse intro that fills in",
              description: "Rising Euclidean hats + gradual filter open",
              code: `$: s("bd ~ ~ bd ~ ~ bd ~").gain(.7)
$: s("hh(3,16)").gain(perlin.range(.1,.4))
$: note("<c2 c2 eb2 g1>/2").s('sawtooth')
  .lpf(sine.range(400, 2200).slow(8))
  .decay(.3).sustain(.1).gain(.5)`,
            },
          },
        ],
      },
      {
        id: "transitions",
        title: "Transitions",
        tagline: "Fill-ins, drops, risers",
        blocks: [
          {
            kind: "text",
            text:
              "Single-bar fills bridge sections. Mute everything but one element on bar 8 or 16, then drop back in.",
          },
          {
            kind: "example",
            example: {
              title: "Snare fill every 8 bars",
              description: 'every(8, ...) applies a transform on every Nth cycle',
              code: `$: s("sd").every(8, fast(4)).gain(.6)`,
            },
          },
          {
            kind: "example",
            example: {
              title: "Noise riser",
              description: "White noise with a rising filter — tension builder",
              code: `$: s("white").struct("x")
  .lpf(sine.range(200, 8000).slow(4))
  .gain(.3).release(4)`,
            },
          },
        ],
      },
      {
        id: "arrangement",
        title: "Arrangement with labels",
        tagline: "Plain comments become landmarks",
        blocks: [
          {
            kind: "text",
            text:
              "Strudel doesn't have a timeline, but comments do the work. Use // labels for sections you plan to jump between. Group code under labels so you can quickly toggle whole blocks with comments.",
          },
          {
            kind: "example",
            example: {
              title: "Labelled arrangement",
              description: "Comment // out to mute a section live",
              code: `// intro — just pad
$: note("<c3 eb3>/4").s('triangle').attack(1).gain(.3)

// drums
$: s("bd*4").bank('RolandTR909').gain(.8)
$: s("hh*8").gain(.3)

// bass (uncomment to drop)
// $: note("c2*2").s('sawtooth').lpf(600).gain(.5)`,
            },
          },
        ],
      },
    ],
  },

  {
    id: "ai",
    title: "AI assistant",
    sections: [
      {
        id: "how-chat-works",
        title: "How the chat works",
        tagline: "Copilot, always",
        blocks: [
          {
            kind: "text",
            text:
              "The chat is a copilot — every response with code is a diff proposal, not a commit. The backend's model router picks Haiku for small nudges and Sonnet for bigger changes.",
          },
          {
            kind: "text",
            text:
              "Every response that contains code is presented as a diff against your current editor content. Actions:",
          },
          {
            kind: "table",
            headers: ["Action", "What it does"],
            rows: [
              ["▶ Listen", "Temporarily swap the playing pattern to the proposed code"],
              ["✓ Keep", "Commit the change to the editor"],
              ["✕ Reject", "Revert to the snapshot taken before Listen"],
            ],
          },
          {
            kind: "callout",
            callout: {
              tone: "info",
              title: "The agent sees your code",
              body: "Every message includes your current editor content as context. You can say 'the hihats' or 'the third line' instead of repeating code — it knows what you mean.",
            },
          },
        ],
      },
      {
        id: "good-prompts",
        title: "Writing good prompts",
        tagline: "Specific intent > vague adjectives",
        blocks: [
          {
            kind: "table",
            headers: ["Instead of…", "Try…"],
            rows: [
              ['"make it better"', '"darker filter sweep on the bassline, less delay on the hats"'],
              ['"new track"', '"deep house, A minor, 122 BPM, warm pads, rolling bassline"'],
              ['"add something"', '"add a pad that outlines the current chord progression"'],
              ['"remove the lead"', '"mute the lead line but keep everything else"'],
              ['"fix this"', '"the kick and bass are fighting — duck the bass when the kick hits"'],
            ],
          },
        ],
      },
      {
        id: "prompt-recipes",
        title: "Prompt recipes",
        tagline: "Cut-and-paste prompts that work",
        blocks: [
          {
            kind: "text",
            text: "Drum tweaks",
          },
          {
            kind: "table",
            headers: ["Goal", "Prompt"],
            rows: [
              ["Punchier kick", '"make the kick punchier — shorter decay, more click"'],
              ["Ghost snares", '"add ghost snares on the 16th before the 2 and 4"'],
              ["Add swing", '"apply 55% swing to the hats only"'],
              ["Thinner hats", '"reduce the hats — just on the offbeats"'],
            ],
          },
          { kind: "text", text: "Mood shifts" },
          {
            kind: "table",
            headers: ["Goal", "Prompt"],
            rows: [
              ["Darker", '"darken everything — lower the lpf on the bass and synths by 30%"'],
              ["More space", '"add reverb and delay to the lead, nothing else"'],
              ["Brighter", '"open up the filter on the pad over 8 cycles"'],
              ["Tighter", '"pull reverb and delay back — keep it dry"'],
            ],
          },
          { kind: "text", text: "Arrangement moves" },
          {
            kind: "table",
            headers: ["Goal", "Prompt"],
            rows: [
              ["Build a drop", '"build a drop at cycle 16 — mute kick and bass, filter sweep up, then everything back"'],
              ["B section", '"give me a B section of this — same vibe, different chord progression"'],
              ["Halftime", '"turn this into a half-time feel"'],
              ["Breakdown", '"breakdown — strip to pad and one drum element"'],
            ],
          },
          { kind: "text", text: "Debugging" },
          {
            kind: "table",
            headers: ["Situation", "Prompt"],
            rows: [
              ["Too busy", '"too busy — simplify, keep only what matters"'],
              ["Low-end mud", '"the low end is muddy — clean it up"'],
              ["Explain error", '"why is this throwing an error?"'],
              ["Explain line", '"explain what the third line is doing"'],
            ],
          },
        ],
      },
      {
        id: "skills",
        title: "Agent skills reference",
        tagline: "What the agent can do",
        blocks: [
          {
            kind: "text",
            text:
              "The agent has a catalog of discrete skills — named capabilities routed to specific prompts and models. Shipped skills:",
          },
          {
            kind: "table",
            headers: ["Skill", "Triggered by", "Returns"],
            rows: [
              ["compose-genre", 'DJ deck → COMPOSE · chat: "make a deep house track"', "code + title"],
              ["evolve", 'Transport EVOLVE · autopilot interval · chat: "evolve this"', "code"],
              ["add-layer", 'DJ deck → [+ Kick/Hats/…] · chat: "add a bassline"', "code"],
              ["edit-filter", 'chat: "darker filter on the lead"', "code"],
              ["edit-swap", 'chat: "mute the hats", "swap 909 for 808"', "code"],
            ],
          },
          {
            kind: "text",
            text:
              "Planned: transpose, tempo-change, explain-function, explain-pattern, debug-error, build-drop, variation. See the full spec at /docs/agent-skills.",
          },
        ],
      },
      {
        id: "deck",
        title: "DJ deck workflow",
        tagline: "Structured prompts without typing them",
        blocks: [
          {
            kind: "text",
            text:
              "The DJ deck (Cmd+J) builds a structured prompt from UI selections and sends it to the composer. It's the fastest way to anchor a vibe without writing prose.",
          },
          {
            kind: "table",
            headers: ["Control", "Effect on the prompt"],
            rows: [
              ["Genre", "Injects a style description (warm pads / driving kick / etc.)"],
              ["Key", "Constrains scales and root notes"],
              ["BPM", "Tempo — appended as a hard constraint"],
              ["Energy", "Adjectives: sparse → restrained → medium → energetic → relentless"],
              ["Space", "Reverb/delay feel: tight → close → some room → spacious → cavernous"],
              ["Brightness", "Filter tone: dark → muted → natural → bright → crystalline"],
            ],
          },
          {
            kind: "callout",
            callout: {
              tone: "info",
              title: "Compose vs Add layer",
              body: "COMPOSE replaces the editor with a fresh track. Add layer buttons (Kick/Hats/…) keep existing code and ask the AI to contribute one part, respecting current key + energy.",
            },
          },
        ],
      },
    ],
  },

  {
    id: "reference",
    title: "Reference",
    sections: [
      {
        id: "shortcuts",
        title: "Keyboard shortcuts",
        tagline: "Studio-only (press ? for the overlay)",
        blocks: [
          {
            kind: "table",
            headers: ["Shortcut", "Action"],
            rows: [
              ["Ctrl/Cmd + Enter", "Evaluate current code (play)"],
              ["Ctrl/Cmd + S", "Save pattern"],
              ["Ctrl/Cmd + K", "Snippets palette"],
              ["Ctrl/Cmd + J", "DJ deck"],
              ["F1 or Ctrl/Cmd + /", "These docs"],
              ["Ctrl/Cmd + Shift + P", "Command palette"],
              ["?", "Shortcut reference overlay"],
              ["Ctrl/Cmd + =/-/0", "Font size up / down / reset"],
              ["Ctrl/Cmd + Click", "Add cursor (multi-cursor)"],
              ["Esc", "Close any overlay"],
            ],
          },
          {
            kind: "callout",
            callout: {
              tone: "info",
              title: "Vim mode",
              body: "Settings → Editor → Keybindings. :w evaluates, :q stops, gc toggles line comment.",
            },
          },
        ],
      },
      {
        id: "editor-settings",
        title: "Editor settings",
        tagline: "Turn on what helps",
        blocks: [
          {
            kind: "table",
            headers: ["Setting", "Default", "Purpose"],
            rows: [
              ["Autocomplete", "on", "Function names, sound banks, chord symbols"],
              ["Hover docs", "on", "Tooltip with params + examples"],
              ["Bracket matching", "on", "Highlight matching brackets"],
              ["Active line", "on", "Highlight current line"],
              ["Tab indent", "on", "Tab inserts indent (off: moves focus)"],
              ["Multi-cursor", "on", "Cmd/Ctrl+Click adds cursor"],
              ["Line wrapping", "off", "Wrap vs scroll for long lines"],
              ["Keybindings", "codemirror", "codemirror / vscode / vim / emacs"],
            ],
          },
        ],
      },
      {
        id: "elsewhere",
        title: "Elsewhere in pulse.city",
        tagline: "Beyond the studio",
        blocks: [
          {
            kind: "text",
            text:
              "This docs panel is scoped to the Studio task — Strudel + livecoding + AI. For product-level docs (what pulse.city is, architecture, agent skills spec, roadmap), open the full docs site.",
          },
          {
            kind: "table",
            headers: ["Destination", "What's there"],
            rows: [
              ["/docs/introduction", "What pulse.city is, core concepts"],
              ["/docs/quick-start", "Eight-step onboarding"],
              ["/docs/architecture", "How studio ↔ radio ↔ AI ↔ scheduler fit together"],
              ["/docs/studio-guide", "Every UI element in the studio, explained"],
              ["/docs/agent-skills", "Formal catalog of AI capabilities"],
              ["/radio", "The always-live radio page"],
              ["/library", "Your saved patterns"],
            ],
          },
        ],
      },
    ],
  },
];

export function allDocsSections(): DocsSection[] {
  return DOCS_GROUPS.flatMap((g) => g.sections);
}

export function findSection(id: string): DocsSection | undefined {
  return allDocsSections().find((s) => s.id === id);
}
