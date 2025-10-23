import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

import { useSound } from "@hooks/useSound";
import { useGameStore } from "@zustand/store";
import { GameStatuses } from "@zustand/GameStore";

import playerDies from "@assets/sounds/playerDies.wav";

const SPEED = 0.05;
const MOBILE_FOLLOW_SPEED = 0.05; // Constant movement speed for mobile

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
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  const setPlayerRawPosition = useGameStore(
    (state) => state.setPlayerRawPosition
  );
  const playerRawPosition = useGameStore((state) => state.playerRawPosition);
  const bounds = useGameStore((state) => state.bounds);
  const enemies = useGameStore((state) => state.enemies);
  const isMobileControls = useGameStore((state) => state.isMobileControls);

  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const resetGame = useGameStore((state) => state.resetGame);

  const deathAudio = useSound(playerDies);

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

  useEffect(() => {
    if (!isMobileControls) return;

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) {
        // Convert screen coordinates to normalized device coordinates (-1 to 1)
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setTouchPosition({ x, y });
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setTouchPosition({ x, y });
      }
    };

    const handleTouchEnd = () => {
      // Keep the last position when touch ends so player stays there
      // setTouchPosition(null);
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Also support mouse on mobile devices
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setTouchPosition({ x, y });
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobileControls]);

  useFrame(() => {
    const newPosition = [...playerRawPosition] as [number, number, number];

    if (isMobileControls) {
      // Mobile: move towards touch/pointer position at constant speed
      const currentPointer = touchPosition || { x: pointer.x, y: pointer.y };
      const targetX = currentPointer.x * bounds.maxX;
      const targetY = currentPointer.y * bounds.maxY;
      
      // Calculate direction vector
      const dx = targetX - newPosition[0];
      const dy = targetY - newPosition[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move at constant speed towards target
      if (distance > 0.01) { // Add threshold to prevent jittering
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Move at constant speed, but don't overshoot
        const moveDistance = Math.min(MOBILE_FOLLOW_SPEED, distance);
        newPosition[0] += normalizedDx * moveDistance;
        newPosition[1] += normalizedDy * moveDistance;
      }
    } else {
      // Desktop: WASD controls
      keysPressed.forEach((key) => {
        if (keyMap[key]) {
          newPosition[0] += keyMap[key][0];
          newPosition[1] += keyMap[key][1];
        }
      });
    }

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
          deathAudio.play();
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
