# Spec: Next.js Migration (POC → Alpha)

## Summary

Migrar pulse.city de vanilla JS + Vite para Next.js 15 + React 19. A logica core (autopilot, manual, chat, evolve, spectrum) ja esta validada no POC — a migracao e estrutural, nao funcional.

---

## Principio: migrar, nao reescrever

O POC validou a experiencia. A migracao traduz cada parte para o equivalente React:

| POC (vanilla JS) | Next.js (producao) |
|---|---|
| `main.js` monolito | Componentes React isolados |
| `localStorage` direto | Zustand store + persist middleware |
| `chatHistory[]` array | `useChat()` Vercel AI SDK |
| `callAI()` fetch no browser | API route server-side |
| `mode` variavel global | Zustand store |
| CSS classes | Tailwind + shadcn/ui |
| Vite dev server | Next.js App Router |
| `index.html` monolito | Layout + pages + componentes |

---

## Estrutura de pastas

```
pulse-city-next/
  app/
    layout.tsx              # Root layout (fonts, providers, theme)
    page.tsx                # Landing / boot overlay
    studio/
      page.tsx              # Main studio (editor + chat + spectrum)
      layout.tsx            # Studio layout (header + transport)
    api/
      chat/
        route.ts            # Vercel AI SDK streaming chat
      compose/
        route.ts            # AI compose endpoint
      evolve/
        route.ts            # AI evolve endpoint
      analyze/
        route.ts            # YouTube/link analysis
  components/
    boot-overlay.tsx        # Boot screen with TUNE IN button
    header.tsx              # Brand, mode badge, mode toggle, presence
    editor/
      strudel-editor.tsx    # StrudelMirror wrapper ("use client", dynamic)
    chat/
      chat-panel.tsx        # Chat messages + input
      chat-message.tsx      # Single message (user/assistant/system)
      chat-input.tsx        # Input with attachment support
    spectrum/
      spectrum-analyzer.tsx # Canvas spectrum ("use client")
    tools/
      tools-panel.tsx       # 8 tool buttons
    transport/
      transport-bar.tsx     # Play, stop, evolve, mode controls
  lib/
    store.ts                # Zustand store (mode, chat, code, settings)
    ai/
      prompts.ts            # System prompts (compose, evolve, manual)
      model-router.ts       # Model selection per task/tier
    strudel/
      init.ts               # Audio init, evalScope, samples loading
      constants.ts          # Initial code, sample URLs
    utils.ts                # extractJson, formatCode, detectInputType
  public/
    fonts/                  # Self-hosted fonts (optional)
  styles/
    globals.css             # Tailwind base + custom vars
  next.config.ts            # transpilePackages, CSP headers
  tailwind.config.ts        # Custom theme (navy/lime/sky palette)
```

---

## Componentes criticos

### StrudelEditor (client-only)

```tsx
// components/editor/strudel-editor.tsx
"use client";

import dynamic from 'next/dynamic';

// StrudelMirror must be client-only (uses DOM, eval, WebAudio)
const StrudelEditorInner = dynamic(
  () => import('./strudel-editor-inner'),
  { ssr: false, loading: () => <div className="editor-skeleton" /> }
);

export function StrudelEditor() {
  return <StrudelEditorInner />;
}
```

**Por que `ssr: false`**: StrudelMirror usa CodeMirror (DOM), `eval()` (transpiler), e WebAudio API — nenhum funciona server-side.

### Zustand Store

```ts
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PulseStore {
  mode: 'autopilot' | 'manual';
  code: string;
  trackTitle: string;
  playing: boolean;
  setMode: (mode: 'autopilot' | 'manual') => void;
  setCode: (code: string) => void;
  setTrackTitle: (title: string) => void;
  setPlaying: (playing: boolean) => void;
}

export const useStore = create<PulseStore>()(
  persist(
    (set) => ({
      mode: 'autopilot',
      code: '',
      trackTitle: '',
      playing: false,
      setMode: (mode) => set({ mode }),
      setCode: (code) => set({ code }),
      setTrackTitle: (title) => set({ trackTitle: title }),
      setPlaying: (playing) => set({ playing }),
    }),
    { name: 'pc.store' }
  )
);
```

### AI Chat (Vercel AI SDK)

