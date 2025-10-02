import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { buildCliProgram } from "../src/cli/commands";
import type { ConvexCaller } from "../src/convex-client";
import type { ParsedFunction } from "../src/types";

// Mock ConvexCaller
vi.mock("../src/convex-client");

const mockCaller = {
  callFunction: vi.fn(),
} as unknown as ConvexCaller;

describe("buildCliProgram", () => {
  it("should create a CLI program with root-level functions", () => {
    const functions: ParsedFunction[] = [
      {
        path: "ping",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
      },
      {
        path: "health",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    expect(program).toBeInstanceOf(Command);
    expect(program.name()).toBe("test-cli");
    expect(program.description()).toBe("CLI for Convex backend functions");

    const commands = program.commands;
    expect(commands).toHaveLength(2);
    expect(commands[0].name()).toBe("ping");
    expect(commands[1].name()).toBe("health");
  });

  it("should create subcommands for module functions", () => {
    const functions: ParsedFunction[] = [
      {
        path: "todos.getAll",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
      },
      {
        path: "todos.create",
        type: "mutation",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
        },
      },
      {
        path: "users.getUser",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    const commands = program.commands;
    expect(commands).toHaveLength(2);

    const todosCommand = commands.find((cmd) => cmd.name() === "todos");
    const usersCommand = commands.find((cmd) => cmd.name() === "users");

    expect(todosCommand).toBeDefined();
    expect(usersCommand).toBeDefined();

    expect(todosCommand?.commands).toHaveLength(2);
    expect(todosCommand?.commands[0].name()).toBe("get-all");
    expect(todosCommand?.commands[1].name()).toBe("create");

    expect(usersCommand?.commands).toHaveLength(1);
    expect(usersCommand?.commands[0].name()).toBe("get-user");
  });

  it("should handle mixed root and module functions", () => {
    const functions: ParsedFunction[] = [
      {
        path: "ping",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
      },
      {
        path: "todos.getAll",
        type: "query",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    const commands = program.commands;
    expect(commands).toHaveLength(2);

    const rootCommand = commands.find((cmd) => cmd.name() === "ping");
    const moduleCommand = commands.find((cmd) => cmd.name() === "todos");

    expect(rootCommand).toBeDefined();
    expect(moduleCommand).toBeDefined();
    expect(moduleCommand?.commands).toHaveLength(1);
  });

  it("should create options for all arguments (no positional arguments)", () => {
    const functions: ParsedFunction[] = [
      {
        path: "createUser",
        type: "mutation",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "User name" },
            age: { type: "number", description: "User age" },
            isActive: { type: "boolean", description: "User active status" },
            email: { type: "string", description: "User email" },
          },
          required: ["name", "age", "isActive", "email"],
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    const command = program.commands[0];

    // No positional arguments - all args are options for stability
    const args = command.registeredArguments;
    expect(args).toHaveLength(0);

    // All properties should be options
    const options = command.options;
    const nameOption = options.find((opt) => opt.long === "--name");
    const ageOption = options.find((opt) => opt.long === "--age");
    const emailOption = options.find((opt) => opt.long === "--email");
    const isActiveOption = options.find((opt) => opt.long === "--is-active");

    expect(nameOption).toBeDefined();
    expect(ageOption).toBeDefined();
    expect(emailOption).toBeDefined();
    expect(isActiveOption).toBeDefined();
  });

  it("should create options with correct types and requirements", () => {
    const functions: ParsedFunction[] = [
      {
        path: "testFunction",
        type: "mutation",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {
            requiredString: { type: "string", description: "Required string" },
            optionalNumber: { type: "number", description: "Optional number" },
            requiredBoolean: {
              type: "boolean",
              description: "Required boolean",
            },
            optionalArray: {
              type: "array",
              items: { type: "string" },
              description: "Optional array",
            },
            enumField: {
              type: "string",
              enum: ["option1", "option2", "option3"],
              description: "Enum field",
            },
            fieldWithDefault: {
              type: "string",
              default: "defaultValue",
              description: "Field with default",
            },
          },
          required: ["requiredString", "requiredBoolean"],
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    const command = program.commands[0];
    const options = command.options;

    const booleanOption = options.find(
      (opt) => opt.long === "--required-boolean"
    );
    expect(booleanOption).toBeDefined();
    expect(booleanOption?.mandatory).toBe(true);

    const numberOption = options.find(
      (opt) => opt.long === "--optional-number"
    );
    expect(numberOption).toBeDefined();
    expect(numberOption?.mandatory).toBe(false);

    const enumOption = options.find((opt) => opt.long === "--enum-field");
    expect(enumOption).toBeDefined();

    const defaultOption = options.find(
      (opt) => opt.long === "--field-with-default"
    );
    expect(defaultOption).toBeDefined();
    expect(defaultOption?.defaultValue).toBe("defaultValue");
  });

  it("should use kebab-case for command and option names", () => {
    const functions: ParsedFunction[] = [
      {
        path: "myModule.createUserAccount",
        type: "mutation",
        args: undefined,
        jsonSchema: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            isActive: { type: "boolean" },
          },
          required: ["firstName", "lastName"],
        },
      },
    ];

    const program = buildCliProgram(functions, mockCaller, "test-cli");

    const moduleCommand = program.commands[0];
    expect(moduleCommand.name()).toBe("my-module");

    const functionCommand = moduleCommand.commands[0];
    expect(functionCommand.name()).toBe("create-user-account");

    const options = functionCommand.options;
    const isActiveOption = options.find((opt) => opt.long === "--is-active");
    expect(isActiveOption).toBeDefined();
  });
});
