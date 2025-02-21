import { Vector3 } from "three";
import { StateCreator } from "zustand";

export interface PlayerStore {
  playerRawPosition: [number, number, number];
  setPlayerRawPosition: (position: [number, number, number]) => void;
}

export const createPlayerSlice: StateCreator<PlayerStore, [], [], PlayerStore> = (
  set
) => ({
  playerRawPosition: [0, 0, -2] as [number, number, number],
  cursorPosition: new Vector3(0, 0, 0),
  setPlayerRawPosition: (position: [number, number, number]) =>
    set({ playerRawPosition: position }),
});
