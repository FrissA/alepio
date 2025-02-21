import { StateCreator } from "zustand";
import { Vector3 } from "three";

import { GameStore } from "./GameStore";
import { PlayerStore } from "./PlayerStore";
import { spawnFarFromPlayer } from "../helpers";

export interface EnemiesStore {
  enemies: {
    [key: string]: {
      id: string;
      position: Vector3;
      alive?: boolean;
    };
  };

  addEnemy: () => void;
  removeEnemy: (enemy: { id: string }) => void;
}

export const createEnemiesSlice: StateCreator<
  GameStore & PlayerStore & EnemiesStore,
  [],
  [],
  EnemiesStore
> = (set, get) => ({
  enemies: {} as Record<
    string,
    { id: string; position: Vector3; alive?: boolean }
  >,
  addEnemy: () =>
    set((state) => {
      const id = Math.random().toString();
      return {
        enemies: {
          ...state.enemies,
          [id]: {
            id,
            position: spawnFarFromPlayer(
              new Vector3(...get().playerRawPosition), // Accessing player position from Player Slice
              get().bounds // Accessing bounds from Game Slice
            ),
          },
        },
      };
    }),
  removeEnemy: (enemy: { id: string }) =>
    set((state) => {
      const enemies = { ...state.enemies };
      delete enemies[enemy.id];
      return { enemies };
    }),
});
