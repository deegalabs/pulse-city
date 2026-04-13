# Spec: Audio References & Multimodal Input

## Summary

O chat aceita YouTube links, imagens, e codigo como referencia. A AI analisa o material e gera Strudel patterns INSPIRADOS na referencia — mesma energia, BPM, mood, mas sons e composicao originais. Nunca reproduz a musica original.

---

## YouTube como referencia

### Fluxo

```
User cola: https://youtube.com/watch?v=xyz
    |
    +-- 1. Detecta link YouTube no input
    +-- 2. Extrai metadata (titulo, thumbnail) via oEmbed
    +-- 3. Chat mostra card de preview
    +-- 4. Server extrai audio (yt-dlp)
    +-- 5. Analise do audio:
    |     +-- BPM (Essentia.js / Meyda)
    |     +-- Key / escala (Cm, Am, etc)
    |     +-- Energia / loudness
    |     +-- Genero estimado
    +-- 6. AI recebe analise estruturada
    +-- 7. AI gera Strudel pattern inspirado
```

### POC (sem backend de audio)

- User cola link -> chat mostra como link clicavel
- User descreve o que ouviu: "algo como essa batida, 128bpm, techno dark"
- AI gera baseado na descricao textual
- Metadata do YouTube via oEmbed (titulo, thumbnail) exibido no chat

### Producao (com analise real)

```ts
// Server route: app/api/analyze-youtube/route.ts

import { exec } from 'child_process';

export async function POST(req) {
  const { url } = await req.json();

  // 1. Metadata via oEmbed
  const oembed = await fetch(
    `https://www.youtube.com/oembed?url=${url}&format=json`
  ).then(r => r.json());

  // 2. Extract audio via yt-dlp (30s snippet)
  const audioPath = await extractAudio(url, { duration: 30 });

  // 3. Analyze with Essentia or librosa
  const analysis = await analyzeAudio(audioPath);

  return Response.json({
    title: oembed.title,
    thumbnail: oembed.thumbnail_url,
    bpm: analysis.bpm,
    key: analysis.key,
    energy: analysis.energy,
    genre: analysis.genre,
    mood: analysis.mood,
  });
}
```

### Analise de audio — ferramentas

| Ferramenta | Onde roda | Features | Licenca |
|------------|-----------|----------|---------|
| **Essentia.js** | Browser + Node | BPM, key, loudness, spectral, mood | AGPL |
| **Meyda** | Browser | Spectral features, RMS, ZCR | MIT |
| **librosa** (Python) | Server | BPM, key, chroma, onset detection | ISC |
| **Spotify Audio Features API** | Server | BPM, key, energy, danceability, valence | Proprietary |

**Recomendacao**: Essentia.js para POC avancado (roda no browser), librosa ou Essentia Python para producao server-side.

### Prompt para AI com referencia

```
User shared a YouTube reference:
- Title: "Amelie Lens — Exhale"
- BPM: 136
- Key: Dm
- Energy: 0.92 (high)
- Genre: Hard Techno
- Mood: Dark, driving, industrial

