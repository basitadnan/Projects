// Textures: Solar System Scope (NASA-derived), CC-BY 4.0, hosted on Wikimedia Commons.
const W = "https://upload.wikimedia.org/wikipedia/commons";

export const TEX = {
  milkyWay: `${W}/thumb/8/85/Solarsystemscope_texture_8k_stars_milky_way.jpg/4096px-Solarsystemscope_texture_8k_stars_milky_way.jpg`,
  sun: `${W}/c/cb/Solarsystemscope_texture_2k_sun.jpg`,
  mercury: `${W}/9/92/Solarsystemscope_texture_2k_mercury.jpg`,
  earthDay: `${W}/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg`,
  earthNight: `${W}/2/2f/Solarsystemscope_texture_2k_earth_nightmap.jpg`,
  earthClouds: `${W}/e/ed/Solarsystemscope_texture_2k_earth_clouds.jpg`,
  mars: `${W}/4/46/Solarsystemscope_texture_2k_mars.jpg`,
  jupiter: `${W}/b/be/Solarsystemscope_texture_2k_jupiter.jpg`,
  saturn: `${W}/e/ea/Solarsystemscope_texture_2k_saturn.jpg`,
  saturnRing: `${W}/7/7d/Solarsystemscope_texture_2k_saturn_ring_alpha.png`,
  neptune: `${W}/1/1e/Solarsystemscope_texture_2k_neptune.jpg`,
  moon: `${W}/2/26/Solarsystemscope_texture_2k_moon.jpg`,
  // Real Solar System Scope surface map (NASA-data-derived), same CC-BY-4.0 family as the planets above.
  ceres: `${W}/f/f0/Solarsystemscope_texture_2k_ceres_fictional.jpg`,
};

export const ALL_TEXTURES = Object.values(TEX);

export interface Moon {
  radius: number;
  distance: number;
  speed: number;
  tilt?: number;
  phase?: number;
  color?: string;
}

export interface PlanetSpec {
  texture: string;
  fallbackColor: string;
  radius: number;
  orbit: number;
  speed: number; // rad / s
  angle0: number;
  tilt: number; // axial tilt radians
  spin: number; // rad / s
  rings?: { inner: number; outer: number; texture: string };
  moons?: Moon[];
  atmosphere?: { color: string; scale: number; intensity: number };
  clouds?: string;
  night?: string;
  satellite?: boolean;
  viewScale?: number;
}

export interface Project {
  id: string;
  name: string;
  kind: string; // planet classification label
  tagline: string;
  url?: string;
  urlLabel?: string;
  description: string;
  features: string[];
  stack: string[];
  stats?: string[];
  accent: string;
  planet: PlanetSpec;
}

