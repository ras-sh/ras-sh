import { cn } from "@ras.sh/ui/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";
import "@ras.sh/ui/globals.css";
import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
