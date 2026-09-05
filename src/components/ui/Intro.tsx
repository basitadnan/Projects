import { useEffect, useState } from "react";
import { ME } from "../../data/bodies";
import { useOrbit } from "../../store";

export default function Intro() {
  const phase = useOrbit((s) => s.phase);
  const setPhase = useOrbit((s) => s.setPhase);
  const go = useOrbit((s) => s.go);
  const loaded = useOrbit((s) => s.loaded);
  const assetsTotal = useOrbit((s) => s.assetsTotal);
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const ready = assetsTotal > 0 && loaded >= assetsTotal;
  const pct = assetsTotal ? Math.round((loaded / assetsTotal) * 100) : 0;

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600); // name
    const t2 = setTimeout(() => setStep(2), 2000); // age
    const t3 = setTimeout(() => setStep(3), 3000); // button
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase !== "intro") return null;

  const enter = () => {
    setLeaving(true);
    setTimeout(() => {
      go(0);
      setPhase("orbit");
    }, 500);
  };

  const letters = ME.name.split("");

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center text-center transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, rgba(2,3,10,0.15) 0%, rgba(2,3,10,0.75) 100%)" }}
    >
      <div className="pointer-events-none select-none px-6">
        <p
          className={`font-mono text-[11px] tracking-[0.5em] uppercase text-white/50 transition-all duration-700 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Incoming transmission
        </p>

        <h1 className="mt-5 font-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white">
          {letters.map((ch, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: step >= 1 ? 1 : 0,
                transform: step >= 1 ? "translateY(0) rotateX(0)" : "translateY(24px) rotateX(60deg)",
                filter: step >= 1 ? "blur(0)" : "blur(8px)",
                transition: `all .8s cubic-bezier(.2,.8,.2,1) ${i * 55}ms`,
                whiteSpace: ch === " " ? "pre" : undefined,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div
          className={`mt-6 flex items-center justify-center gap-4 transition-all duration-700 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300/70" />
          <span className="font-mono text-sm sm:text-base tracking-[0.35em] uppercase text-amber-200">
            Age <span className="text-white text-xl sm:text-2xl font-display font-semibold tracking-normal">{ME.age}</span>
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300/70" />
        </div>
      </div>

      <div
        className={`mt-14 flex flex-col items-center gap-4 transition-all duration-700 ${
          step >= 3 ? "pointer-events-auto opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={enter}
          disabled={!ready}
          className="group relative overflow-hidden rounded-full border border-amber-200/40 bg-white/5 px-9 py-3.5 font-mono text-xs tracking-[0.4em] uppercase text-amber-100 backdrop-blur-md transition hover:border-amber-200/80 hover:bg-amber-200/10 disabled:cursor-wait"
        >
          <span
            className="absolute inset-y-0 left-0 bg-amber-300/15 transition-all duration-300"
            style={{ width: ready ? "0%" : `${pct}%` }}
          />
          <span className="relative flex items-center gap-3">
            {ready ? (
              <>
                Enter Orbit
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </>
            ) : (
              <>Calibrating telescope · {pct}%</>
            )}
          </span>
        </button>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          6 projects · 1 star · or tap a planet's name to jump straight to it
        </p>
      </div>
    </div>
  );
}
