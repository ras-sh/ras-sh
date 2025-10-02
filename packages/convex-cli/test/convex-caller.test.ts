import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConvexCaller } from "../src/convex-client";

// Create a minimal fake Convex client via dynamic import interception
vi.mock("convex/browser", () => {
  class FakeClient {
    url: string;
    constructor(url: string) {
      this.url = url;
    }
    query(ref: unknown, args?: unknown) {
      return Promise.resolve({ type: "query", ref, args, url: this.url });
    }
    mutation(ref: unknown, args?: unknown) {
      return Promise.resolve({ type: "mutation", ref, args, url: this.url });
    }
    action(ref: unknown, args?: unknown) {
      return Promise.resolve({ type: "action", ref, args, url: this.url });
    }
  }
  return { ConvexHttpClient: FakeClient };
});

function makeApiProxy() {
  // Emulate Convex anyApi proxy behavior
  return new Proxy(
    {},
    {
      get(_t, prop: string) {
        if (prop === "todos") {
          return new Proxy(
            {},
            {
              get(_t2, prop2: string) {
                if (prop2 === "getAll") {
                  return {};
                }
                return Reflect.get({}, prop2);
              },
            }
          );
        }
        return Reflect.get({}, prop);
      },
    }
  );
}

describe("ConvexCaller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls query with function reference when resolvable", async () => {
    const api = { todos: { getAll: {} } };
    const caller = new ConvexCaller(api as any, "http://localhost:3210");
    const res = await caller.callFunction("todos.getAll", "query", {});
    expect(res).toMatchObject({ type: "query" });
  });

  it("falls back to string path when reference is not resolvable", async () => {
    const api = makeApiProxy();
    const caller = new ConvexCaller(api as any, "http://localhost:3210");
    const res = await caller.callFunction("todos.getAll", "query", { a: 1 });
    expect(res).toMatchObject({ type: "query" });
  });
});
