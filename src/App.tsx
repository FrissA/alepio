import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Line,
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";

import { useGameStore } from "./zustland/store";
import Enemy from "./Components/Enemy";
import Player from "./Components/Player";
import Bullet from "./Components/Bullet";

const App: React.FC = () => {
  const setBounds = useGameStore((state) => state.setBounds);
  const bounds = useGameStore((state) => state.bounds);
  const bullets = useGameStore((state) => state.bullets);
  const addBullet = useGameStore((state) => state.addBullet);
  const cleanUpBullets = useGameStore((state) => state.cleanUpBullets);

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
    console.log("loadeng");
    const intervalId = setInterval(() => {
      // When the bullet is shot, we create it and add it to the state
      console.log("inside interval");

      addBullet();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addBullet]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //Every some seconds, clean up bullets
      cleanUpBullets();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [cleanUpBullets]);

  // Create boundary lines
  const createBoundaryLines = () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      // Bottom edge
      bounds.minX - 0.15,
      bounds.minY - 0.15,
      0,
      bounds.maxX + 0.15,
      bounds.minY - 0.15,
      0,
      // Right edge
      bounds.maxX + 0.15,
      bounds.minY - 0.15,
      0,
      bounds.maxX + 0.15,
      bounds.maxY + 0.15,
      0,
      // Top edge
      bounds.maxX + 0.15,
      bounds.maxY + 0.15,
      0,
      bounds.minX - 0.15,
      bounds.maxY + 0.15,
      0,
      // Left edge
      bounds.minX - 0.15,
      bounds.maxY + 0.15,
      0,
      bounds.minX - 0.15,
      bounds.minY - 0.15,
      0,
    ]);
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

    const material = new LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    return new Line(geometry, material);
  };
  const boundaryLines = createBoundaryLines();
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Player />
      <Enemy />
      {Object.values(bullets).map((bullet) => (
        <Bullet key={bullet.id} {...bullet} />
      ))}
      <primitive object={boundaryLines} />
    </Canvas>
  );
};

export default App;
