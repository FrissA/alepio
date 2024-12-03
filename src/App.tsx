import React from "react";
import { Canvas } from "@react-three/fiber";

import Enemy from "./Components/Enemy";
import Player from "./Components/Player";

const App: React.FC = () => {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      {/* Add the Enemy */}
      <Player />
      <Enemy />
    </Canvas>
  );
};

export default App;

// <mesh>
// <boxGeometry args={[1, 1, 1]} />
// <meshStandardMaterial color="orange" />
// </mesh>