Generate a Strudel pattern INSPIRED by this reference.
Use similar BPM and key. Do NOT copy — create original patterns
with the same energy and feel.
```

---

## Imagens como referencia

### Fluxo

```
User cola/arrasta imagem (Ctrl+V, drag & drop, upload)
    |
    +-- 1. Detecta File com type image/*
    +-- 2. Resize client-side (max 1024px)
    +-- 3. Chat mostra thumbnail
    +-- 4. Converte para base64
    +-- 5. Envia para AI com vision (Claude Haiku)
    +-- 6. AI interpreta vibe/mood da imagem
    +-- 7. AI gera Strudel pattern que "soa" como a imagem
```

### Interpretacao de imagens

| Visual | Interpretacao musical |
|--------|----------------------|
| Escuro, noturno, neon | Dark techno, ambient, filtros fechados |
| Praia, sol, cores quentes | House tropical, melodico, aberto |
| Cidade, concreto, industrial | Industrial techno, percussion pesada |
| Natureza, verde, agua | Ambient, organic, field recordings |
| Festa, multidao, luzes | High energy, drops, builds |
| Minimalista, clean | Minimal techno, poucos elementos |

### POC

- Funciona direto com Claude Haiku (suporta vision)
- Imagem convertida para base64 no client
- Enviada no corpo da mensagem da API

### Producao

```tsx
// Vercel AI SDK com attachments
const onSubmit = () => {
  handleSubmit(undefined, {
    experimental_attachments: imageFile ? [imageFile] : undefined,
  });
};
```

---

## Codigo como referencia

### Deteccao

```js
function isStrudelCode(text) {
  const patterns = ['$:', '.bank(', '.note(', '.s(', '.gain(', '.lpf('];
  const isMultiline = text.includes('\n');
  const hasPattern = patterns.some(p => text.includes(p));
  return isMultiline && hasPattern;
}
```

### Fluxo

```
User cola bloco de codigo Strudel
    |
    +-- 1. Detecta como code (multiline + patterns Strudel)
    +-- 2. Chat renderiza com syntax highlighting
    +-- 3. AI recebe como codigo para analise
    +-- 4. AI sugere:
    |     +-- Variacoes do pattern
    |     +-- Complementos (layers adicionais)
    |     +-- Correcoes de mix (gain, EQ)
    |     +-- Explicacao do que o codigo faz
    +-- 5. Botao "Load to editor" no chat (manual mode)
```

### System prompt para analise de codigo

```
The user shared Strudel code for analysis.
Understand the pattern structure, instruments used,
rhythm, and harmony. Suggest improvements or variations
that complement the existing pattern.
```

---

## Vocals

### Opcoes por fase

| Fase | Abordagem | Como |
|------|-----------|------|
| **POC** | `.vowel()` synth | Filtro vowel nativo do Strudel simula vogais |
| **POC** | Upload de vocal samples | User sobe WAV/MP3 de vocal chops |
| **Alpha** | Vocal sample packs | Packs pre-carregados: "techno vocals", "house vocals" |
| **Beta** | ElevenLabs TTS | Texto -> voz via API, carrega como sample |
| **Beta** | AI DJ voice | Voz entre tracks anunciando, como radio |
| **Launch** | AI vocal generation | Suno/Udio API para melodias vocais |

### Vocal synth no Strudel (funciona agora)

```js
// Filtro vowel simula formantes vocais
$: note("c4 e4 g4 c5")
  .s('sawtooth')
  .vowel("a e i o u")
  .gain(.4)

// Vocal chops de sample pack
$: s("vocals:0 vocals:3 ~ vocals:1")
  .gain(.7)
  .delay(.3)
  .room(.2)
```

### ElevenLabs TTS (producao)

```ts
// Server route: app/api/tts/route.ts
export async function POST(req) {
  const { text, voice } = await req.json();

  const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
    }),
  });

  const audioBuffer = await res.arrayBuffer();
  // Salva como sample temporario, retorna URL
  const url = await saveToStorage(audioBuffer, 'tts.mp3');
  return Response.json({ url });
}
```

### DJ Voice entre tracks

```
[Track termina]
  -> TTS: "You're listening to pulse.city. Next up, a deep house journey."
  -> Crossfade para proxima track
  -> Efeito: reverb + filter sweep na voz
```

---

## Plataformas de referencia suportadas

| Plataforma | Metadata | Analise audio | Como |
|------------|----------|---------------|------|
| **YouTube** | oEmbed (titulo, thumb) | yt-dlp + Essentia | Server-side |
| **Spotify** | API (BPM, key, energy) | Audio Features API | Server-side |
| **SoundCloud** | oEmbed (titulo, thumb) | Stream URL + Essentia | Server-side |
| **Bandcamp** | Scraping OG tags | Download preview + Essentia | Server-side |
| **Apple Music** | MusicKit API | Catalog metadata | Server-side |

---

## Consideracoes

- **Copyright**: nunca reproduzir musica original — apenas analisar e inspirar
- **yt-dlp**: funciona mas pode ter issues legais em producao. Alternativa: pedir ao user para descrever
- **Tamanho de audio**: analisar apenas 30s (suficiente para BPM/key/mood)
- **Custo TTS**: ElevenLabs cobra por caractere. Cache vocais comuns
- **Essentia.js WASM**: ~2MB download, mas roda offline depois
- **Rate limiting**: limitar analises de YouTube a X por hora por user
- **Privacidade**: audio extraido nunca e salvo permanentemente — analisar e descartar
