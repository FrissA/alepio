import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

import Player from "@components/Player";
import EnemyManager from "@components/EnemyManager";
import BulletManager from "@components/BulletManager";
import StartMenu from "@components/StartMenu";
import YouDied from "@components/YouDied";
import { useSound } from "@hooks/useSound";

import speakerIcon from "@assets/speaker.svg";
import mutedSpeakerIcon from "@assets/mutedSpeaker.svg";
import unmuteSound from "@assets/sounds/unmute.wav";

const App: React.FC = () => {
  const setBounds = useGameStore((state) => state.setBounds);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const score = useGameStore((state) => state.score);
  const maxScore = useGameStore((state) => state.maxScore);

  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);
  const toggleAudio = useGameStore((state) => state.toggleAudio);

  const unmuteAudio = useSound(unmuteSound);

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

  const speakerSource = isAudioEnabled ? speakerIcon : mutedSpeakerIcon;

  return (
    <>
      {gameStatus === GameStatuses.menu && <StartMenu />}
      {/* TODO: Move to separate component */}
      {gameStatus === GameStatuses.running && (
        <>
          <h1 className="absolute top-4 left-4 text-green-400 font-[Orbitron] text-md opacity-90">
            Score: {score}
          </h1>
          {/* Next onw with small text */}
          <h1 className="absolute top-14 left-4 text-green-400 font-[Orbitron] text-2px opacity-90">
            Max score: {maxScore}
          </h1>
          {/* Top right speaker icon clickable */}
          <div>
            <div
              className="absolute z-10 top-4 right-4 cursor-pointer"
              onClick={() => {
                unmuteAudio.play();
                toggleAudio();
              }}
            >
              <img
                className="w-8 h-8"
                src={speakerSource}
                alt={`${isAudioEnabled ? "Unmuted" : "Muted"} speaker icon`}
              />
            </div>
          </div>
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
