import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

import { useGameStore } from "../zustland/store";

const keyMap: {
  [key: string]: [number, number];
} = {
  KeyW: [0, 0.1], // Move up (positive Y)
  KeyS: [0, -0.1], // Move down (negative Y)
  KeyA: [-0.1, 0], // Move left (negative X)
  KeyD: [0.1, 0], // Move right (positive X)
};

const Player: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  useFrame(() => {
    const newPosition = [...position] as [number, number, number];

    keysPressed.forEach((key) => {
      if (keyMap[key]) {
        newPosition[0] += keyMap[key][0];
        newPosition[1] += keyMap[key][1];
      }
    });

    setPosition(newPosition);
    setPlayerPosition(newPosition); // Update the global store

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
