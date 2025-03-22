import React, { useEffect } from "react";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

import StartMenu from "@components/StartMenu";
import YouDied from "@components/YouDied";
import GameOverlay from "@components/GameOverlay";
import Socials from "@components/Socials";

const App: React.FC = () => {
  const setBounds = useGameStore((state) => state.setBounds);
  const gameStatus = useGameStore((state) => state.gameStatus);

  useEffect(() => {
    const updateBounds = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const height = 5.5;
      const width = height * aspectRatio;

      setBounds({
        minX: -width,
        maxX: width,
        minY: -height,
        maxY: height,
        z: -2,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, [setBounds]);

  return (
    <div>
      {gameStatus === GameStatuses.menu && <StartMenu />}
      {/* TODO: Move to separate component */}
      {gameStatus === GameStatuses.running && <GameOverlay />}
      {gameStatus === GameStatuses.dead && <YouDied />}
      <Socials />
    </div>
  );
};

export default App;
