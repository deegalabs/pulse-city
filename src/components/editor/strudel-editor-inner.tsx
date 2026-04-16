"use client";

import { useEffect, useRef, useCallback } from "react";
import { silence } from "@strudel/core";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput } from "@strudel/webaudio";
import { getDrawContext } from "@strudel/draw";
import { StrudelMirror } from "@strudel/codemirror";
import { INITIAL_CODE } from "@/lib/strudel/constants";
import { getPrebakePromise } from "@/lib/strudel/init";

interface StrudelEditorInnerProps {
  initialCode?: string;
  onToggle?: (playing: boolean) => void;
  onError?: (error: string) => void;
  editorRef?: React.MutableRefObject<StrudelMirror | null>;
}

export default function StrudelEditorInner({
  initialCode,
  onToggle,
  onError,
  editorRef,
}: StrudelEditorInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<StrudelMirror | null>(null);

  const handleToggle = useCallback(
    (isPlaying: boolean) => {
      onToggle?.(isPlaying);
    },
    [onToggle]
  );

  useEffect(() => {
    if (!containerRef.current || mirrorRef.current) return;

    const drawContext = getDrawContext();

    const mirror = new StrudelMirror({
      root: containerRef.current,
      initialCode: initialCode ?? INITIAL_CODE,
      defaultOutput: webaudioOutput,
      getTime: () => getAudioContext().currentTime,
      transpiler,
      autodraw: true,
      drawTime: [-2, 2] as [number, number],
      drawContext,
      pattern: silence,
      prebake: async () => {
        const p = getPrebakePromise();
        if (p) await p;
      },
      onUpdateState: (state: { started?: boolean; error?: { message: string } }) => {
        if (state.started !== undefined) {
          handleToggle(state.started);
        }
        if (state.error) {
          onError?.(state.error.message);
        }
      },
      onToggle: (isPlaying: boolean) => {
        handleToggle(isPlaying);
      },
    });

    mirrorRef.current = mirror;
    if (editorRef) editorRef.current = mirror;

    return () => {
      // StrudelMirror doesn't have a destroy method,
      // but we clear the container on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      mirrorRef.current = null;
      if (editorRef) editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="editor-wrap flex-1 min-h-0 overflow-hidden relative"
    />
  );
}
