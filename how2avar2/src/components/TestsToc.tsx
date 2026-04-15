"use client";

import { useEffect, useState } from "react";
import { observe } from "react-intersection-observer";
import { cn } from "@/utils/cn";

export type TocGroup = {
  id: string;
  label: string;
  htmlNames: string[];
};

export function TestsToc({ groups }: { groups: TocGroup[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const cleanupFunctions = groups.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return () => {};
      return observe(
        element,
        (inView) => {
          if (inView) setActiveId(id);
        },
        { rootMargin: "-10% 0% -80% 0%" },
      );
    });
    return () =>
      cleanupFunctions.forEach((cleanupFunction) => cleanupFunction());
  }, [groups]);

  return (
    <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto pb-8 text-sm">
      <ul className="space-y-1">
        {groups.map(({ id, label, htmlNames }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "block truncate rounded px-2 py-1 transition-colors hover:text-fd-primary",
                activeId === id
                  ? "font-medium text-fd-primary"
                  : "text-fd-muted-foreground",
              )}
            >
              {label}
            </a>
            <ul className="ml-2 space-y-0.5">
              {htmlNames.map((name) => (
                <li key={name}>
                  <a
                    href={`#${id}-${name}`}
                    onClick={() => {
                      const details = document.getElementById(
                        `details-${id}-${name}`,
                      ) as HTMLDetailsElement | null;
                      if (details) details.open = true;
                    }}
                    className="block truncate rounded px-2 py-0.5 text-xs text-fd-muted-foreground hover:text-fd-primary"
                  >
                    {name.replace(/^avar2test-/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
