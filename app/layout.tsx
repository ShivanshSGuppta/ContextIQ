import type { Metadata } from "next";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

export const metadata: Metadata = {
  title: "ContextIQ",
  description:
    "Memory-native workspace for sales and customer-facing teams, powered by HydraDB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
