export const ORG = "ras-sh";
export const GITHUB_PREFIX = `${ORG}/`;
export const NPM_PREFIX = `@${ORG}/`;

export const LIBRARIES = [
  {
    id: "remove-bg",
    description:
      "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
  },
  {
    id: "convex-cli",
    description:
      "Turn your Convex backend into a type-safe CLI with automatic function discovery and input validation.",
    hasNpmPackage: true,
  },
];

export type Library = (typeof LIBRARIES)[number];
