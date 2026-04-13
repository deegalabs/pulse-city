# Spec: Chat Autonomy Model

## Summary

Chat behavior changes based on current mode. In autopilot, AI has full control. In manual, chat is a helpful assistant that never touches code without explicit permission.

## Rules by mode

### Autopilot mode

| User says | Chat does |
|-----------|-----------|
| "make it darker" | Steers next evolve cycle with that direction |
| "add more bass" | Next evolution adds bass-heavy layer |
| "I like this" | Locks current vibe, evolves subtly |
| "change everything" | Next evolution is a bigger mutation |

Chat messages are added to `chatHistory` and included in the evolve prompt as `User direction: ...`.

### Manual mode

| User says | Chat does |
|-----------|-----------|
| "how do I add reverb?" | Explains `.room()` and `.size()` in chat |
| "add a bass line" | Suggests code block in chat, does NOT apply |
| "apply it" / "do it" / "sim" | Applies last suggestion to editor |
| "change the filter to 2000" | Suggests the change in chat |
| "fix this error" | Reads current code, suggests fix in chat |

### Intent detection (manual mode)

Questions and descriptions → respond in chat only:
- "what does .lpf do?"
- "suggest a chord progression"
- "make this better"

Explicit action words → apply to editor:
- "apply", "do it", "aplica", "faz", "sim", "yes"
- "put this in the code"
- "update the code"

## Chat display

- Show code suggestions in chat with syntax highlighting (monospace block)
- Show "Apply" button next to code suggestions in manual mode
- In autopilot, no apply button needed (AI applies automatically)

## Context

- Keep last 20 messages in history
- Include current editor code as context in every AI call
- System prompt changes based on mode:
  - Autopilot: "You control the code. Apply changes directly."
  - Manual: "You are a helpful assistant. Suggest code but do NOT apply. Wait for explicit permission."
