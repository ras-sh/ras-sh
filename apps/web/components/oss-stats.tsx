"use client";

import { useNpmDownloadCounter } from "@erquhart/convex-oss-stats/react";
import { api } from "@ras-sh/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Download, Star } from "lucide-react";

type OssStatsProps = {
  library: string;
};

export const OssStats = ({ library }: OssStatsProps) => {
  const stats = useQuery(api.ossStats.getStats, { library });

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
    <div className="flex items-center space-x-6 text-sm text-zinc-400">
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
