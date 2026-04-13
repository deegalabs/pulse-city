import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "autopilot" | "manual";

interface PulseStore {
  // --- state ---
  mode: Mode;
  code: string;
  trackTitle: string;
  playing: boolean;
  patternId: string | null;

  // --- actions ---
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setCode: (code: string) => void;
  setTrackTitle: (title: string) => void;
  setPlaying: (playing: boolean) => void;
  setPatternId: (id: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  mode: "autopilot" as Mode,
  code: "",
  trackTitle: "",
  playing: false,
  patternId: null as string | null,
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
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "pc.store",
      partialize: (state) => ({
        mode: state.mode,
        code: state.code,
        trackTitle: state.trackTitle,
      }),
    }
  )
);
