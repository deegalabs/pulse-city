import {
  initAudio,
  registerSynthSounds,
  samples,
} from "@strudel/webaudio";
import { evalScope } from "@strudel/core";
import { SAMPLES_URL } from "./constants";

export let initialized = false;
let prebakePromise: Promise<unknown[]> | null = null;

/**
 * Default drum aliases — maps raw `bd`/`hh`/`sd`/etc to TR-909 samples so that
 * `s("bd*4")` without `.bank(...)` actually plays something.
 *
 * Strudel's tidal-drum-machines.json exposes samples as `RolandTR909_bd` etc.;
 * without this extra registration, a bare `s("bd")` has nothing to bind to.
 * Users can still override with `.bank('RolandTR808')` or any other bank.
 *
 * Paths mirror the files inside ritchse/tidal-drum-machines, which is what
 * felixroos/dough-samples points `_base` at.
 */
const DRUM_ALIASES_BASE =
  "https://raw.githubusercontent.com/ritchse/tidal-drum-machines/main/machines/";

const DEFAULT_DRUM_ALIASES: Record<string, string[]> = {
  bd: [
    "RolandTR909/rolandtr909-bd/Bassdrum-01.wav",
    "RolandTR909/rolandtr909-bd/Bassdrum-02.wav",
    "RolandTR909/rolandtr909-bd/Bassdrum-03.wav",
    "RolandTR909/rolandtr909-bd/Bassdrum-04.wav",
  ],
  sd: [
    "RolandTR909/rolandtr909-sd/Snaredrum.wav",
  ],
  cp: [
    "RolandTR909/rolandtr909-cp/Clap.wav",
  ],
  hh: [
    "RolandTR909/rolandtr909-hh/hh01.wav",
    "RolandTR909/rolandtr909-hh/hh02.wav",
    "RolandTR909/rolandtr909-hh/hh03.wav",
    "RolandTR909/rolandtr909-hh/hh04.wav",
  ],
  oh: [
    "RolandTR909/rolandtr909-oh/Openhat.wav",
  ],
  cr: [
    "RolandTR909/rolandtr909-cr/Crash.wav",
  ],
  rd: [
    "RolandTR909/rolandtr909-rd/Ride.wav",
  ],
  lt: [
    "RolandTR909/rolandtr909-lt/Tom L.wav",
  ],
  mt: [
    "RolandTR909/rolandtr909-mt/Tom M.wav",
  ],
  ht: [
    "RolandTR909/rolandtr909-ht/Tom H.wav",
  ],
  rim: [
    "RolandTR909/rolandtr909-rim/Rim.wav",
  ],
  // Perc commonly asked without bank
  cb: ["RolandTR808/roland-tr-808-cb/CB.WAV"],
  ma: ["RolandTR808/roland-tr-808-ma/MA.WAV"],
  rs: ["RolandTR808/roland-tr-808-rs/RS.WAV"],
};

export async function initStrudelAudio() {
  if (initialized) return prebakePromise;

  await initAudio();

  prebakePromise = Promise.all([
    evalScope(
      evalScope,
      import("@strudel/core"),
      import("@strudel/mini"),
      import("@strudel/tonal"),
      import("@strudel/webaudio")
    ),
    registerSynthSounds(),
    samples(`${SAMPLES_URL}/tidal-drum-machines.json`),
    samples(`${SAMPLES_URL}/Dirt-Samples.json`),
    // Register raw drum-name aliases so `s("bd")` works without .bank()
    samples({ _base: DRUM_ALIASES_BASE, ...DEFAULT_DRUM_ALIASES } as unknown as string),
  ]);

  await prebakePromise;
  initialized = true;
  return prebakePromise;
}

export function getPrebakePromise() {
  return prebakePromise;
}
