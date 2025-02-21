import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import { useGameStore } from "./zustland/store";
import Enemy from "./Components/Enemy";
import Player from "./Components/Player";
import Bullet from "./Components/Bullet";

const App: React.FC = () => {
  const setBounds = useGameStore((state) => state.setBounds);

  const bullets = useGameStore((state) => state.bullets);
  const addBullet = useGameStore((state) => state.addBullet);
  const cleanUpBullets = useGameStore((state) => state.cleanUpBullets);

  const enemies = useGameStore((state) => state.enemies);
  const addEnemy = useGameStore((state) => state.addEnemy);

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      // When the bullet is shot, we create it and add it to the state
      addBullet();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addBullet]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // When the bullet is shot, we create it and add it to the state
      addEnemy();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addEnemy]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //Every some seconds, clean up bullets out of bounds
      cleanUpBullets();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [cleanUpBullets]);

  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 2]} />
      <Player />
      {Object.values(enemies).map((enemy) => (
        <Enemy key={enemy.id} {...enemy} />
      ))}

      {Object.values(bullets).map((bullet) => (
        <Bullet key={bullet.id} {...bullet} />
      ))}
    </Canvas>
  );
};

export default App;
