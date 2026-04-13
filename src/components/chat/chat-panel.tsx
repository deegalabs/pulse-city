"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";

interface ChatPanelProps {
  onCodeApply?: (code: string) => void;
}

export function ChatPanel({ onCodeApply }: ChatPanelProps) {
  const { mode, code } = useStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { mode, currentCode: code },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll unless user scrolled up
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

  // Extract text from message parts
  const getMessageText = (
    message: (typeof messages)[0]
  ): string => {
    return message.parts
      .filter((part): part is { type: "text"; text: string } => part.type === "text")
      .map((part) => part.text)
      .join("");
  };

  // Try to parse JSON response and extract code for apply
  const tryParseCode = (text: string): string | null => {
    try {
      const json = JSON.parse(text);
      if (json.code) return json.code;
      if (json.action === "apply" && json.code) return json.code;
    } catch {
      // Not JSON, check for code block
      const match = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/);
      if (match) return match[1].trim();
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0"
      >
        {messages.length === 0 && (
          <p className="text-xs text-text-dim py-1">
            {mode === "autopilot"
              ? "Autopilot is composing. Send a direction to steer the music."
              : "Manual mode. Describe a vibe or ask for help with your code."}
          </p>
        )}

        {messages.map((message) => {
          const text = getMessageText(message);
          const isUser = message.role === "user";
          const extractedCode = !isUser ? tryParseCode(text) : null;

          // Try to display parsed message
          let displayText = text;
          try {
            const json = JSON.parse(text);
            if (json.message) displayText = json.message;
          } catch {
            // Keep original text
          }

          return (
            <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-lime/15 text-lime border border-lime/20"
                    : "bg-surface text-text border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap">{displayText}</p>
                {extractedCode && onCodeApply && (
                  <button
                    onClick={() => onCodeApply(extractedCode)}
                    className="mt-1.5 px-2 py-0.5 rounded bg-lime/20 text-lime text-[0.6rem] font-heading tracking-wider hover:bg-lime/30 transition cursor-pointer"
                  >
                    APPLY CODE
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-dim">
              <span className="animate-pulse">thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 px-3 py-1.5 border-t border-border shrink-0"
      >
        <span className="text-lime text-[0.6rem] shrink-0">&#9658;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "autopilot"
              ? "steer: more bass, darker, speed up..."
              : "describe a vibe, give a direction..."
          }
          disabled={isLoading}
          className="flex-1 py-1.5 px-3 bg-surface border border-border rounded-full text-text text-xs focus:border-lime outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-3 py-1 rounded-full bg-lime text-bg font-heading font-semibold text-[0.65rem] tracking-wide cursor-pointer hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
