import { Command } from "commander";
import type { ConvexCaller } from "../convex-client";
import type { ConvexCliRunParams, JsonSchema, ParsedFunction } from "../types";
import { defaultLogger, kebabCase } from "../utils";
import { addOptionForProperty } from "./options";

/**
 * Build input object from options only (no positional arguments)
 */
function buildInputFromOptions(
  schema: JsonSchema,
  options: Record<string, unknown>
): Record<string, unknown> {
  if (schema.type !== "object" || !schema.properties) {
    return options;
  }

  const input: Record<string, unknown> = {};

  // Add options with proper type conversion
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      // Convert string booleans to actual booleans based on schema
      const propSchema = schema.properties?.[key];
      if (propSchema?.type === "boolean" && typeof value === "string") {
        if (value === "true") {
          input[key] = true;
        } else if (value === "false") {
          input[key] = false;
        } else {
          input[key] = value; // Let Convex handle the validation error
        }
      } else {
        input[key] = value;
      }
    }
  }

  return input;
}

/**
 * Build the CLI program structure from parsed functions
 */
export function buildCliProgram(
  functions: ParsedFunction[],
  caller: ConvexCaller,
  programName = "convex-cli",
  runParams?: ConvexCliRunParams
): Command {
  const program = new Command(programName);
  program.description("CLI for Convex backend functions");

  // Group functions by module
  const modules: Record<string, ParsedFunction[]> = {};
  for (const fn of functions) {
    const parts = fn.path.split(".");
    const moduleName = parts.length > 1 ? parts[0] : "root";

    if (!modules[moduleName]) {
      modules[moduleName] = [];
    }
    modules[moduleName].push(fn);
  }

  // Create commands for each module
  for (const [moduleName, moduleFunctions] of Object.entries(modules)) {
    if (moduleName === "root") {
      // Add root-level functions directly to the main program
      for (const fn of moduleFunctions) {
        addFunctionCommand(program, fn, caller, runParams);
      }
    } else {
      // Create a subcommand for the module
      const moduleCommand = new Command(kebabCase(moduleName));
      moduleCommand.description(`${moduleName} module functions`);

      for (const fn of moduleFunctions) {
        addFunctionCommand(moduleCommand, fn, caller, runParams);
      }

      program.addCommand(moduleCommand);
    }
  }

  return program;
}

/**
 * Add a function command to a parent command
 */
function addFunctionCommand(
  parentCommand: Command,
  fn: ParsedFunction,
  caller: ConvexCaller,
  runParams?: ConvexCliRunParams
): void {
  const logger = { ...defaultLogger, ...runParams?.logger };
  const parts = fn.path.split(".");
  const functionName = parts.at(-1) || fn.path;
  const command = new Command(kebabCase(functionName));

  // Set description based on function type
  let typeDescription: string;
  if (fn.type === "query") {
    typeDescription = "(query)";
  } else if (fn.type === "mutation") {
    typeDescription = "(mutation)";
  } else {
    typeDescription = "(action)";
  }
  command.description(`${fn.path} ${typeDescription}`);

  // Add options for all properties (no positional arguments for stability)
  if (fn.jsonSchema.type === "object" && fn.jsonSchema.properties) {
    for (const [propName, propSchema] of Object.entries(
      fn.jsonSchema.properties
    )) {
      const isRequired = fn.jsonSchema.required?.includes(propName) ?? false;
      addOptionForProperty(command, propName, propSchema, isRequired);
    }
  }

  // Add action handler
  command.action(async () => {
    try {
      // Get options (no positional arguments)
      const options = command.opts();

      // Build the input object from options only
      const input = buildInputFromOptions(fn.jsonSchema, options);

      // Call the Convex function
      const result = await caller.callFunction(fn.path, fn.type, input);

      // Log the result
      if (result !== null && result !== undefined) {
        logger.info?.(result);
      }
    } catch (error) {
      logger.error?.(error);
      process.exit(1);
    }
  });

  parentCommand.addCommand(command);
}
