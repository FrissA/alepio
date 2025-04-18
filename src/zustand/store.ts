import { create } from "zustand";

import { createGameSlice, GameStore } from "./GameStore";
import { createPlayerSlice, PlayerStore } from "./PlayerStore";
import { createEnemiesSlice, EnemiesStore } from "./EnemiesStore";
import { BulletsStore, createBulletsSlice } from "./BulletsStore";
import { persist } from "zustand/middleware";

export const useGameStore = create<
  GameStore & PlayerStore & EnemiesStore & BulletsStore
>()(
  persist(
    (set, get, store) => ({
      ...createGameSlice(set, get, store),
      ...createPlayerSlice(set, get, store),
      ...createEnemiesSlice(set, get, store),
      ...createBulletsSlice(set, get, store),
    }),
    {
      name: "alepio",
      partialize: (state) => ({
        maxScore: state.maxScore,
        isAudioEnabled: state.isAudioEnabled,
      }),
    }
  )
);
