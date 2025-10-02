"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { ReactNode } from "react";

type ToolCardLinkProps = {
  toolId: string;
  children: ReactNode;
};

export function ToolCardLink({ toolId, children }: ToolCardLinkProps) {
  return (
    <Link
      className="group block rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 transition-all duration-200 hover:scale-103 hover:border-amber-400/30 hover:bg-amber-400/1 sm:p-6"
      href={`/${toolId}`}
      onClick={() => {
        posthog.capture("tool_card_clicked", {
          tool: toolId,
        });
      }}
    >
      {children}
    </Link>
  );
}
