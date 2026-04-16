"use client";

import { useStore } from "@/lib/store";

export type NavItem = "COMPOSER" | "SIGNAL" | "NETWORK" | "HISTORY";

interface SidebarProps {
  activePanel?: NavItem;
  onPanelChange?: (panel: NavItem) => void;
}

function ComposerIcon({ className }: { className?: string }) {
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
      <path d="M12 3v14" />
      <path d="M8 7l4-4 4 4" />
      <path d="M4 14c0 3 2.5 5 8 5s8-2 8-5" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <path d="M17 17V7" />
      <path d="M7 17V7" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
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
      <path d="M2 12h2" />
      <path d="M6 8v8" />
      <path d="M10 4v16" />
      <path d="M14 6v12" />
      <path d="M18 9v6" />
      <path d="M22 12h-2" />
    </svg>
  );
}

function NetworkIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <path d="M9.5 10.5L5.5 7.5" />
      <path d="M14.5 10.5L18.5 7.5" />
      <path d="M9.5 13.5L5.5 16.5" />
      <path d="M14.5 13.5L18.5 16.5" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

const NAV_ITEMS: { key: NavItem; icon: typeof ComposerIcon }[] = [
  { key: "COMPOSER", icon: ComposerIcon },
  { key: "SIGNAL", icon: SignalIcon },
  { key: "NETWORK", icon: NetworkIcon },
  { key: "HISTORY", icon: HistoryIcon },
];

function PanelRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-2">
      <span className="font-micro text-[9px] tracking-widest text-text-dim block">{label}</span>
      <span className="font-mono text-xs text-text">{children}</span>
    </div>
  );
}

function ComposerPanel() {
  const { trackTitle, playing } = useStore();
  return (
    <>
      <PanelRow label="CURRENT COMPOSITION">
        {trackTitle || "Untitled"}
      </PanelRow>
      <PanelRow label="MODE">
        <span className="text-agent">AUTOPILOT</span>
      </PanelRow>
      <PanelRow label="STATUS">
        <span className="inline-flex items-center gap-2">
          {playing && (
            <span className="w-1.5 h-1.5 bg-agent rounded-full animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
          )}
          {playing ? "COMPOSING" : "IDLE"}
        </span>
      </PanelRow>
      <PanelRow label="MUTATIONS">0</PanelRow>
    </>
  );
}

function SignalPanel() {
  const { playing } = useStore();
  return (
    <>
      <PanelRow label="AUDIO SIGNAL">MASTER OUTPUT</PanelRow>
      <PanelRow label="STATUS">
        <span className={playing ? "text-agent" : "text-text-dim"}>
          {playing ? "ACTIVE" : "SILENT"}
        </span>
      </PanelRow>
      <PanelRow label="SAMPLE RATE">44100 Hz</PanelRow>
      <PanelRow label="BUFFER SIZE">128</PanelRow>
      <PanelRow label="LATENCY">~5.8ms</PanelRow>
    </>
  );
}

function NetworkPanel() {
  return (
    <>
      <PanelRow label="NETWORK STATUS">LISTENERS</PanelRow>
      <PanelRow label="COUNT">1</PanelRow>
      <PanelRow label="STREAM">LOCAL</PanelRow>
      <PanelRow label="SYNC">
        <span className="text-signal-warn">DISCONNECTED</span>
      </PanelRow>
    </>
  );
}

function HistoryPanel() {
  return (
    <>
      <PanelRow label="EVOLUTION LOG">
        <span className="text-text-dim italic">no mutations yet</span>
      </PanelRow>
    </>
  );
}

const PANELS: Record<NavItem, () => React.ReactNode> = {
  COMPOSER: () => <ComposerPanel />,
  SIGNAL: () => <SignalPanel />,
  NETWORK: () => <NetworkPanel />,
  HISTORY: () => <HistoryPanel />,
};

export function Sidebar({ activePanel = "COMPOSER", onPanelChange }: SidebarProps) {
  const { mode } = useStore();

  if (mode !== "autopilot") return null;

  const PanelContent = PANELS[activePanel];

  return (
    <aside className="bg-surface-1 fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 border-r border-border flex-col py-4 hidden lg:flex z-40">
      {/* Header section */}
      <div className="px-6 mb-8">
        <div className="font-micro text-[10px] tracking-[0.2em] text-text-dim mb-1">
          MCP CONTROL
        </div>
        <div className="font-micro text-[9px] tracking-widest text-agent/80">
          AI AUTOPILOT ACTIVE
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ key, icon: Icon }) => {
          const isActive = key === activePanel;
          return (
            <div
              key={key}
              onClick={() => onPanelChange?.(key)}
              className={[
                "px-6 py-3 flex items-center gap-4 font-micro text-xs tracking-widest uppercase cursor-pointer transition-all duration-200",
                isActive
                  ? "text-agent bg-surface-2 border-l-2 border-agent"
                  : "text-text-dim hover:bg-surface-2 hover:text-text border-l-2 border-transparent",
              ].join(" ")}
            >
              <Icon />
              {key}
            </div>
          );
        })}
      </nav>

      {/* Panel content */}
      <div className="border-t border-white/5 mt-4 pt-4 flex-1 overflow-y-auto">
        <PanelContent />
      </div>

      {/* Bottom section */}
      <div className="px-6 mt-auto">
        <button className="w-full font-micro text-xs tracking-widest text-agent border border-agent/40 py-2 hover:bg-agent/10 transition-colors cursor-pointer">
          [ LIVE ]
        </button>
        <div className="mt-4 flex items-center gap-4 text-text-dim font-micro text-[10px] tracking-widest uppercase cursor-pointer py-2 hover:text-text transition-colors">
          <HelpIcon />
          HELP
        </div>
      </div>
    </aside>
  );
}
