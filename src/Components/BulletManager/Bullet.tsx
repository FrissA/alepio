import React, { useRef, useEffect, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { useGameStore } from "@zustand/store";

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

  const bulletRef = useRef<{ original: Vector3; direction: Vector3 }>({
    original: new Vector3(),
    direction: new Vector3(),
  });

  useEffect(() => {
    // Set the target position for the bullet (where the cursor was when shot)
    if (meshRef.current && !wasShot) {
      const position = new Vector3(
        playerRawPosition[0],
        playerRawPosition[1],
        playerRawPosition[2]
      );
      meshRef.current.position.set(position.x, position.y, bounds.z);
     
      bulletRef.current.original = position;

      const target = new Vector3(
        pointer.x * bounds.maxX,
        pointer.y * bounds.maxY,
        bounds.z
      );
      bulletRef.current.direction = target;

      setWasShot(true);
    }
  }, [wasShot, playerRawPosition, pointer, updateBullet, id, bounds]);

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
