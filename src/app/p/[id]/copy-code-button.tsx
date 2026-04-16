"use client";

import { useState } from "react";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="font-micro text-[10px] tracking-widest text-listener py-2 px-4 border border-listener/20 hover:bg-listener/5 transition-colors uppercase cursor-pointer"
    >
      {copied ? "COPIED!" : "[ COPY CODE ]"}
    </button>
  );
}
