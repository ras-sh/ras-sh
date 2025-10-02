import { describe, expect, it } from "vitest";
import { formatError, kebabCase } from "../src/utils";

describe("kebabCase", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(kebabCase("camelCase")).toBe("camel-case");
    expect(kebabCase("myVariableName")).toBe("my-variable-name");
    expect(kebabCase("getUserAccount")).toBe("get-user-account");
  });

  it("should handle PascalCase", () => {
    expect(kebabCase("PascalCase")).toBe("pascal-case");
    expect(kebabCase("MyComponent")).toBe("my-component");
  });

  it("should handle already kebab-case strings", () => {
    expect(kebabCase("already-kebab")).toBe("already-kebab");
    expect(kebabCase("my-function")).toBe("my-function");
  });

  it("should handle single words", () => {
    expect(kebabCase("word")).toBe("word");
    expect(kebabCase("Word")).toBe("word");
  });

  it("should handle numbers and special characters", () => {
    expect(kebabCase("getValue2")).toBe("get-value2");
    expect(kebabCase("myVar_name")).toBe("my-var_name");
  });

  it("should handle empty strings", () => {
    expect(kebabCase("")).toBe("");
  });
});

describe("formatError", () => {
  it("should format Error objects", () => {
    const error = new Error("Something went wrong");
    const result = formatError(error);
    expect(result).toBe("Something went wrong");
  });

  it("should format string errors", () => {
    const error = "String error message";
    const result = formatError(error);
    expect(result).toBe("String error message");
  });

  it("should format objects with message property", () => {
    const error = { message: "Object error message" };
    const result = formatError(error);
    expect(result).toBe("[object Object]");
  });

  it("should format unknown error types", () => {
    const error = { code: 500, status: "error" };
    const result = formatError(error);
    expect(result).toBe("[object Object]");
  });

  it("should handle null and undefined", () => {
    expect(formatError(null)).toBe("null");
    expect(formatError(undefined)).toBe("undefined");
  });

  it("should handle numbers and booleans", () => {
    const TEST_NUMBER = 42;
    expect(formatError(TEST_NUMBER)).toBe("42");
    expect(formatError(true)).toBe("true");
    expect(formatError(false)).toBe("false");
  });
});
