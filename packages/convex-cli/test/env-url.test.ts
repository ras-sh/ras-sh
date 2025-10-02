import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCli } from "../src/index";

vi.mock("../src/cli/commands", () => {
  const fakeProgram = {
    version: () => fakeProgram,
    description: () => fakeProgram,
    configureOutput: () => fakeProgram,
    parseAsync: async () => Promise.resolve(),
  } as const;
  return {
    buildCliProgram: vi.fn(() => fakeProgram),
  };
});

describe("URL selection from env", () => {
  const OLD_ENV = { ...process.env };
  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("uses CONVEX_URL when provided", async () => {
    process.env.CONVEX_URL = "https://example.convex.cloud";
    const cli = createCli({
      api: { mod: { fn: {} } } as any,
      functions: [{ name: "fn", module: "mod", type: "query" }],
    });
    await cli.run({ argv: ["node", "cli", "--help"] });
    expect(process.env.CONVEX_URL).toBe("https://example.convex.cloud");
  });

  it("derives from CONVEX_DEPLOYMENT when URL missing", async () => {
    process.env.CONVEX_URL = undefined;
    process.env.CONVEX_DEPLOYMENT = "happy-otter-123";
    const cli = createCli({
      api: { mod: { fn: {} } } as any,
      functions: [{ name: "fn", module: "mod", type: "query" }],
    });
    await cli.run({ argv: ["node", "cli", "--help"] });
    expect(process.env.CONVEX_DEPLOYMENT).toBe("happy-otter-123");
  });
});
