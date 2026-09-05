import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS } from "../../data/bodies";
import Sun from "./Sun";
import Planet from "./Planet";
import CameraRig from "./CameraRig";
import { AsteroidBelt, Comets, MilkyWay } from "./Environment";

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 60, 190], fov: 45, near: 0.1, far: 2000 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <color attach="background" args={["#02030a"]} />
      <ambientLight intensity={0.06} />
      <hemisphereLight intensity={0.04} color="#8fb3ff" groundColor="#000000" />

      <MilkyWay />
      <Sun />
      {PROJECTS.map((p, i) => (
        <Planet key={p.id} project={p} index={i + 1} />
      ))}
      <AsteroidBelt />
      <Comets />
      <CameraRig />
    </Canvas>
  );
}
