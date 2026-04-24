"use client";

import { useEffect, useState } from "react";

export interface TickerEvent {
  icon?: string;
  text: string;
  color?: "text" | "creator" | "listener" | "agent" | "warn";
}

interface TickerProps {
  events: TickerEvent[];
  interval?: number;
  className?: string;
}

const COLOR_CLASS: Record<NonNullable<TickerEvent["color"]>, string> = {
  text: "text-text-dim",
  creator: "text-creator",
  listener: "text-listener",
  agent: "text-agent",
  warn: "text-signal-warn",
};

export function Ticker({ events, interval = 4000, className = "" }: TickerProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (events.length <= 1) return;
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % events.length);
        setVisible(true);
      }, 220);
    }, interval);
    return () => window.clearInterval(id);
  }, [events.length, interval]);

  if (events.length === 0) return null;

  const current = events[index];
  const colorClass = COLOR_CLASS[current.color ?? "text"];

  return (
    <span
      className={`font-micro text-[10px] tracking-widest uppercase inline-flex items-center gap-2 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      } ${colorClass} ${className}`}
    >
      {current.icon && <span aria-hidden>{current.icon}</span>}
      <span className="truncate">{current.text}</span>
    </span>
  );
}

export const CITY_EVENTS: TickerEvent[] = [
  { icon: "◉", text: "Cluster 7 broadcasting", color: "creator" },
  { icon: "◆", text: "Agent composing live", color: "agent" },
  { icon: "▲", text: "Signal locked to main clock", color: "listener" },
  { icon: "●", text: "Listener network online", color: "listener" },
  { icon: "◈", text: "Pattern buffer evolving", color: "agent" },
  { icon: "◉", text: "Ipê Village 2026 · pop-up city", color: "creator" },
  { icon: "▓", text: "Re-sequencing audio buffer", color: "warn" },
  { icon: "◆", text: "New mutation detected", color: "agent" },
];
