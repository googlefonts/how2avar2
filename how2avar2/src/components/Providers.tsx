"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search";

config.autoAddCss = false;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: { type: "static" },
        SearchDialog,
      }}
    >
      {children}
    </RootProvider>
  );
}
