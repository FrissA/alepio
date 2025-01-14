import { create } from "zustand";
import { Vector3 } from "three";

interface GameStore {
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  setBounds: (bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }) => void;
  playerPosition: [number, number, number];
  setPlayerPosition: (position: [number, number, number]) => void;
  cursorPosition: Vector3;
  bullets: {
    [key: string]: {
      id: string;
      position?: Vector3;
      target?: Vector3;
      outOfBounds?: boolean;
    };
  };
  addBullet: () => void;
  updateBullet: (bullet: {
    id: string;
    position: Vector3;
    target?: Vector3;
    outOfBounds?: boolean;
  }) => void;
  killBullet: (bullet: { id: string }) => void;
  cleanUpBullets: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5 },
  playerPosition: [0, 0, 0],
  cursorPosition: new Vector3(0, 0, 0),
  bullets: {},
  setBounds: (bounds) => set({ bounds }),
  setPlayerPosition: (position) => set({ playerPosition: position }),
  addBullet: () =>
    set((state) => {
      const id = Math.random().toString();
      return {
        bullets: { ...state.bullets, [id]: { id } },
      };
    }),
  updateBullet: (bullet) =>
    set((state) => ({ bullets: { ...state.bullets, [bullet.id]: bullet } })),
  killBullet: (bullet) =>
    set((state) => {
      const bullets = { ...state.bullets };
      delete bullets[bullet.id];
      return { bullets: { ...bullets } };
    }),
  cleanUpBullets: () =>
    set(({ bullets }) => {
      const newBullets = { ...bullets };
      return Object.values(newBullets).reduce((acc, curr) => {
        if (!curr.outOfBounds) {
          acc[curr.id] = curr;
        }
        return acc;
      }, {} as typeof bullets);
    }),
}));
