export const ORG = "ras-sh";
export const GITHUB_PREFIX = `${ORG}/`;
export const NPM_PREFIX = `@${ORG}/`;

export const TOOLS = [
  {
    id: "remove-bg",
    description:
      "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
  },
  {
    id: "convert",
    description:
      "Convert images between formats (JPEG, PNG, WebP, AVIF, GIF, TIFF) with quality control. Fast, secure, and private.",
  },
  {
    id: "convex-cli",
    description:
      "Turn your Convex backend into a type-safe CLI with automatic function discovery and input validation.",
    hasNpmPackage: true,
  },
];

export type Tool = (typeof TOOLS)[number];
