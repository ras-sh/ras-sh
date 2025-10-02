import { generateJsonSchemaFromArgs } from "../schema-generator";
import type { FunctionDefinition, ParsedFunction } from "../types";
import { ConvexAstParser } from "./ast-parser";
import { FunctionCache } from "./cache";

/**
 * Discover Convex functions by parsing TypeScript source files
 * Uses AST analysis to extract function definitions, types, and arguments
 * Implements caching with automatic directory checksum invalidation
 */
function discoverFunctions(): ParsedFunction[] {
  const cache = FunctionCache.getInstance();

  // Try to get cached functions first
  const cachedFunctions = cache.get();
  if (cachedFunctions) {
    return cachedFunctions;
  }

  // Cache miss - parse functions and cache the result
  const parser = ConvexAstParser.getInstance();
  const discoveredFunctions = parser.discoverConvexFunctions();

  const parsedFunctions = discoveredFunctions.map((fn) => ({
    path: fn.module ? `${fn.module}.${fn.name}` : fn.name,
    type: fn.type,
    args: fn.args,
    jsonSchema: generateJsonSchemaFromArgs(fn.args),
  }));

  // Cache the result for future runs
  cache.set(parsedFunctions);

  return parsedFunctions;
}

/**
 * Convert function definitions to parsed functions
 * (for backward compatibility with provided functions)
 */
function convertFunctionDefinitions(
  functions: FunctionDefinition[]
): ParsedFunction[] {
  return functions.map((fn) => ({
    path: fn.module ? `${fn.module}.${fn.name}` : fn.name,
    type: fn.type,
    args: fn.args,
    jsonSchema: generateJsonSchemaFromArgs(fn.args),
  }));
}

// Export for internal use
export { discoverFunctions, convertFunctionDefinitions };
