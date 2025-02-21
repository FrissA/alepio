import { StateCreator } from "zustand";
import { Vector3 } from "three";

export interface BulletsStore {
  bullets: {
    [key: string]: {
      id: string;
      position?: Vector3;
      target?: Vector3;
      outOfBounds?: boolean;
      consumed?: boolean;
    };
  };

  addBullet: () => void;
  updateBullet: (bullet: {
    id: string;
    position: Vector3;
    target?: Vector3;
    outOfBounds?: boolean;
  }) => void;
  removeBullet: (bullet: { id: string }) => void;
  cleanUpBullets: () => void;
  resetBullets: () => void;
}

export const createBulletsSlice: StateCreator<
  BulletsStore,
  [],
  [],
  BulletsStore
> = (set) => ({
  bullets: {} as Record<
    string,
    {
      id: string;
      position?: Vector3;
      target?: Vector3;
      outOfBounds?: boolean;
      consumed?: boolean;
    }
  >,
  addBullet: () =>
    set((state) => {
      const id = Math.random().toString();
      return { bullets: { ...state.bullets, [id]: { id } } };
    }),
  updateBullet: (bullet: {
    id: string;
    position: Vector3;
    target?: Vector3;
    outOfBounds?: boolean;
  }) =>
    set((state) => {
      if (state.bullets[bullet.id]) {
        return {
          bullets: { ...state.bullets, [bullet.id]: bullet },
        };
      }
      return state;
    }),
  removeBullet: (bullet: { id: string }) => {
    set((state) => {
      const bullets = { ...state.bullets };
      delete bullets[bullet.id];
      return { bullets };
    });
  },
  cleanUpBullets: () =>
    set(({ bullets }) => {
      return {
        bullets: Object.fromEntries(
          Object.entries(bullets).filter(([_, b]) => !b.outOfBounds)
        ),
      };
    }),
  resetBullets: () => set(() => ({ bullets: {} })),
});
