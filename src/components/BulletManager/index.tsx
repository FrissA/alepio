import { useEffect } from "react";

import { useGameStore } from "@zustand/store";

import Bullet from "./Bullet";

const BulletManager: React.FC = () => {
  const bullets = useGameStore((state) => state.bullets);
  const addBullet = useGameStore((state) => state.addBullet);
  const cleanUpBullets = useGameStore((state) => state.cleanUpBullets);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // When the bullet is shot, we create it and add it to the state
      addBullet();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addBullet]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //Every some seconds, clean up bullets out of bounds
      cleanUpBullets();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [cleanUpBullets]);

  return (
    <group>
      {Object.values(bullets).map((bullet) => (
        <Bullet key={bullet.id} {...bullet} />
      ))}
    </group>
  );
};

export default BulletManager;
