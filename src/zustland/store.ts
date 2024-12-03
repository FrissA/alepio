// store.ts
import { create } from "zustand";

interface GameState {
  playerPosition: [number, number, number];
  setPlayerPosition: (position: [number, number, number]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerPosition: [0, 0, 0],
  setPlayerPosition: (position) => set({ playerPosition: position }),
}));
