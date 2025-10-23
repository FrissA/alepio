import { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";
import { useSound } from "@hooks/useSound";
import { isMobileDevice } from "@helpers/index";
import LoginButton from "@components/LoginButton";

import actionSound from "@assets/sounds/action.wav";

const StartScreen: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setMobileControls = useGameStore((state) => state.setMobileControls);
  const isMobileControls = useGameStore((state) => state.isMobileControls);
  const actionAudio = useSound(actionSound);

  useEffect(() => {
    // Detect if mobile device on component mount
    setMobileControls(isMobileDevice());
  }, [setMobileControls]);

  useEffect(() => {
    if (isMobileControls) return; // Don't listen for keyboard on mobile
    
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
  }, [setGameStatus, actionAudio, isMobileControls]);

  const handleStartClick = () => {
    actionAudio.play();
    setTimeout(() => {
      setGameStatus(GameStatuses.running);
    }, 200);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-green-400 font-mono">
      <div
        className="border-4 border-green-500 rounded-lg p-6 shadow-lg bg-black/80 backdrop-blur-md max-w-sm text-center 
        animate-terminal border-glow"
      >
        <h1 className="text-4xl font-[Orbitron] font-bold tracking-wide uppercase animate-fade-in">
          Welcome to AlepIO
        </h1>
        {isMobileControls ? (
          <>
            <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
              Touch and drag to <span className="text-white">move</span>
            </p>
            <p className="mt-2 font-[Orbitron] text-lg animate-flicker">
              Auto-aim at <span className="text-white">closest enemy</span>
            </p>
            <button
              onClick={handleStartClick}
              className="mt-6 px-8 py-3 bg-green-500 text-white font-[Orbitron] font-bold rounded-lg 
              hover:bg-green-400 active:bg-green-600 transition-colors uppercase tracking-wide
              border-2 border-green-300 shadow-lg"
            >
              Start Game
            </button>
          </>
        ) : (
          <>
            <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
              Move with <span className="text-white">WASD</span>. Aim with{" "}
              <span className="text-white">cursor</span>
            </p>
            <p className="mt-4 font-[Orbitron] text-lg animate-flicker">
              Press the <span className="text-white">space bar</span> to start
            </p>
          </>
        )}
        <div className="mt-6 flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
