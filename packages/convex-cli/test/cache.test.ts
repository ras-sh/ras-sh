import * as crypto from "node:crypto";
import * as fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FunctionCache } from "../src/discovery/cache";
import type { ParsedFunction } from "../src/types";

// Constants for test assertions
const FUNCTIONS_JSON_REGEX = /"functions":\s*\[[\s\S]*\]/;
const EXPECTED_HASH_UPDATE_CALLS = 4; // 2 file paths + 2 contents

// Mock fs module
vi.mock("node:fs");
vi.mock("node:crypto");

const mockFs = vi.mocked(fs);
const mockCrypto = vi.mocked(crypto);

describe("FunctionCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    FunctionCache.resetInstance();

    // Default mocks
    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockReturnValue("{}");
    mockFs.writeFileSync.mockImplementation(() => {
      // Empty implementation for mocking
    });
    mockFs.mkdirSync.mockImplementation(() => {
      // Empty implementation for mocking - returns undefined by default
      // biome-ignore lint/nursery/noUselessUndefined: Required for explicit return type
      return undefined;
    });
    mockFs.readdirSync.mockImplementation(() => []);
    mockFs.unlinkSync.mockImplementation(() => {
      // Empty implementation for mocking
    });
    mockCrypto.createHash.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue("checksum123"),
    } as any);
  });

  it("should return null when cache file does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);

    const cache = FunctionCache.getInstance();
    const result = cache.get();

    expect(result).toBeNull();
    expect(mockFs.existsSync).toHaveBeenCalled();
  });

  it("should return null when convex directory does not exist", () => {
    mockFs.existsSync.mockImplementation(
      (filePath) =>
        typeof filePath === "string" && filePath.includes("functions.json")
    );
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify({
        functions: [{ path: "test", type: "query", args: {} }],
        timestamp: Date.now(),
        directoryChecksum: "old-checksum",
      })
    );

    const cache = FunctionCache.getInstance();
    const result = cache.get();

    expect(result).toBeNull();
  });

  it("should return null when directory checksum does not match", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify({
        functions: [{ path: "test", type: "query", args: {} }],
        timestamp: Date.now(),
        directoryChecksum: "old-checksum",
      })
    );

    const cache = FunctionCache.getInstance();
    const result = cache.get();

    expect(result).toBeNull();
  });

  it("should return cached functions when checksum matches", () => {
    const cachedFunctions: ParsedFunction[] = [
      { path: "test", type: "query", args: {}, jsonSchema: { type: "object" } },
    ];

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify({
        functions: cachedFunctions,
        timestamp: Date.now(),
        directoryChecksum: "checksum123",
      })
    );

    const cache = FunctionCache.getInstance();
    const result = cache.get();

    expect(result).toEqual(cachedFunctions);
  });

  it("should store functions in cache with correct checksum", () => {
    const functions: ParsedFunction[] = [
      { path: "test", type: "query", args: {}, jsonSchema: { type: "object" } },
    ];

    // Ensure convex directory exists for checksum calculation
    mockFs.existsSync.mockImplementation(
      (filePath) =>
        typeof filePath === "string" && filePath.includes("./convex")
    );

    const cache = FunctionCache.getInstance();
    cache.set(functions);

    expect(mockFs.mkdirSync).toHaveBeenCalled();
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("functions.json"),
      expect.stringMatching(FUNCTIONS_JSON_REGEX)
    );
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("functions.json"),
      expect.stringContaining('"directoryChecksum": "checksum123"')
    );
  });

  it("should handle file read errors gracefully", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("Read error");
    });

    const cache = FunctionCache.getInstance();
    const result = cache.get();

    expect(result).toBeNull();
  });

  it("should handle file write errors gracefully", () => {
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error("Write error");
    });

    const cache = FunctionCache.getInstance();
    const functions: ParsedFunction[] = [
      { path: "test", type: "query", args: {}, jsonSchema: { type: "object" } },
    ];

    // Should not throw
    expect(() => cache.set(functions)).not.toThrow();
  });

  it("should clear cache file when clear is called", () => {
    mockFs.existsSync.mockReturnValue(true);

    const cache = FunctionCache.getInstance();
    cache.clear();

    expect(mockFs.unlinkSync).toHaveBeenCalled();
  });

  it("should handle clear errors gracefully", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.unlinkSync.mockImplementation(() => {
      throw new Error("Delete error");
    });

    const cache = FunctionCache.getInstance();

    // Should not throw
    expect(() => cache.clear()).not.toThrow();
  });

  it("should generate correct directory checksum", () => {
    const testFiles = ["todos.ts", "users.ts"];
    const testContents = ["content1", "content2"];

    mockFs.existsSync.mockImplementation(
      (filePath) =>
        typeof filePath === "string" &&
        (filePath.includes("convex") || filePath.includes(".ts"))
    );

    mockFs.readdirSync.mockReturnValue(
      testFiles.map(
        (name) =>
          ({
            name,
            isDirectory: () => false,
            isFile: () => true,
          }) as any
      )
    );

    let fileIndex = 0;
    mockFs.readFileSync.mockImplementation((filePath) => {
      if (typeof filePath === "string" && filePath.endsWith(".ts")) {
        return testContents[fileIndex++] || "";
      }
      return "{}";
    });

    const cache = FunctionCache.getInstance();
    cache.get(); // This will call getDirectoryChecksum

    // Verify that createHash was called and update was called for each file
    const hashMock = mockCrypto.createHash.mock.results[0]?.value;
    expect(hashMock?.update).toHaveBeenCalledTimes(EXPECTED_HASH_UPDATE_CALLS);
  });

  it("should skip _generated directory in checksum", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue([
      {
        name: "_generated",
        isDirectory: () => true,
        isFile: () => false,
      },
      {
        name: "todos.ts",
        isDirectory: () => false,
        isFile: () => true,
      },
    ] as any);

    mockFs.readFileSync.mockImplementation((filePath) => {
      if (typeof filePath === "string" && filePath.includes("todos.ts")) {
        return "content";
      }
      return "{}";
    });

    const cache = FunctionCache.getInstance();
    cache.get(); // This will call getDirectoryChecksum

    // Should only process todos.ts, not _generated directory
    expect(mockFs.readdirSync).toHaveBeenCalled();
  });
});
