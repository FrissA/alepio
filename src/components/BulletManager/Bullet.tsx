import React, { useRef, useEffect, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { useSound } from "@hooks/useSound";
import { useGameStore } from "@zustand/store";

import bulletSound from "@assets/sounds/bullet.wav";

interface BulletProps {
  id: string;
}

const Bullet: React.FC<BulletProps> = ({ id }) => {
  const [wasShot, setWasShot] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();
  const speed = 0.04; // Bullet speed
  const updateBullet = useGameStore((state) => state.updateBullet);
  const playerRawPosition = useGameStore((state) => state.playerRawPosition);
  const bounds = useGameStore((state) => state.bounds);
  const isMobileControls = useGameStore((state) => state.isMobileControls);
  const enemies = useGameStore((state) => state.enemies);

  const bulletRef = useRef<{ original: Vector3; direction: Vector3 }>({
    original: new Vector3(),
    direction: new Vector3(),
  });

  const bulletAudio = useSound(bulletSound);

  useEffect(() => {
    // Set the target position for the bullet (where the cursor was when shot)
    if (meshRef.current && !wasShot) {
      
      bulletAudio.play();

      const position = new Vector3(
        playerRawPosition[0],
        playerRawPosition[1],
        playerRawPosition[2]
      );
      meshRef.current.position.set(position.x, position.y, bounds.z);
     
      bulletRef.current.original = position;

      let target: Vector3;

      if (isMobileControls) {
        // Mobile: Auto-aim at closest enemy
        const enemyList = Object.values(enemies).filter(e => e.position);
        
        if (enemyList.length > 0) {
          // Find closest enemy
          let closestEnemy = enemyList[0];
          let minDistance = position.distanceTo(closestEnemy.position!);
          
          for (const enemy of enemyList) {
            const distance = position.distanceTo(enemy.position!);
            if (distance < minDistance) {
              minDistance = distance;
              closestEnemy = enemy;
            }
          }
          
          target = closestEnemy.position!.clone();
        } else {
          // No enemies, shoot forward
          target = new Vector3(position.x, bounds.maxY, bounds.z);
        }
      } else {
        // Desktop: Aim at cursor
        target = new Vector3(
          pointer.x * bounds.maxX,
          pointer.y * bounds.maxY,
          bounds.z
        );
      }

      bulletRef.current.direction = target;

      setWasShot(true);
    }
  }, [bulletAudio, wasShot, playerRawPosition, pointer, updateBullet, id, bounds, isMobileControls, enemies]);

  // Update bullet position every frame
  useFrame(() => {
    if (meshRef.current) {
      // Move the bullet towards the target

      const direction = new Vector3()
        .subVectors(bulletRef.current.original, bulletRef.current.direction)
        .normalize();

      meshRef.current.position.add(direction.multiplyScalar(-speed));

      if (
        meshRef.current.position.x === 0 &&
        meshRef.current.position.y === 0
      ) {
        meshRef.current.position.set(bounds.maxX, bounds.maxY, bounds.z);
      }

      const outOfBounds =
        Math.abs(meshRef.current.position.x) > 10 ||
        Math.abs(meshRef.current.position.y) > 10;

      updateBullet({
        id,
        position: meshRef.current.position,
        outOfBounds,
      });
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default Bullet;
