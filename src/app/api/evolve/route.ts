import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getModel } from "@/lib/ai/model-router";
import { EVOLVE_PROMPT } from "@/lib/ai/prompts";
import { extractJson } from "@/lib/ai/extract-json";
import { getClientIp } from "@/lib/server/request";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { asString, safeJson } from "@/lib/server/validation";

export const maxDuration = 30;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`ai:evolve:${ip}`, { windowMs: 60_000, max: 30 });
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

  const currentCode = asString((body as { currentCode?: unknown }).currentCode, 40_000);
  if (!currentCode) {
    return NextResponse.json({ error: "currentCode is required" }, { status: 400 });
  }

  const model = getModel("evolve");

  try {
    const { text } = await generateText({
      model,
      system: EVOLVE_PROMPT,
      prompt: `Here is the current track playing:\n\`\`\`\n${currentCode}\n\`\`\`\n\nEvolve it — make 1-2 small mutations while keeping the vibe.`,
    });

    const json = extractJson(text);
    if (!json || !json.code) {
      return NextResponse.json(
        { message: "AI did not return valid code", code: null },
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
    console.error("Evolve error:", err);
    return NextResponse.json(
      { message: "Evolve failed", code: null },
      { status: 500 }
    );
  }
}
