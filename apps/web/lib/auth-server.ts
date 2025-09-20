import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@ras.sh/backend/convex/auth";

export const getToken = () => {
  return getTokenNextjs(createAuth);
};
