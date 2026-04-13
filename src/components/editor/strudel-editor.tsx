"use client";

import dynamic from "next/dynamic";

const StrudelEditorInner = dynamic(() => import("./strudel-editor-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-bg text-text-dim font-heading text-xs tracking-widest">
      LOADING EDITOR...
    </div>
  ),
});

export { StrudelEditorInner as StrudelEditor };
export type { default as StrudelEditorInnerType } from "./strudel-editor-inner";
