# Spec: Chat System

## Summary

O chat é o canal principal de interação entre o usuário e a AI. Suporta texto, imagens, links, código colado, e arquivos. Mostra histórico completo da conversa com scroll. Muda de comportamento conforme o modo (autopilot vs manual). Na produção usa streaming para respostas em tempo real.

---

## Input multimodal

### Tipos de input suportados

| Tipo | Como funciona | Exemplo |
|------|---------------|---------|
| **Texto** | Digitado no input | "add more bass" |
| **Imagem** | Paste (Ctrl+V) ou drag & drop ou botão de upload | Screenshot de referência, foto de controlador MIDI |
| **Link** | Colado no input, detectado automaticamente | Link do Spotify, YouTube, SoundCloud |
| **Código** | Paste multilinha detectado como code block | Trecho de Strudel colado de outro lugar |
| **Arquivo de áudio** | Drag & drop ou upload | Sample WAV/MP3 para referência |

### Detecção automática de tipo

```js
function detectInputType(input) {
  // Image paste from clipboard
  if (input instanceof File && input.type.startsWith('image/')) return 'image';
  
  // Audio file
  if (input instanceof File && input.type.startsWith('audio/')) return 'audio';
  
  // URL detection
  const urlRegex = /https?:\/\/[^\s]+/;
  if (urlRegex.test(input)) return 'link';
  
  // Code detection (has $: or common Strudel patterns)
  if (input.includes('$:') || input.includes('.bank(') || input.includes('.note(')) return 'code';
  
  // Default
  return 'text';
}
```

### Tratamento por tipo

**Imagem:**
- Exibe thumbnail na mensagem do user
- Enviada como base64 para AI vision (Claude Haiku suporta imagens)
- AI pode analisar: "essa imagem mostra um waveform — vou criar algo com formato similar"
- POC: converte para base64, envia no body da mensagem
- Produção: Vercel AI SDK suporta `experimental_attachments` no `useChat`

**Link:**
- Detecta plataforma (Spotify, YouTube, SoundCloud)
- Exibe card de preview no chat (título, thumbnail)
- AI recebe: "User shared a Spotify link: [track name] by [artist] — BPM: X, Key: Y"
- POC: extrai URL, mostra como link clicável
- Produção: server-side fetch metadata via oEmbed ou APIs das plataformas

**Código colado:**
- Detecta como code block (multilinha com patterns Strudel)
- Renderiza com syntax highlighting no chat
- AI recebe como código para análise/modificação
- Botão "Load to editor" ao lado do bloco

**Áudio:**
- Player inline no chat
- AI recebe descrição: "User shared an audio file (WAV, 5s)"
- Futuro: análise de pitch/BPM do sample para gerar pattern compatível

### Input area

```
┌──────────────────────────────────────────────┐
│ [📎] [input field.........................] ► │
└──────────────────────────────────────────────┘
  │
  ├── 📎 botão: abre file picker (imagem, áudio)
  ├── Ctrl+V: paste de imagem do clipboard
  ├── Drag & drop: imagem ou áudio sobre o chat
  └── Multilinha: Shift+Enter para quebra de linha
```

Quando imagem/arquivo é adicionado, mostra preview acima do input:

```
┌──────────────────────────────────────────────┐
│ ┌──────┐                                     │
│ │ 🖼️ img│ ✕  ← preview com botão remover     │
│ └──────┘                                     │
│ [📎] [describe what you want...........] ►   │
└──────────────────────────────────────────────┘
```

---

## Chat UI — Histórico completo

### Layout atualizado

