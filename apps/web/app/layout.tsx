import { cn } from "@ras-sh/ui/lib/utils";
import { DM_Mono } from "next/font/google";
import "@ras-sh/ui/globals.css";
import { Providers } from "@/components/providers";

const fontMono = DM_Mono({
  weight: ["300", "400", "500"],
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
          fontMono.variable,
          "dark min-h-dvh font-mono antialiased"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
