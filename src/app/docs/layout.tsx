import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-site/docs-shell";

export const metadata: Metadata = {
  title: "Docs — pulse.city",
  description:
    "Documentation for pulse.city — the code-driven music studio for Ipê Village 2026.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
