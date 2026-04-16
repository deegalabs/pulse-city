/**
 * Extract JSON from an LLM response that may contain:
 * - markdown code fences (```json ... ```)
 * - extra text before/after the JSON
 * - literal newlines inside string values (common LLM issue)
 */
export function extractJson(text: string): Record<string, unknown> | null {
  // Try direct parse first
  const direct = tryParse(text);
  if (direct) return direct;

  // Try extracting from markdown fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    const parsed = tryParse(fenceMatch[1].trim());
    if (parsed) return parsed;
  }

  // Try finding the first { ... } block
  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    const slice = text.slice(braceStart, braceEnd + 1);
    const parsed = tryParse(slice);
    if (parsed) return parsed;

    // LLMs often put literal newlines inside JSON string values.
    // Fix by escaping newlines that appear between unescaped quotes.
    const fixed = fixNewlinesInStrings(slice);
    const parsedFixed = tryParse(fixed);
    if (parsedFixed) return parsedFixed;
  }

  return null;
}

function tryParse(text: string): Record<string, unknown> | null {
  try {
    const result = JSON.parse(text);
    if (typeof result === "object" && result !== null) return result;
  } catch {
    // not valid JSON
  }
  return null;
}

/**
 * Replace literal newlines inside JSON string values with \n.
 * Walks the string tracking whether we're inside a quoted value.
 */
function fixNewlinesInStrings(json: string): string {
  const chars: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < json.length; i++) {
    const ch = json[i];

    if (escaped) {
      chars.push(ch);
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      chars.push(ch);
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      chars.push(ch);
      continue;
    }

    if (inString && ch === "\n") {
      chars.push("\\n");
      continue;
    }

    if (inString && ch === "\r") {
      continue; // drop \r
    }

    if (inString && ch === "\t") {
      chars.push("\\t");
      continue;
    }

    chars.push(ch);
  }

  return chars.join("");
}
