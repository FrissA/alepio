import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useGameStore } from "../zustland/store";

const Enemy: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const bounds = useGameStore((state) => state.bounds);
  const speed = 0.02;

  useFrame(() => {
    if (meshRef.current) {
      const enemyPosition = meshRef.current.position;

      const direction = new Vector3(
        playerPosition[0] - enemyPosition.x,
        playerPosition[1] - enemyPosition.y,
        playerPosition[2] - enemyPosition.z
      );

      direction.normalize().multiplyScalar(speed);

      enemyPosition.x += direction.x;
      enemyPosition.y += direction.y;

      // Clamp enemy position to bounds
      enemyPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, enemyPosition.x));
      enemyPosition.y = Math.max(bounds.minY, Math.min(bounds.maxY, enemyPosition.y));

      meshRef.current.rotation.x += 0.06;
      meshRef.current.rotation.y += 0.06;
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
