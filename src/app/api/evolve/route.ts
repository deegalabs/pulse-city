import { generateText } from "ai";
import { getModel } from "@/lib/ai/model-router";
import { EVOLVE_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { currentCode }: { currentCode: string } = await req.json();

  const model = getModel("evolve");

  const { text } = await generateText({
    model,
    system: EVOLVE_PROMPT,
    prompt: `Here is the current track playing:\n\`\`\`\n${currentCode}\n\`\`\`\n\nEvolve it — make 1-2 small mutations while keeping the vibe.`,
  });

  try {
    const json = JSON.parse(text);
    return Response.json(json);
  } catch {
    return Response.json(
      { message: "AI response was not valid JSON", code: null },
      { status: 500 }
    );
  }
}
