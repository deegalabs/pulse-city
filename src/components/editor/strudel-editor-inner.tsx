"use client";

import { useEffect, useRef, useCallback } from "react";
import { silence } from "@strudel/core";
import { transpiler } from "@strudel/transpiler";
import { getAudioContext, webaudioOutput } from "@strudel/webaudio";
import { getDrawContext } from "@strudel/draw";
import { StrudelMirror } from "@strudel/codemirror";
import { INITIAL_CODE } from "@/lib/strudel/constants";
import { getPrebakePromise } from "@/lib/strudel/init";
import { useStore } from "@/lib/store";

interface StrudelEditorInnerProps {
  initialCode?: string;
  onToggle?: (playing: boolean) => void;
  onError?: (error: string) => void;
  onChange?: (code: string) => void;
  onEvaluate?: (code: string) => void;
  editorRef?: React.MutableRefObject<StrudelMirror | null>;
}

export default function StrudelEditorInner({
  initialCode,
  onToggle,
  onError,
  onChange,
  onEvaluate,
  editorRef,
}: StrudelEditorInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<StrudelMirror | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onEvaluateRef = useRef(onEvaluate);
  onEvaluateRef.current = onEvaluate;
  const editorSettings = useStore((s) => s.editor);

  const handleToggle = useCallback(
    (isPlaying: boolean) => {
      onToggle?.(isPlaying);
    },
    [onToggle]
  );

  useEffect(() => {
    if (!containerRef.current || mirrorRef.current) return;
    const root = containerRef.current;

    const drawContext = getDrawContext();

    const mirror = new StrudelMirror({
      root,
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
      onUpdateState: (state: { started?: boolean; error?: { message: string }; code?: string }) => {
        if (state.started !== undefined) {
          handleToggle(state.started);
        }
        if (state.error) {
          onError?.(state.error.message);
        }
        if (typeof state.code === "string") {
          onChangeRef.current?.(state.code);
        }
      },
      onToggle: (isPlaying: boolean) => {
        handleToggle(isPlaying);
      },
    });

    mirrorRef.current = mirror;
    if (editorRef) editorRef.current = mirror;

    // Wrap evaluate so studio can track eval events (history, last-eval-at…)
    const mirrorAny = mirror as unknown as {
      evaluate: () => unknown;
      code?: string;
    };
    const originalEvaluate = mirrorAny.evaluate.bind(mirrorAny);
    mirrorAny.evaluate = function wrappedEvaluate() {
      const result = originalEvaluate();
      try {
        onEvaluateRef.current?.(mirrorAny.code ?? "");
      } catch (err) {
        console.error("onEvaluate callback failed:", err);
      }
      return result;
    };

    // Apply initial settings from store
    const s = useStore.getState().editor;
    const m = mirror as unknown as {
      changeSetting: (key: string, value: unknown) => void;
      setFontSize: (size: number) => void;
      setFontFamily: (family: string) => void;
    };
    m.changeSetting("isAutoCompletionEnabled", s.autocomplete);
    m.changeSetting("isTooltipEnabled", s.tooltips);
    m.changeSetting("isBracketMatchingEnabled", s.bracketMatching);
    m.changeSetting("isActiveLineHighlighted", s.activeLine);
    m.changeSetting("isTabIndentationEnabled", s.tabIndent);
    m.changeSetting("isMultiCursorEnabled", s.multiCursor);
    m.changeSetting("isLineWrappingEnabled", s.lineWrapping);
    m.changeSetting("keybindings", s.keybindings);
    m.setFontSize(s.fontSize);

    return () => {
      root.innerHTML = "";
      mirrorRef.current = null;
      if (editorRef) editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to settings changes after mount
  useEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    const m = mirror as unknown as {
      changeSetting: (key: string, value: unknown) => void;
      setFontSize: (size: number) => void;
    };
    m.changeSetting("isAutoCompletionEnabled", editorSettings.autocomplete);
    m.changeSetting("isTooltipEnabled", editorSettings.tooltips);
    m.changeSetting("isBracketMatchingEnabled", editorSettings.bracketMatching);
    m.changeSetting("isActiveLineHighlighted", editorSettings.activeLine);
    m.changeSetting("isTabIndentationEnabled", editorSettings.tabIndent);
    m.changeSetting("isMultiCursorEnabled", editorSettings.multiCursor);
    m.changeSetting("isLineWrappingEnabled", editorSettings.lineWrapping);
    m.changeSetting("keybindings", editorSettings.keybindings);
    m.setFontSize(editorSettings.fontSize);
  }, [editorSettings]);

  return (
    <div
      ref={containerRef}
      className="editor-wrap flex-1 min-h-0 overflow-hidden relative"
    />
  );
}
