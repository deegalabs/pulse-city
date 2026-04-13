declare module "@strudel/codemirror" {
  export class StrudelMirror {
    constructor(options: Record<string, unknown>);
    code: string;
    setCode(code: string): void;
    evaluate(): void;
    toggle(): void;
    stop(): void;
  }
}

declare module "@strudel/core" {
  export const silence: unknown;
  export function evalScope(...args: unknown[]): Promise<void>;
}

declare module "@strudel/transpiler" {
  export const transpiler: unknown;
}

declare module "@strudel/webaudio" {
  export function getAudioContext(): AudioContext;
  export const webaudioOutput: unknown;
  export function initAudio(): Promise<void>;
  export function registerSynthSounds(): Promise<void>;
  export function samples(url: string): Promise<void>;
  export function getAnalyzerData(
    type: string,
    channel: number
  ): Float32Array | Uint8Array;
}

declare module "@strudel/draw" {
  export function getDrawContext(): unknown;
}

declare module "@strudel/mini" {}
declare module "@strudel/tonal" {}
