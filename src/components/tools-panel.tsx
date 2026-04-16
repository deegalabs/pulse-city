"use client";

import { useStore } from "@/lib/store";

interface ToolsPanelProps {
  onToolClick?: (tool: string) => void;
}

const TOOLS: readonly { name: string; icon: string; accent?: boolean }[] = [
  { name: "DRUMS", icon: "grid_view" },
  { name: "BASS", icon: "graphic_eq" },
  { name: "CHORDS", icon: "layers" },
  { name: "LEAD", icon: "waves" },
  { name: "FX", icon: "blur_on" },
  { name: "FILTER", icon: "filter_list" },
  { name: "TEMPO", icon: "timer" },
  { name: "DROP", icon: "bolt", accent: true },
];

const ICON_PATHS: Record<string, string> = {
  grid_view: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  graphic_eq: "M7 18V6M12 18V2M17 18V8M2 18V9M22 18V13",
  layers:
    "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83ZM22.18 12.09l-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.09M22.18 16.59l-8.58 3.91a2 2 0 0 1-1.66 0L2.6 16.59",
  waves:
    "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
  blur_on:
    "M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 2v2M12 20v2M2 12h2M20 12h2",
  filter_list: "M4 6h16M6 12h12M8 18h8",
  timer:
    "M10 2h4M12 14V8M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  construction:
    "M12 15V3M4.93 11.44 2 20h20l-2.93-8.56M7.5 3h9M12 3v12",
};

const AUTOPILOT_ICONS = ["graphic_eq", "layers", "waves", "blur_on"];

function ToolIcon({ icon, className }: { icon: string; className?: string }) {
  const path = ICON_PATHS[icon];
  if (!path) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

export function ToolsPanel({ onToolClick }: ToolsPanelProps) {
  const { mode } = useStore();
  const isAutopilot = mode === "autopilot";

  if (isAutopilot) {
    return (
      <div className="border-t border-white/10 p-6 bg-base/50 grayscale opacity-50 select-none">
        <div className="font-micro text-[10px] tracking-[0.2em] text-text-dim mb-4 flex items-center gap-2">
          <ToolIcon icon="construction" className="!w-3 !h-3" />
          TOOLKIT [LOCKED]
        </div>
        <div className="grid grid-cols-4 gap-2">
          {AUTOPILOT_ICONS.map((icon) => (
            <div
              key={icon}
              className="aspect-square bg-surface-2 border border-white/5 flex items-center justify-center"
            >
              <ToolIcon icon={icon} className="text-text-dim" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] bg-surface-1 p-6 glass-line border-x-0 border-b-0">
      <span className="font-micro text-[10px] tracking-widest text-text-dim mb-4 block">
        TOOLKIT
      </span>
      <div className="grid grid-cols-2 gap-3 h-[calc(100%-24px)]">
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            onClick={() => onToolClick?.(tool.name)}
            className={`bg-surface-2 glass-line p-3 flex flex-col justify-between items-start hover:bg-surface-3 transition-colors cursor-pointer ${
              tool.accent ? "border-agent/30" : ""
            }`}
          >
            <span
              className={`font-micro text-[10px] tracking-widest ${
                tool.accent ? "text-agent" : "text-creator"
              }`}
            >
              {tool.name}
            </span>
            <ToolIcon
              icon={tool.icon}
              className={tool.accent ? "text-agent" : "text-text-dim"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
