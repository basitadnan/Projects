import { useEffect } from "react";
import Scene from "./components/three/Scene";
import Intro from "./components/ui/Intro";
import HUD from "./components/ui/HUD";
import { PROJECTS } from "./data/bodies";
import { preloadAll } from "./lib/textures";
import { useOrbit } from "./store";

export default function App() {
  const setTotal = useOrbit((s) => s.setTotal);

  useEffect(() => {
    setTotal(PROJECTS.length);
    preloadAll();
  }, [setTotal]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#02030a] text-white">
      <Scene />
      {/* subtle vignette + film grain feel */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      <Intro />
      <HUD />
    </div>
  );
}
