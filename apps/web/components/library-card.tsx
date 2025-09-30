import type { Library } from "@ras-sh/backend/constants";
import { api } from "@ras-sh/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { OssStats } from "@/components/oss-stats";

type LibraryCardProps = {
  library: Library;
};

export async function LibraryCard({ library }: LibraryCardProps) {
  const preloadedStats = await preloadQuery(api.ossStats.getStats, {
    library: library.id,
  });

  const Component = library.comingSoon ? "div" : "a";
  const linkProps = library.comingSoon
    ? {}
    : {
        href: library.url,
        rel: "noopener noreferrer" as const,
        target: "_blank" as const,
      };

  return (
    <Component
      className={`group block rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-200 ${
        library.comingSoon
          ? "cursor-not-allowed opacity-60"
          : "hover:scale-103 hover:border-amber-400/30 hover:bg-amber-400/1"
      }`}
      {...linkProps}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3
              className={`font-bold text-lg text-zinc-100 transition-all duration-200 ${
                library.comingSoon ? "" : "group-hover:text-amber-400"
              }`}
            >
              {library.id}
            </h3>
            {library.comingSoon && (
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-sans text-xs text-zinc-400">
                Coming Soon
              </span>
            )}
          </div>

          <OssStats library={library.id} preloadedStats={preloadedStats} />
        </div>

        <p
          className={`mt-4 font-sans text-base text-zinc-300 leading-relaxed transition-all duration-200 ${
            library.comingSoon ? "" : "group-hover:text-zinc-200"
          }`}
        >
          {library.description}
        </p>
      </div>
    </Component>
  );
}
