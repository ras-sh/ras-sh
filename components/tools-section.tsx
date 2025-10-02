import { ToolCard } from "@/components/tool-card";
import { TOOLS } from "@/lib/constants";

export function ToolsSection() {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
