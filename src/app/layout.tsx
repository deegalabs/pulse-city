import type { Metadata } from "next";
import { Chakra_Petch, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

import type { Viewport } from "next";

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
      className={`${chakraPetch.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-dvh flex flex-col">{children}</body>
    </html>
  );
}
