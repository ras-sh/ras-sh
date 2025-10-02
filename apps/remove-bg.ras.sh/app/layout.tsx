import { cn } from "@ras-sh/ui/lib/utils";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@ras-sh/ui/globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "remove-bg.ras.sh - In-browser AI background removal",
    template: "%s | remove-bg.ras.sh",
  },
  description:
    "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
  keywords: [
    "developer tools",
    "side projects",
    "CLI tools",
    "TypeScript",
    "React",
    "Next.js",
    "Convex",
    "open source",
  ],
  authors: [{ name: "Richard Solomou" }],
  creator: "Richard Solomou",
  publisher: "ras.sh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://remove-bg.ras.sh"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "remove-bg.ras.sh - In-browser AI background removal",
    description:
      "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
    url: "https://remove-bg.ras.sh",
    siteName: "remove-bg.ras.sh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "remove-bg.ras.sh - In-browser AI background removal",
    description:
      "AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads.",
    creator: "@richardsolomou",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "remove-bg.ras.sh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(geist.variable, "dark min-h-dvh font-mono antialiased")}
      >
        {children}
      </body>
    </html>
  );
}
