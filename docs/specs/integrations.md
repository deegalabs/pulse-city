# Spec: Integrations & Ecosystem

## Summary

pulse.city pode se conectar com plataformas externas, agentes AI via MCP, hardware, e serviços web3 para criar um ecossistema completo de música generativa.

---

## 1. MCP (Model Context Protocol) — Agentes & Tools

### pulse.city como MCP Server

pulse.city expõe tools via MCP para que outros agentes (Claude, GPT, custom) possam controlar a música:

```json
{
  "tools": [
    { "name": "play", "description": "Start playing current pattern" },
    { "name": "stop", "description": "Stop playback" },
    { "name": "setCode", "description": "Set Strudel code and evaluate", "params": { "code": "string" } },
    { "name": "evolve", "description": "Trigger one evolution cycle" },
    { "name": "getCode", "description": "Get current Strudel code" },
    { "name": "getState", "description": "Get playback state, mode, energy level" },
    { "name": "setMode", "description": "Switch between autopilot and manual", "params": { "mode": "autopilot|manual" } },
    { "name": "setBpm", "description": "Change tempo", "params": { "bpm": "number" } },
    { "name": "addLayer", "description": "Add a new pattern layer", "params": { "code": "string" } },
    { "name": "removeLayer", "description": "Remove a pattern layer by index", "params": { "index": "number" } }
  ],
  "resources": [
    { "name": "currentPattern", "description": "The currently playing Strudel code" },
    { "name": "chatHistory", "description": "Recent chat messages" },
    { "name": "spectrumData", "description": "Real-time frequency/energy data" }
  ]
}
```

**Caso de uso**: Um agente externo (ex: Claude Desktop) controla pulse.city como um instrumento. "Hey Claude, cria uma música ambient para eu trabalhar" → Claude chama `setCode` no pulse.city MCP.

### pulse.city consumindo MCP Servers

| MCP Server | Uso |
|------------|-----|
| **Spotify MCP** | Buscar referências: "cria algo parecido com esse artista" → busca estilo/BPM/key no Spotify |
| **YouTube MCP** | Analisar vídeos de referência de live coding |
| **Slack/Discord MCP** | Notificar canal quando DJ entra ao vivo, compartilhar tracks |
| **GitHub MCP** | Publicar patterns como gists, fork de patterns |
| **Supabase MCP** | CRUD direto no banco via agente |
| **Browserbase/Puppeteer MCP** | Automação de testes, screenshots de patterns |
| **Memory MCP** | Agente lembra preferências do user entre sessões |
| **Calendar MCP** | Agendar sets ao vivo, eventos no Ipê Village |
| **Gmail MCP** | Notificar criadores quando seu pattern é forkado/tocado |
| **Filesystem MCP** | Salvar/carregar patterns locais, sample packs |
| **Sequential Thinking MCP** | Planejamento complexo de composições multi-parte |

### Multi-Agent Architecture

```
[Orchestrator Agent]
    │
    ├── [Composer Agent] — gera padrões Strudel
    │   └── Especializado em teoria musical, progressões, estrutura
    │
    ├── [Mixer Agent] — ajusta gain, EQ, efeitos
    │   └── Analisa spectrum data, balanceia frequências
    │
    ├── [DJ Agent] — decide transições, setlist
    │   └── Considera hora do dia, energia da audiência, histórico
    │
    ├── [Visual Agent] — controla projeções, temas
    │   └── Sync com beat detection, mood da música
    │
    └── [Social Agent] — interage com audiência
        └── Lê chat, responde, pega requests
```

Cada agente é um MCP client/server. O Orchestrator coordena via tool calling.

---

## 2. Plataformas de Música

### Spotify

| Feature | Como |
|---------|------|
| Import playlist mood | Analisar BPM, key, energy de uma playlist → gerar Strudel similar |
| Export como playlist | Gravar output como audio → upload para Spotify via API |
| "Soa como..." | User cola link de track → AI analisa e gera versão Strudel |
| Login via Spotify | Auth com Spotify OAuth para perfil do creator |

### SoundCloud

| Feature | Como |
|---------|------|
| Publicar tracks | Gravar pattern como WAV/MP3 → upload via SoundCloud API |
| Embed player | Embed SoundCloud player no perfil do creator |
| Import samples | Carregar samples do SoundCloud para usar no editor |

### YouTube / Twitch

| Feature | Como |
|---------|------|
| Live stream | OBS + browser source → stream do editor + spectrum ao vivo |
| VOD archive | Gravar sessões de autopilot como vídeo (code + audio) |
| Twitch integration | Chat do Twitch controla evolve direction |

### MIDI / Hardware

| Feature | Como |
|---------|------|
| MIDI controllers | Web MIDI API → knobs controlam filtros, gain, BPM em tempo real |
| Ableton Link | Sync BPM com outros músicos na mesma rede |
| OSC | Comunicação com SuperCollider, TouchDesigner, Max/MSP |
| Launchpad | Grid de botões → trigger de layers, mute/unmute patterns |

---

## 3. AI / LLM Platforms

### Anthropic (Claude)

| Feature | Como |
|---------|------|
| Claude como compositor | Vercel AI SDK com Claude Sonnet para composições complexas |
| Claude Artifacts | Gerar patterns como artifacts interativos |
| Claude MCP | pulse.city como tool no Claude Desktop |
| Computer Use | Claude vê o spectrum e ajusta mix baseado no visual |

### OpenAI

| Feature | Como |
|---------|------|
| GPT-4o como alternativa | Fallback provider no Vercel AI SDK |
| Whisper | Voice-to-text para comandos de voz no chat |
| DALL-E | Gerar artwork para tracks baseado no vibe |

### Groq / Local (Ollama)

