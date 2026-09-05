import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Moon as MoonSpec, Project } from "../../data/bodies";
import { TEX } from "../../data/bodies";
import { useTex } from "../../lib/textures";
import { makeAtmosphereMaterial } from "../../lib/materials";
import { bodyRegistry, useOrbit } from "../../store";

interface Props {
  project: Project;
  index: number;
}

/* ---------- helpers ---------- */

function useRingGeometry(inner: number, outer: number) {
  return useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 160, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = v.length();
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    uv.needsUpdate = true;
    return geo;
  }, [inner, outer]);
}

/** Standard material whose emissive (city lights) only shows on the night side. */
function useNightMaterial(map: THREE.Texture | null, night: THREE.Texture | null, fallback: string) {
  return useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: map ?? undefined,
      color: map ? "#ffffff" : fallback,
      roughness: 0.9,
      metalness: 0.02,
      emissive: night ? new THREE.Color("#ffd9a0") : new THREE.Color("#000000"),
      emissiveMap: night ?? undefined,
      emissiveIntensity: night ? 1.4 : 0,
    });
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vSunDot;")
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           vec4 wpEmit = modelMatrix * vec4(transformed, 1.0);
           vec3 wnEmit = normalize(mat3(modelMatrix) * objectNormal);
           vSunDot = dot(wnEmit, normalize(-wpEmit.xyz));`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vSunDot;")
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
           totalEmissiveRadiance *= 1.0 - smoothstep(-0.25, 0.1, vSunDot);`,
        );
    };
    return m;
  }, [map, night, fallback]);
}

function Moon({ spec, moonTex }: { spec: MoonSpec; moonTex: THREE.Texture | null }) {
  const pivot = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    pivot.current.rotation.y += spec.speed * dt;
    mesh.current.rotation.y += dt * 0.2;
  });
  return (
    <group rotation={[spec.tilt ?? 0, spec.phase ?? 0, 0]}>
      <group ref={pivot} rotation-y={spec.phase ?? 0}>
        <mesh ref={mesh} position={[spec.distance, 0, 0]} castShadow>
          <sphereGeometry args={[spec.radius, 32, 32]} />
          <meshStandardMaterial
            key={moonTex ? "t" : "p"}
            map={moonTex ?? undefined}
            color={moonTex ? "#ffffff" : spec.color ?? "#bbbbbb"}
            roughness={1}
          />
        </mesh>
      </group>
    </group>
  );
}

function Satellite({ planetRadius }: { planetRadius: number }) {
  const pivot = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const s = planetRadius * 0.11;
  useFrame((_, dt) => {
    pivot.current.rotation.y -= dt * 0.45;
    body.current.rotation.y += dt * 0.6;
  });
  return (
    <group rotation={[0.9, 0.3, 0.2]}>
      <group ref={pivot}>
        <group ref={body} position={[planetRadius * 1.75, 0, 0]} scale={s}>
          {/* bus */}
          <mesh>
            <boxGeometry args={[0.9, 0.9, 1.4]} />
            <meshStandardMaterial color="#d8c27a" metalness={0.8} roughness={0.35} />
          </mesh>
          {/* solar panels */}
          <mesh position={[2.1, 0, 0]}>
            <boxGeometry args={[3.2, 0.05, 1.1]} />
            <meshStandardMaterial color="#1a2f6b" metalness={0.6} roughness={0.25} emissive="#0b1a44" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[-2.1, 0, 0]}>
            <boxGeometry args={[3.2, 0.05, 1.1]} />
            <meshStandardMaterial color="#1a2f6b" metalness={0.6} roughness={0.25} emissive="#0b1a44" emissiveIntensity={0.4} />
          </mesh>
          {/* dish */}
          <mesh position={[0, 0.8, 0.2]} rotation={[-0.6, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.2, 0.3, 24, 1, true]} />
            <meshStandardMaterial color="#eeeeee" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color="#ff4040" intensity={0.6} decay={2} distance={3} position={[0, -0.6, 0]} />
        </group>
      </group>
    </group>
  );
}

/* ---------- planet ---------- */