export const ME = {
  name: "Abdul Basit",
  age: 18,
  role: "Self-taught Full-Stack Developer",
  location: "Islamabad, Pakistan",
  education: "Business Data Analytics · COMSATS University",
  email: "adnanabdulbasit75@gmail.com",
  github: "github.com/basitadnan",
  githubUrl: "https://github.com/basitadnan",
  whatsapp: "+92 333 7613822",
  whatsappUrl: "https://wa.me/923337613822",
  overview:
    "Self-taught full-stack developer based in Islamabad, Pakistan, starting a Business Data Analytics degree at COMSATS University. I build and ship products end-to-end — directing AI coding tools to execute while I handle architecture, review, and product decisions. Focused on local-first, low-cost, practical tools that solve real problems.",
  principles: [
    { title: "Architecture first", body: "I own the system design, data model and trade-offs; AI tools execute under review." },
    { title: "Ship end-to-end", body: "From idea to deployed product with real users, payments and support." },
    { title: "Local-first & low-cost", body: "Practical tools built for Pakistan's realities: Easypaisa, NayaPay, committees, low budgets." },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: "entryhive",
    name: "EntryHive",
    kind: "Gas giant · Jupiter-class",
    tagline: "Entry-test prep platform for Pakistani students.",
    url: "https://entryhive-pak.vercel.app",
    urlLabel: "entryhive-pak.vercel.app",
    description:
      "A full prep ecosystem for university entry tests in Pakistan. Students practice from curated question banks, sit timed mock tests, retain concepts with spaced-repetition flashcards, and estimate admission chances with a merit calculator. A built-in referral and wallet system powers growth and premium subscriptions.",
    features: [
      "Curated question banks by subject & test",
      "Timed mock tests with analytics",
      "Spaced-repetition flashcards",
      "Merit / aggregate calculator",
      "Referral + wallet system",
      "Premium subscription tier",
    ],
    stack: ["Web app", "Vercel", "PayGate payments"],
    stats: ["600+ users", "~70–80 paid premium subscribers", "Largest project"],
    accent: "#e8b87a",
    planet: {
      texture: TEX.jupiter,
      fallbackColor: "#c9a077",
      radius: 5.2,
      orbit: 30,
      speed: 0.012,
      angle0: 0.4,
      tilt: 0.05,
      spin: 0.12,
      moons: [
        { radius: 0.32, distance: 7.4, speed: 0.55, tilt: 0.05, color: "#d9c9a8" },
        { radius: 0.26, distance: 8.6, speed: 0.42, tilt: -0.08, phase: 2.1, color: "#c8b79a" },
        { radius: 0.4, distance: 10.2, speed: 0.31, tilt: 0.12, phase: 4.0, color: "#b7ab98" },
        { radius: 0.36, distance: 12.0, speed: 0.22, tilt: -0.04, phase: 5.3, color: "#a9a29a" },
      ],
    },
  },
  {
    id: "calobit",
    name: "Calobit",
    kind: "Ringed giant · Saturn-class",
    tagline: "AI-powered calorie tracker with a free BYOK mode.",
    url: "https://calobit.vercel.app",
    urlLabel: "calobit.vercel.app",
    description:
      "Log meals in plain language and let AI break them into calories and macros. A paid tier covers hosted AI meal logging, while a free bring-your-own-key version lets anyone use it with their own API key for non-commercial use.",
    features: [
      "AI meal logging from natural language",
      "Calorie & macro tracking",
      "Paid hosted-AI tier",
      "Free BYOK (bring-your-own-key) mode",
      "Daily targets and history",
    ],
    stack: ["Web app", "LLM APIs", "Vercel"],
    stats: ["Paid + free tiers", "Second largest project"],
    accent: "#e6d3a3",
    planet: {
      texture: TEX.saturn,
      fallbackColor: "#d9c49a",
      radius: 4.3,
      orbit: 50,
      speed: 0.009,
      angle0: 1.35,
      tilt: 0.47,
      spin: 0.11,
      rings: { inner: 1.25, outer: 2.3, texture: TEX.saturnRing },
      viewScale: 1.45,
      moons: [
        { radius: 0.3, distance: 11.5, speed: 0.28, tilt: 0.47, color: "#d8d2c6" },
        { radius: 0.2, distance: 13.4, speed: 0.2, tilt: 0.47, phase: 3.2, color: "#c4bdb2" },
      ],
    },
  },
  {
    id: "payvo",
    name: "Payvo",
    kind: "Ice giant · Neptune-class",
    tagline: "Passive expense tracking from Easypaisa & NayaPay notifications.",
    url: "https://payvo-pak.vercel.app",
    urlLabel: "payvo-pak.vercel.app",
    description:
      "An Android app that listens to Easypaisa and NayaPay transaction notifications through NotificationListenerService and turns them into a clean ledger automatically. No manual entry, no bank integrations — just passive, on-device expense tracking.",
    features: [
      "Auto-captures Easypaisa / NayaPay transactions",
      "NotificationListenerService pipeline",
      "Zero manual entry",
      "On-device, privacy-first ledger",
      "Feeds PayGate & the Finance Manager",
    ],
    stack: ["Android", "Kotlin", "Jetpack Compose"],
    stats: ["Native Android", "Core of the payments ecosystem"],
    accent: "#7fb2ff",
    planet: {
      texture: TEX.neptune,
      fallbackColor: "#3f6fd8",
      radius: 3.1,
      orbit: 68,
      speed: 0.007,
      angle0: 2.2,
      tilt: 0.49,
      spin: 0.1,
      atmosphere: { color: "#5f8cff", scale: 1.08, intensity: 0.9 },
      moons: [{ radius: 0.28, distance: 5.6, speed: -0.35, tilt: 0.4, color: "#cfd6e0" }],
    },
  },
  {
    id: "paygate",
    name: "PayGate",
    kind: "Terrestrial · Earth-class",
    tagline: "Payment verification microservice connecting Payvo to my products.",
    urlLabel: "Internal service · no public link",
    description:
      "A standalone payment verification service. Products like EntryHive and Calobit create pending orders; Payvo detects incoming payments on the phone and reports them; PayGate auto-matches amounts and references, marks orders paid, and falls back to a manual review queue when a match is ambiguous.",
    features: [
      "Pending-order API for products",
      "Payment ingestion from Payvo",
      "Automatic order ↔ payment matching",
      "Manual fallback queue",
      "Shared across EntryHive & Calobit",
    ],
    stack: ["Next.js", "Supabase", "REST API"],
    stats: ["Powers premium payments", "Multi-product"],
    accent: "#6fd3a8",
    planet: {
      texture: TEX.earthDay,
      fallbackColor: "#3b7bd6",
      radius: 2.4,
      orbit: 84,
      speed: 0.006,
      angle0: 3.1,
      tilt: 0.41,
      spin: 0.15,
      clouds: TEX.earthClouds,
      night: TEX.earthNight,
      atmosphere: { color: "#6fb4ff", scale: 1.1, intensity: 1.1 },
      satellite: true,
      moons: [{ radius: 0.6, distance: 5.2, speed: 0.25, tilt: 0.1, color: "#bdbdbd" }],
    },
  },
  {
    id: "kairo",
    name: "Kairo",
    kind: "Terrestrial · Mars-class",
    tagline: "University schedule & productivity app with a built-in AI assistant.",
    url: "https://kairo-steel.vercel.app",
    urlLabel: "kairo-steel.vercel.app",
    description:
      "Everything a student's semester needs in one place: timetable, assignments, deadlines and exam dates — with push notifications so nothing slips, and an AI assistant that understands your schedule.",
    features: [
      "Weekly timetable",
      "Assignments & deadline tracking",
      "Exam calendar",
      "Built-in AI assistant",
      "Push notifications",
    ],
    stack: ["Web app", "Push notifications", "Vercel"],
    accent: "#ff9a6b",
    planet: {
      texture: TEX.mars,
      fallbackColor: "#c1440e",
      radius: 1.8,
      orbit: 98,
      speed: 0.005,
      angle0: 4.0,
      tilt: 0.44,
      spin: 0.14,
      atmosphere: { color: "#ffb08a", scale: 1.06, intensity: 0.35 },
      moons: [
        { radius: 0.12, distance: 2.9, speed: 0.8, tilt: 0.02, color: "#8f8a84" },
        { radius: 0.09, distance: 3.8, speed: 0.5, tilt: 0.05, phase: 2.5, color: "#8f8a84" },
      ],
    },
  },
  {
    id: "finance",
    name: "Finance Manager",
    kind: "Rocky · Mercury-class",
    tagline: "Income-cycle-aware local budgeting, synced from Payvo.",
    urlLabel: "Private build · unnamed",
    description:
      "A personal finance Android app built around how money actually flows locally. It syncs transactions from Payvo, models ROSCA / committee-based income cycles, keeps locked savings out of spend calculations, and includes an AI-assisted “Ask” screen that explains your finances using deterministic math — never LLM-guessed numbers.",
    features: [
      "Syncs transaction data from Payvo",
      "ROSCA / committee income-cycle modelling",
      "Locked savings excluded from spend",
      "AI “Ask” screen backed by deterministic math",
      "Fully local budgeting",
    ],
    stack: ["Android", "Kotlin", "Jetpack Compose"],
    accent: "#cfcfcf",
    planet: {
      texture: TEX.mercury,
      fallbackColor: "#8f8a84",
      radius: 1.3,
      orbit: 110,
      speed: 0.004,
      angle0: 4.9,
      tilt: 0.01,
      spin: 0.08,
    },
  },
];

export const SUN = { radius: 9, spin: 0.02 };
