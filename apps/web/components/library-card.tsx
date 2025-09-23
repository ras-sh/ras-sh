import { GITHUB_PREFIX, NPM_PREFIX } from "@ras-sh/backend/constants";
import { api } from "@ras-sh/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { OssStats } from "@/components/oss-stats";

type Library = {
  id: string;
  description: string;
};

type LibraryCardProps = {
  library: Library;
};

export async function LibraryCard({ library }: LibraryCardProps) {
  const preloadedStats = await preloadQuery(api.ossStats.getStats, {
    library: library.id,
  });

  return (
    <a
      className="block max-w-md rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-200 hover:border-zinc-700/50 hover:bg-zinc-900/50"
      href={`https://github.com/${GITHUB_PREFIX}${library.id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <OssStats library={library.id} preloadedStats={preloadedStats} />
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="font-bold text-lg text-zinc-100">
            {NPM_PREFIX}
            {library.id}
          </h3>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {library.description}
        </p>
      </div>
    </a>
  );
}
