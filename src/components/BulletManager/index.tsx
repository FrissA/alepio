import { useEffect } from "react";

import { useGameStore } from "@zustand/store";

import Bullet from "./Bullet";

const BulletManager: React.FC = () => {
  const bullets = useGameStore((state) => state.bullets);
  const addBullet = useGameStore((state) => state.addBullet);
  const cleanUpBullets = useGameStore((state) => state.cleanUpBullets);
  const isMobileControls = useGameStore((state) => state.isMobileControls);

  const bulletInterval = isMobileControls ? 1500 : 1000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      // When the bullet is shot, we create it and add it to the state
      addBullet();
    }, bulletInterval);

    return () => clearInterval(intervalId);
  }, [addBullet, bulletInterval]);

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
