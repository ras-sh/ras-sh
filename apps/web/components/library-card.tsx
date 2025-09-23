import { GITHUB_PREFIX } from "@ras-sh/backend/constants";
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
      className="group block rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-200 hover:scale-103 hover:border-amber-400/30 hover:bg-amber-400/1"
      href={`https://github.com/${GITHUB_PREFIX}${library.id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-lg text-zinc-100 transition-all duration-200 group-hover:text-amber-400">
            {library.id}
          </h3>

          <OssStats library={library.id} preloadedStats={preloadedStats} />
        </div>

        <p className="mt-4 font-sans text-base text-zinc-300 leading-relaxed transition-all duration-200 group-hover:text-zinc-200">
          {library.description}
        </p>
      </div>
    </a>
  );
}
