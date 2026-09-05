import { useEffect, useState } from "react";
import * as THREE from "three";
import { ALL_TEXTURES } from "../data/bodies";
import { useOrbit } from "../store";

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

const cache = new Map<string, Promise<THREE.Texture | null>>();

export function loadTex(url: string, linear = false): Promise<THREE.Texture | null> {
  const key = linear ? `lin:${url}` : url;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = new Promise<THREE.Texture | null>((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      () => {
        console.warn("Texture failed to load:", url);
        resolve(null);
      },
    );
  }).finally(() => {
    if (!linear) useOrbit.getState().assetDone();
  });
  cache.set(key, p);
  return p;
}

/** Kick off loading of every texture up-front so the loader bar is meaningful. */
export function preloadAll() {
  useOrbit.getState().setAssetsTotal(ALL_TEXTURES.length);
  ALL_TEXTURES.forEach((u) => loadTex(u));
}

export function useTex(url?: string, linear = false): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    loadTex(url, linear).then((t) => {
      if (alive) setTex(t);
    });
    return () => {
      alive = false;
    };
  }, [url, linear]);
  return tex;
}
