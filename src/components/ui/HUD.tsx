import { useEffect } from "react";
import { ME, PROJECTS, type Project } from "../../data/bodies";
import { useOrbit } from "../../store";
import { cn } from "../../utils/cn";

const BODIES = [{ id: "sun", name: "Abdul", accent: "#ffb347" }, ...PROJECTS.map((p) => ({ id: p.id, name: p.name, accent: p.accent }))];

/* ------------------------------ icons ------------------------------ */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 4.3c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5L9.6 8.7c-.2-.4-.3-.6-.6-.6z"/></svg>
);

/* ------------------------------ top bar ------------------------------ */
function TopBar() {
  const current = useOrbit((s) => s.current);
  const go = useOrbit((s) => s.go);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-5 sm:p-7">
      <div className="pointer-events-auto">
        <div className="font-display text-sm font-semibold tracking-tight text-white">
          AB<span className="text-amber-300">.</span>orbit
        </div>
        <div className="mt-0.5 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">Portfolio system</div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-2 backdrop-blur-md">
        {BODIES.map((b, i) => (
          <button
            key={b.id}
            onClick={() => go(i)}
            title={b.name}
            className="group relative flex h-6 items-center justify-center px-1"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                i === 0 ? "h-2.5 w-2.5" : "h-1.5 w-1.5",
                i === current ? "scale-150 shadow-[0_0_10px_currentColor]" : "opacity-50 group-hover:opacity-100",
              )}
              style={{ background: b.accent, color: b.accent }}
            />
            <span className="pointer-events-none absolute top-full mt-1 hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-white/70 group-hover:block">
              {b.name}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}

/* ------------------------------ arrows ------------------------------ */
function NavArrows() {
  const current = useOrbit((s) => s.current);
  const total = useOrbit((s) => s.total);
  const next = useOrbit((s) => s.next);
  const prev = useOrbit((s) => s.prev);
  const entered = useOrbit((s) => s.entered);
  const panelOpen = current === 0 || entered;

  const Btn = ({ dir, disabled, onClick, label }: { dir: "l" | "r"; disabled: boolean; onClick: () => void; label?: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "l" ? "Previous body" : "Next body"}
      className={cn(
        "pointer-events-auto group flex items-center gap-3 rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-300",
        "h-12 w-12 justify-center sm:h-14 sm:w-14 hover:border-white/40 hover:bg-white/10",
        disabled && "pointer-events-none opacity-0 scale-75",
      )}
      title={label}
    >
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5 stroke-white fill-none transition-transform", dir === "l" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5")} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {dir === "l" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-20 flex items-center justify-between px-4 sm:px-8 transition-all duration-500",
        // when a panel is open on desktop, keep arrows in the free (left) area; on mobile lift above the sheet
        panelOpen ? "top-[38%] md:top-1/2 md:pr-[46%] lg:pr-[40%]" : "top-1/2",
        "-translate-y-1/2",
      )}
    >
      <Btn dir="l" disabled={current <= 0} onClick={prev} label={BODIES[current - 1]?.name} />
      <Btn dir="r" disabled={current >= total} onClick={next} label={BODIES[current + 1]?.name} />
    </div>
  );
}

/* ------------------------------ planet label ------------------------------ */
function BodyLabel() {
  const current = useOrbit((s) => s.current);
  const entered = useOrbit((s) => s.entered);
  const enter = useOrbit((s) => s.enter);
  if (current === 0) return null;
  const p = PROJECTS[current - 1];
  const visible = !entered;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center px-6 pb-10 text-center transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      )}
    >
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: p.accent }}>
        {String(current).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")} · {p.kind}
      </p>
      <h2 className="mt-2 font-display text-4xl sm:text-6xl font-semibold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
        {p.name}
      </h2>
      <p className="mt-2 max-w-md text-sm text-white/70">{p.tagline}</p>
      <button
        onClick={enter}
        className={cn(
          "pointer-events-auto mt-6 rounded-full border px-8 py-3 font-mono text-xs tracking-[0.35em] uppercase backdrop-blur-md transition hover:bg-white/10",
          !visible && "pointer-events-none",
        )}
        style={{ borderColor: `${p.accent}80`, color: p.accent }}
      >
        Enter Planet ↓
      </button>
    </div>
  );
}

