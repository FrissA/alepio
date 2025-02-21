import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useGameStore } from "../zustland/store";

interface EnemyProps {
  id: string;
  position: Vector3;
}

const Enemy: React.FC<EnemyProps> = ({ id, position }) => {
  const meshRef = useRef<Mesh>(null);
  const playerRawPosition = useGameStore((state) => state.playerRawPosition);
  const bounds = useGameStore((state) => state.bounds);
  const bullets = useGameStore((state) => state.bullets);
  const removeEnemy = useGameStore((state) => state.removeEnemy);
  const removeBullet = useGameStore((state) => state.removeBullet);
  const [speed, setSpeed] = useState(0.03);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  }, [position]);

  useFrame(() => {
    if (meshRef.current) {
      const enemyPosition = meshRef.current.position;

      const direction = new Vector3(
        playerRawPosition[0] - enemyPosition.x,
        playerRawPosition[1] - enemyPosition.y,
        bounds.z
      );

      direction.normalize();

      enemyPosition.x += direction.x * speed;
      enemyPosition.y += direction.y * speed;
      enemyPosition.z = bounds.z;

      // Keep enemy within bounds
      enemyPosition.x = Math.max(
        bounds.minX,
        Math.min(bounds.maxX, enemyPosition.x)
      );
      enemyPosition.y = Math.max(
        bounds.minY,
        Math.min(bounds.maxY, enemyPosition.y)
      );

      meshRef.current.rotation.x += 0.06;
      meshRef.current.rotation.y += 0.06;

      // Check if enemy is hit by a bullet
      Object.values(bullets).forEach((bullet) => {
        if (bullet.position) {
          const closeToBullet = new Vector3().subVectors(
            enemyPosition,
            bullet.position
          );
          if (closeToBullet.length() < 0.25) {
            // Enemy is hit by a bullet
            enemyPosition.x = bounds.maxX;
            enemyPosition.y = bounds.maxY;
            setSpeed(0);
            removeEnemy({ id });
            removeBullet({ id: bullet.id });
          }
        }
      });
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Enemy;
