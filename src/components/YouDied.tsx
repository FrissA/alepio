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
  const isMobileControls = useGameStore((state) => state.isMobileControls);

  const actionAudio = useSound(actionSound);

  const handleBackToMenu = () => {
    actionAudio.play();
    setGameStatus(GameStatuses.menu);
    setScore(0);
  };

  useEffect(() => {
    if (isMobileControls) return; // Don't listen for keyboard on mobile

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleBackToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileControls]); // eslint-disable-line react-hooks/exhaustive-deps

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
          Your score: <span className="text-white">{score}</span>
        </h2>
        <h3 className="text-xl font-[Orbitron] mt-2 animate-fade-in">
          Max score: <span className="text-white">{maxScore}</span>
        </h3>
        {isMobileControls ? (
          <button
            onClick={handleBackToMenu}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-[Orbitron] font-bold rounded-lg 
            hover:bg-green-400 active:bg-green-600 transition-colors uppercase tracking-wide
            border-2 border-green-300 shadow-lg"
          >
            Back to Menu
          </button>
        ) : (
          <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
            Press the <span className="text-white">space bar</span> to go back
            to the menu
          </p>
        )}
      </div>
    </div>
  );
};

export default YouDied;
