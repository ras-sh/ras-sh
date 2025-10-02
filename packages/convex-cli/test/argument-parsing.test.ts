import { describe, expect, it } from "vitest";

describe("Argument Parsing Logic", () => {
  function buildInputFromArgsAndOptions(
    schema: {
      type: string;
      properties?: Record<string, any>;
      required?: readonly string[];
    },
    positionalValues: unknown[],
    options: Record<string, unknown>,
    actualPositionalArgs: string[]
  ): Record<string, unknown> {
    if (schema.type !== "object" || !schema.properties) {
      return options;
    }

    const input: Record<string, unknown> = {};

    for (
      let i = 0;
      i < actualPositionalArgs.length && i < positionalValues.length;
      i++
    ) {
      input[actualPositionalArgs[i]] = positionalValues[i];
    }

    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        const propSchema = schema.properties?.[key];
        if (propSchema?.type === "boolean" && typeof value === "string") {
          if (value === "true") {
            input[key] = true;
          } else if (value === "false") {
            input[key] = false;
          } else {
            input[key] = value;
          }
        } else {
          input[key] = value;
        }
      }
    }

    return input;
  }

  it("should combine positional arguments and options correctly", () => {
    const schema = {
      type: "object",
      properties: {
        text: { type: "string" },
        count: { type: "number" },
        isActive: { type: "boolean" },
      },
      required: ["text", "count"],
    } as const;

    const TEST_COUNT = 42;
    const positionalValues = ["Hello World", TEST_COUNT];
    const options = { isActive: "true" } as const;
    const actualPositionalArgs = ["text", "count"];

    const result = buildInputFromArgsAndOptions(
      schema,
      positionalValues,
      options as unknown as Record<string, unknown>,
      actualPositionalArgs
    );

    expect(result).toEqual({
      text: "Hello World",
      count: 42,
      isActive: true,
    });
  });
});
