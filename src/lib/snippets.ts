export type SnippetCategory =
  | "drums"
  | "bass"
  | "melody"
  | "chords"
  | "fx"
  | "groove"
  | "scales"
  | "modulation";

export interface Snippet {
  id: string;
  label: string;
  description: string;
  category: SnippetCategory;
  tags: string[];
  code: string;
}

export const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  drums: "Drums",
  bass: "Bass",
  melody: "Melody",
  chords: "Chords",
  fx: "FX",
  groove: "Groove",
  scales: "Scales",
  modulation: "Modulation",
};

export const CATEGORY_ORDER: SnippetCategory[] = [
  "drums",
  "bass",
  "melody",
  "chords",
  "groove",
  "fx",
  "modulation",
  "scales",
];

export const SNIPPETS: Snippet[] = [
  // ── Drums ──
  {
    id: "tr909-basic",
    label: "TR-909 four-on-floor",
    description: "Classic house kick + clap + hats",
    category: "drums",
    tags: ["house", "techno", "kick"],
    code: `$: s("bd*4").bank('RolandTR909').gain(.9)
$: s("~ cp ~ cp").bank('RolandTR909').gain(.5)
$: s("hh*8").bank('RolandTR909').gain(perlin.range(.2,.45))`,
  },
  {
    id: "tr808-boom-bap",
    label: "TR-808 boom-bap",
    description: "Hip-hop boom-bap pattern",
    category: "drums",
    tags: ["hiphop", "boom-bap", "808"],
    code: `$: s("bd ~ ~ bd ~ bd ~ ~").bank('RolandTR808').gain(.9)
$: s("~ ~ sd ~").bank('RolandTR808').gain(.7)
$: s("hh*4").bank('RolandTR808').gain(.35)`,
  },
  {
    id: "breaks-amen",
    label: "Amen break",
    description: "Jungle/DnB breakbeat skeleton",
    category: "drums",
    tags: ["jungle", "dnb", "break"],
    code: `$: s("bd ~ ~ bd ~ ~ bd ~").gain(.9)
$: s("~ ~ sd ~ ~ sd ~ sd").gain(.7)
$: s("hh*16").gain(.3).pan(sine.range(0,1))`,
  },
  {
    id: "trap-hats",
    label: "Trap hi-hats",
    description: "Rapid hat rolls with velocity ramp",
    category: "drums",
    tags: ["trap", "hats", "rolls"],
    code: `$: s("hh(7,16)").bank('RolandTR808').gain(rand.range(.2,.6)).speed(rand.range(.9,1.3))`,
  },

  // ── Bass ──
  {
    id: "acid-303",
    label: "Acid 303 bassline",
    description: "Squelchy filtered acid bass",
    category: "bass",
    tags: ["acid", "303", "squelch"],
    code: `$: note("<c2 c2 eb2 g1>").struct("x(5,8)")
  .s('sawtooth').decay(.15).sustain(0)
  .lpf(perlin.range(400,2000)).lpq(12).gain(.55)`,
  },
  {
    id: "sub-bass",
    label: "Sub bass",
    description: "Pure sine sub anchoring the low end",
    category: "bass",
    tags: ["sub", "deep"],
    code: `$: note("<c1 c1 eb1 g1>/2").s('sine').gain(.7).lpf(120)`,
  },
  {
    id: "wobble-bass",
    label: "Wobble bass",
    description: "Dubstep-style filter wobble",
    category: "bass",
    tags: ["dubstep", "wobble", "lfo"],
    code: `$: note("c2*2").s('sawtooth')
  .lpf(sine.range(200,2500).slow(2)).lpq(8)
  .gain(.65).decay(.4).sustain(.3)`,
  },
  {
    id: "walking-bass",
    label: "Walking bass",
    description: "Jazz walking line over I-vi-ii-V",
    category: "bass",
    tags: ["jazz", "walking"],
    code: `$: note("c2 e2 g2 a2 f2 a2 c3 d3 d2 f2 a2 b2 g1 b2 d3 b2")
  .s('triangle').decay(.4).sustain(.2).gain(.55)`,
  },

  // ── Melody ──
  {
    id: "arp-ascending",
    label: "Ascending arpeggio",
    description: "Fast climbing arp on minor triad",
    category: "melody",
    tags: ["arp", "ascending"],
    code: `$: note("<c4 eb4 g4 c5>*4").s('sawtooth')
  .decay(.1).sustain(0).lpf(1800).gain(.3)`,
  },
  {
    id: "pentatonic-lead",
    label: "Pentatonic lead",
    description: "Pentatonic random picks with perlin",
    category: "melody",
    tags: ["pentatonic", "random"],
    code: `$: n("0 2 4 7 9 [7 4]".pick(perlin))
  .scale('C:minorPentatonic').s('square')
  .decay(.2).sustain(0).gain(.4)`,
  },
  {
    id: "plucky-lead",
    label: "Plucky synth lead",
    description: "Short decay pluck with delay",
    category: "melody",
    tags: ["pluck", "lead", "delay"],
    code: `$: note("<e5 g5 b4 d5>*2").s('triangle')
  .decay(.15).sustain(0).delay(.4).delaytime(3/8).delayfeedback(.5)
  .gain(.35)`,
  },

  // ── Chords ──
  {
    id: "jazz-ii-v-i",
    label: "Jazz ii-V-I in C",
    description: "Dmin7 – G7 – Cmaj7 progression",
    category: "chords",
    tags: ["jazz", "progression", "251"],
    code: `$: chord("<Dm7 G7 Cmaj7 Cmaj7>").voicing()
  .s('sine').gain(.3).room(.4)`,
  },
  {
    id: "house-chords",
    label: "House stab chords",
    description: "Off-beat ninth chord stabs",
    category: "chords",
    tags: ["house", "stabs"],
    code: `$: chord("<Am9 Dm9 Fmaj9 G9>").voicing()
  .struct("~ x ~ x").s('sawtooth')
  .decay(.2).sustain(0).lpf(2800).gain(.4)`,
  },
  {
    id: "pad-warm",
    label: "Warm pad",
    description: "Slow ambient pad for background",
    category: "chords",
    tags: ["pad", "ambient", "warm"],
    code: `$: chord("<Cmaj7 Am7 Fmaj7 G7>/2").voicing()
  .s('triangle').attack(.5).release(.8)
  .lpf(1200).gain(.3).room(.7)`,
  },

  // ── Groove ──
  {
    id: "swing-16",
    label: "16th-note swing",
    description: "Apply 60% swing to hats",
    category: "groove",
    tags: ["swing", "shuffle"],
    code: `$: s("hh*16").swingBy(.6, 16).gain(.35)`,
  },
  {
    id: "polyrhythm-3-4",
    label: "3 vs 4 polyrhythm",
    description: "Triplet perc against four-on-floor",
    category: "groove",
    tags: ["polyrhythm", "triplet"],
    code: `$: s("bd*4").bank('RolandTR909').gain(.8)
$: s("cb*3").gain(.4)`,
  },

  // ── FX ──
  {
    id: "dub-delay",
    label: "Dub delay throw",
    description: "Long echo with feedback",
    category: "fx",
    tags: ["dub", "delay", "echo"],
    code: `.delay(.6).delaytime(3/8).delayfeedback(.6).delaysync(1)`,
  },
  {
    id: "reverb-cathedral",
    label: "Cathedral reverb",
    description: "Long hall-style reverb",
    category: "fx",
    tags: ["reverb", "space"],
    code: `.room(.9).roomsize(.9).roomfade(4)`,
  },
  {
    id: "filter-sweep",
    label: "LFO filter sweep",
    description: "Sine-driven low-pass over 8 cycles",
    category: "fx",
    tags: ["filter", "lfo", "sweep"],
    code: `.lpf(sine.range(200,4000).slow(8)).lpq(6)`,
  },
  {
    id: "distortion",
    label: "Saturation / drive",
    description: "Add warm saturation and gain boost",
    category: "fx",
    tags: ["distortion", "drive", "sat"],
    code: `.shape(.4).gain(.9)`,
  },

  // ── Modulation ──
  {
    id: "perlin-gain",
    label: "Perlin gain",
    description: "Organic gain movement",
    category: "modulation",
    tags: ["perlin", "organic"],
    code: `.gain(perlin.range(.3,.7))`,
  },
  {
    id: "pan-walk",
    label: "Stereo pan walk",
    description: "Slow sine-driven panning",
    category: "modulation",
    tags: ["pan", "stereo"],
    code: `.pan(sine.range(0,1).slow(4))`,
  },
  {
    id: "random-speed",
    label: "Random pitch shift",
    description: "Slight random speed per hit",
    category: "modulation",
    tags: ["random", "pitch"],
    code: `.speed(rand.range(.92,1.08))`,
  },

  // ── Scales ──
  {
    id: "minor-scale",
    label: "C minor scale",
    description: "Eighth-note minor scale run",
    category: "scales",
    tags: ["minor", "scale"],
    code: `$: n("0 1 2 3 4 5 6 7").scale('C:minor')
  .s('sine').gain(.3).decay(.15).sustain(0)`,
  },
  {
    id: "phrygian-dominant",
    label: "Phrygian dominant",
    description: "Spanish / flamenco flavor",
    category: "scales",
    tags: ["phrygian", "exotic"],
    code: `$: n("0 1 3 4 5 6 7".pick(perlin))
  .scale('E:phrygianDominant')
  .s('sawtooth').decay(.2).lpf(1500).gain(.35)`,
  },
];

export function snippetsByCategory(): Record<SnippetCategory, Snippet[]> {
  const out = {} as Record<SnippetCategory, Snippet[]>;
  for (const cat of CATEGORY_ORDER) out[cat] = [];
  for (const s of SNIPPETS) out[s.category].push(s);
  return out;
}

export function filterSnippets(query: string, category: SnippetCategory | null): Snippet[] {
  const q = query.trim().toLowerCase();
  return SNIPPETS.filter((s) => {
    if (category && s.category !== category) return false;
    if (!q) return true;
    const haystack = `${s.label} ${s.description} ${s.tags.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}
