import { preloadQuery } from "convex/nextjs";
import { OssStats } from "@/components/oss-stats";
import { ToolCardLink } from "@/components/tool-card-link";
import { api } from "@/convex/_generated/api";
import type { Tool } from "@/lib/constants";

type ToolCardProps = {
  tool: Tool;
};

export async function ToolCard({ tool }: ToolCardProps) {
  const preloadedStats = await preloadQuery(api.ossStats.getStats, {
    tool: tool.id,
  });

  return (
    <ToolCardLink toolId={tool.id}>
      <div className="space-y-3 sm:space-y-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-bold text-base text-zinc-100 transition-all duration-200 sm:text-lg">
            {tool.id}
          </h3>

          {tool.hasNpmPackage && (
            <OssStats library={tool.id} preloadedStats={preloadedStats} />
          )}
        </div>

        <p className="font-sans text-sm text-zinc-300 leading-relaxed transition-all duration-200 sm:text-base">
          {tool.description}
        </p>
      </div>
    </ToolCardLink>
  );
}
