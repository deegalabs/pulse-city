"use client";

export type SoundKind = "sample" | "synth" | "wavetable" | "other";
export type SoundCategory =
  | "samples"
  | "drum-machines"
  | "synths"
  | "wavetables"
  | "user";

export interface SoundEntry {
  name: string;
  kind: SoundKind;
  category: SoundCategory;
  tag?: string;
  variations?: number; // number of samples in the bank (optional)
  bank?: string; // inferred bank for drum-machine-style names like "RolandTR909_bd"
}

const CATEGORY_LABELS: Record<SoundCategory, string> = {
  samples: "Samples",
  "drum-machines": "Drum Machines",
  synths: "Synths",
  wavetables: "Wavetables",
  user: "User",
};

export function categoryLabel(cat: SoundCategory): string {
  return CATEGORY_LABELS[cat];
}

interface SoundMapEntry {
  data?: {
    type?: string;
    tag?: string;
    samples?: string[] | Record<string, string[]>;
    prebake?: boolean;
  };
}

/**
 * Read Strudel's global sound registry and normalize into categories.
 * Must be called client-side after the prebake promise has resolved, otherwise
 * the map will be mostly empty.
 */
export async function listSounds(): Promise<SoundEntry[]> {
  if (typeof window === "undefined") return [];
  let map: Record<string, SoundMapEntry> = {};
  try {
    const webaudio = (await import("@strudel/webaudio")) as unknown as {
      soundMap?: { get?: () => Record<string, SoundMapEntry> };
    };
    if (webaudio.soundMap?.get) {
      map = webaudio.soundMap.get() ?? {};
    }
  } catch {
    return [];
  }

  const entries: SoundEntry[] = [];
  for (const [name, value] of Object.entries(map)) {
    const data = value?.data ?? {};
    const kind: SoundKind = isKind(data.type) ? (data.type as SoundKind) : "other";

    let category: SoundCategory;
    if (kind === "synth") category = "synths";
    else if (kind === "wavetable") category = "wavetables";
    else if (data.tag === "user") category = "user";
    else if (data.tag === "drum-machines" || name.includes("_")) category = "drum-machines";
    else category = "samples";

    let variations: number | undefined;
    if (Array.isArray(data.samples)) {
      variations = data.samples.length;
    } else if (data.samples && typeof data.samples === "object") {
      // `note -> [files]` shape (piano-style)
      variations = Object.values(data.samples).reduce(
        (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
        0
      );
    }

    const bank = name.includes("_") ? name.split("_", 1)[0] : undefined;

    entries.push({ name, kind, category, tag: data.tag, variations, bank });
  }

  // Stable alphabetical sort
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
}

function isKind(v: unknown): v is SoundKind {
  return v === "sample" || v === "synth" || v === "wavetable";
}

export function filterSounds(
  sounds: SoundEntry[],
  query: string,
  category: SoundCategory | "all"
): SoundEntry[] {
  const q = query.trim().toLowerCase();
  return sounds.filter((s) => {
    if (category !== "all" && s.category !== category) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.bank?.toLowerCase().includes(q) ?? false)
    );
  });
}

export function groupByBank(sounds: SoundEntry[]): Map<string, SoundEntry[]> {
  const out = new Map<string, SoundEntry[]>();
  for (const s of sounds) {
    const key = s.bank ?? s.name;
    if (!out.has(key)) out.set(key, []);
    out.get(key)!.push(s);
  }
  return out;
}

/**
 * Upload a folder of sound files and register each subfolder as a sound name.
 *
 * Expected folder structure:
 *   samples/
 *     swoop/
 *       swoop1.wav
 *       swoop2.wav
 *     smash/
 *       ...
 *
 * Each subfolder becomes a key you can call via `s("<subfolder>")`. Multiple
 * files within one folder are variations accessible via `.n(i)`.
 *
 * Files are loaded into memory via `URL.createObjectURL()` — fast but lost on
 * refresh. Persistent storage via IndexedDB is a future phase.
 */
export interface ImportedSoundBank {
  name: string;
  urls: string[];
}

export async function importSoundFolder(
  files: FileList | File[]
): Promise<{ banks: ImportedSoundBank[]; count: number }> {
  const fileArr = Array.from(files);
  const byFolder = new Map<string, File[]>();

  for (const f of fileArr) {
    const path = (f as File & { webkitRelativePath?: string }).webkitRelativePath;
    if (!path || !/\.(wav|mp3|ogg|flac|aif|aiff)$/i.test(f.name)) continue;
    // Path looks like "samples/swoop/swoop1.wav" — we want the immediate parent of the file
    const parts = path.split("/");
    if (parts.length < 2) continue;
    const folder = parts[parts.length - 2];
    if (!folder) continue;
    const arr = byFolder.get(folder) ?? [];
    arr.push(f);
    byFolder.set(folder, arr);
  }

  const banks: ImportedSoundBank[] = [];
  let count = 0;
  for (const [folder, folderFiles] of byFolder) {
    folderFiles.sort((a, b) => a.name.localeCompare(b.name));
    const urls = folderFiles.map((f) => URL.createObjectURL(f));
    banks.push({ name: folder.toLowerCase().replace(/\s+/g, "_"), urls });
    count += urls.length;
  }

  // Register with Strudel's sampler. samples(map, baseUrl, options) accepts a
  // plain object whose keys become sound names; options.tag categorises them.
  try {
    const webaudio = (await import("@strudel/webaudio")) as unknown as {
      samples: (
        map: unknown,
        baseUrl?: string,
        options?: { tag?: string; prebake?: boolean }
      ) => Promise<unknown>;
    };
    const sampleMap: Record<string, string[]> = {};
    for (const bank of banks) sampleMap[bank.name] = bank.urls;
    await webaudio.samples(sampleMap, "", { tag: "user" });
  } catch (err) {
    console.error("Failed to register user samples:", err);
  }

  return { banks, count };
}
