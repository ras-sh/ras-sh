"use client";

import { Toaster } from "@ras-sh/ui/components/sonner";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
      <Toaster richColors />
    </ConvexProvider>
  );
}
