import { anthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";

export type AITask =
  | "compose"
  | "evolve"
  | "chat"
  | "vision"
  | "analyze-reference";
export type UserTier = "free" | "pro" | "creator";

const groq = createGroq();

export function getModel(task: AITask, userTier: UserTier = "free") {
  // Free tier always uses Groq
  if (userTier === "free") {
    return groq("llama-3.3-70b-versatile");
  }

  switch (task) {
    case "compose":
    case "analyze-reference":
      return anthropic("claude-sonnet-4-6");

    case "evolve":
    case "chat":
    case "vision":
      return anthropic("claude-haiku-4-5-20251001");

    default:
      return anthropic("claude-haiku-4-5-20251001");
  }
}
