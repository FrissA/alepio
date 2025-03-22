import { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";
import { useSound } from "@hooks/useSound";

import actionSound from "@assets/sounds/action.wav";

const StartScreen: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const actionAudio = useSound(actionSound);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        actionAudio.play();
        setTimeout(() => {
          setGameStatus(GameStatuses.running);
        }, 200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setGameStatus, actionAudio]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-green-400 font-mono">
      <div
        className="border-4 border-green-500 rounded-lg p-6 shadow-lg bg-black/80 backdrop-blur-md max-w-md text-center 
        animate-terminal border-glow"
      >
        <h1 className="text-4xl font-[Orbitron] font-bold tracking-wide uppercase animate-fade-in">
          Welcome to AlepIO
        </h1>
        <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
          Move with <span className="text-white">WASD</span>. Aim with{" "}
          <span className="text-white">cursor</span>
        </p>
        <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
          Press the <span className="text-white">space bar</span> to start
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