```
┌─────────────────────────────────────────┐
│ CHAT                            [mode]  │ ← header com badge de modo
├─────────────────────────────────────────┤
│                                         │
│ 🤖 Welcome! Music is playing.           │ ← primeira mensagem (system)
│    Give me a direction or take control. │
│                                         │
│ 👤 make it darker and more minimal      │ ← user message
│                                         │
│ 🤖 Steering toward dark minimal.        │ ← AI response
│    Next evolution will strip layers      │
│    and close filters.                    │
│                                         │
│ 👤 [🖼️ screenshot.png]                  │ ← user com imagem
│    something like this vibe             │
│                                         │
│ 🤖 Got it — that looks like a lo-fi     │ ← AI analisa imagem
│    ambient setup. Evolving toward       │
│    that aesthetic.                       │
│                                         │
│ 👤 https://open.spotify.com/track/...   │ ← user com link
│    ┌──────────────────────────┐         │
│    │ 🎵 Midnight City — M83   │         │ ← link card preview
│    │    Synth-pop • 105 BPM   │         │
│    └──────────────────────────┘         │
│                                         │
│ 🤖 Nice reference! Evolving toward      │
│    that synth-pop energy with           │
│    arpeggiated chords.                  │
│                                         │
│ 👤 can you show me the code?            │
│                                         │
│ 🤖 Here's what I'd suggest:             │
│    ┌────────────────────────────┐       │
│    │ $: s("bd*4")              │       │ ← syntax highlighted
│    │   .bank('RolandTR909')    │       │
│    │   .gain(.9).analyze(1)    │       │
│    └────────────────────────────┘       │
│                    [Apply to editor]    │ ← só no manual mode
│                                         │
├─────────────────────────────────────────┤
│ ┌────┐                                  │
│ │🖼️ x│ ← attachment preview             │
│ └────┘                                  │
│ [📎] [steer the vibe...............] ►  │ ← input
└─────────────────────────────────────────┘
```

### Scroll e histórico

- **Chat area é scrollável** — todas as mensagens visíveis, scroll up para ver mais
- **Auto-scroll** para baixo quando nova mensagem chega
- **Sticky scroll** — se user scrollou para cima (lendo histórico), não auto-scroll
- **Máximo na UI**: todas as mensagens da sessão (sem limite visual)
- **Máximo no contexto AI**: últimas 20 mensagens (context window)
- **Mensagens antigas**: ficam visíveis na UI mas não vão para a AI

### Tipos de mensagem renderizados

| Tipo | Renderização |
|------|-------------|
| Texto simples | Parágrafo normal |
| Código inline | `monospace` com background |
| Code block | Syntax highlighted, botão "Apply" (manual) ou "Load" |
| Imagem (user) | Thumbnail clicável (abre fullsize) |
| Link | Card com preview (título, thumbnail, domínio) |
| Áudio | Mini player inline (play/pause, waveform) |
| Erro | Background vermelho sutil, ícone de warning |
| System | Texto dimmed, sem avatar |
| Typing indicator | "..." animado enquanto AI responde |

### Mensagem data model

```ts
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  
  // Multimodal
  attachments?: {
    type: 'image' | 'audio' | 'file';
    url: string;          // blob URL (POC) ou CDN URL (prod)
    name: string;
    mimeType: string;
    thumbnail?: string;   // base64 thumbnail para imagens
  }[];
  
  // Links detectados
  links?: {
    url: string;
    title?: string;
    thumbnail?: string;
    platform?: 'spotify' | 'youtube' | 'soundcloud' | 'other';
    metadata?: Record<string, string>;  // BPM, key, artist, etc.
  }[];
  
  // Code blocks extraídos
  codeBlocks?: {
    code: string;
    language: string;
    applied: boolean;     // true se user já aplicou no editor
  }[];
}
```

---

## Comportamento por modo

### Autopilot

- User envia mensagem → vai pro `chatHistory`
- Próximo evolve cycle usa como direção: `User direction: ${mensagem}`
- Chat responde imediatamente: "Steering: '${mensagem}'. Next evolution will follow."
- Se user envia imagem → AI descreve o vibe e usa como direção
- Se user envia link → AI extrai mood/estilo e usa como referência
- Não chama AI separado — a direção é aplicada no próximo evolve

### Manual

- User envia mensagem → chama AI com system prompt de assistente
- AI responde com sugestão de código NO CHAT (não aplica no editor)
- Resposta mostra código em bloco formatado com "Apply" button
- Se user diz "apply" / "aplica" / "sim" / "do it" → aplica último código sugerido
- Se user faz pergunta → responde normalmente sem código
- Se user envia imagem → AI analisa e sugere pattern baseado no visual
- Se user envia link → AI analisa e sugere pattern inspirado

### System prompts

