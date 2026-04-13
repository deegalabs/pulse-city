import {
  streamText,
  type UIMessage,
  convertToModelMessages,
} from "ai";
import { getModel } from "@/lib/ai/model-router";
import {
  AUTOPILOT_CHAT_PROMPT,
  MANUAL_CHAT_PROMPT,
} from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    mode,
    currentCode,
  }: {
    messages: UIMessage[];
    mode: "autopilot" | "manual";
    currentCode: string;
  } = await req.json();

  const systemPrompt =
    mode === "autopilot" ? AUTOPILOT_CHAT_PROMPT : MANUAL_CHAT_PROMPT;

  const model = getModel("chat");

  const result = streamText({
    model,
    system: `${systemPrompt}\n\nCurrent code in editor:\n\`\`\`\n${currentCode}\n\`\`\``,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
