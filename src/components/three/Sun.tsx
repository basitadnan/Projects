import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUN, TEX } from "../../data/bodies";
import { useTex } from "../../lib/textures";
import { makeAtmosphereMaterial, makeGlowTexture, makeSunMaterial } from "../../lib/materials";
import { bodyRegistry } from "../../store";

export default function Sun() {
  const group = useRef<THREE.Group>(null!);
  const surface = useRef<THREE.Mesh>(null!);
  const map = useTex(TEX.sun);

  const material = useMemo(() => makeSunMaterial(map), [map]);
  const corona = useMemo(() => makeAtmosphereMaterial("#ff9a3c", 1.6, 1.6), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);

  useEffect(() => {
    bodyRegistry.set(0, group.current);
    return () => {
      bodyRegistry.delete(0);
    };
  }, []);

  useFrame((state, dt) => {
    surface.current.rotation.y += SUN.spin * dt;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={group}>
      <mesh ref={surface} material={material}>
        <sphereGeometry args={[SUN.radius, 96, 96]} />
      </mesh>
      {/* corona */}
      <mesh material={corona} scale={1.28}>
        <sphereGeometry args={[SUN.radius, 64, 64]} />
      </mesh>
      {/* volumetric-looking glow */}
      <sprite scale={[SUN.radius * 7.5, SUN.radius * 7.5, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
          toneMapped={false}
        />
      </sprite>
      <pointLight intensity={2.6} decay={0} color="#fff3e0" />
    </group>
  );
}