**Autopilot system prompt:**
```
You steer a live Strudel track. The user's message is a direction
for the next evolution. Acknowledge briefly (1 sentence max).
Do NOT generate code — the evolve loop handles that.
If user shares an image, describe the vibe/mood you see.
If user shares a link, acknowledge the reference.
```

**Manual system prompt:**
```
You are a Strudel live-coding assistant. Help the user with their music.

RULES:
- Suggest code but NEVER apply it directly
- Show code in a ``` code block
- Explain what the code does in 1-2 sentences
- If the user asks you to apply/do it, respond with JSON:
  { "action": "apply", "code": "..." }
- Use $: block syntax, .bank() on drums, .analyze(1) on key layers
- If user shares an image, analyze it and suggest a pattern that matches the vibe
- If user shares a music link, analyze the style and suggest a Strudel interpretation
- Be concise — this is a live session, not a tutorial
```

### Intent detection (manual mode)

```js
const APPLY_WORDS = ['apply', 'aplica', 'faz', 'do it', 'sim', 'yes', 'bora', 'manda'];

function isApplyIntent(text) {
  const lower = text.toLowerCase().trim();
  return APPLY_WORDS.some(w => lower.includes(w));
}
```

---

## Produção (Next.js + Vercel AI SDK)

### Stack

```
Vercel AI SDK
  ├── useChat() hook — streaming, context, tool calling, attachments
  ├── Server route: app/api/chat/route.ts
  ├── Provider: Anthropic (Claude) or Groq (Llama)
  └── Tools: applyCode, explainPattern, suggestLayer, analyzeImage
```

### useChat with attachments

```tsx
const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: { mode, currentCode },
});

// Image paste handler
const handlePaste = (e: ClipboardEvent) => {
  const file = e.clipboardData?.files[0];
  if (file?.type.startsWith('image/')) {
    setAttachment(file);
  }
};

// Submit with attachment
const onSubmit = () => {
  handleSubmit(undefined, {
    experimental_attachments: attachment ? [attachment] : undefined,
  });
};
```

### Server route with vision

```ts
export async function POST(req) {
  const { messages, mode, currentCode } = await req.json();
  
  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: `${systemPrompt}\n\nCurrent code:\n${currentCode}`,
    messages, // Vercel AI SDK handles image attachments automatically
    tools: {
      applyCode: {
        description: 'Apply code to the editor. Only when user explicitly asks.',
        parameters: z.object({ code: z.string() }),
      },
      analyzeLink: {
        description: 'Fetch and analyze a music link for style/BPM/mood.',
        parameters: z.object({ url: z.string() }),
      },
    },
  });

  return result.toDataStreamResponse();
}
```

### Link preview

```ts
// Server-side: fetch oEmbed data for link previews
async function getLinkPreview(url: string) {
  // Spotify
  if (url.includes('spotify.com')) {
    return fetch(`https://open.spotify.com/oembed?url=${url}`).then(r => r.json());
  }
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return fetch(`https://www.youtube.com/oembed?url=${url}&format=json`).then(r => r.json());
  }
  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return fetch(`https://soundcloud.com/oembed?url=${url}&format=json`).then(r => r.json());
  }
  // Generic: use Open Graph tags
  return fetchOpenGraph(url);
}
```

---

## Considerações

- **Imagens no POC**: Claude Haiku suporta vision via API direta. Groq/Ollama: enviar descrição textual em vez de imagem
- **Tamanho de imagens**: resize client-side para max 1024px antes de enviar (reduz latência e custo)
- **Links**: POC mostra como texto clicável. Produção mostra card com preview
- **Áudio**: POC não analisa áudio. Produção pode usar Whisper para transcrever ou librosa-style analysis
- **Latência**: Groq ~1s, Anthropic ~2-3s. Streaming mitiga percepção
- **Context window**: 20 mensagens + código atual + image descriptions. Sumarizar se grande demais
- **Erro de AI**: mostrar no chat como mensagem de erro, não quebrar o fluxo
- **Offline (Ollama)**: funciona sem internet, sem suporte a imagem (text only)
- **Custo**: imagens custam mais tokens. Limitar a 1 imagem por mensagem no free tier
- **Privacidade**: imagens nunca são salvas no servidor no POC (blob URL local). Produção: CDN com expiry
