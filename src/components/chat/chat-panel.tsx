"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { CodeDiff } from "@/components/chat/code-diff";
import { extractCode, extractMessage } from "@/lib/ai/extract-ai-response";

interface ChatPanelProps {
  onCodeApply?: (code: string) => void;
  onCodePreview?: (code: string) => void;
  onCodeRevert?: () => void;
}

function RobotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-agent shrink-0 mt-0.5"
    >
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1H3v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <rect x="3" y="15" width="18" height="6" rx="2" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-dim"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChatPanel({ onCodeApply, onCodePreview, onCodeRevert }: ChatPanelProps) {
  const { mode, code } = useStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(() => new Set());
  // Snapshot of the code at the moment a message's diff is first shown, so
  // the diff keeps its "before" state even after the user hits Listen/Keep.
  const baselineRef = useRef<Map<string, string>>(new Map());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => {
        const s = useStore.getState();
        return { mode: s.mode, currentCode: s.code };
      },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!userScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, userScrolledUp]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setUserScrolledUp(!atBottom);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
    setUserScrolledUp(false);
  };

  const getMessageText = (message: (typeof messages)[0]): string => {
    return message.parts
      .filter(
        (part): part is { type: "text"; text: string } => part.type === "text"
      )
      .map((part) => part.text)
      .join("");
  };

  const tryParseCode = extractCode;

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.prompt) {
        sendMessage({ text: detail.prompt });
      }
    };
    window.addEventListener("pulse:tool", handler);
    return () => window.removeEventListener("pulse:tool", handler);
  }, [sendMessage]);

  const getBaseline = (messageId: string, current: string): string => {
    const existing = baselineRef.current.get(messageId);
    if (existing !== undefined) return existing;
    baselineRef.current.set(messageId, current);
    return current;
  };

  const handleListen = useCallback(
    (messageId: string, newCode: string) => {
      if (previewingId === messageId) {
        onCodeRevert?.();
        setPreviewingId(null);
        return;
      }
      onCodePreview?.(newCode);
      setPreviewingId(messageId);
    },
    [previewingId, onCodePreview, onCodeRevert]
  );

  const handleKeep = useCallback(
    (messageId: string, newCode: string) => {
      onCodeApply?.(newCode);
      setPreviewingId((curr) => (curr === messageId ? null : curr));
      setAppliedIds((prev) => {
        const next = new Set(prev);
        next.add(messageId);
        return next;
      });
    },
    [onCodeApply]
  );

  const handleReject = useCallback(
    (messageId: string) => {
      if (previewingId === messageId) {
        onCodeRevert?.();
        setPreviewingId(null);
      }
      setRejectedIds((prev) => {
        const next = new Set(prev);
        next.add(messageId);
        return next;
      });
    },
    [previewingId, onCodeRevert]
  );

  /* ── Manual / Copilot mode ── */
  return (
    <div className="flex-1 min-h-0 bg-base flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 flex justify-between items-center border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-micro text-[10px] tracking-widest text-text">
            CHAT
          </span>
          <span className="font-micro text-[10px] tracking-widest text-agent bg-agent/10 px-1.5 py-0.5 rounded">
            COPILOT MODE
          </span>
        </div>
        <ChevronDown />
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
      >
        {messages.length === 0 && (
          <p className="text-sm text-text-dim">
            Manual mode. Describe a vibe or ask for help with your code.
          </p>
        )}

        {messages.map((message) => {
          const text = getMessageText(message);
          const isUser = message.role === "user";
          const extractedCode = !isUser ? tryParseCode(text) : null;
          const displayText = isUser ? text : extractMessage(text);

          const showDiff = !!extractedCode && !rejectedIds.has(message.id);

          return (
            <div key={message.id} className="flex gap-3">
              <span
                className={`font-micro text-[10px] pt-1 shrink-0 ${
                  isUser ? "text-listener" : "text-agent"
                }`}
              >
                {isUser ? "YOU" : "AGENT"}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    isUser ? "text-text" : "text-text-dim italic"
                  }`}
                >
                  {displayText}
                </p>
                {showDiff && extractedCode && (
                  <CodeDiff
                    oldCode={getBaseline(message.id, code)}
                    newCode={extractedCode}
                    previewing={previewingId === message.id}
                    applied={appliedIds.has(message.id)}
                    onListen={() => handleListen(message.id, extractedCode)}
                    onKeep={() => handleKeep(message.id, extractedCode)}
                    onReject={() => handleReject(message.id)}
                  />
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <span className="font-micro text-[10px] text-agent pt-1">
              AGENT
            </span>
            <p className="text-sm text-text-dim italic animate-pulse">
              thinking...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-white/5 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ASK THE AGENT..."
          disabled={isLoading}
          className="flex-1 bg-surface-1 border-none focus:ring-1 focus:ring-agent text-sm font-body px-3 py-1.5 rounded-sm text-text placeholder:text-text-dim/50 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-creator text-base px-4 py-1.5 font-micro text-[10px] font-bold tracking-widest rounded-sm hover:brightness-110 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
