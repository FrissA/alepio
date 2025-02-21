import { create } from "zustand";

import { createGameSlice, GameStore } from "./GameStore";
import { createPlayerSlice, PlayerStore } from "./PlayerStore";
import { createEnemiesSlice, EnemiesStore } from "./EnemiesStore";
import { BulletsStore, createBulletsSlice } from "./BulletsStore";

export const useGameStore = create<
  GameStore & PlayerStore & EnemiesStore & BulletsStore
>()((set, get, store) => ({
  ...createGameSlice(set, get, store),
  ...createPlayerSlice(set, get, store),
  ...createEnemiesSlice(set, get, store),
  ...createBulletsSlice(set, get, store),
}));
