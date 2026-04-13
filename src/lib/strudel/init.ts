import {
  initAudio,
  registerSynthSounds,
  samples,
} from "@strudel/webaudio";
import { evalScope } from "@strudel/core";
import { SAMPLES_URL } from "./constants";

let initialized = false;
let prebakePromise: Promise<unknown[]> | null = null;

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
  ]);

  await prebakePromise;
  initialized = true;
  return prebakePromise;
}

export function getPrebakePromise() {
  return prebakePromise;
}
