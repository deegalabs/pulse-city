"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  listSounds,
  filterSounds,
  categoryLabel,
  importSoundFolder,
  type SoundCategory,
  type SoundEntry,
} from "@/lib/strudel/sounds";
import { getPrebakePromise } from "@/lib/strudel/init";

interface SoundsBrowserProps {
  open: boolean;
  onClose: () => void;
  onPreview: (sound: string) => void;
  onPreviewStop: () => void;
  onInsert: (code: string) => void;
}

const TABS: Array<{ key: SoundCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "samples", label: categoryLabel("samples") },
  { key: "drum-machines", label: "Drums" },
  { key: "synths", label: categoryLabel("synths") },
  { key: "wavetables", label: "Wave" },
  { key: "user", label: categoryLabel("user") },
];

function kindTone(cat: SoundCategory): string {
  switch (cat) {
    case "samples":
      return "text-creator";
    case "drum-machines":
      return "text-listener";
    case "synths":
      return "text-agent";
    case "wavetables":
      return "text-signal-warn";
    case "user":
      return "text-text";
    default:
      return "text-text-dim";
  }
}

export function SoundsBrowser({
  open,
  onClose,
  onPreview,
  onPreviewStop,
  onInsert,
}: SoundsBrowserProps) {
  const [sounds, setSounds] = useState<SoundEntry[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SoundCategory | "all">("all");
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Wait for prebake so sample registration has completed before reading the map
      const p = getPrebakePromise();
      if (p) {
        try {
          await p;
        } catch {
          // ignore — listing may still work partially
        }
      }
      const list = await listSounds();
      setSounds(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    setQuery("");
    setCurrentSound(null);
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open, refresh]);

  // Stop preview when drawer closes
  useEffect(() => {
    if (!open && currentSound) {
      onPreviewStop();
      setCurrentSound(null);
    }
  }, [open, currentSound, onPreviewStop]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = useMemo(
    () => filterSounds(sounds, query, activeTab),
    [sounds, query, activeTab]
  );

  const countsByTab = useMemo(() => {
    const counts: Record<string, number> = { all: sounds.length };
    for (const s of sounds) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, [sounds]);

  const handlePreview = (name: string) => {
    if (currentSound === name) {
      onPreviewStop();
      setCurrentSound(null);
      return;
    }
    onPreview(`s("${name}")`);
    setCurrentSound(name);
  };

  const handleInsert = (name: string) => {
    onInsert(`$: s("${name}").gain(.7)`);
  };

  const handleImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImporting(true);
    setImportMessage(null);
    try {
      const result = await importSoundFolder(files);
      setImportMessage(
        `Imported ${result.banks.length} bank${result.banks.length === 1 ? "" : "s"} · ${result.count} file${result.count === 1 ? "" : "s"}`
      );
      await refresh();
      setActiveTab("user");
    } catch (err) {
      console.error(err);
      setImportMessage("Import failed — check the console");
    } finally {
      setImporting(false);
    }
  };

  return (
    <aside
      aria-hidden={!open}
      className={`fixed right-0 top-0 bottom-0 z-40 flex flex-col bg-surface-1 border-l border-white/10 shadow-2xl transition-transform duration-200 ease-out ${
        open
          ? "translate-x-0 pointer-events-auto"
          : "translate-x-full pointer-events-none"
      }`}
      style={{ width: "min(100vw, 520px)" }}
    >
      {open && (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
            <h2 className="font-heading font-bold text-base text-text tracking-tight shrink-0">
              SOUNDS
            </h2>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-base border border-white/10 px-3 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-creator/40 transition-colors placeholder:text-text-dim/60 min-w-0"
            />
            <button
              onClick={refresh}
              className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer shrink-0"
              title="Refresh"
            >
              ↻
            </button>
            <button
              onClick={onClose}
              className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer shrink-0"
              aria-label="Close"
            >
              [ ✕ ]
            </button>
          </div>

          {/* Tabs */}
          <nav className="grid grid-cols-5 border-b border-white/10 shrink-0">
            {TABS.map((t) => {
              const active = activeTab === t.key;
              const count = countsByTab[t.key] ?? 0;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`py-2 flex flex-col items-center gap-0.5 cursor-pointer transition-colors border-b-2 ${
                    active
                      ? "text-creator border-creator bg-creator/5"
                      : "text-text-dim border-transparent hover:text-text"
                  }`}
                  title={t.label}
                >
                  <span className="font-micro text-[8px] tracking-widest uppercase leading-none">
                    {t.label}
                  </span>
                  <span className="font-mono text-[9px] text-text-dim">{count}</span>
                </button>
              );
            })}
          </nav>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Import banner — only on User tab */}
            {activeTab === "user" && (
              <div className="px-4 py-3 border-b border-white/10 bg-surface-2/40">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="font-micro text-[10px] tracking-widest text-text uppercase">
                    Import sounds
                  </span>
                  <span className="font-micro text-[9px] tracking-wide text-text-dim">
                    Blob URLs · lost on refresh
                  </span>
                </div>
                <p className="font-micro text-[9px] tracking-wide text-text-dim leading-relaxed mb-3">
                  Pick a folder of subfolders — each subfolder becomes a sound
                  name, its files become variations:
                  <br />
                  <code className="text-text">samples/swoop/1.wav · samples/swoop/2.wav</code>{" "}
                  →{" "}
                  <code className="text-text">s(&quot;swoop&quot;).n(&quot;0 1&quot;)</code>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  {...{ webkitdirectory: "", directory: "" } as Record<string, string>}
                  onChange={(e) => handleImport(e.target.files)}
                  className="hidden"
                  accept=".wav,.mp3,.ogg,.flac,.aif,.aiff,audio/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                  className="w-full font-micro text-[10px] tracking-widest uppercase text-creator border border-creator/40 hover:bg-creator/10 disabled:opacity-50 disabled:cursor-not-allowed py-1.5 cursor-pointer transition-colors"
                >
                  {importing ? "Importing…" : "📁 Pick folder"}
                </button>
                {importMessage && (
                  <div className="font-micro text-[9px] tracking-wide text-creator mt-2">
                    {importMessage}
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="px-4 py-8 text-center font-micro text-[10px] tracking-widest text-text-dim uppercase">
                Loading sound registry…
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="font-micro text-[10px] tracking-widest text-text-dim uppercase mb-2">
                  No sounds
                </p>
                <p className="font-micro text-[9px] tracking-wide text-text-dim">
                  {query
                    ? "Try a shorter query or switch tab."
                    : "Hit play in the editor once so Strudel finishes loading its sample banks."}
                </p>
              </div>
            )}
            {!loading && filtered.length > 0 && (
              <ul className="divide-y divide-white/5">
                {filtered.map((s) => {
                  const isCurrent = currentSound === s.name;
                  return (
                    <li
                      key={s.name}
                      className={`px-3 py-1.5 flex items-center gap-2 hover:bg-surface-2/60 transition-colors ${
                        isCurrent ? "bg-listener/10" : ""
                      }`}
                    >
                      <button
                        onClick={() => handlePreview(s.name)}
                        className="flex-1 min-w-0 text-left flex items-center gap-2 cursor-pointer"
                        title={`Preview ${s.name}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isCurrent
                              ? "bg-listener animate-[pulse-dot_1.5s_ease-in-out_infinite]"
                              : "bg-transparent"
                          }`}
                        />
                        <span
                          className={`font-mono text-[11px] truncate ${kindTone(
                            s.category
                          )}`}
                        >
                          {s.name}
                        </span>
                        {s.variations != null && s.variations > 1 && (
                          <span className="font-mono text-[9px] text-text-dim shrink-0">
                            ({s.variations})
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleInsert(s.name)}
                        className="font-micro text-[9px] tracking-widest text-creator hover:underline uppercase cursor-pointer shrink-0 px-1.5 py-0.5"
                        title="Insert as a new $: track into the editor"
                      >
                        + code
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 font-micro text-[9px] tracking-widest text-text-dim uppercase flex items-center justify-between shrink-0">
            <span>
              {filtered.length} / {sounds.length} sounds
            </span>
            <span>tap = preview · + code = insert</span>
          </div>
        </>
      )}
    </aside>
  );
}
