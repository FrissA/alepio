import { useMemo } from "react";

import { useGameStore } from "@zustand/store";

export const useSound = (src: string) => {
  const audio = useMemo(() => new Audio(src), [src]);

  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);

  const play = () => {
    if (!isAudioEnabled) return;
    audio.play();
  };

  return {
    play,
  };
};
