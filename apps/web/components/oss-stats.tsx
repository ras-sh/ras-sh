"use client";

import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import type { api } from "@ras-sh/backend/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Download, Star } from "lucide-react";

type OssStatsProps = {
  library: string;
  preloadedStats: Preloaded<typeof api.ossStats.getStats>;
};

export const OssStats = ({ preloadedStats }: OssStatsProps) => {
  const stats = usePreloadedQuery(preloadedStats);

  // Use this hook to get a forecasted download count for an npm package or org
  const npmData = stats?.npm?.downloadCountUpdatedAt
    ? (stats.npm as {
        downloadCount: number;
        dayOfWeekAverages: number[];
        downloadCountUpdatedAt: number;
      })
    : null;
  const liveNpmDownloadCount = useNpmDownloadCounter(npmData);

  return (
    <div className="flex items-center space-x-6 text-sm text-zinc-400 transition-all duration-200 group-hover:text-zinc-300">
      <div className="flex items-center space-x-2">
        <Download className="size-4" />
        <span>{liveNpmDownloadCount.count || 0}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Star className="size-4" />
        <span>{stats?.github?.starCount || 0}</span>
      </div>
    </div>
  );
};
