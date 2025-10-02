import type { ConvexHttpClient } from "convex/browser";
import type { ConvexApi, FunctionType } from "./types";

// We'll need to import ConvexClient at runtime since it's a peer dependency
export class ConvexCaller {
  private client: ConvexHttpClient | null;
  private readonly api: ConvexApi;
  private readonly url: string;

  constructor(api: ConvexApi, url: string) {
    this.api = api;
    this.url = url;
    // Lazy initialize on first call
    this.client = null;
    this.clientPromise = null;
  }

  private clientPromise: Promise<void> | null;

  private async initializeClient(url: string) {
    try {
      // Try to import ConvexHttpClient for Node.js environment
      try {
        const convexModule = await import("convex/browser");
        const ConvexClientConstructor =
          convexModule.ConvexHttpClient || convexModule.ConvexClient;

        if (!ConvexClientConstructor) {
          throw new Error("ConvexClient not found in convex/browser");
        }

        this.client = new ConvexClientConstructor(url) as ConvexHttpClient;
      } catch (importError) {
        throw new Error(`Failed to import ConvexClient: ${importError}`);
      }
    } catch (error) {
      throw new Error(
        `Failed to initialize ConvexClient: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async ensureClient(): Promise<void> {
    if (this.client) {
      return;
    }
    if (!this.clientPromise) {
      this.clientPromise = this.initializeClient(this.url);
    }
    await this.clientPromise;
  }

  async callFunction(
    functionPath: string,
    type: FunctionType,
    args: Record<string, unknown> = {}
  ): Promise<unknown> {
    // Ensure client is initialized before use
    await this.ensureClient();

    if (!this.client) {
      throw new Error("ConvexClient not initialized");
    }

    try {
      // Get the function reference from the API
      const functionRef = this.getFunctionReference(functionPath);

      // If not found, fall back to string reference (modulePath:functionName)
      if (functionRef === null || functionRef === undefined) {
        const parts = functionPath.split(".");
        const fn = parts.at(-1);
        const mod = parts.slice(0, -1).join("/");
        const name = mod && fn ? `${mod}:${fn}` : functionPath;

        if (type === "query") {
          return await this.client.query(name as never, args as never);
        }
        if (type === "mutation") {
          return await this.client.mutation(name as never, args as never);
        }
        if (type === "action") {
          return await this.client.action(name as never, args as never);
        }
        throw new Error(`Unknown function type: ${type}`);
      }

      // Call the appropriate method based on function type
      if (type === "query") {
        return await this.client.query(functionRef as never, args as never);
      }
      if (type === "mutation") {
        return await this.client.mutation(functionRef as never, args as never);
      }
      if (type === "action") {
        return await this.client.action(functionRef as never, args as never);
      }
      throw new Error(`Unknown function type: ${type}`);
    } catch (error) {
      throw new Error(
        `Failed to call ${type} "${functionPath}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private getFunctionReference(functionPath: string): unknown {
    const parts = functionPath.split(".");

    try {
      let current: unknown = this.api;

      for (const part of parts) {
        if (
          current &&
          (typeof current === "object" || typeof current === "function")
        ) {
          // Access the property directly to trigger Proxy get traps (Convex api uses Proxies)
          current = (current as Record<string, unknown>)[part as string];
          if (current === undefined || current === null) {
            return null;
          }
        } else {
          return null;
        }
      }

      return current;
    } catch (_error) {
      return null;
    }
  }

  async close(): Promise<void> {
    // ConvexHttpClient doesn't have a close method, but we keep this for future compatibility
    if (
      this.client &&
      "close" in this.client &&
      typeof this.client.close === "function"
    ) {
      await this.client.close();
    }
  }
}
