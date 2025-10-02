import { preloadQuery } from "convex/nextjs";
import { ProjectLayout } from "@/components/project-layout";
import { api } from "@/convex/_generated/api";
import { NPM_PREFIX } from "@/lib/constants";

export default async function ConvexCliPage() {
  const preloadedStats = await preloadQuery(api.ossStats.getStats, {
    tool: "convex-cli",
  });

  return (
    <ProjectLayout
      description="Create a fully type-safe CLI from your Convex API. Functions are discovered automatically and exposed as commands, making it easy to use your backend from the terminal or distribute access externally."
      hasNpmPackage
      name="convex-cli"
      path="packages/convex-cli"
      preloadedStats={preloadedStats}
    >
      <div className="prose prose-invert prose-h2:mb-4 prose-h3:mb-2 max-w-none prose-ul:space-y-2 prose-pre:overflow-x-auto prose-code:rounded prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-800/50 prose-blockquote:border-l-zinc-700 prose-code:bg-zinc-800/50 prose-pre:bg-zinc-900/50 prose-pre:p-4 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-headings:font-bold prose-blockquote:text-zinc-400 prose-code:text-sm prose-code:text-zinc-300 prose-h2:text-2xl prose-h2:text-zinc-100 prose-h3:text-lg prose-h3:text-zinc-200 prose-li:text-zinc-300 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-ul:text-zinc-300 prose-code:before:content-[''] prose-code:after:content-['']">
        <blockquote>
          <p>
            <strong>Note:</strong> This is an independent project and is not
            officially affiliated with Convex or the Convex team.
          </p>
        </blockquote>

        <h2>Features</h2>
        <ul>
          <li>
            🔍 <strong>Automatic Function Discovery:</strong> Parses your{" "}
            <code>convex/_generated/api.d.ts</code> to automatically discover
            all your Convex functions without manual registration
          </li>
          <li>
            🛡️ <strong>Type-Safe Arguments:</strong> Uses your Convex function
            signatures to validate and convert CLI arguments, preventing runtime
            errors
          </li>
          <li>
            📊 <strong>AST-Based Analysis:</strong> Leverages TypeScript's AST
            via ts-morph to understand complex function parameters and nested
            types
          </li>
          <li>
            🔄 <strong>Smart Type Coercion:</strong> Automatically converts CLI
            strings to appropriate Convex types (booleans, IDs, objects, arrays)
          </li>
          <li>
            📁 <strong>Modular Command Structure:</strong> Organizes commands by
            your Convex modules with automatic kebab-case conversion
          </li>
          <li>
            ⚡ <strong>Full Convex Support:</strong> Works with queries,
            mutations, and actions with proper error handling and authentication
          </li>
        </ul>

        <h2>Installation</h2>
        <p>
          <strong>Prerequisites:</strong> Node.js 20+ and a Convex project with
          generated types (<code>npx convex dev</code>)
        </p>
        <pre>
          <code className="language-bash">
            npm install {NPM_PREFIX}convex-cli
          </code>
        </pre>
        <blockquote>
          <p>
            <strong>Note:</strong> This package requires <code>convex</code> as
            a peer dependency. Make sure it's installed in your project.
          </p>
        </blockquote>

        <h2>Quick Start</h2>

        <h3>1. Environment Setup</h3>
        <pre>
          <code className="language-bash">{`# For production
export CONVEX_URL="https://your-deployment.convex.cloud"

# For local development (default)
export CONVEX_URL="http://localhost:3210"`}</code>
        </pre>

        <h3>2. Create CLI Entry Point</h3>
        <pre>
          <code className="language-typescript">{`// src/cli.ts
import { createCli } from "${NPM_PREFIX}convex-cli";
import { api } from "../convex/_generated/api.js";

createCli({ api }).run();`}</code>
        </pre>

        <h3>3. Add NPM Script</h3>
        <pre>
          <code className="language-json">{`{
  "scripts": {
    "cli": "tsx --env-file=.env.local src/cli.ts"
  }
}`}</code>
        </pre>

        <h3>4. Test the CLI</h3>
        <pre>
          <code className="language-bash">{`# Generate Convex types (if not already done)
npx convex dev

# Test the CLI
npm run cli --help

# Try a command
npm run cli todos get-all`}</code>
        </pre>

        <h2>Usage Examples</h2>
        <p>
          The CLI automatically generates commands based on your Convex API
          structure:
        </p>
        <pre>
          <code className="language-bash">{`# List all todos
npm run cli todos get-all

# Create a new todo
npm run cli todos create --text "Buy groceries"

# Toggle todo completion
npm run cli todos toggle --id "j57..." --completed true

# Complex arguments with kebab-case conversion
npm run cli users create-user --first-name "John" --last-name "Doe"`}</code>
        </pre>
      </div>
    </ProjectLayout>
  );
}
