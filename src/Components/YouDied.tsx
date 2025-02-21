import { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

const YouDied: React.FC = () => {
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const score = useGameStore((state) => state.score);
  const setScore = useGameStore((state) => state.setScore);
  const maxScore = useGameStore((state) => state.maxScore);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setGameStatus(GameStatuses.menu);
        setScore(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setScore, setGameStatus]);;

  return (
    <div>
      <h1>You died :(</h1>
      <h2>Your score: {score}</h2>
      <h3>Max score: {maxScore}</h3>
      <p>Press the space bar to go back to the menu</p>
    </div>
  );
};

export default YouDied;