```tsx
// components/chat/chat-panel.tsx
"use client";

import { useChat } from 'ai/react';
import { useStore } from '@/lib/store';

export function ChatPanel() {
  const { mode, code } = useStore();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { mode, currentCode: code },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map(m => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### AI Server Route

```ts
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getModel } from '@/lib/ai/model-router';

export async function POST(req: Request) {
  const { messages, mode, currentCode } = await req.json();

  const model = getModel(mode === 'autopilot' ? 'evolve' : 'chat');
  const systemPrompt = mode === 'autopilot'
    ? AUTOPILOT_SYSTEM_PROMPT
    : MANUAL_SYSTEM_PROMPT;

  const result = streamText({
    model,
    system: `${systemPrompt}\n\nCurrent code:\n${currentCode}`,
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## Next.js config

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: [
    '@strudel/core',
    '@strudel/codemirror',
    '@strudel/draw',
    '@strudel/transpiler',
    '@strudel/webaudio',
    '@strudel/mini',
    '@strudel/tonal',
  ],
  headers: async () => [{
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        // unsafe-eval required for Strudel transpiler
        value: "script-src 'self' 'unsafe-eval'; worker-src 'self' blob:;",
      },
    ],
  }],
};

export default config;
```

---

## Ordem de migracao

### Sprint Alpha-01: Scaffold + Editor + Audio

1. `create-next-app` com TypeScript + Tailwind + App Router
2. Instalar dependencias: `@strudel/*`, `zustand`, `ai`, `@ai-sdk/anthropic`
3. Configurar `next.config.ts` (transpilePackages, CSP)
4. Criar layout root (fonts, dark theme)
5. Boot overlay (landing page)
6. StrudelEditor component (client-only, dynamic import)
7. Audio init no boot click
8. Verificar: boot → editor carrega → Ctrl+Enter toca

### Sprint Alpha-02: Zustand + Mode + Transport

1. Zustand store (mode, code, playing, trackTitle) com persist
2. Header component (brand, mode badge, toggle button)
3. Transport bar (play, stop, evolve, rerun)
4. Mode switching (autopilot/manual)
5. Verificar: state persiste no reload

### Sprint Alpha-03: AI Chat + Server Routes

1. API route `/api/chat` com Vercel AI SDK
2. API route `/api/compose` (compose prompt)
3. API route `/api/evolve` (evolve prompt)
4. Model router (Sonnet/Haiku/Groq por tarefa)
5. `useChat()` no ChatPanel com streaming
6. Chat mode-aware (steer vs copilot)
7. Verificar: chat funciona com streaming

### Sprint Alpha-04: Spectrum + Tools + Polish

1. Spectrum analyzer component (client-only canvas)
2. Tools panel (8 buttons)
3. Ticker + presence
4. Settings overlay
5. Tailwind theme (navy/lime/sky palette)
6. shadcn/ui components (Button, Input, Dialog, Badge)
7. Responsive (mobile autopilot-only)
8. Verificar: paridade visual com POC

### Sprint Alpha-05: Auth + DB (Supabase)

1. Supabase project setup
2. Auth (email + Google)
3. User table + patterns table
4. Save/load patterns per user
5. Share pattern via public URL
6. Verificar: login → save → reload → pattern restored

---

## Riscos e mitigacoes

| Risco | Mitigacao |
|-------|-----------|
| Strudel nao funciona com SSR | `dynamic()` com `ssr: false` — ja testado no POC |
| Duplicate `@strudel/core` no webpack | `transpilePackages` + resolve alias no next.config |
| `eval()` bloqueado por CSP | Header CSP com `unsafe-eval` (documentado) |
| Bundle grande (Strudel ~800KB) | Lazy load pos-boot, code splitting |
| Latencia do server-side AI | Streaming via Vercel AI SDK |
| Cold start nas API routes | Vercel Edge Functions (opcional) |

---

## Criterio de "pronto"

Alpha esta pronto quando:
1. Boot → musica toca automaticamente (autopilot)
2. Mode switch funciona (autopilot ↔ manual)
3. Chat com streaming (Vercel AI SDK)
4. AI keys server-side (seguro)
5. State persiste (Zustand + localStorage)
6. Login funciona (Supabase auth)
7. Patterns salvos por user
8. Deploy na Vercel funcionando
9. Paridade visual com POC
