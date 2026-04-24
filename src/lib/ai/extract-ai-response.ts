/**
 * Robust extraction of { message, code } from AI responses.
 *
 * Handles:
 * - Clean JSON: { "message": "...", "code": "..." }
 * - Markdown code fences: ```js\ncode\n```
 * - Malformed JSON where the code field is wrapped in backticks instead of quotes
 * - Inline code fences without a newline after the opening fence
 */

export interface AiResponse {
  message: string;
  code: string | null;
}

const FENCE_RE = /```(?:js|javascript|ts|typescript|strudel)?\s*\n?([\s\S]*?)```/;
const JSON_CODE_BACKTICKS_RE =
  /"code"\s*:\s*```(?:js|javascript|ts|typescript|strudel)?\s*\n?([\s\S]*?)```/;
const JSON_MESSAGE_RE = /"message"\s*:\s*"((?:\\"|[^"])*)"/;

export function extractCode(text: string): string | null {
  if (!text) return null;

  // 1. Clean JSON
  try {
    const json = JSON.parse(text);
    if (json && typeof json.code === "string") return json.code.trim();
  } catch {
    // fall through
  }

  // 2. JSON-with-backticks: "code": ```...```
  const withBackticks = text.match(JSON_CODE_BACKTICKS_RE);
  if (withBackticks) return withBackticks[1].trim();

  // 3. Plain markdown code fence anywhere in the text
  const fence = text.match(FENCE_RE);
  if (fence) return fence[1].trim();

  return null;
}

export function extractMessage(text: string): string {
  if (!text) return "";

  // 1. Clean JSON
  try {
    const json = JSON.parse(text);
    if (json && typeof json.message === "string") return json.message;
  } catch {
    // fall through
  }

  // 2. Pull "message": "…" even from malformed JSON
  const match = text.match(JSON_MESSAGE_RE);
  if (match) return match[1].replace(/\\"/g, '"');

  // 3. Strip code fences and return remaining prose
  return text.replace(FENCE_RE, "").trim() || text;
}

export function extractAiResponse(text: string): AiResponse {
  return {
    message: extractMessage(text),
    code: extractCode(text),
  };
}
