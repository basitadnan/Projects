import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PROJECTS, SUN } from "../../data/bodies";
import { bodyRegistry, useOrbit } from "../../store";

const UP = new THREE.Vector3(0, 1, 0);

export default function CameraRig() {
  const { camera, size } = useThree();
  const smoothedTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 60, 190));
  const desiredTarget = useRef(new THREE.Vector3());
  const P = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const tangent = useRef(new THREE.Vector3());
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const initialised = useRef(false);

  useFrame((state, dt) => {
    const { phase, current, entered } = useOrbit.getState();
    const t = state.clock.elapsedTime;
    const isMobile = size.width < 768;
    const aspect = size.width / Math.max(1, size.height);
    // pull back on narrow / portrait screens so bodies never overflow horizontally
    const aspectFactor = Math.max(1, 1.15 / aspect);

    if (phase === "intro") {
      const r = 195;
      const a = t * 0.025;
      desiredPos.current.set(Math.sin(a) * r, 62 + Math.sin(t * 0.1) * 4, Math.cos(a) * r);
      desiredTarget.current.set(0, -6, 0);
    } else {
      const obj = bodyRegistry.get(current);
      if (obj) obj.getWorldPosition(P.current);
      else P.current.set(0, 0, 0);

      const showPanel = current === 0 || entered;

      if (current === 0) {
        const dist = SUN.radius * 3.4 * aspectFactor;
        dir.current.set(0.55, 0.32, 1).normalize();
        desiredPos.current.copy(P.current).addScaledVector(dir.current, dist);
      } else {
        const spec = PROJECTS[current - 1].planet;
        const base = spec.radius * (spec.viewScale ?? 1);
        const mult = (entered ? 3.1 : 4.6) * aspectFactor;
        const dist = Math.max(base * mult, 7 * aspectFactor);
        dir.current.copy(P.current).normalize(); // sun -> planet
        tangent.current.crossVectors(UP, dir.current).normalize();
        // camera sits to the side & slightly sunward so the lit hemisphere faces us
        desiredPos.current
          .copy(P.current)
          .addScaledVector(tangent.current, dist * 0.82)
          .addScaledVector(dir.current, -dist * 0.42)
          .addScaledVector(UP, dist * 0.3);
      }

      // frame the body off-centre when a panel is open
      fwd.current.copy(P.current).sub(desiredPos.current).normalize();
      right.current.crossVectors(fwd.current, UP).normalize();
      const camDist = desiredPos.current.distanceTo(P.current);
      desiredTarget.current.copy(P.current);
      if (showPanel) {
        if (isMobile) desiredTarget.current.addScaledVector(UP, -camDist * 0.2);
        else desiredTarget.current.addScaledVector(right.current, camDist * 0.24);
      }
    }

    if (!initialised.current) {
      camera.position.copy(desiredPos.current);
      smoothedTarget.current.copy(desiredTarget.current);
      initialised.current = true;
    }

    const k = phase === "intro" ? 1.2 : 2.0;
    const f = 1 - Math.exp(-dt * k);
    camera.position.lerp(desiredPos.current, f);
    smoothedTarget.current.lerp(desiredTarget.current, f);
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
