import type { Command } from "commander";
import { Option } from "commander";
import type { JsonSchema } from "../types";
import { kebabCase } from "../utils";

/**
 * Add an option for a JSON schema property to a command
 */
export function addOptionForProperty(
  command: Command,
  propName: string,
  propSchema: JsonSchema,
  isRequired: boolean
): void {
  const optionName = `--${kebabCase(propName)}`;
  const description =
    propSchema.description || `${propName} (${propSchema.type})`;

  let option: Option;

  switch (propSchema.type) {
    case "boolean":
      option = new Option(`${optionName} <value>`, description);
      option.argParser((value) => {
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }
        throw new Error(
          `Invalid boolean value: ${value}. Use 'true' or 'false'.`
        );
      });
      option.choices(["true", "false"]);
      if (isRequired) {
        option.makeOptionMandatory();
      }
      break;

    case "number":
    case "integer":
      option = new Option(`${optionName} <value>`, description);
      option.argParser((value) => {
        const num = Number(value);
        if (Number.isNaN(num)) {
          throw new Error(`Invalid number: ${value}`);
        }
        return propSchema.type === "integer" ? Math.floor(num) : num;
      });
      break;

    case "array":
      option = new Option(`${optionName} [values...]`, description);
      option.argParser((value, previous) => {
        const array = Array.isArray(previous) ? previous : [];
        // Parse the value based on array item type
        if (propSchema.items?.type === "number") {
          const num = Number(value);
          if (Number.isNaN(num)) {
            throw new Error(`Invalid number in array: ${value}`);
          }
          array.push(num);
        } else {
          array.push(value);
        }
        return array;
      });
      break;

    default:
      if (propSchema.enum && propSchema.enum.length > 0) {
        option = new Option(`${optionName} <value>`, description);
        option.choices(propSchema.enum.map(String));
      } else {
        option = new Option(`${optionName} <value>`, description);
      }
      break;
  }

  if (isRequired) {
    option.makeOptionMandatory();
  }

  if (propSchema.default !== undefined) {
    option.default(propSchema.default);
  }

  command.addOption(option);
}
