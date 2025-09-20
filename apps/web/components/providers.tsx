"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { Toaster } from "@ras.sh/ui/components/sonner";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexBetterAuthProvider authClient={authClient} client={convex}>
      {children}
      <Toaster richColors />
    </ConvexBetterAuthProvider>
  );
}
