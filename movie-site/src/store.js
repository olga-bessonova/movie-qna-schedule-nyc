import { create } from "zustand";

export const useSlideStore = create((set) => ({
  currentAMCSlide: 0,
  currentIFCSlide: 0,
  currentAngelikaSlide: 0,

  setCurrentAMCSlide: (idx) => set({ currentAMCSlide: idx }),
  setCurrentIFCSlide: (idx) => set({ currentIFCSlide: idx }),
  setCurrentAngelikaSlide: (idx) => set({ currentAngelikaSlide: idx }),
}));