export default function Planet({ project, index }: Props) {
  const spec = project.planet;
  const anchor = useRef<THREE.Group>(null!); // follows the orbit
  const spinner = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const map = useTex(spec.texture);
  const night = useTex(spec.night);
  const clouds = useTex(spec.clouds, true);
  const ringTex = useTex(spec.rings?.texture);
  const moonTex = useTex(spec.moons?.length ? TEX.moon : undefined);

  const phase = useOrbit((s) => s.phase);
  const go = useOrbit((s) => s.go);
  const setPhase = useOrbit((s) => s.setPhase);

  const surfaceMat = useNightMaterial(map, night, spec.fallbackColor);
  const atmoMat = useMemo(
    () => (spec.atmosphere ? makeAtmosphereMaterial(spec.atmosphere.color, spec.atmosphere.intensity) : null),
    [spec.atmosphere],
  );
  const ringGeo = useRingGeometry(
    (spec.rings?.inner ?? 1) * spec.radius,
    (spec.rings?.outer ?? 2) * spec.radius,
  );

  useEffect(() => {
    bodyRegistry.set(index, anchor.current);
    return () => {
      bodyRegistry.delete(index);
    };
  }, [index]);

  useFrame((state, dt) => {
    const a = spec.angle0 + state.clock.elapsedTime * spec.speed;
    anchor.current.position.set(Math.cos(a) * spec.orbit, 0, Math.sin(a) * spec.orbit);
    spinner.current.rotation.y += spec.spin * dt;
    if (cloudRef.current) cloudRef.current.rotation.y += spec.spin * 1.25 * dt;
  });

  const segments = spec.radius > 3 ? 96 : 64;

  return (
    <>
      {/* orbit path */}
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[spec.orbit - 0.06, spec.orbit + 0.06, 256]} />
        <meshBasicMaterial color="#8fb3ff" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <group ref={anchor}>
        {/* tilted frame */}
        <group rotation-z={spec.tilt}>
          <mesh ref={spinner} material={surfaceMat} castShadow receiveShadow>
            <sphereGeometry args={[spec.radius, segments, segments]} />
          </mesh>

          {clouds && (
            <mesh ref={cloudRef} scale={1.012}>
              <sphereGeometry args={[spec.radius, segments, segments]} />
              <meshStandardMaterial
                alphaMap={clouds}
                color="#ffffff"
                transparent
                opacity={0.9}
                depthWrite={false}
                roughness={1}
              />
            </mesh>
          )}

          {atmoMat && spec.atmosphere && (
            <mesh material={atmoMat} scale={spec.atmosphere.scale}>
              <sphereGeometry args={[spec.radius, 64, 64]} />
            </mesh>
          )}

          {spec.rings && (
            <mesh ref={ringRef} geometry={ringGeo} rotation-x={-Math.PI / 2} receiveShadow>
              <meshStandardMaterial
                key={ringTex ? "t" : "p"}
                map={ringTex ?? undefined}
                color={ringTex ? "#ffffff" : "#c9b48a"}
                transparent
                opacity={ringTex ? 1 : 0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
                roughness={0.85}
              />
            </mesh>
          )}
        </group>

        {spec.moons?.map((m, i) => (
          <Moon key={i} spec={m} moonTex={moonTex} />
        ))}

        {spec.satellite && <Satellite planetRadius={spec.radius} />}

        {/* floating label, only in the overview/intro phase */}
        <Html
          center
          position={[0, spec.radius * (spec.rings ? 2.4 : 1.6) + 1.5, 0]}
          zIndexRange={[5, 0]}
          style={{
            opacity: phase === "intro" ? 1 : 0,
            transition: "opacity .6s ease",
            pointerEvents: phase === "intro" ? "auto" : "none",
          }}
        >
          <button
            onClick={() => {
              go(index);
              setPhase("orbit");
            }}
            className="group flex flex-col items-center gap-1 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition"
          >
            <span className="h-6 w-px bg-gradient-to-b from-transparent to-white/50" />
            <span style={{ color: project.accent }}>{project.name}</span>
          </button>
        </Html>
      </group>
    </>
  );
}
