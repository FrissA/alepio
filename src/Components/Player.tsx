import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

import { useGameStore } from "../zustland/store";

const SPEED = 0.05;

const keyMap: {
  [key: string]: [number, number];
} = {
  KeyW: [0, SPEED],
  KeyS: [0, -SPEED],
  KeyA: [-SPEED, 0],
  KeyD: [SPEED, 0],
};

const Player: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const bounds = useGameStore((state) => state.bounds);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useFrame(() => {
    const newPosition = [...playerPosition] as [number, number, number];

    keysPressed.forEach((key) => {
      if (keyMap[key]) {
        newPosition[0] += keyMap[key][0];
        newPosition[1] += keyMap[key][1];
      }
    });

    // Clamp position to bounds
    newPosition[0] = Math.max(
      bounds.minX,
      Math.min(bounds.maxX, newPosition[0])
    );
    newPosition[1] = Math.max(
      bounds.minY,
      Math.min(bounds.maxY, newPosition[1])
    );

    setPlayerPosition(newPosition);
    // console.log("newPosition", newPosition);

    if (meshRef.current) {
      meshRef.current.position.set(...newPosition);
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(event.code));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(event.code);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

export default Player;
