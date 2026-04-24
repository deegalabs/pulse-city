"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DOCS_GROUPS,
  allDocsSections,
  type DocsBlock,
  type DocsExample,
  type DocsSection,
} from "@/lib/docs/content";
import {
  playInlinePreview,
  revertInlinePreview,
} from "@/lib/strudel/preview";
import { setAudioOutput as setSinkIdOnContext } from "@/lib/audio/output-devices";
import { useStore } from "@/lib/store";

interface DocsModalProps {
  open: boolean;
  onClose: () => void;
  onInsert?: (code: string) => void;
}

function searchSections(query: string): DocsSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allDocsSections().filter((s) => {
    const haystack = [
      s.title,
      s.tagline,
      ...s.blocks.flatMap((b) => [
        b.text ?? "",
        b.example?.title ?? "",
        b.example?.description ?? "",
        b.callout?.title ?? "",
        b.callout?.body ?? "",
      ]),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

function Example({
  example,
  previewing,
  cueEnabled,
  onToggleCue,
  cueAvailable,
  onListen,
  onRevert,
  onInsert,
}: {
  example: DocsExample;
  previewing: boolean;
  cueEnabled: boolean;
  cueAvailable: boolean;
  onToggleCue: () => void;
  onListen?: () => void;
  onRevert?: () => void;
  onInsert?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };
  return (
    <div className="border border-white/10 rounded overflow-hidden bg-base/60">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-1 border-b border-white/10 gap-2">
        <div className="min-w-0">
          <div className="font-micro text-[10px] tracking-widest text-text uppercase truncate">
            {example.title}
          </div>
          {example.description && (
            <div className="font-micro text-[9px] tracking-wide text-text-dim truncate">
              {example.description}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleCue}
            disabled={!cueAvailable}
            title={
              cueAvailable
                ? "Route this preview to the cue output (set in Settings → Audio Output)"
                : "Set a distinct Cue device in Settings → Audio Output to enable"
            }
            className={`font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              cueEnabled
                ? "bg-signal-warn/15 border-signal-warn text-signal-warn"
                : "border-white/10 text-text-dim hover:text-text hover:border-white/20"
            }`}
          >
            CUE
          </button>
          <button
            onClick={previewing ? onRevert : onListen}
            className={`font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border cursor-pointer transition-colors ${
              previewing
                ? "bg-listener/15 border-listener text-listener"
                : "border-listener/40 text-listener hover:bg-listener/10"
            }`}
          >
            {previewing ? "▪ Stop" : "▶ Listen"}
          </button>
          {onInsert && (
            <button
              onClick={onInsert}
              className="font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border border-creator/40 text-creator hover:bg-creator/10 cursor-pointer transition-colors"
              title="Insert at cursor"
            >
              ↵ Insert
            </button>
          )}
          <button
            onClick={handleCopy}
            className="font-micro text-[9px] tracking-widest uppercase px-2 py-0.5 border border-white/10 text-text-dim hover:text-text hover:border-white/20 cursor-pointer transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="font-mono text-[11px] leading-relaxed text-text p-3 overflow-x-auto whitespace-pre">
        {example.code}
      </pre>
    </div>
  );
}

function Block({
  block,
  onListen,
  onRevert,
  onInsert,
  previewingCode,
  cueEnabled,
  onToggleCue,
  cueAvailable,
}: {
  block: DocsBlock;
  onListen?: (code: string) => void;
  onRevert?: () => void;
  onInsert?: (code: string) => void;
  previewingCode?: string | null;
  cueEnabled: (code: string) => boolean;
  onToggleCue: (code: string) => void;
  cueAvailable: boolean;
}) {
  if (block.kind === "text") {
    return (
      <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
        {block.text}
      </p>
    );
  }
  if (block.kind === "callout") {
    const tone = block.callout?.tone ?? "info";
    const toneClass =
      tone === "warn"
        ? "border-signal-warn/40 bg-signal-warn/5 text-signal-warn"
        : "border-listener/40 bg-listener/5 text-listener";
    return (
      <div className={`border ${toneClass} rounded px-4 py-3`}>
        <div className="font-micro text-[10px] tracking-widest uppercase mb-1">
          {block.callout?.title}
        </div>
        <div className="text-sm text-text-muted leading-relaxed">
          {block.callout?.body}
        </div>
      </div>
    );
  }
  if (block.kind === "table") {
    return (
      <div className="border border-white/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-1">
            <tr>
              {block.headers?.map((h) => (
                <th
                  key={h}
                  className="text-left font-micro text-[10px] tracking-widest uppercase text-text-dim px-3 py-2 border-b border-white/10"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows?.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2 align-top ${
                      j === 0
                        ? "font-mono text-xs text-text"
                        : "text-sm text-text-muted"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.kind === "example" && block.example) {
    const code = block.example.code;
    const previewing = !!previewingCode && previewingCode === code;
    return (
      <Example
        example={block.example}
        previewing={previewing}
        cueEnabled={cueEnabled(code)}
        onToggleCue={() => onToggleCue(code)}
        cueAvailable={cueAvailable}
        onListen={onListen ? () => onListen(code) : undefined}
        onRevert={onRevert}
        onInsert={onInsert ? () => onInsert(code) : undefined}
      />
    );
  }
  return null;
}

export function DocsModal({
  open,
  onClose,
  onInsert,
}: DocsModalProps) {
  const [activeId, setActiveId] = useState<string>(DOCS_GROUPS[0].sections[0].id);
  const [query, setQuery] = useState("");
  const [previewingCode, setPreviewingCode] = useState<string | null>(null);
  const [cueByCode, setCueByCode] = useState<Set<string>>(() => new Set());
  const previousSinkRef = useRef<string | null>(null);

  const { mainDeviceId, cueDeviceId } = useStore((s) => s.audio);
  // Cue is "available" when the user has picked a distinct cue device
  const cueAvailable = !!cueDeviceId && cueDeviceId !== mainDeviceId;

  const cueEnabled = useCallback(
    (code: string) => cueByCode.has(code) && cueAvailable,
    [cueByCode, cueAvailable]
  );

  const toggleCue = useCallback((code: string) => {
    setCueByCode((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const stopInlinePreview = useCallback(async () => {
    revertInlinePreview();
    if (previousSinkRef.current !== null) {
      await setSinkIdOnContext(previousSinkRef.current);
      previousSinkRef.current = null;
    }
    setPreviewingCode(null);
  }, []);

  const handleListen = useCallback(
    async (code: string) => {
      if (previewingCode === code) {
        await stopInlinePreview();
        return;
      }
      // If another example was previewing, stop it first (restore routing)
      if (previewingCode !== null) {
        await stopInlinePreview();
      }
      // Route to cue device if enabled
      if (cueEnabled(code) && cueDeviceId) {
        const current =
          ((await import("@/lib/audio/output-devices")).getCurrentOutputSinkId?.() ?? "") || "";
        previousSinkRef.current = current;
        await setSinkIdOnContext(cueDeviceId);
      }
      // Set state before awaiting so the spinner/indicator shows immediately
      setPreviewingCode(code);
      await playInlinePreview(code);
    },
    [previewingCode, cueEnabled, cueDeviceId, stopInlinePreview]
  );

  const handleRevert = useCallback(async () => {
    await stopInlinePreview();
  }, [stopInlinePreview]);
  const searchResults = useMemo(() => searchSections(query), [query]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
  }, [open]);

  // Auto-stop any running preview when the drawer closes
  useEffect(() => {
    if (open) return;
    stopInlinePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeSection = allDocsSections().find((s) => s.id === activeId);
  const showingSearch = query.trim().length > 0;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed right-0 top-0 bottom-0 z-40 flex flex-col bg-surface-1 border-l border-white/10 shadow-2xl transition-transform duration-200 ease-out ${
        open
          ? "translate-x-0 pointer-events-auto"
          : "translate-x-full pointer-events-none"
      }`}
      style={{
        width: "min(100vw, 520px)",
      }}
    >
      {open && (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
            <h2 className="font-heading font-bold text-base text-text tracking-tight shrink-0">
              DOCS
            </h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs…"
              className="flex-1 bg-base border border-white/10 px-3 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-creator/40 transition-colors placeholder:text-text-dim/60 min-w-0"
            />
            <a
              href="/docs/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer shrink-0 hidden sm:inline"
              title="Open full docs site in a new tab"
            >
              ↗
            </a>
            <button
              onClick={onClose}
              className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer shrink-0"
              aria-label="Close docs"
              title="Close (Esc)"
            >
              [ ✕ ]
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {/* Sidebar */}
            <nav className="w-40 shrink-0 border-r border-white/10 overflow-y-auto py-3">
            {DOCS_GROUPS.map((group) => (
              <div key={group.id} className="mb-5">
                <h3 className="font-micro text-[9px] tracking-widest uppercase text-text-dim mb-1.5 px-2">
                  {group.title}
                </h3>
                <ul className="space-y-0.5">
                  {group.sections.map((s) => {
                    const active = s.id === activeId && !showingSearch;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => {
                            setActiveId(s.id);
                            setQuery("");
                          }}
                          className={`w-full text-left font-micro text-[10px] tracking-widest uppercase px-2 py-1.5 cursor-pointer transition-colors ${
                            active
                              ? "bg-creator/10 text-creator border-l-2 border-creator"
                              : "text-text-dim hover:text-text border-l-2 border-transparent"
                          }`}
                        >
                          {s.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            </nav>

            {/* Main */}
            <main ref={contentRef} className="flex-1 overflow-y-auto p-5 min-w-0">
            {showingSearch ? (
              <div>
                <h1 className="font-heading font-bold text-2xl text-text mb-1">
                  Search results
                </h1>
                <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase mb-6">
                  {searchResults.length} match{searchResults.length === 1 ? "" : "es"}
                </p>
                <ul className="space-y-2">
                  {searchResults.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setActiveId(s.id);
                          setQuery("");
                        }}
                        className="w-full text-left border border-white/10 hover:border-creator/40 px-4 py-3 cursor-pointer transition-colors"
                      >
                        <div className="font-micro text-[11px] tracking-widest text-text uppercase">
                          {s.title}
                        </div>
                        <div className="font-micro text-[9px] tracking-wide text-text-dim mt-0.5">
                          {s.tagline}
                        </div>
                      </button>
                    </li>
                  ))}
                  {searchResults.length === 0 && (
                    <li className="font-micro text-[10px] tracking-widest text-text-dim uppercase">
                      No matches.
                    </li>
                  )}
                </ul>
              </div>
            ) : activeSection ? (
              <article>
                <div className="mb-6">
                  <h1 className="font-heading font-bold text-3xl text-text tracking-tight mb-1">
                    {activeSection.title}
                  </h1>
                  <p className="font-micro text-[11px] tracking-widest text-text-dim uppercase">
                    {activeSection.tagline}
                  </p>
                </div>
                <div className="space-y-5 max-w-3xl">
                  {activeSection.blocks.map((block, i) => (
                    <Block
                      key={i}
                      block={block}
                      onListen={handleListen}
                      onRevert={handleRevert}
                      onInsert={onInsert}
                      previewingCode={previewingCode}
                      cueEnabled={cueEnabled}
                      onToggleCue={toggleCue}
                      cueAvailable={cueAvailable}
                    />
                  ))}
                </div>
              </article>
            ) : null}
            </main>
          </div>
        </>
      )}
    </aside>
  );
}
