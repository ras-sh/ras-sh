import * as fs from "node:fs";
import * as path from "node:path";
import {
  type CallExpression,
  type Expression,
  Node,
  type ObjectLiteralExpression,
  Project,
  type PropertyAccessExpression,
  type PropertyAssignment,
  SyntaxKind,
  type VariableDeclaration,
} from "ts-morph";
import type { ArgDefinition, FunctionDefinition, FunctionType } from "../types";

// Constants for magic numbers
const RELATIVE_PREFIX_LENGTH = 3; // "../"
const JS_SUFFIX_LENGTH = 3; // ".js"

/**
 * TypeScript AST-based parser for Convex functions using ts-morph
 * Provides accurate and robust function discovery through static analysis
 */
export class ConvexAstParser {
  private static instance: ConvexAstParser;
  private readonly project: Project;

  private constructor() {
    this.project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        target: 1, // ES5
        module: 1, // CommonJS
        allowJs: true,
        checkJs: false,
        noEmit: true,
      },
    });
  }

  /**
   * Get singleton instance to reuse ts-morph Project across calls
   */
  static getInstance(): ConvexAstParser {
    if (!ConvexAstParser.instance) {
      ConvexAstParser.instance = new ConvexAstParser();
    }
    return ConvexAstParser.instance;
  }

  /**
   * Reset singleton instance (primarily for testing)
   */
  static resetInstance(): void {
    // biome-ignore lint/suspicious/noExplicitAny: Required for testing singleton reset
    (ConvexAstParser as any).instance = undefined;
  }

  /**
   * Discover Convex functions by parsing TypeScript source files
   */
  discoverConvexFunctions(): FunctionDefinition[] {
    const functions: FunctionDefinition[] = [];

    try {
      // Read the generated API file to get module imports
      const apiPath = path.join("./convex", "_generated", "api.d.ts");

      if (!fs.existsSync(apiPath)) {
        return [];
      }

      const apiContent = fs.readFileSync(apiPath, "utf-8");
      const modules = this.extractModulesFromApi(apiContent);

      // Process each module file using AST parsing
      for (const module of modules) {
        const modulePath = path.join("./convex", `${module.file}.ts`);

        if (!fs.existsSync(modulePath)) {
          continue;
        }

        const moduleContent = fs.readFileSync(modulePath, "utf-8");
        const moduleFunctions = this.extractFunctionsFromModule(
          moduleContent,
          module.name,
          modulePath
        );
        functions.push(...moduleFunctions);
      }

      return functions;
    } catch (_error) {
      return [];
    }
  }

  /**
   * Extract module information from generated API file using AST parsing
   */
  private extractModulesFromApi(
    apiContent: string
  ): Array<{ name: string; file: string }> {
    const modules: Array<{ name: string; file: string }> = [];

    try {
      // Parse the API file as TypeScript
      const sourceFile = this.project.createSourceFile("api.d.ts", apiContent, {
        overwrite: true,
      });

      // Find all import declarations
      const importDeclarations = sourceFile.getImportDeclarations();

      for (const importDecl of importDeclarations) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();

        // Check if it's a relative import starting with "../" and ending with ".js"
        if (
          !(
            moduleSpecifier.startsWith("../") && moduleSpecifier.endsWith(".js")
          )
        ) {
          continue;
        }

        // Get the namespace import (import type * as moduleName)
        const namespaceImport = importDecl.getNamespaceImport();
        if (!namespaceImport) {
          continue;
        }

        const moduleName = namespaceImport.getText();
        // Remove "../" prefix and ".js" suffix to get the file path
        const filePath = moduleSpecifier.slice(
          RELATIVE_PREFIX_LENGTH,
          -JS_SUFFIX_LENGTH
        );

        modules.push({
          name: moduleName,
          file: filePath,
        });
      }

      return modules;
    } catch (_error) {
      return [];
    }
  }

  /**
   * Extract functions from a TypeScript module using AST analysis
   */
  private extractFunctionsFromModule(
    content: string,
    moduleName: string,
    filePath: string
  ): FunctionDefinition[] {
    const functions: FunctionDefinition[] = [];

    try {
      // Get or create the source file in the project (reuse if already exists)
      let sourceFile = this.project.getSourceFile(filePath);
      if (!sourceFile) {
        sourceFile = this.project.createSourceFile(filePath, content);
      }

      // Find all variable declarations with export modifier
      const exportedVariables = sourceFile
        .getVariableDeclarations()
        .filter((decl) => {
          const variableStatement = decl.getVariableStatement();
          return variableStatement?.hasExportKeyword() ?? false;
        });

      for (const variable of exportedVariables) {
        const functionDef = this.parseConvexFunction(variable, moduleName);
        if (functionDef) {
          functions.push(functionDef);
        }
      }

      return functions;
    } catch (_error) {
      return [];
    }
  }

  /**
   * Parse a variable declaration to check if it's a Convex function
   */
  private parseConvexFunction(
    variable: VariableDeclaration,
    moduleName: string
  ): FunctionDefinition | null {
    const name = variable.getName();
    const initializer = variable.getInitializer();

    if (!initializer) {
      return null;
    }

    // Check if the initializer is a call expression (query(), mutation(), action())
    if (initializer.getKind() !== SyntaxKind.CallExpression) {
      return null;
    }

    const callExpr = initializer as CallExpression;
    const expression = callExpr.getExpression();

    // Check if it's a call to query, mutation, or action
    const functionType = this.getFunctionType(expression.getText());
    if (!functionType) {
      return null;
    }

    // Extract arguments from the function configuration
    const args = this.extractArgs(callExpr);

    return {
      name,
      type: functionType,
      module: moduleName,
      args,
    };
  }

  /**
   * Determine the function type from the call expression
   */
  private getFunctionType(expressionText: string): FunctionType | null {
    switch (expressionText) {
      case "query":
        return "query";
      case "mutation":
        return "mutation";
      case "action":
        return "action";
      default:
        return null;
    }
  }

  /**
   * Extract arguments from the Convex function configuration object
   */
  private extractArgs(
    callExpr: CallExpression
  ): Record<string, ArgDefinition> | undefined {
    const args = callExpr.getArguments();
    if (args.length === 0) {
      return;
    }

    const configObject = args[0];
    if (configObject.getKind() !== SyntaxKind.ObjectLiteralExpression) {
      return;
    }

    const objLiteral = configObject as ObjectLiteralExpression;
    const argsProperty = objLiteral.getProperty("args");

    if (
      !argsProperty ||
      argsProperty.getKind() !== SyntaxKind.PropertyAssignment
    ) {
      return;
    }

    const argsAssignment = argsProperty as PropertyAssignment;
    const argsValue = argsAssignment.getInitializer();

    if (
      !argsValue ||
      argsValue.getKind() !== SyntaxKind.ObjectLiteralExpression
    ) {
      return;
    }

    return this.parseArgsObject(argsValue as ObjectLiteralExpression);
  }

  /**
   * Parse the args object to extract argument definitions
   */
  private parseArgsObject(
    argsObject: ObjectLiteralExpression
  ): Record<string, ArgDefinition> {
    const argDefinitions: Record<string, ArgDefinition> = {};

    const properties = argsObject.getProperties();
    for (const prop of properties) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) {
        continue;
      }

      const assignment = prop as PropertyAssignment;
      const argName = assignment.getName();
      if (!argName) {
        continue;
      }

      const initializer = assignment.getInitializer();
      if (!initializer) {
        continue;
      }

      const argDef = this.parseValidatorExpression(initializer);
      if (argDef) {
        argDefinitions[argName] = argDef;
      }
    }

    return argDefinitions;
  }

  /**
   * Parse a validator expression using AST analysis
   */
  private parseValidatorExpression(
    expression: Expression
  ): ArgDefinition | null {
    // Handle call expressions (v.string(), v.optional(), etc.)
    if (expression.getKind() === SyntaxKind.CallExpression) {
      const callExpr = expression as CallExpression;
      return this.parseValidatorCallExpression(callExpr);
    }

    // Handle property access expressions (v.string, v.number)
    if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expression as PropertyAccessExpression;
      return this.parseValidatorPropertyAccess(propAccess);
    }

    // Default to string type for unknown expressions
    return { type: "string", required: true };
  }

  /**
   * Parse validator call expressions like v.string(), v.optional(v.number())
   */
  private parseValidatorCallExpression(
    callExpr: CallExpression
  ): ArgDefinition | null {
    const expression = callExpr.getExpression();

    // Handle v.optional() wrapper
    if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expression as PropertyAccessExpression;
      const methodName = propAccess.getName();

      if (methodName === "optional") {
        // Parse the inner validator
        const args = callExpr.getArguments();
        if (args.length > 0) {
          const firstArg = args[0];
          if (Node.isExpression(firstArg)) {
            const innerValidator = this.parseValidatorExpression(firstArg);
            return innerValidator
              ? { ...innerValidator, required: false }
              : null;
          }
        }
        return null;
      }

      // Handle other validator methods
      return this.parseValidatorMethodCall(methodName);
    }

    return null;
  }

  /**
   * Parse validator property access like v.string (without call)
   */
  private parseValidatorPropertyAccess(
    propAccess: PropertyAccessExpression
  ): ArgDefinition | null {
    const methodName = propAccess.getName();
    return this.parseValidatorMethodCall(methodName);
  }

  /**
   * Map validator method names to argument types
   */
  private parseValidatorMethodCall(methodName: string): ArgDefinition | null {
    const validatorTypeMap: Record<string, string> = {
      string: "string",
      number: "number",
      float64: "number",
      int64: "integer",
      bigint: "integer",
      boolean: "boolean",
      id: "string",
      literal: "string",
      union: "string", // Simplified for now
      object: "object",
      array: "array",
    };

    const type = validatorTypeMap[methodName];
    return type ? { type, required: true } : { type: "string", required: true };
  }
}