/* ------------------------------ panels ------------------------------ */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/40">{title}</h4>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function SunPanel() {
  return (
    <>
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-300">Star · Host of the system</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">{ME.name}</h2>
      <p className="mt-1 text-sm text-white/70">
        {ME.role} · {ME.age} · {ME.location}
      </p>
      <p className="mt-1 font-mono text-[11px] text-white/45">{ME.education}</p>

      <div className="mt-6 space-y-6">
        <Section title="Overview">
          <p className="text-[15px] leading-relaxed text-white/80">{ME.overview}</p>
        </Section>

        <Section title="How I work">
          <ul className="space-y-3">
            {ME.principles.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <div>
                  <div className="text-sm font-medium text-white">{p.title}</div>
                  <div className="text-sm text-white/60">{p.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Open a channel">
          <div className="grid gap-2">
            <ContactRow href={ME.githubUrl} icon={<GitHubIcon />} label="GitHub" value={ME.github} />
            <ContactRow href={`mailto:${ME.email}`} icon={<MailIcon />} label="Email" value={ME.email} />
            <ContactRow href={ME.whatsappUrl} icon={<WhatsAppIcon />} label="WhatsApp" value={ME.whatsapp} />
          </div>
        </Section>

        <Section title="Orbiting bodies">
          <div className="flex flex-wrap gap-2">
            {PROJECTS.map((p, i) => (
              <JumpChip key={p.id} index={i + 1} project={p} />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function ContactRow({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-amber-200/50 hover:bg-white/[0.07]"
    >
      <span className="text-amber-200">{icon}</span>
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 w-20">{label}</span>
      <span className="truncate text-sm text-white/85 group-hover:text-white">{value}</span>
      <span className="ml-auto text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70">↗</span>
    </a>
  );
}

function JumpChip({ index, project }: { index: number; project: Project }) {
  const go = useOrbit((s) => s.go);
  return (
    <button
      onClick={() => go(index)}
      className="rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition hover:bg-white/10"
      style={{ borderColor: `${project.accent}66`, color: project.accent }}
    >
      {project.name}
    </button>
  );
}

function ProjectPanel({ p, index }: { p: Project; index: number }) {
  const leave = useOrbit((s) => s.leave);
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: p.accent }}>
            {String(index).padStart(2, "0")} · {p.kind}
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">{p.name}</h2>
          <p className="mt-1.5 text-sm text-white/70">{p.tagline}</p>
        </div>
        <button
          onClick={leave}
          className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 transition hover:border-white/40 hover:text-white"
        >
          Leave ↑
        </button>
      </div>

      {p.stats && (
        <div className="mt-5 flex flex-wrap gap-2">
          {p.stats.map((s) => (
            <span key={s} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/85 ring-1 ring-white/10">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <Section title="Mission brief">
          <p className="text-[15px] leading-relaxed text-white/80">{p.description}</p>
        </Section>

        <Section title="Systems on board">
          <ul className="grid gap-2 sm:grid-cols-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Composition">
          <div className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-md border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/70">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <div className="pt-1">
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs tracking-[0.3em] uppercase text-black transition hover:brightness-110"
              style={{ background: p.accent }}
            >
              Launch {p.urlLabel} ↗
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-5 py-3 font-mono text-[11px] tracking-[0.25em] uppercase text-white/50">
              ⊘ {p.urlLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function DetailPanel() {
  const current = useOrbit((s) => s.current);
  const entered = useOrbit((s) => s.entered);
  const open = current === 0 || entered;
  const project = current > 0 ? PROJECTS[current - 1] : null;

  return (
    <aside
      className={cn(
        "fixed z-20 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
        // mobile: bottom sheet; desktop: right column
        "inset-x-0 bottom-0 max-h-[62vh] md:inset-x-auto md:bottom-auto md:right-6 md:top-24 md:max-h-[calc(100vh-8rem)] md:w-[44vw] lg:w-[38vw] md:max-w-[560px]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0",
      )}
    >
      <div className="h-full max-h-[inherit] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-white/10 bg-[#070912]/75 p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl scroll-thin">
        {project ? <ProjectPanel key={project.id} p={project} index={current} /> : <SunPanel />}
      </div>
    </aside>
  );
}

/* ------------------------------ hint + keyboard ------------------------------ */
function Hint() {
  const current = useOrbit((s) => s.current);
  return (
    <div className="pointer-events-none fixed bottom-4 left-5 z-20 hidden md:block font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
      ← → navigate · {current === 0 ? "enter to visit first planet" : "enter to land · esc to leave"}
    </div>
  );
}

export default function HUD() {
  const phase = useOrbit((s) => s.phase);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useOrbit.getState();
      if (s.phase !== "orbit") return;
      if (e.key === "ArrowRight") s.next();
      else if (e.key === "ArrowLeft") s.prev();
      else if (e.key === "Enter") s.current === 0 ? s.go(1) : s.enter();
      else if (e.key === "Escape") s.leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (phase !== "orbit") return null;
  return (
    <div className="animate-fade-in">
      <TopBar />
      <NavArrows />
      <BodyLabel />
      <DetailPanel />
      <Hint />
    </div>
  );
}
