import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { TopBar } from "@/components/top-bar";

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ras.sh - Side Projects & Developer Tools",
    template: "%s | ras.sh",
  },
  description:
    "A collection of side projects, experiments, and tools built with modern technologies.",
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
      "A collection of side projects, experiments, and tools built with modern technologies.",
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
        <Providers>
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
