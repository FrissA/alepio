import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";

import { useGameStore } from "../zustland/store";

interface BulletProps {
  id: string;
}

const Bullet: React.FC<BulletProps> = ({ id }) => {
  const [wasShot, setWasShot] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();
  const speed = 0.04; // Bullet speed
  const updateBullet = useGameStore((state) => state.updateBullet);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const bounds = useGameStore((state) => state.bounds);

  const bulletRef = useRef<{ original: Vector3; direction: Vector3 }>({
    original: new Vector3(),
    direction: new Vector3(),
  }); // Target point (cursor position)

  useEffect(() => {
    // Set the target position for the bullet (where the cursor was when shot)
    if (meshRef.current && !wasShot) {
      // console.log("playerPosition", playerPosition);
      const position = new Vector3(
        playerPosition[0],
        playerPosition[1],
        playerPosition[2]
      );
      meshRef.current.position.set(position.x, position.y, bounds.z);
      bulletRef.current.original = position;
      // console.log("position", position);
      const target = new Vector3(
        pointer.x * bounds.maxX,
        pointer.y * bounds.maxY,
        bounds.z
      );
      bulletRef.current.direction = target;
      // console.log("target", target);
      setWasShot(true);
      updateBullet({
        id,
        position: bulletRef.current.original,
        target: bulletRef.current.direction,
        outOfBounds: false,
      });
    }
  }, [wasShot, playerPosition, pointer, updateBullet, id, bounds]);

  // Update bullet position every frame
  useFrame(() => {
    if (meshRef.current) {
      // Move the bullet towards the target

      const direction = new Vector3()
        .subVectors(bulletRef.current.original, bulletRef.current.direction)
        .normalize();
      // const direction = new Vector3()
      //   .subVectors(bulletRef.current.original, bulletRef.current.direction)
      //   .normalize();

      // console.log("meshRef.current.position", meshRef.current.position);
      // console.log("direction", direction);

      meshRef.current.position.add(direction.multiplyScalar(-speed));
      // Optionally, remove the bullet if it goes out of bounds
      let outOfBounds = false;
      if (
        Math.abs(meshRef.current.position.x) > 10 ||
        Math.abs(meshRef.current.position.y) > 10
      ) {
        // Bullet can be removed or reset here
        // meshRef.current.position.set(0, 0, 0); // Example reset
        outOfBounds = true;
      }
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
