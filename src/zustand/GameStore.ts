import { StateCreator } from "zustand";
import { PlayerStore } from "./PlayerStore";
import { EnemiesStore } from "./EnemiesStore";
import { BulletsStore } from "./BulletsStore";

export enum GameStatuses {
  menu = "menu",
  running = "running",
  dead = "dead",
}

export interface GameStore {
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    z: number;
  };
  score: number;
  maxScore: number;
  gameStatus: GameStatuses;

  setBounds: (bounds: GameStore["bounds"]) => void;
  setGameStatus: (status: GameStore["gameStatus"]) => void;
  setScore: (score: number) => void;
  resetGame: () => void;
}

export const createGameSlice: StateCreator<
  GameStore & PlayerStore & EnemiesStore & BulletsStore,
  [],
  [],
  GameStore
> = (set, get) => ({
  bounds: { minX: -1, maxX: 1, minY: -1, maxY: 1, z: -2 },
  gameStatus: GameStatuses.menu,
  score: 0,
  maxScore: 0,
  setBounds: (bounds) => set({ bounds }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setScore: (score) =>
    set((state) => {
      let maxScore = state.maxScore;
      if (score > maxScore) {
        maxScore = score;
      }
      return { ...state, score, maxScore };
    }),

  resetGame: () => {
    get().resetEnemies();
    get().resetBullets();
    get().resetPlayer();
  },
});
