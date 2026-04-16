import { generateText } from "ai";
import { getModel } from "@/lib/ai/model-router";
import { EVOLVE_PROMPT } from "@/lib/ai/prompts";
import { extractJson } from "@/lib/ai/extract-json";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { currentCode }: { currentCode: string } = await req.json();

  const model = getModel("evolve");

  try {
    const { text } = await generateText({
      model,
      system: EVOLVE_PROMPT,
      prompt: `Here is the current track playing:\n\`\`\`\n${currentCode}\n\`\`\`\n\nEvolve it — make 1-2 small mutations while keeping the vibe.`,
    });

    const json = extractJson(text);
    if (!json || !json.code) {
      return Response.json(
        { message: "AI did not return valid code", code: null },
        { status: 500 }
      );
    }
    return Response.json(json);
  } catch (err) {
    console.error("Evolve error:", err);
    return Response.json(
      { message: "Evolve failed", code: null },
      { status: 500 }
    );
  }
}
