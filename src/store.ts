import { create } from "zustand";
import * as THREE from "three";

export type Phase = "intro" | "orbit";

interface OrbitState {
  phase: Phase;
  current: number; // 0 = sun, 1..n = projects
  entered: boolean;
  total: number; // index of last body
  loaded: number;
  assetsTotal: number;
  setPhase: (p: Phase) => void;
  go: (i: number) => void;
  next: () => void;
  prev: () => void;
  enter: () => void;
  leave: () => void;
  setTotal: (n: number) => void;
  setAssetsTotal: (n: number) => void;
  assetDone: () => void;
}

export const useOrbit = create<OrbitState>((set, get) => ({
  phase: "intro",
  current: 0,
  entered: false,
  total: 0,
  loaded: 0,
  assetsTotal: 0,
  setPhase: (phase) => set({ phase }),
  go: (i) => {
    const { total } = get();
    const clamped = Math.max(0, Math.min(total, i));
    set({ current: clamped, entered: false });
  },
  next: () => get().go(get().current + 1),
  prev: () => get().go(get().current - 1),
  enter: () => set({ entered: true }),
  leave: () => set({ entered: false }),
  setTotal: (n) => set({ total: n }),
  setAssetsTotal: (n) => set({ assetsTotal: n }),
  assetDone: () => set((s) => ({ loaded: s.loaded + 1 })),
}));

/** Non-reactive registry of 3D objects so the camera rig can follow bodies. */
export const bodyRegistry = new Map<number, THREE.Object3D>();
