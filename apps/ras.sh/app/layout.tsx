import { cn } from "@ras-sh/ui/lib/utils";
import { DM_Mono, DM_Sans } from "next/font/google";
import "@ras-sh/ui/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

const fontMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ras.sh - Side Projects & Developer Tools",
    template: "%s | ras.sh",
  },
  description:
    "A collection of side projects, experiments, and tools built with modern technologies. Featuring convex-cli and other developer tools.",
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
  metadataBase: new URL("https://ras.sh"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ras.sh - Side Projects & Developer Tools",
    description:
      "A collection of side projects, experiments, and tools built with modern technologies. Featuring convex-cli and other developer tools.",
    url: "https://ras.sh",
    siteName: "ras.sh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ras.sh - Side Projects & Developer Tools",
    description:
      "A collection of side projects, experiments, and tools built with modern technologies.",
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
    title: "ras.sh",
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
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "dark min-h-dvh font-mono antialiased"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
