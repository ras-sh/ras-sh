import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";

import { data } from "@/lib/data";

import "./globals.css";

const jetbrainsMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(data.url as string),
  title: {
    default: data.title,
    template: `%s | ${data.title}`,
  },
  description: data.description,
  openGraph: {
    title: data.title,
    description: data.description,
    url: "./",
    siteName: data.title,
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${data.url}/feed.xml`,
    },
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
  twitter: {
    title: data.title,
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${jetbrainsMono.variable} scroll-smooth`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="dark min-h-dvh font-mono text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
