import { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";
import { useSound } from "@hooks/useSound";

import actionSound from "@assets/sounds/action.wav";

const YouDied: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const score = useGameStore((state) => state.score);
  const setScore = useGameStore((state) => state.setScore);
  const maxScore = useGameStore((state) => state.maxScore);

  const actionAudio = useSound(actionSound);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        actionAudio.play();
        setGameStatus(GameStatuses.menu);
        setScore(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actionAudio, setScore, setGameStatus]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-green-400 font-mono">
      <div
        className="border-4 border-green-500 rounded-lg p-6 shadow-lg bg-black/80 backdrop-blur-md max-w-md text-center 
      animate-terminal border-glow"
      >
        <h1 className="text-4xl font-[Orbitron] font-bold tracking-wide uppercase animate-fade-in text-red-500">
          You Died
        </h1>
        <h2 className="text-2xl font-[Orbitron] mt-4 animate-fade-in">
          Your score: <span className="text-violet-400">{score}</span>
        </h2>
        <h3 className="text-xl font-[Orbitron] mt-2 animate-fade-in">
          Max score: <span className="text-violet-400">{maxScore}</span>
        </h3>
        <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
          Press the <span className="text-green-400">space bar</span> to go back
          to the menu
        </p>
      </div>
    </div>
  );
};

export default YouDied;
