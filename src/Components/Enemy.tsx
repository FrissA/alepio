import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useGameStore } from "../zustland/store";

const Enemy: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const speed = 0.02; // Constant movement speed

  useFrame(() => {
    if (meshRef.current) {
      const enemyPosition = meshRef.current.position;

      // Calculate direction vector (Player - Enemy)
      const direction = new Vector3(
        playerPosition[0] - enemyPosition.x,
        playerPosition[1] - enemyPosition.y,
        playerPosition[2] - enemyPosition.z
      );

      // Normalize direction vector and scale by speed
      direction.normalize().multiplyScalar(speed);

      // Update the enemy's position
      enemyPosition.x += direction.x;
      enemyPosition.y += direction.y;
      enemyPosition.z += direction.z;

      // Rotate the enemy for visual effect
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
