import type { Metadata } from "next";

// Self-hosted via @fontsource (npm-bundled font files) rather than
// next/font/google, which fetches from fonts.googleapis.com at build
// time — not reachable from every build environment (including this
// project's CI sandbox). Same typefaces, same weights, zero build-time
// network dependency.
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "ZAVÉA Command Center",
  description: "AI-powered operating system for ZAVÉA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
