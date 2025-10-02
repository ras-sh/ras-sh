import { OssStats } from "@erquhart/convex-oss-stats";
import { v } from "convex/values";
import { GITHUB_PREFIX, LIBRARIES, NPM_PREFIX, ORG } from "../lib/constants";
import { components } from "./_generated/api";
import { query } from "./_generated/server";

const githubRepos = LIBRARIES.map((library) => `${GITHUB_PREFIX}${library.id}`);
const npmPackages = LIBRARIES.filter((library) => library.hasNpmPackage).map(
  (library) => `${NPM_PREFIX}${library.id}`
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
    library: v.string(),
  },
  handler: async (ctx, args) => {
    let githubData: Awaited<ReturnType<typeof ossStats.getGithubRepo>> | null =
      null;
    let npmData: Awaited<ReturnType<typeof ossStats.getNpmPackage>> | null =
      null;

    try {
      githubData = await ossStats.getGithubRepo(
        ctx,
        `${GITHUB_PREFIX}${args.library}`
      );
    } catch {
      // Ignore error
    }

    const libraryConfig = LIBRARIES.find((lib) => lib.id === args.library);
    if (libraryConfig?.hasNpmPackage) {
      try {
        npmData = await ossStats.getNpmPackage(
          ctx,
          `${NPM_PREFIX}${args.library}`
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
