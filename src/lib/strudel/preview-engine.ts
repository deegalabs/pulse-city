"use client";

// @strudel/core doesn't ship TS types for `repl` — import at runtime and cast.
import * as StrudelCore from "@strudel/core";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput } from "@strudel/webaudio";
import { getPrebakePromise } from "@/lib/strudel/init";

const repl = (StrudelCore as unknown as {
  repl: (options: Record<string, unknown>) => PreviewRepl;
}).repl;

/**
 * A dedicated Strudel repl+scheduler for previewing docs/snippet code.
 *
 * Why a separate instance?
 * - The main Studio editor owns its own StrudelMirror with its own Cyclist
 *   scheduler. Evaluating preview code on it would stop whatever the user
 *   was playing and rewrite their active pattern.
 * - A separate `repl()` call creates an independent scheduler. Both schedulers
 *   schedule haps into the same AudioContext destination — audio sums at the
 *   output. So preview plays OVER the main track without interfering with it.
 * - Sample cache and evalScope registrations are module-global in Strudel, so
 *   the preview engine inherits everything the main editor has already loaded.
 *
 * Only one preview plays at a time — clicking Listen on a different example
 * replaces the current preview. Stopping the preview does NOT stop the main
 * editor.
 */

type PreviewRepl = {
  evaluate: (
    code: string,
    autostart?: boolean,
    shouldHush?: boolean
  ) => Promise<unknown>;
  stop: () => void;
  start: () => void;
  pause: () => void;
  setCps: (cps: number) => void;
  state: { started: boolean };
  scheduler: { start: () => void; stop: () => void };
};

let instance: PreviewRepl | null = null;
let isStarted = false;

function ensureEngine(): PreviewRepl {
  if (instance) return instance;
  instance = repl({
    defaultOutput: webaudioOutput,
    getTime: () => getAudioContext().currentTime,
    transpiler,
    id: "pulse-preview",
    onToggle: (started: boolean) => {
      isStarted = started;
    },
    prebake: async () => {
      const p = getPrebakePromise();
      if (p) await p;
    },
  });
  return instance;
}

async function awaitSamplesReady(): Promise<void> {
  const p = getPrebakePromise();
  if (p) {
    try {
      await p;
    } catch {
      // swallow — preview will fail later with a clearer error
    }
  }
}

/**
 * Play the given code on the preview engine. Stops any previous preview first.
 * Does NOT touch the main editor or its scheduler.
 */
export async function previewPlay(code: string): Promise<void> {
  const trimmed = code.trim();
  if (!trimmed) return;
  await awaitSamplesReady();
  const engine = ensureEngine();
  try {
    await engine.evaluate(trimmed, true, true);
  } catch (err) {
    console.error("Preview engine: evaluate failed", err);
  }
}

/**
 * Stop the preview engine. Main editor keeps playing whatever it had.
 */
export function previewStop(): void {
  if (!instance) return;
  try {
    instance.stop();
  } catch (err) {
    console.error("Preview engine: stop failed", err);
  }
}

export function isPreviewPlaying(): boolean {
  return !!instance && isStarted;
}
