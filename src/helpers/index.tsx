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

const isMobileDevice = () => {
  // Check if the device has touch support and is likely mobile
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  
  return hasTouch && (isMobileUserAgent || isSmallScreen);
};

export { spawnFarFromPlayer, isMobileDevice };
