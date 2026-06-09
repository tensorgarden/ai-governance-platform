import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Governance Platform — Policy Enforcement & Usage Monitoring",
  description: "Portfolio demo: enterprise AI governance with policy enforcement, real-time usage monitoring, compliance reporting, and safety controls for responsible AI adoption."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
