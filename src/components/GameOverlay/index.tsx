import { Canvas } from "@react-three/fiber";

import { useGameStore } from "@zustand/store";
import { useSound } from "@hooks/useSound";
import Player from "@components/Player";
import EnemyManager from "@components/EnemyManager";
import BulletManager from "@components/BulletManager";
import speakerIcon from "@assets/speaker.svg";
import mutedSpeakerIcon from "@assets/mutedSpeaker.svg";

import unmuteSound from "@assets/sounds/unmute.wav";

const GameOverlay = () => {
  const score = useGameStore((state) => state.score);
  const maxScore = useGameStore((state) => state.maxScore);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);

  const unmuteAudio = useSound(unmuteSound);

  const speakerSource = isAudioEnabled ? speakerIcon : mutedSpeakerIcon;

  return (
    <>
      <h3 className="absolute z-1 top-4 left-4 text-white font-[Orbitron]">
        Score: {score}
      </h3>
      <h3 className="absolute z-1 top-14 left-4 text-white font-[Orbitron]">
        Max score: {maxScore}
      </h3>
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
      <Canvas
        className="bg-black/80"
        style={{ height: "100vh", width: "100vw" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} />
        <Player />
        <EnemyManager />
        <BulletManager />
      </Canvas>
    </>
  );
};

export default GameOverlay;
