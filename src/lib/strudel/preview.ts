"use client";

import { previewPlay, previewStop } from "@/lib/strudel/preview-engine";

/**
 * Thin wrappers so existing callers (DocsModal) don't have to know about the
 * engine module directly. Previously this file manipulated the main editor's
 * repl, which conflicted with the user's playing track — now everything routes
 * through a parallel preview scheduler.
 */

export async function playInlinePreview(code: string): Promise<void> {
  return previewPlay(code);
}

export function revertInlinePreview(): void {
  previewStop();
}