| Feature | Como |
|---------|------|
| Groq free tier | Evolve loop sem custo (já implementado) |
| Ollama local | Funcionar offline em eventos sem internet |
| Custom fine-tuned model | Treinar modelo específico para Strudel syntax |

### ElevenLabs / TTS

| Feature | Como |
|---------|------|
| Voice DJ | AI anuncia tracks, fala entre transições |
| Vocal samples | Gerar vocais/spoken word para incorporar nas tracks |

---

## 4. Visual & Creative

### Hydra (já suportado pelo Strudel)

| Feature | Como |
|---------|------|
| Live visuals | `@strudel/hydra` — visuals reativos à música no browser |
| Projeções | Fullscreen Hydra output para projetar em paredes |
| Sync | Visuals seguem beat detection e energy level |

### TouchDesigner / resolume

| Feature | Como |
|---------|------|
| OSC bridge | Enviar dados de spectrum/beat via OSC para TouchDesigner |
| Visual mapping | Projeção mapeada em superfícies do Ipê Village |

### Stitch (Google — já disponível)

| Feature | Como |
|---------|------|
| Design system | Gerar UI consistente para marketplace com Stitch MCP |
| Prototipar telas | Gerar mockups de novas features (chat, perfil, browse) |
| Variantes | Testar dark/light themes, layouts diferentes |

---

## 5. Social & Comunidade

### Discord

| Feature | Como |
|---------|------|
| Bot pulse.city | Bot que toca patterns em voice channel |
| Notifications | Aviso quando DJ entra ao vivo |
| Voting | Comunidade vota no próximo estilo do autopilot |
| Slash commands | `/pulse play techno` → gera e toca |

### Farcaster / Lens (web3 social)

| Feature | Como |
|---------|------|
| Mint patterns como NFTs | Cada composição vira um NFT on-chain |
| Social feed | Compartilhar patterns no feed descentralizado |
| Frames | Farcaster Frame que toca pattern inline no feed |

### Telegram

| Feature | Como |
|---------|------|
| Bot | Enviar comando, receber link para ouvir |
| Mini App | pulse.city como Telegram Mini App |
| Group DJ | Grupo do Telegram controla direção do autopilot |

---

## 6. Web3 / Crypto

### NFTs de Patterns

```
Pattern NFT {
  code: string          // Strudel source code
  audioPreview: string  // 30s IPFS audio
  creator: address      // Wallet do criador
  forks: number         // Quantas vezes foi remixado
  plays: number         // Quantas vezes foi tocado
  royalty: 5%           // Royalty on secondary sales
}
```

### Token-gated access

| Tier | Access |
|------|--------|
| Free | Autopilot, listen only |
| Holder (NFT) | Manual mode, chat, publish |
| Pro (subscription) | All agents, collab, marketplace |
| DAO member | Governance, curation, revenue share |

### On-chain music

| Feature | Como |
|---------|------|
| Store patterns on-chain | Arweave ou IPFS para permanência |
| Composability | Patterns podem importar trechos de outros patterns (on-chain) |
| Revenue split | Smart contract distribui royalties automaticamente |
| Chain | Base (L2) — baixo gas, ecossistema Coinbase |

---

## 7. IoT & Instalações Físicas

### Ipê Village hardware

| Device | Uso |
|--------|-----|
| Raspberry Pi | Headless Chrome → PA system, autopilot 24/7 |
| ESP32 + speakers | Micro-instalações sonoras espalhadas pela vila |
| LED strips | WS2812B controlados por beat detection via WebSocket |
| Projetor | Tela grande mostrando editor + Hydra visuals |
| QR totems | Pontos de acesso → scan → abre pulse.city no celular |

### Sensores → Música

| Sensor | Dado | Mapeamento musical |
|--------|------|---------------------|
| Temperatura | 15-40°C | Filter cutoff (frio=fechado, quente=aberto) |
| Luminosidade | 0-100% | Volume/energy (noite=ambient, dia=upbeat) |
| Movimento (PIR) | presença | Trigger de layers (mais gente = mais camadas) |
| Microfone | dB level | Reactivo ao barulho ambiente |
| Hora do dia | 0-24h | Mood (manhã=chill, tarde=groovy, noite=techno) |

---

## 8. Analytics & Observabilidade

### PostHog

| Evento | Dado |
|--------|------|
| `boot` | Timestamp, device, location |
| `play` | Pattern code hash, duration |
| `mode_switch` | autopilot→manual ou vice-versa |
| `chat_message` | Prompt (sanitized), mode |
| `evolve` | Mutation type, user direction |
| `pattern_publish` | Title, tags, code length |
| `pattern_fork` | Source pattern, creator |

### Grafana + Prometheus (produção)

| Métrica | Uso |
|---------|-----|
| Active listeners | Real-time dashboard |
| AI latency | p50/p95/p99 por provider |
| Error rate | Eval failures, AI failures |
| Evolve frequency | Mutations per hour |

---

## Prioridade de implementação

### POC (agora)
- Nenhuma integração externa necessária

### Alpha
- [ ] Vercel AI SDK (server-side AI)
- [ ] Supabase (auth + DB)
- [ ] PostHog analytics

### Beta
- [ ] pulse.city como MCP Server
- [ ] Discord bot
- [ ] Web MIDI API
- [ ] Hydra visuals toggle
- [ ] Spotify "soa como..." feature

### Launch (Ipê Village)
- [ ] IoT sensores → música
- [ ] Raspberry Pi installations
- [ ] LED sync
- [ ] QR totems
- [ ] Projeções com Hydra/TouchDesigner

### Post-launch
- [ ] NFT patterns (Base L2)
- [ ] Farcaster Frames
- [ ] Multi-agent architecture
- [ ] Telegram Mini App
- [ ] Custom fine-tuned Strudel model
