import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "autopilot" | "manual";
export type Keybindings = "codemirror" | "vscode" | "vim" | "emacs";

export interface EditorSettings {
  autocomplete: boolean;
  tooltips: boolean;
  bracketMatching: boolean;
  activeLine: boolean;
  tabIndent: boolean;
  multiCursor: boolean;
  lineWrapping: boolean;
  keybindings: Keybindings;
  fontSize: number;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  autocomplete: true,
  tooltips: true,
  bracketMatching: true,
  activeLine: true,
  tabIndent: true,
  multiCursor: true,
  lineWrapping: false,
  keybindings: "codemirror",
  fontSize: 14,
};

export const FONT_SIZE_MIN = 10;
export const FONT_SIZE_MAX = 28;
export const FONT_SIZE_DEFAULT = 14;

export type Genre =
  | "deep-house"
  | "techno"
  | "ambient"
  | "jazz"
  | "dnb"
  | "trap"
  | "psychedelic"
  | "house"
  | "lofi"
  | "dub"
  | "ethereal"
  | "industrial";

export interface DeckState {
  genre: Genre | null;
  key: string;
  bpm: number;
  energy: number;
  space: number;
  brightness: number;
}

export const DEFAULT_DECK: DeckState = {
  genre: null,
  key: "C minor",
  bpm: 124,
  energy: 50,
  space: 40,
  brightness: 55,
};

export const BPM_MIN = 60;
export const BPM_MAX = 180;

export interface AudioOutputs {
  mainDeviceId: string; // "" = system default
  cueDeviceId: string; // "" = system default (identical to main)
}

export type DashboardPanel = "NOW" | "TRACKS" | "HISTORY" | "SESSION";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  label: string;
  code: string;
}

const HISTORY_MAX = 50;

export const DEFAULT_AUDIO_OUTPUTS: AudioOutputs = {
  mainDeviceId: "",
  cueDeviceId: "",
};

interface PulseStore {
  // --- state ---
  mode: Mode;
  code: string;
  trackTitle: string;
  playing: boolean;
  patternId: string | null;

  // --- live broadcast (radio) ---
  broadcastCode: string;
  broadcastTitle: string;
  broadcastActive: boolean;

  // --- editor preferences ---
  editor: EditorSettings;

  // --- DJ deck ---
  deck: DeckState;

  // --- audio outputs ---
  audio: AudioOutputs;

  // --- dashboard ---
  dashboardPanel: DashboardPanel;
  history: HistoryEntry[]; // in-memory, not persisted
  sessionStartedAt: number | null; // timestamp of first play this session
  lastError: string | null; // last Strudel eval error, cleared on successful eval
  lastEvaluatedAt: number | null; // timestamp of last successful evaluate()

  // --- actions ---
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setCode: (code: string) => void;
  setTrackTitle: (title: string) => void;
  setPlaying: (playing: boolean) => void;
  setPatternId: (id: string | null) => void;
  setBroadcast: (code: string, title: string) => void;
  setBroadcastActive: (active: boolean) => void;
  setEditorSetting: <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => void;
  resetEditorSettings: () => void;
  setDeck: <K extends keyof DeckState>(key: K, value: DeckState[K]) => void;
  resetDeck: () => void;
  setAudioOutput: <K extends keyof AudioOutputs>(key: K, value: AudioOutputs[K]) => void;
  setDashboardPanel: (panel: DashboardPanel) => void;
  pushHistory: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
  markSessionStarted: () => void;
  setLastError: (err: string | null) => void;
  markEvaluated: () => void;
  reset: () => void;
}

const INITIAL_STATE = {
  mode: "manual" as Mode,
  code: "",
  trackTitle: "",
  playing: false,
  patternId: null as string | null,
  broadcastCode: "",
  broadcastTitle: "",
  broadcastActive: false,
  editor: { ...DEFAULT_EDITOR_SETTINGS },
  deck: { ...DEFAULT_DECK },
  audio: { ...DEFAULT_AUDIO_OUTPUTS },
  dashboardPanel: "NOW" as DashboardPanel,
  history: [] as HistoryEntry[],
  sessionStartedAt: null as number | null,
  lastError: null as string | null,
  lastEvaluatedAt: null as number | null,
};

export const useStore = create<PulseStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === "autopilot" ? "manual" : "autopilot" }),
      setCode: (code) => set({ code }),
      setTrackTitle: (title) => set({ trackTitle: title }),
      setPlaying: (playing) => set({ playing }),
      setPatternId: (id) => set({ patternId: id }),
      setBroadcast: (code, title) => set({ broadcastCode: code, broadcastTitle: title }),
      setBroadcastActive: (active) => set({ broadcastActive: active }),
      setEditorSetting: (key, value) =>
        set((state) => ({ editor: { ...state.editor, [key]: value } })),
      resetEditorSettings: () => set({ editor: { ...DEFAULT_EDITOR_SETTINGS } }),
      setDeck: (key, value) =>
        set((state) => ({ deck: { ...state.deck, [key]: value } })),
      resetDeck: () => set({ deck: { ...DEFAULT_DECK } }),
      setAudioOutput: (key, value) =>
        set((state) => ({ audio: { ...state.audio, [key]: value } })),
      setDashboardPanel: (panel) => set({ dashboardPanel: panel }),
      pushHistory: (entry) =>
        set((state) => {
          const id =
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const next = [
            { ...entry, id, timestamp: Date.now() },
            ...state.history,
          ].slice(0, HISTORY_MAX);
          return { history: next };
        }),
      clearHistory: () => set({ history: [] }),
      markSessionStarted: () =>
        set((state) => ({
          sessionStartedAt: state.sessionStartedAt ?? Date.now(),
        })),
      setLastError: (err) => set({ lastError: err }),
      markEvaluated: () =>
        set({ lastEvaluatedAt: Date.now(), lastError: null }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "pc.store",
      partialize: (state) => ({
        mode: state.mode,
        code: state.code,
        trackTitle: state.trackTitle,
        editor: state.editor,
        deck: state.deck,
        audio: state.audio,
        dashboardPanel: state.dashboardPanel,
      }),
    }
  )
);
