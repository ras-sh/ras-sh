import { preloadQuery } from "convex/nextjs";
import Link from "next/link";
import { OssStats } from "@/components/oss-stats";
import { api } from "@/convex/_generated/api";
import type { Library } from "@/lib/constants";

type LibraryCardProps = {
  library: Library;
};

export async function LibraryCard({ library }: LibraryCardProps) {
  const preloadedStats = await preloadQuery(api.ossStats.getStats, {
    library: library.id,
  });

  return (
    <Link
      className="group block rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 transition-all duration-200 hover:scale-103 hover:border-amber-400/30 hover:bg-amber-400/1 sm:p-6"
      href={`/${library.id}`}
    >
      <div className="space-y-3 sm:space-y-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-bold text-base text-zinc-100 transition-all duration-200 sm:text-lg">
            {library.id}
          </h3>

          {library.hasNpmPackage && (
            <OssStats library={library.id} preloadedStats={preloadedStats} />
          )}
        </div>

        <p className="font-sans text-sm text-zinc-300 leading-relaxed transition-all duration-200 sm:text-base">
          {library.description}
        </p>
      </div>
    </Link>
  );
}
