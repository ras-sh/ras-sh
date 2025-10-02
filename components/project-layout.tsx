"use client";

import { SiGithub, SiNpm } from "@icons-pack/react-simple-icons";
import type { Preloaded } from "convex/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";
import type { ReactNode } from "react";
import { OssStats } from "@/components/oss-stats";
import type { api } from "@/convex/_generated/api";
import { GITHUB_PREFIX, NPM_PREFIX } from "@/lib/constants";

type ProjectLayoutProps = {
  name: string;
  description: string;
  path: string;
  hasNpmPackage?: boolean;
  preloadedStats?: Preloaded<typeof api.ossStats.getStats>;
  children?: ReactNode;
};

export function ProjectLayout({
  name,
  description,
  path,
  hasNpmPackage = false,
  preloadedStats,
  children,
}: ProjectLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 pt-20">
      <main className="mx-auto w-full max-w-4xl space-y-8">
        <div className="space-y-6">
          <Link
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            href="/"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>

          <div className="space-y-2">
            <h1 className="font-bold text-4xl text-zinc-100">{name}</h1>
            <p className="font-sans text-xl text-zinc-300 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-4">
            <a
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2 font-sans text-base text-zinc-300 transition-all duration-200 hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-zinc-100"
              href={`https://github.com/${GITHUB_PREFIX}ras-sh/tree/main/${path}`}
              onClick={() => {
                posthog.capture("github_link_clicked", {
                  project: name,
                  path,
                });
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <SiGithub className="size-4" />
              GitHub
            </a>
            {hasNpmPackage && (
              <a
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2 font-sans text-base text-zinc-300 transition-all duration-200 hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-zinc-100"
                href={`https://www.npmjs.com/package/${NPM_PREFIX}${name}`}
                onClick={() => {
                  posthog.capture("npm_link_clicked", {
                    project: name,
                  });
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                <SiNpm className="size-4" />
                npm
                {preloadedStats && (
                  <OssStats library={name} preloadedStats={preloadedStats} />
                )}
              </a>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
