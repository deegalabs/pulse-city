import { generateText } from "ai";
import { getModel } from "@/lib/ai/model-router";
import { COMPOSE_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt?: string } = await req.json();

  const userPrompt = prompt
    ? `The user wants: ${prompt}`
    : "Compose a fresh electronic track. Choose a genre that fits a pop-up city festival vibe.";

  const model = getModel("compose");

  const { text } = await generateText({
    model,
    system: COMPOSE_PROMPT,
    prompt: userPrompt,
  });

  try {
    const json = JSON.parse(text);
    return Response.json(json);
  } catch {
    return Response.json(
      { message: "AI response was not valid JSON", code: null, title: null },
      { status: 500 }
    );
  }
}
