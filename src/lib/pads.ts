export type PadAccent = "drum" | "percussion" | "cymbal" | "bass" | "lead";

export interface Pad {
  key: string; // keyboard binding (single char, lowercase)
  label: string;
  description: string;
  /** One-shot preview pattern — plays on click via the parallel preview engine. */
  sound: string;
  /** Full `$:` track line inserted into the editor when Shift-clicked or via an explicit insert action. */
  insertCode: string;
  accent: PadAccent;
}

/**
 * Default 4×4 pad grid — TR-909 core + TR-808 extras + percussion.
 * Inspired by the Akai MPC2000XL layout (Q/W/E/R top row).
 *
 * Click a pad → the parallel preview engine plays `sound` one-shot, independent
 * of whatever the main editor is evaluating.
 * Shift-click (or the + button) → `insertCode` is appended to the editor.
 */
export const DEFAULT_PADS: Pad[][] = [
  // Row 1 — TR-909 core kit (QWER)
  [
    {
      key: "q",
      label: "KICK",
      description: "909 four-on-floor kick",
      sound: `s("bd").bank('RolandTR909').gain(.85)`,
      insertCode: `$: s("bd*4").bank('RolandTR909').gain(.85)`,
      accent: "drum",
    },
    {
      key: "w",
      label: "SNARE",
      description: "909 backbeat snare on 2 & 4",
      sound: `s("sd").bank('RolandTR909').gain(.6)`,
      insertCode: `$: s("~ sd ~ sd").bank('RolandTR909').gain(.6)`,
      accent: "drum",
    },
    {
      key: "e",
      label: "CLAP",
      description: "909 handclap on 2 & 4",
      sound: `s("cp").bank('RolandTR909').gain(.5)`,
      insertCode: `$: s("~ cp ~ cp").bank('RolandTR909').gain(.5)`,
      accent: "percussion",
    },
    {
      key: "r",
      label: "HATS",
      description: "909 eighth-note closed hats",
      sound: `s("hh").bank('RolandTR909').gain(.4)`,
      insertCode: `$: s("hh*8").bank('RolandTR909').gain(.35)`,
      accent: "cymbal",
    },
  ],
  // Row 2 — TR-909 extras (ASDF)
  [
    {
      key: "a",
      label: "O-HAT",
      description: "909 open hat on the offbeat",
      sound: `s("oh").bank('RolandTR909').gain(.5)`,
      insertCode: `$: s("~ oh ~ oh").bank('RolandTR909').gain(.45)`,
      accent: "cymbal",
    },
    {
      key: "s",
      label: "RIDE",
      description: "909 eighth-note ride",
      sound: `s("rd").bank('RolandTR909').gain(.35)`,
      insertCode: `$: s("rd*8").bank('RolandTR909').gain(.3)`,
      accent: "cymbal",
    },
    {
      key: "d",
      label: "CRASH",
      description: "909 crash on bar 1",
      sound: `s("cr").bank('RolandTR909').gain(.5)`,
      insertCode: `$: s("cr ~ ~ ~").bank('RolandTR909').gain(.5)`,
      accent: "cymbal",
    },
    {
      key: "f",
      label: "TOM",
      description: "909 tom roll across bar",
      sound: `s("mt").bank('RolandTR909').gain(.5)`,
      insertCode: `$: s("<lt mt ht>").bank('RolandTR909').gain(.45)`,
      accent: "drum",
    },
  ],
  // Row 3 — TR-808 core (ZXCV)
  [
    {
      key: "z",
      label: "808-KICK",
      description: "808 sub kick, booming",
      sound: `s("bd").bank('RolandTR808').gain(.95)`,
      insertCode: `$: s("bd*2").bank('RolandTR808').gain(.9)`,
      accent: "drum",
    },
    {
      key: "x",
      label: "808-SD",
      description: "808 snare on 2 & 4",
      sound: `s("sd").bank('RolandTR808').gain(.65)`,
      insertCode: `$: s("~ sd ~ sd").bank('RolandTR808').gain(.6)`,
      accent: "drum",
    },
    {
      key: "c",
      label: "808-CP",
      description: "808 clap on 3",
      sound: `s("cp").bank('RolandTR808').gain(.55)`,
      insertCode: `$: s("~ ~ cp ~").bank('RolandTR808').gain(.5)`,
      accent: "percussion",
    },
    {
      key: "v",
      label: "TRAP-HH",
      description: "808 trap hats, 7/16 euclidean",
      sound: `s("hh").bank('RolandTR808').gain(.35)`,
      insertCode: `$: s("hh(7,16)").bank('RolandTR808').gain(.3)`,
      accent: "cymbal",
    },
  ],
  // Row 4 — Percussion + low-end (1234)
  [
    {
      key: "1",
      label: "COWBELL",
      description: "808 cowbell syncopation",
      sound: `s("cb").bank('RolandTR808').gain(.5)`,
      insertCode: `$: s("~ cb ~ cb ~").bank('RolandTR808').gain(.4)`,
      accent: "percussion",
    },
    {
      key: "2",
      label: "MARACA",
      description: "808 maraca sixteenth-note shuffle",
      sound: `s("ma").bank('RolandTR808').gain(.35)`,
      insertCode: `$: s("ma*8").bank('RolandTR808').gain(.25)`,
      accent: "percussion",
    },
    {
      key: "3",
      label: "SUB",
      description: "Deep sub bass C2",
      sound: `note("c2").s('sine').gain(.6).lpf(120)`,
      insertCode: `$: note("c2*2").s('sine').gain(.55).lpf(120)`,
      accent: "bass",
    },
    {
      key: "4",
      label: "STAB",
      description: "Short saw stab Eb3",
      sound: `note("eb3").s('sawtooth').decay(.1).sustain(0).lpf(2000).gain(.4)`,
      insertCode: `$: note("<eb3 g3 bb3>").s('sawtooth').decay(.1).sustain(0).lpf(2000).gain(.3)`,
      accent: "lead",
    },
  ],
];

export const ALL_PADS: Pad[] = DEFAULT_PADS.flat();

export function padByKey(key: string): Pad | undefined {
  const k = key.toLowerCase();
  return ALL_PADS.find((p) => p.key === k);
}
