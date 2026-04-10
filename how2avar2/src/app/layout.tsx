"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./global.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import SearchDialog from "@/components/search";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              type: "static",
            },
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
