import {
  streamText,
  type UIMessage,
  convertToModelMessages,
} from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/lib/ai/model-router";
import {
  AUTOPILOT_CHAT_PROMPT,
  MANUAL_CHAT_PROMPT,
} from "@/lib/ai/prompts";
import { getClientIp } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { asString, safeJson } from "@/lib/server/validation";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`ai:chat:${ip}`, { windowMs: 60_000, max: 60 });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSec),
          "X-RateLimit-Limit": String(rate.limit),
          "X-RateLimit-Remaining": String(rate.remaining),
        },
      }
    );
  }

  const body = await safeJson(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as {
    messages?: unknown;
    mode?: unknown;
    currentCode?: unknown;
  };

  if (!Array.isArray(payload.messages) || payload.messages.length === 0 || payload.messages.length > 60) {
    return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  const mode = payload.mode === "autopilot" || payload.mode === "manual" ? payload.mode : null;
  if (!mode) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const currentCode = asString(payload.currentCode, 40_000);
  if (!currentCode) {
    return NextResponse.json({ error: "currentCode is required" }, { status: 400 });
  }

  const messages = payload.messages as UIMessage[];

  const systemPrompt =
    mode === "autopilot" ? AUTOPILOT_CHAT_PROMPT : MANUAL_CHAT_PROMPT;

  const model = getModel("chat");

  try {
    const result = streamText({
      model,
      system: `${systemPrompt}\n\nCurrent code in editor:\n\`\`\`\n${currentCode}\n\`\`\``,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-RateLimit-Limit": String(rate.limit),
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
