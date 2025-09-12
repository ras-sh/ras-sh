import { Copy, Database, Terminal } from 'lucide-react';

const CLI_TOOLS = [
  {
    name: 'create-convex-app',
    description: 'Scaffold a Convex app with opinionated defaults, auth choices, and frontend frameworks',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12">
      {/* Main Content */}
      <main className="space-y-16 max-w-lg mx-auto">
        {/* Terminal Icon and Title */}
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Terminal size={80} className="text-zinc-100" />
          </div>

          <h1 className="text-6xl font-bold tracking-tight text-zinc-100">ras.sh</h1>

          {/* <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Developer tools delivered as a single npm package. Install once, access everything.
          </p> */}
        </div>

        {/* Installation Command */}
        {/* <section className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="text-zinc-400 text-sm font-mono ml-2">terminal</div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-mono text-sm">$</span>
                  <code className="text-zinc-100 font-mono text-lg">npx ras.sh</code>
                  <button type="button" className="ml-auto text-zinc-400 hover:text-zinc-100 transition-colors">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* CLI Tools */}
        {/* <section className="space-y-8">
          <div className="flex justify-center">
            {CLI_TOOLS.map((tool, index) => (
              <div
                key={index}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6 hover:bg-zinc-900/50 transition-all duration-200 hover:border-zinc-700/50 max-w-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Database size={20} className="text-purple-400" />
                    <h3 className="text-lg font-bold text-zinc-100">{tool.name}</h3>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
}
