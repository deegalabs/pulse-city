import type { Metadata, Viewport } from "next";
import { chakraPetch, dmSans, jetbrainsMono } from "./fonts";
import "./globals.css";

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
      className={`h-full ${chakraPetch.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="h-dvh flex flex-col">{children}</body>
    </html>
  );
}
