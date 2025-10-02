import { OssStats } from "@erquhart/convex-oss-stats";
import { v } from "convex/values";
import { GITHUB_PREFIX, NPM_PREFIX, ORG, TOOLS } from "../lib/constants";
import { components } from "./_generated/api";
import { query } from "./_generated/server";

const githubRepos = TOOLS.map((tool) => `${GITHUB_PREFIX}${tool.id}`);
const npmPackages = TOOLS.filter((tool) => tool.hasNpmPackage).map(
  (tool) => `${NPM_PREFIX}${tool.id}`
);

export const ossStats = new OssStats(components.ossStats, {
  githubOwners: [ORG],
  npmOrgs: [ORG],
  githubRepos,
  npmPackages,
});

export const {
  sync,
  clearAndSync,
  getGithubOwner,
  getNpmOrg,
  getGithubRepo,
  getGithubRepos,
  getNpmPackage,
  getNpmPackages,
} = ossStats.api();

export const getStats = query({
  args: {
    tool: v.string(),
  },
  handler: async (ctx, args) => {
    let githubData: Awaited<ReturnType<typeof ossStats.getGithubRepo>> | null =
      null;
    let npmData: Awaited<ReturnType<typeof ossStats.getNpmPackage>> | null =
      null;

    try {
      githubData = await ossStats.getGithubRepo(
        ctx,
        `${GITHUB_PREFIX}${args.tool}`
      );
    } catch {
      // Ignore error
    }

    const toolConfig = TOOLS.find((tool) => tool.id === args.tool);
    if (toolConfig?.hasNpmPackage) {
      try {
        npmData = await ossStats.getNpmPackage(
          ctx,
          `${NPM_PREFIX}${args.tool}`
        );
      } catch {
        // Ignore error
      }
    }

    return {
      github: githubData,
      npm: npmData,
    };
  },
});
