import type { Command } from "commander";
import { buildCliProgram } from "./cli/commands";
import { ConvexCaller } from "./convex-client";
import {
  convertFunctionDefinitions,
  discoverFunctions,
} from "./discovery/index";
import type {
  ConvexCli,
  ConvexCliParams,
  ConvexCliRunParams,
  ParsedFunction,
} from "./types";
import { defaultLogger, formatError } from "./utils";

// Export main types needed by users
export type { ConvexCli, ConvexCliParams, ConvexCliRunParams } from "./types";

/**
 * Create a CLI from a Convex API object.
 *
 * @param params Configuration object with api, url, and other options
 * @returns A CLI object with a run method
 */
export function createCli(params: ConvexCliParams): ConvexCli {
  const functions = loadFunctions(params);

  function buildProgram(runParams?: ConvexCliRunParams): Command {
    const caller = new ConvexCaller(params.api, getUrl(params));
    const program = buildCliProgram(
      functions,
      caller,
      params.name || "convex-cli",
      runParams
    );

    if (params.version) {
      program.version(params.version);
    }

    if (params.description) {
      program.description(
        params.description || "CLI for Convex backend functions"
      );
    }

    return program;
  }

  const run: ConvexCli["run"] = async (runParams?: ConvexCliRunParams) => {
    const logger = { ...defaultLogger, ...runParams?.logger };
    const processInstance = runParams?.process || process;
    const argv = runParams?.argv || process.argv;

    try {
      const program = buildProgram(runParams);

      program.configureOutput({
        writeOut: (str) => logger.info?.(str),
        writeErr: (str) => logger.error?.(str),
      });

      await program.parseAsync(argv);
    } catch (error) {
      handleCliError(error, logger, processInstance);
    }
  };

  return {
    run,
    buildProgram,
  };
}

/**
 * Load functions from provided definitions or discover automatically
 */
function loadFunctions(params: ConvexCliParams): ParsedFunction[] {
  const { functions: providedFunctions } = params;

  let functions: ParsedFunction[];

  if (providedFunctions && providedFunctions.length > 0) {
    functions = convertFunctionDefinitions(providedFunctions);
  } else {
    functions = discoverFunctions();
  }

  if (functions.length === 0) {
    throw new Error(
      "No Convex functions found. Make sure you have exported functions in your convex/ directory and run `npx convex dev` to generate types."
    );
  }

  return functions;
}

/**
 * Get the Convex URL from params or environment
 */
function getUrl(params: ConvexCliParams): string {
  return (
    params.url ||
    process.env.CONVEX_URL ||
    (process.env.CONVEX_DEPLOYMENT
      ? `https://${process.env.CONVEX_DEPLOYMENT}.convex.cloud`
      : "http://localhost:3210")
  );
}

/**
 * Handle CLI errors with appropriate exit codes
 */
function handleCliError(
  error: unknown,
  logger: { error?: (message: unknown) => void },
  processInstance: NodeJS.Process
): void {
  // Allow commander controlled exits (e.g. --help) to pass through with their exit code
  const maybeCommander = error as { exitCode?: number } | undefined;
  if (maybeCommander && typeof maybeCommander.exitCode === "number") {
    processInstance.exit(maybeCommander.exitCode);
    return;
  }

  logger.error?.(formatError(error));
  processInstance.exit(1);
}
