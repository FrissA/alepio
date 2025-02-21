import { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

const StartScreen: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setGameStatus(GameStatuses.running);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setGameStatus]);

  return (
    <div>
      <h1>Welcome to AlepIO</h1>
      <p>Press the space bar to start</p>
    </div>
  );
};

export default StartScreen;
