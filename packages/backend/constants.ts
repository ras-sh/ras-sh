export const ORG = "ras-sh";
export const GITHUB_PREFIX = `${ORG}/`;
export const NPM_PREFIX = `@${ORG}/`;

export const LIBRARIES = [
  {
    id: "raid",
    description:
      "Real-time multiplayer raiding. Battle endless waves of monsters, collect loot, and progress with players worldwide.",
    comingSoon: true,
    url: "https://raid.ras.sh",
  },
  {
    id: "remove-bg",
    description:
      "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
    url: "https://remove-bg.ras.sh",
  },
  {
    id: "stack",
    description:
      "Modular TypeScript scaffolding. Build incrementally, update seamlessly, and never start from scratch again.",
    hasNpmPackage: true,
    url: "https://github.com/ras-sh/stack",
  },
  {
    id: "convex-cli",
    description:
      "Turn your Convex backend into a type-safe CLI with automatic function discovery and input validation.",
    hasNpmPackage: true,
    url: "https://github.com/ras-sh/convex-cli",
  },
];

export type Library = (typeof LIBRARIES)[number];
