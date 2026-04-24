import type { Metadata, Viewport } from "next";
import { chakraPetch, dmSans, jetbrainsMono, spaceMono } from "./fonts";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "pulse.city — the city is playing",
  description:
    "A living soundtrack for Ipe Village 2026. Open. Autonomous. Collective.",
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark h-full", chakraPetch.variable, dmSans.variable, jetbrainsMono.variable, spaceMono.variable, geist.variable)}
    >
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
