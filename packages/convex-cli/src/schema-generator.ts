import type { ArgDefinition, JsonSchema } from "./types";

/**
 * Generate a JSON schema from argument definitions
 */
export function generateJsonSchemaFromArgs(
  args?: Record<string, ArgDefinition>
): JsonSchema {
  if (!args) {
    return {
      type: "object",
      properties: {},
      additionalProperties: true,
    };
  }

  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  for (const [argName, argDef] of Object.entries(args)) {
    properties[argName] = {
      type: argDef.type,
      description: `${argName} (${argDef.type})`,
    };

    if (argDef.required) {
      required.push(argName);
    }
  }

  return {
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined,
  };
}
