"use client";

interface ToolsPanelProps {
  onToolClick?: (tool: string) => void;
}

const TOOLS = [
  { icon: "🥁", name: "DRUMS" },
  { icon: "🔊", name: "BASS" },
  { icon: "🎹", name: "CHORDS" },
  { icon: "🎵", name: "LEAD" },
  { icon: "✨", name: "FX" },
  { icon: "🌀", name: "FILTER" },
  { icon: "⏱", name: "TEMPO" },
  { icon: "⚡", name: "DROP" },
] as const;

export function ToolsPanel({ onToolClick }: ToolsPanelProps) {
  return (
    <div className="shrink-0 border-t border-border">
      <div className="px-3 py-1 border-b border-border">
        <span className="font-heading text-[0.55rem] tracking-widest text-text-dim">
          TOOLS
        </span>
      </div>
      <div className="grid grid-cols-4 gap-px bg-border">
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            onClick={() => onToolClick?.(tool.name)}
            className="flex flex-col items-center justify-center gap-0.5 py-2 bg-surface text-text-dim hover:bg-surface-2 hover:text-text transition-all cursor-pointer"
          >
            <span className="text-lg leading-none">{tool.icon}</span>
            <span className="font-heading text-[0.48rem] tracking-widest font-semibold">
              {tool.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
