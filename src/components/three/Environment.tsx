import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { TEX } from "../../data/bodies";
import { useTex } from "../../lib/textures";
import { makeGlowTexture } from "../../lib/materials";

/** Sphere-ish UVs (matches vertex normal direction) so a real surface texture
 *  wraps sensibly around a jagged rock instead of showing raw icosahedron UVs. */
function applySphericalUVs(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    uv[i * 2] = 0.5 + Math.atan2(v.z, v.x) / (Math.PI * 2);
    uv[i * 2 + 1] = 0.5 - Math.asin(v.y) / Math.PI;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

/* ---------- Milky Way backdrop (real 8k panorama, downsampled to 4k) ---------- */
export function MilkyWay() {
  const tex = useTex(TEX.milkyWay);
  const { scene } = useThree();
  useEffect(() => {
    if (!tex) {
      scene.background = new THREE.Color("#02030a");
      return;
    }
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.background = tex;
    scene.backgroundIntensity = 0.55;
    // tilt the galaxy band so it cuts diagonally across the sky
    scene.backgroundRotation = new THREE.Euler(0.6, 1.2, 0.25);
  }, [tex, scene]);
  return <Stars radius={260} depth={80} count={5000} factor={3.5} saturation={0.2} fade speed={0.4} />;
}

/* ---------- Asteroid belt ---------- */
export function AsteroidBelt({ inner = 57, outer = 63, count = 1400 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);

  // Real Solar System Scope surface map (NASA-data-derived, CC-BY-4.0) — gives the
  // belt actual rock/crater detail instead of flat procedural vertex colors.
  const rockTex = useTex(TEX.ceres);

  const geometry = useMemo(() => {
    // jagged rock: displaced icosahedron
    const g = new THREE.IcosahedronGeometry(1, 2);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      v.multiplyScalar(0.72 + Math.random() * 0.56);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    applySphericalUVs(g);
    return g;
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const r = inner + Math.pow(Math.random(), 0.7) * (outer - inner);
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.8;
      dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.06 + Math.pow(Math.random(), 3) * 0.55;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, inner, outer]);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.004;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
        <meshStandardMaterial
          key={rockTex ? "t" : "p"}
          map={rockTex ?? undefined}
          color={rockTex ? "#ffffff" : "#8a7d6e"}
          roughness={1}
          metalness={0.05}
        />
      </instancedMesh>
    </group>
  );
}

/* ---------- Comets ---------- */
interface CometProps {
  a: number; // semi-major
  b: number; // semi-minor
  tilt: [number, number, number];
  speed: number;
  phase: number;
  color: string;
}

function Comet({ a, b, tilt, speed, phase, color }: CometProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const glow = useMemo(() => makeGlowTexture("rgba(220,240,255,1)", "rgba(150,200,255,0.3)"), []);
  useFrame((state) => {
    // ellipse with sun at one focus; speed up near perihelion (Kepler-ish)
    const t = state.clock.elapsedTime * speed + phase;
    const M = t % (Math.PI * 2);
    const e = Math.sqrt(1 - (b * b) / (a * a));
    let E = M;
    for (let i = 0; i < 5; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    const x = a * (Math.cos(E) - e);
    const z = b * Math.sin(E);
    ref.current.position.set(x, 0, z);
  });
  return (
    <group rotation={tilt}>
      <Trail width={2.6} length={14} color={new THREE.Color(color)} attenuation={(w) => w * w} decay={1.2}>
        <mesh ref={ref}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
          <sprite scale={[5, 5, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
          </sprite>
        </mesh>
      </Trail>
    </group>
  );
}

export function Comets() {
  return (
    <>
      <Comet a={120} b={40} tilt={[0.35, 0.4, 0.1]} speed={0.16} phase={0.6} color="#9fd6ff" />
      <Comet a={150} b={55} tilt={[-0.5, 2.1, 0.25]} speed={0.11} phase={2.8} color="#c8f2ff" />
      <Comet a={95} b={30} tilt={[0.2, -1.2, -0.4]} speed={0.22} phase={4.5} color="#bfe6ff" />
    </>
  );
}
