"use client";

import { useEffect, useRef } from "react";
import type { StrudelMirror } from "@strudel/codemirror";
import { useStore } from "@/lib/store";

const EVOLVE_INTERVAL_MS = 30_000;

interface Options {
  editorRef: React.RefObject<StrudelMirror | null>;
}

export function useAutopilotEvolve({ editorRef }: Options) {
  const { mode, playing, code, setCode, setTrackTitle } = useStore();
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (mode !== "autopilot" || !playing) return;

    const tick = async () => {
      if (inFlightRef.current) return;
      const editor = editorRef.current;
      if (!editor) return;
      const currentCode = useStore.getState().code || code;
      if (!currentCode.trim()) return;

      inFlightRef.current = true;
      try {
        const res = await fetch("/api/evolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentCode }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          code?: string | null;
          title?: string;
        };
        if (data.code && typeof data.code === "string") {
          setCode(data.code);
          if (data.title) setTrackTitle(data.title);
          editor.setCode(data.code);
          editor.evaluate();
        }
      } catch {
        // swallow — autopilot keeps ticking
      } finally {
        inFlightRef.current = false;
      }
    };

    const id = window.setInterval(tick, EVOLVE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [mode, playing, editorRef, code, setCode, setTrackTitle]);
}
