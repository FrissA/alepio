import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

import Player from "@components/Player";
import EnemyManager from "@components/EnemyManager";
import BulletManager from "@components/BulletManager";
import StartMenu from "@components/StartMenu";
import YouDied from "@components/YouDied";

const App: React.FC = () => {
  const setBounds = useGameStore((state) => state.setBounds);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const score = useGameStore((state) => state.score);
  const maxScore = useGameStore((state) => state.maxScore);

  useEffect(() => {
    const updateBounds = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;
      const height = 5.5; // Set a fixed height for the game world
      const width = height * aspectRatio; // Scale width based on the aspect ratio

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
    <>
      {gameStatus === GameStatuses.menu && <StartMenu />}
      {/* TODO: Move to separate component */}
      {gameStatus === GameStatuses.running && (
        <>
          <h1 style={{ position: "absolute", top: "10px", left: "10px", fontSize: "30px" }}>
            Score: {score}
          </h1>
          <h1 style={{ position: "absolute", top: "60px", left: "10px", fontSize: "15px" }}>
            Max score: {maxScore}
          </h1>
          <Canvas style={{ height: "100vh", width: "100vw" }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[2, 2, 2]} />
            <Player />
            <EnemyManager />
            <BulletManager />
          </Canvas>
        </>
      )}
      {gameStatus === GameStatuses.dead && <YouDied />}
    </>
  );
};

export default App;
