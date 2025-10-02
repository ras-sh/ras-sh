import * as fs from "node:fs";
import * as path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConvexAstParser } from "../src/discovery/ast-parser";
import type { FunctionDefinition } from "../src/types";

// Mock fs module
vi.mock("node:fs");

const mockFs = vi.mocked(fs);

describe("ConvexAstParser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ConvexAstParser.resetInstance();
  });

  it("should return empty array when api.d.ts does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    const parser = ConvexAstParser.getInstance();
    const result = parser.discoverConvexFunctions();

    expect(result).toEqual([]);
    expect(mockFs.existsSync).toHaveBeenCalledWith(
      path.join("./convex", "_generated", "api.d.ts")
    );
  });

  it("should discover functions from module files", () => {
    const apiContent = `
import type * as todos from "../todos.js";
import type * as users from "../users.js";
    `;

    const todosContent = `
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return [];
  }
});

export const create = mutation({
  args: {
    text: v.string(),
    completed: v.boolean()
  },
  handler: async (ctx, args) => {
    return {};
  }
});

export const toggle = mutation({
  args: {
    id: v.id("todos"),
    completed: v.boolean()
  },
  handler: async (ctx, args) => {
    return {};
  }
});
    `;

    const usersContent = `
export const getUser = query({
  args: {
    id: v.id("users"),
    includeProfile: v.boolean()
  },
  handler: async (ctx, args) => {
    return {};
  }
});
    `;

    mockFs.existsSync.mockImplementation((filePath) => {
      if (typeof filePath === "string") {
        return (
          filePath.includes("api.d.ts") ||
          filePath.includes("todos.ts") ||
          filePath.includes("users.ts")
        );
      }
      return false;
    });

    mockFs.readFileSync.mockImplementation((filePath, _encoding) => {
      if (typeof filePath === "string") {
        if (filePath.includes("api.d.ts")) {
          return apiContent;
        }
        if (filePath.includes("todos.ts")) {
          return todosContent;
        }
        if (filePath.includes("users.ts")) {
          return usersContent;
        }
      }
      return "";
    });

    const parser = ConvexAstParser.getInstance();
    const result = parser.discoverConvexFunctions();

    const expectedFunctionsCount = 4;
    expect(result).toHaveLength(expectedFunctionsCount);

    const todosGetAll = result.find(
      (fn: FunctionDefinition) => fn.name === "getAll" && fn.module === "todos"
    );
    expect(todosGetAll).toBeDefined();
    expect(todosGetAll?.type).toBe("query");
    expect(todosGetAll?.args).toEqual({});

    const todosCreate = result.find(
      (fn: FunctionDefinition) => fn.name === "create" && fn.module === "todos"
    );
    expect(todosCreate).toBeDefined();
    expect(todosCreate?.type).toBe("mutation");
    expect(todosCreate?.args).toEqual({
      text: { type: "string", required: true },
      completed: { type: "boolean", required: true },
    });

    const todosToggle = result.find(
      (fn: FunctionDefinition) => fn.name === "toggle" && fn.module === "todos"
    );
    expect(todosToggle).toBeDefined();
    expect(todosToggle?.type).toBe("mutation");
    expect(todosToggle?.args).toEqual({
      id: { type: "string", required: true },
      completed: { type: "boolean", required: true },
    });

    const usersGetUser = result.find(
      (fn: FunctionDefinition) => fn.name === "getUser" && fn.module === "users"
    );
    expect(usersGetUser).toBeDefined();
    expect(usersGetUser?.type).toBe("query");
    expect(usersGetUser?.args).toEqual({
      id: { type: "string", required: true },
      includeProfile: { type: "boolean", required: true },
    });
  });

  it("should handle functions with no args", () => {
    const apiContent = 'import type * as health from "../health.js";';
    const healthContent = `
export const ping = query({
  args: {},
  handler: async (ctx) => {
    return "pong";
  }
});
    `;

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation((filePath) => {
      if (typeof filePath === "string") {
        if (filePath.includes("api.d.ts")) {
          return apiContent;
        }
        if (filePath.includes("health.ts")) {
          return healthContent;
        }
      }
      return "";
    });

    const parser = ConvexAstParser.getInstance();
    const result = parser.discoverConvexFunctions();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: "ping",
      type: "query",
      module: "health",
      args: {},
    });
  });

  it("should handle different Convex validator types", () => {
    const apiContent = 'import type * as test from "../test.js";';
    const testContent = `
export const testFunction = mutation({
  args: {
    text: v.string(),
    count: v.number(),
    age: v.int64(),
    price: v.float64(),
    active: v.boolean(),
    userId: v.id("users"),
    tags: v.array(v.string())
  },
  handler: async (ctx, args) => {
    return {};
  }
});
    `;

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation((filePath) => {
      if (typeof filePath === "string") {
        if (filePath.includes("api.d.ts")) {
          return apiContent;
        }
        if (filePath.includes("test.ts")) {
          return testContent;
        }
      }
      return "";
    });

    const parser = ConvexAstParser.getInstance();
    const result = parser.discoverConvexFunctions();

    expect(result).toHaveLength(1);
    expect(result[0].args).toEqual({
      text: { type: "string", required: true },
      count: { type: "number", required: true },
      age: { type: "integer", required: true },
      price: { type: "number", required: true },
      active: { type: "boolean", required: true },
      userId: { type: "string", required: true },
      tags: { type: "array", required: true },
    });
  });
});
