import type { DeckState, Genre } from "@/lib/store";

export const GENRE_LABELS: Record<Genre, string> = {
  "deep-house": "Deep House",
  techno: "Techno",
  ambient: "Ambient",
  jazz: "Jazz",
  dnb: "Drum & Bass",
  trap: "Trap",
  psychedelic: "Psychedelic",
  house: "House",
  lofi: "Lo-Fi",
  dub: "Dub",
  ethereal: "Ethereal",
  industrial: "Industrial",
};

export const GENRE_DESCRIPTIONS: Record<Genre, string> = {
  "deep-house": "warm pads, four-on-floor, rolling bassline, ~120-124 BPM",
  techno: "driving kick, hypnotic stabs, 130 BPM, minimal variation",
  ambient: "slow evolving pads, field-recording textures, no drums",
  jazz: "acoustic swing, walking bass, ii-V-I progressions, brush drums",
  dnb: "170-174 BPM, amen break derivatives, reese bass, deep sub",
  trap: "booming 808 sub, rapid hi-hats, triplet rolls, 140 BPM half-time feel",
  psychedelic: "modular textures, filter sweeps, evolving arps, unusual time signatures",
  house: "classic house: lively kick, open hats, piano stabs, 122 BPM",
  lofi: "jazz chord samples, lo-fi hip-hop drums, vinyl crackle, 75-85 BPM",
  dub: "heavy reverb/delay throws, sparse drums, deep bassline, spacious mix",
  ethereal: "shimmering pads, bell-like leads, long tails, cinematic atmosphere",
  industrial: "distorted drums, noise textures, metallic percussion, grinding bass",
};

function intensityWord(value: number, kind: "energy" | "space" | "brightness"): string {
  const axes = {
    energy: ["sparse and subdued", "restrained", "medium drive", "energetic", "relentless"],
    space: ["tight and dry", "close", "some room", "spacious", "cavernous"],
    brightness: ["dark and low-passed", "muted", "natural tone", "bright", "crystalline"],
  };
  const idx = Math.min(4, Math.max(0, Math.floor(value / 20)));
  return axes[kind][idx];
}

export function buildDeckComposePrompt(deck: DeckState): string {
  const genre = deck.genre
    ? `${GENRE_LABELS[deck.genre]} — ${GENRE_DESCRIPTIONS[deck.genre]}`
    : "pop-up city festival vibe, genre of your choice";

  return [
    `Compose a fresh track in this style: ${genre}.`,
    `Key: ${deck.key}. BPM: ${deck.bpm}.`,
    `Energy: ${intensityWord(deck.energy, "energy")} (${deck.energy}/100).`,
    `Space: ${intensityWord(deck.space, "space")} (${deck.space}/100).`,
    `Brightness: ${intensityWord(deck.brightness, "brightness")} (${deck.brightness}/100).`,
  ].join(" ");
}

export function buildLayerPrompt(
  layer: "kick" | "hats" | "snare" | "bass" | "lead" | "pad" | "fx",
  deck: DeckState
): string {
  const genre = deck.genre ? GENRE_LABELS[deck.genre].toLowerCase() : "current";
  const energy = intensityWord(deck.energy, "energy");
  const perLayer: Record<string, string> = {
    kick: `Add or improve the kick drum pattern for a ${genre} track. Keep it ${energy}.`,
    hats: `Add or improve hi-hats / cymbals for this ${genre} track. Keep it ${energy}.`,
    snare: `Add or improve snare / clap pattern for this ${genre} track.`,
    bass: `Add or improve the bassline for this ${genre} track in ${deck.key}. Keep it ${energy}.`,
    lead: `Add a lead melody or arpeggio in ${deck.key} that fits ${genre}. Keep it ${energy}.`,
    pad: `Add a pad or chord progression in ${deck.key} for a ${genre} track. Space: ${intensityWord(deck.space, "space")}.`,
    fx: `Add effects and movement (reverb, delay, filter modulation). Space: ${intensityWord(deck.space, "space")}.`,
  };
  return perLayer[layer];
}
