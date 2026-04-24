"use client";

interface ShortcutsOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  keys: string[];
  label: string;
}

interface ShortcutGroup {
  title: string;
  rows: ShortcutRow[];
}

const GROUPS: ShortcutGroup[] = [
  {
    title: "Playback",
    rows: [
      { keys: ["Ctrl", "↵"], label: "Evaluate / play" },
      { keys: ["Ctrl", "S"], label: "Save pattern" },
    ],
  },
  {
    title: "Palettes",
    rows: [
      { keys: ["Ctrl", "K"], label: "Snippets palette" },
      { keys: ["Ctrl", "J"], label: "DJ deck" },
      { keys: ["Ctrl", "B"], label: "Sounds browser" },
      { keys: ["Ctrl", "U"], label: "Cue agent" },
      { keys: ["Ctrl", "Shift", "P"], label: "Command palette" },
      { keys: ["F1"], label: "Docs modal" },
      { keys: ["?"], label: "This shortcut reference" },
      { keys: ["Esc"], label: "Close any overlay" },
    ],
  },
  {
    title: "Editor",
    rows: [
      { keys: ["Ctrl", "="], label: "Increase font size" },
      { keys: ["Ctrl", "-"], label: "Decrease font size" },
      { keys: ["Ctrl", "0"], label: "Reset font size" },
      { keys: ["Ctrl", "Click"], label: "Add cursor (multi-cursor)" },
      { keys: ["Ctrl", "Space"], label: "Trigger autocomplete" },
    ],
  },
  {
    title: "Vim mode",
    rows: [
      { keys: [":w"], label: "Evaluate current code" },
      { keys: [":q"], label: "Stop playback" },
      { keys: ["gc"], label: "Toggle line comment" },
    ],
  },
];

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono text-[10px] text-text bg-surface-2 border border-white/10 px-1.5 py-0.5 rounded shadow-inner">
      {children}
    </kbd>
  );
}

export function ShortcutsOverlay({ open, onClose }: ShortcutsOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-white/10 w-full max-w-2xl max-h-[80dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-heading font-bold text-lg text-text tracking-tight">
            KEYBOARD SHORTCUTS
          </h2>
          <button
            onClick={onClose}
            className="font-micro text-[10px] tracking-widest text-text-dim hover:text-text uppercase cursor-pointer"
            aria-label="Close"
          >
            [ ESC ]
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-micro text-[10px] tracking-widest uppercase text-creator mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-micro text-[10px] tracking-wide text-text-dim uppercase truncate">
                      {row.label}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      {row.keys.map((k, i) => (
                        <span
                          key={`${row.label}-${i}`}
                          className="flex items-center gap-1"
                        >
                          <Key>{k}</Key>
                          {i < row.keys.length - 1 && (
                            <span className="text-text-dim text-[10px]">+</span>
                          )}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-white/10 font-micro text-[9px] tracking-widest text-text-dim uppercase flex items-center justify-between">
          <span>Ctrl = Cmd on macOS</span>
          <span>
            Switch keybindings in{" "}
            <span className="text-text">[ Settings ]</span>
          </span>
        </div>
      </div>
    </div>
  );
}
