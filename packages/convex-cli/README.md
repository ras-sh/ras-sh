![Convex CLI Banner](https://ras.sh/static/convex-cli.webp)

# @ras-sh/convex-cli [![npm version](https://img.shields.io/npm/v/@ras-sh/convex-cli.svg)](https://www.npmjs.com/package/@ras-sh/convex-cli)

Create a fully type-safe CLI from your Convex API. Functions are discovered automatically and exposed as commands, making it easy to use your backend from the terminal or distribute access externally.

> **Note**: This is an independent project and is not officially affiliated with Convex or the Convex team.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Command Structure](#command-structure)
  - [Argument Handling](#argument-handling)
  - [Function Types](#function-types)
  - [Function Discovery](#function-discovery)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Programmatic Configuration](#programmatic-configuration)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔍 **Automatic Function Discovery**: Parses your `convex/_generated/api.d.ts` to automatically discover all your Convex functions without manual registration
- 🛡️ **Type-Safe Arguments**: Uses your Convex function signatures to validate and convert CLI arguments, preventing runtime errors
- 📊 **AST-Based Analysis**: Leverages TypeScript's AST via ts-morph to understand complex function parameters and nested types
- 🔄 **Smart Type Coercion**: Automatically converts CLI strings to appropriate Convex types (booleans, IDs, objects, arrays)
- 📁 **Modular Command Structure**: Organizes commands by your Convex modules with automatic kebab-case conversion
- ⚡ **Full Convex Support**: Works with queries, mutations, and actions with proper error handling and authentication

## Installation

**Prerequisites:**
- Node.js 20+
- A Convex project with generated types (`npx convex dev`)

```bash
npm install @ras-sh/convex-cli
# or
pnpm add @ras-sh/convex-cli
# or
bun add @ras-sh/convex-cli
```

> **Note**: This package requires `convex` as a peer dependency. Make sure it's installed in your project.

## Quick Start

Get up and running in minutes with these simple steps.

### 1. Environment Setup

Set up your Convex deployment URL:

```bash
# For production
export CONVEX_URL="https://your-deployment.convex.cloud"

# For local development (default)
export CONVEX_URL="http://localhost:3210"

# Or use deployment name
export CONVEX_DEPLOYMENT="your-deployment-name"
```

### 2. Create CLI Entry Point

Create `src/cli.ts` in your project:

```typescript
// src/cli.ts
import { createCli } from "@ras-sh/convex-cli";
import { api } from "../convex/_generated/api.js";

createCli({ api }).run();
```

### 3. Add NPM Script

Update your `package.json`:

```json
{
  "scripts": {
    "cli": "tsx --env-file=.env.local src/cli.ts"
  }
}
```

### 4. Generate Types & Test

Ensure your Convex types are generated, then test the CLI:

```bash
# Generate Convex types (if not already done)
npx convex dev

# Test the CLI
npm run cli --help

# Try a command
npm run cli todos get-all
```

### 🎉 You're Done!

Your CLI is now ready. Run `npm run cli --help` to see all available commands automatically discovered from your Convex API.

## Usage

### Command Structure

The CLI automatically generates commands based on your Convex API structure. Functions are organized by module, with both module and function names converted to kebab-case for consistency.

```bash
# Module functions
your-cli <module-name> <function-name> [options...]

# Root-level functions
your-cli <function-name> [options...]
```

### Argument Handling

All function arguments are passed as command-line options using the `--` prefix. The CLI handles automatic type conversion and validation:

```bash
# String arguments
your-cli todos create --text "Buy groceries"

# Boolean arguments (automatic string-to-boolean conversion)
your-cli todos toggle --id "some-id" --completed true

# Convex ID arguments
your-cli todos delete-todo --id "j57d6h3k66q0q0q0q0q0q0q0q0q0"

# Complex arguments with kebab-case conversion
# Function parameter `firstName` becomes `--first-name`
your-cli users create-user --first-name "John" --last-name "Doe"
```

### Function Types

The CLI supports all Convex function types with appropriate annotations:

```bash
# Queries (read-only operations)
your-cli todos get-all               # (query)

# Mutations (write operations)
your-cli todos create --text "Task"  # (mutation)

# Actions (external API calls, etc.)
your-cli integrations sync-data      # (action)
```

### Function Discovery

The CLI uses TypeScript AST analysis with **ts-morph** to automatically discover your Convex functions:

- Parses `convex/_generated/api.d.ts` to extract module structure
- Analyzes TypeScript source files for function definitions and arguments
- Generates JSON schemas for type validation
- Supports complex nested object types and arrays
- Works with any valid Convex function signature

No manual configuration required - just run `npx convex dev` to generate types and the CLI will discover everything automatically.

## Configuration

### Environment Variables

The CLI supports multiple ways to configure your Convex deployment URL:

- `CONVEX_URL`: Direct URL to your Convex deployment (highest priority)
- `CONVEX_DEPLOYMENT`: Deployment name (constructs URL as `https://{name}.convex.cloud`)
- **Fallback**: `http://localhost:3210` for local development

```bash
# Production deployment
export CONVEX_URL="https://your-deployment.convex.cloud"

# Using deployment name (equivalent to above)
export CONVEX_DEPLOYMENT="your-deployment"

# Local development (default fallback)
# No environment variable needed
```

### Programmatic Configuration

```typescript
import { createCli } from "@ras-sh/convex-cli";
import { api } from "../convex/_generated/api.js";

const cli = createCli({
  api,                   // Your Convex API object (required)
  url: "...",            // Optional: Override environment URL
  name: "my-app-cli",    // Optional: CLI program name (default: "convex-cli")
  version: "1.0.0",      // Optional: CLI version
  description: "...",    // Optional: CLI description
});

// Basic usage
cli.run();

// Advanced usage with custom configuration
cli.run({
  logger: {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
  },
  process: process,      // Optional: custom process object
  argv: process.argv,    // Optional: custom argv
});
```

## Examples

Assuming you have a Convex backend with todo functions:

```typescript
// convex/todos.ts
export const getAll = query(() => { /* ... */ });
export const create = mutation(({ text }: { text: string }) => { /* ... */ });
export const toggle = mutation(({ id }: { id: Id<"todos"> }) => { /* ... */ });
```

Your CLI commands would be:

```bash
# List all todos
npm run cli todos get-all

# Create a new todo
npm run cli todos create --text "Buy groceries"

# Toggle todo completion
npm run cli todos toggle --id "j57d6h3k66q0q0q0q0q0q0q0q0q0" --completed true
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Running tests and linting
- Code quality standards
- Submitting pull requests

### Quick Development Setup

```bash
git clone https://github.com/ras-sh/convex-cli.git
cd convex-cli
pnpm install
pnpm test
pnpm run build
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
