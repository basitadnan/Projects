import * as THREE from "three";

/** Soft rim glow rendered on a slightly larger BackSide sphere. */
export function makeAtmosphereMaterial(color: string, intensity = 1, power = 2.2) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uPower;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float d = -dot(normalize(vNormal), normalize(vViewDir)); // 0 at outer edge, ~0.5 at limb
        float glow = pow(clamp(d * 2.2, 0.0, 1.0), uPower) * uIntensity;
        gl_FragColor = vec4(uColor * glow, glow);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** Radial gradient sprite for star / sun glow. */
export function makeGlowTexture(inner = "rgba(255,225,170,1)", mid = "rgba(255,150,60,0.35)") {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, inner);
  g.addColorStop(0.4, mid);
  g.addColorStop(1, "rgba(255,120,40,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Animated sun surface: texture + slow turbulence brightening. */
export function makeSunMaterial(map: THREE.Texture | null) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uHasMap: { value: map ? 1 : 0 },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uHasMap;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        // Gentle drift over the real texture — kept subtle so the actual
        // photographic surface reads clearly instead of looking painted.
        vec2 uv1 = vUv + vec2(uTime * 0.003, 0.0);
        vec2 uv2 = vUv * 1.15 + vec2(-uTime * 0.0035, uTime * 0.001);
        vec3 a = uHasMap > 0.5 ? texture2D(uMap, uv1).rgb : vec3(1.0, 0.55, 0.15);
        vec3 b = uHasMap > 0.5 ? texture2D(uMap, uv2).rgb : vec3(1.0, 0.6, 0.2);
        vec3 col = mix(a, b, 0.12) * 1.08;
        float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
        col += vec3(1.0, 0.45, 0.1) * pow(rim, 4.0) * 0.45;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    toneMapped: false,
  });
}
