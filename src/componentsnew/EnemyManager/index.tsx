import React, { useEffect } from "react";

import { useGameStore } from "@zustand/store";

import Enemy from "./Enemy";

const EnemyManager: React.FC = () => {
  const enemies = useGameStore((state) => state.enemies);
  const addEnemy = useGameStore((state) => state.addEnemy);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // When the enemy spawns, we create it and add it to the state
      addEnemy();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [addEnemy]);

  return (
    <group>
      {Object.values(enemies).map((enemy) => (
        <Enemy key={enemy.id} {...enemy} />
      ))}
    </group>
  );
};

export default EnemyManager;
