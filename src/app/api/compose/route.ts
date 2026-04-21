import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/lib/ai/model-router";
import { COMPOSE_PROMPT } from "@/lib/ai/prompts";
import { extractJson } from "@/lib/ai/extract-json";
import { getClientIp } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { asString, safeJson } from "@/lib/server/validation";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`ai:compose:${ip}`, { windowMs: 60_000, max: 20 });
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
  if (body === null) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawPrompt = (body as { prompt?: unknown }).prompt;
  if (rawPrompt !== undefined && (typeof rawPrompt !== "string" || rawPrompt.trim().length > 1000)) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const prompt = asString(rawPrompt, 1000);

  const userPrompt = prompt
    ? `The user wants: ${prompt}`
    : "Compose a fresh electronic track. Choose a genre that fits a pop-up city festival vibe.";

  const model = getModel("compose");

  try {
    const { text } = await generateText({
      model,
      system: COMPOSE_PROMPT,
      prompt: userPrompt,
    });

    const json = extractJson(text);
    if (!json || !json.code) {
      return NextResponse.json(
        { message: "AI did not return valid code", code: null, title: null },
        { status: 500 }
      );
    }
    return NextResponse.json(json, {
      headers: {
        "X-RateLimit-Limit": String(rate.limit),
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    });
  } catch (err) {
    console.error("Compose error:", err);
    return NextResponse.json(
      { message: "Compose failed", code: null, title: null },
      { status: 500 }
    );
  }
}
