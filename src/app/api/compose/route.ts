import { generateText } from "ai";
import { getModel } from "@/lib/ai/model-router";
import { COMPOSE_PROMPT } from "@/lib/ai/prompts";
import { extractJson } from "@/lib/ai/extract-json";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt?: string } = await req.json();

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
      return Response.json(
        { message: "AI did not return valid code", code: null, title: null },
        { status: 500 }
      );
    }
    return Response.json(json);
  } catch (err) {
    console.error("Compose error:", err);
    return Response.json(
      { message: "Compose failed", code: null, title: null },
      { status: 500 }
    );
  }
}
