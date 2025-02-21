import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

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
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const meshRef = useRef<Mesh>(null);

  const setPlayerRawPosition = useGameStore(
    (state) => state.setPlayerRawPosition
  );
  const playerRawPosition = useGameStore((state) => state.playerRawPosition);
  const bounds = useGameStore((state) => state.bounds);
  const enemies = useGameStore((state) => state.enemies);
  
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const resetGame = useGameStore((state) => state.resetGame);

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

  useFrame(() => {
    const newPosition = [...playerRawPosition] as [number, number, number];

    keysPressed.forEach((key) => {
      if (keyMap[key]) {
        newPosition[0] += keyMap[key][0];
        newPosition[1] += keyMap[key][1];
      }
    });

    // Keep player within bounds
    newPosition[0] = Math.max(
      bounds.minX,
      Math.min(bounds.maxX, newPosition[0])
    );
    newPosition[1] = Math.max(
      bounds.minY,
      Math.min(bounds.maxY, newPosition[1])
    );

    setPlayerRawPosition(newPosition);

    if (meshRef.current) {
      meshRef.current.position.set(...newPosition);
    }

    Object.values(enemies).forEach((enemy) => {
      if (enemy.position && meshRef.current) {
        const closeToPlayer = new Vector3().subVectors(
          enemy.position,
          meshRef.current.position
        );
        if (closeToPlayer.length() < 0.25) {
          setGameStatus(GameStatuses.dead);
          resetGame();
        }
      }
    });
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

export default Player;
