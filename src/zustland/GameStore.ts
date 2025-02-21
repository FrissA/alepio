import { StateCreator } from "zustand";

export interface GameStore {
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    z: number;
  };
  setBounds: (bounds: GameStore["bounds"]) => void;
}

export const createGameSlice: StateCreator<GameStore, [], [], GameStore> = (set) => ({
  bounds: { minX: -1, maxX: 1, minY: -1, maxY: 1, z: -2 },
  setBounds: (bounds) => set({ bounds }),
});
