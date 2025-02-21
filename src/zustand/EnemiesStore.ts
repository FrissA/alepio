import { StateCreator } from "zustand";
import { Vector3 } from "three";

import { GameStore } from "./GameStore";
import { PlayerStore } from "./PlayerStore";
import { spawnFarFromPlayer } from "@helpers";

export interface EnemiesStore {
  enemies: {
    [key: string]: {
      id: string;
      position: Vector3;
      alive?: boolean;
    };
  };

  addEnemy: () => void;
  updateEnemy: (enemy: {
    id: string;
    position: Vector3;
    target?: Vector3;
  }) => void;
  removeEnemy: (enemy: { id: string }) => void;
  resetEnemies: () => void;
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
  updateEnemy: (enemy: { id: string; position: Vector3; target?: Vector3 }) =>
    set((state) => {
      if (state.enemies[enemy.id]) {
        return {
          enemies: { ...state.enemies, [enemy.id]: enemy },
        };
      }
      return state;
    }),
  removeEnemy: (enemy: { id: string }) =>
    set((state) => {
      const enemies = { ...state.enemies };
      delete enemies[enemy.id];
      return { enemies };
    }),
  resetEnemies: () => set(() => ({ enemies: {} })),
});
