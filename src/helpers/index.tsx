import { Vector3 } from "three";

const spawnFarFromPlayer = (
  playerVector: Vector3,
  bounds: { minX: number; maxX: number; minY: number; maxY: number; z: number }
) => {
  const randomX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
  const randomY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;

  const enemyVector = new Vector3(randomX, randomY, bounds.z);

  const closeToBullet = new Vector3().subVectors(enemyVector, playerVector);

  if (closeToBullet.length() < 0.25) {
    return spawnFarFromPlayer(playerVector, bounds);
  }
  return new Vector3(randomX, randomY, bounds.z);
};

export { spawnFarFromPlayer };
