import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import type { ParsedFunction } from "../types";

type CacheEntry = {
  functions: ParsedFunction[];
  timestamp: number;
  directoryChecksum: string; // checksum of entire convex directory
};

/**
 * Persistent cache for parsed Convex functions to avoid re-parsing on every CLI run
 */
export class FunctionCache {
  private static instance: FunctionCache;
  private readonly cacheDir: string;
  private readonly cachePath: string;

  private constructor() {
    this.cacheDir = path.join(
      process.cwd(),
      "node_modules",
      ".cache",
      "convex-cli"
    );
    this.cachePath = path.join(this.cacheDir, "functions.json");
  }

  static getInstance(): FunctionCache {
    if (!FunctionCache.instance) {
      FunctionCache.instance = new FunctionCache();
    }
    return FunctionCache.instance;
  }

  /**
   * Get cached functions if they're still valid
   */
  get(): ParsedFunction[] | null {
    try {
      if (!fs.existsSync(this.cachePath)) {
        return null;
      }

      const cacheContent = fs.readFileSync(this.cachePath, "utf-8");
      const cache: CacheEntry = JSON.parse(cacheContent);

      // Check if convex directory has changed since cache was created
      const currentChecksum = this.getDirectoryChecksum();
      if (cache.directoryChecksum !== currentChecksum) {
        return null;
      }

      return cache.functions;
    } catch {
      return null;
    }
  }

  /**
   * Store functions in cache with current directory checksum
   */
  set(functions: ParsedFunction[]): void {
    try {
      // Ensure cache directory exists
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      const directoryChecksum = this.getDirectoryChecksum();

      const cache: CacheEntry = {
        functions,
        timestamp: Date.now(),
        directoryChecksum,
      };

      fs.writeFileSync(this.cachePath, JSON.stringify(cache, null, 2));
    } catch {
      // Silently fail - caching is optional
    }
  }

  /**
   * Clear the cache
   */
  clear(): void {
    try {
      if (fs.existsSync(this.cachePath)) {
        fs.unlinkSync(this.cachePath);
      }
    } catch {
      // Silently fail
    }
  }

  /**
   * Reset singleton instance (primarily for testing)
   */
  static resetInstance(): void {
    // biome-ignore lint/suspicious/noExplicitAny: Required for testing singleton reset
    (FunctionCache as any).instance = undefined;
  }

  /**
   * Generate checksum of entire convex directory
   */
  private getDirectoryChecksum(): string {
    try {
      const convexDir = "./convex";
      if (!fs.existsSync(convexDir)) {
        return "";
      }

      const allFiles: string[] = [];
      this.collectTsFiles(convexDir, allFiles);

      // Sort files for consistent ordering
      allFiles.sort();

      // Create combined content hash
      const hash = crypto.createHash("sha256");
      for (const filePath of allFiles) {
        try {
          const content = fs.readFileSync(filePath, "utf-8");
          hash.update(filePath); // Include path in hash
          hash.update(content);
        } catch {
          // Skip files that can't be read
        }
      }

      return hash.digest("hex");
    } catch {
      return "";
    }
  }

  /**
   * Recursively collect all TypeScript files in directory
   */
  private collectTsFiles(dir: string, files: string[]): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== "_generated") {
          this.collectTsFiles(fullPath, files);
        } else if (entry.isFile() && entry.name.endsWith(".ts")) {
          files.push(fullPath);
        }
      }
    } catch {
      // Silently fail - caching is optional
    }
  }
}
