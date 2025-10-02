import { describe, expect, it, vi } from "vitest";
import { createCli } from "../src/index";

// Minimal fake caller via mocking ConvexCaller to avoid real network
vi.mock("../src/convex-client", () => {
  class FakeCaller {
    callFunction(path: string, _type: string, args: Record<string, unknown>) {
      return Promise.resolve({ ok: true, path, args });
    }
  }
  return { ConvexCaller: FakeCaller };
});

describe("CLI program generation", () => {
  it("creates commands for modules and functions", async () => {
    const api = {
      todos: { getAll: {}, create: {} },
      healthCheck: { get: {} },
    } as any;
    const cli = createCli({
      api,
      name: "test-cli",
      functions: [
        { name: "getAll", module: "todos", type: "query" },
        {
          name: "create",
          module: "todos",
          type: "mutation",
          args: { text: { type: "string", required: true } },
        },
        { name: "get", module: "healthCheck", type: "query" },
      ],
    });

    const mockExit = vi.fn();
    const mockProcess = { exit: mockExit } as unknown as NodeJS.Process;

    // Test that CLI can be created and --help works (commander handles it internally)
    await cli.run({
      argv: ["node", "cli", "--help"],
      process: mockProcess,
    });

    // Just verify that exit was called (commander handles --help by exiting)
    expect(mockExit).toHaveBeenCalled();
  });

  it("invokes a function with option args only", async () => {
    const api = { todos: { create: {} } } as any;
    const cli = createCli({
      api,
      functions: [
        {
          name: "create",
          module: "todos",
          type: "mutation",
          args: {
            text: { type: "string", required: true },
            completed: { type: "boolean", required: false },
          },
        },
      ],
    });

    const loggedOutputs: unknown[] = [];
    await cli.run({
      argv: [
        "node",
        "cli",
        "todos",
        "create",
        "--text",
        "hello",
        "--completed",
        "true",
      ],
      logger: {
        info: (message) => loggedOutputs.push(message),
      },
      process: { exit: vi.fn() } as unknown as NodeJS.Process,
    });

    // The logged output should contain the result object
    expect(loggedOutputs).toHaveLength(1);
    expect(loggedOutputs[0]).toMatchObject({
      ok: true,
      path: "todos.create",
      args: { text: "hello", completed: true },
    });
  });
});
