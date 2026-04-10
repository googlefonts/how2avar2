import { glob } from "node:fs/promises";
import path from "node:path";
import sortOn from "sort-on";
import type { Status } from "@/components/StatusBadge";

type FileGroup = { htmls: string[]; pngs: string[]; mds: string[] };

export const testsDirectory = path.resolve("public/tests/static");

const fileGroupKey = (fileName: string): keyof FileGroup => {
  if (fileName.endsWith(".html")) return "htmls";
  if (fileName.endsWith(".fail.md")) return "mds";
  return "pngs";
};

export async function getTestGroups(): Promise<[string, FileGroup][]> {
  const files = await Array.fromAsync(
    glob("**/*.{html,png,fail.md}", { cwd: testsDirectory }),
  );
  const grouped = files.reduce<Record<string, FileGroup>>((acc, file) => {
    const [groupName, fileName] = file.split("/");
    acc[groupName] ??= { htmls: [], pngs: [], mds: [] };
    acc[groupName][fileGroupKey(fileName)].push(fileName);
    return acc;
  }, {});
  return sortOn(Object.entries(grouped), [([name]) => name]);
}

const htmlSortKey = (name: string): number => {
  if (name.includes("expected-mismatch")) return 2;
  if (name.includes("expected")) return 1;
  return 0;
};

export function sortHtmls(htmls: string[]): string[] {
  return sortOn(htmls, [htmlSortKey, (name: string) => name]);
}

const pngSortKey = (name: string): number => {
  if (name.includes("composited")) return 0;
  if (name.includes("expected-mismatch")) return 3;
  if (name.includes("expected")) return 2;
  return 1;
};

export function sortPngs(pngs: string[]): string[] {
  return sortOn(pngs, [pngSortKey, (name: string) => name]);
}

export const screenshotStatusOf = (
  pngName: string,
  failMdPath: string | null,
): Status => {
  if (failMdPath !== null) return "failed";
  if (pngName.includes("composited")) return "composited";
  if (pngName.includes("expected-mismatch")) return "expected-mismatch";
  if (pngName.includes("expected")) return "expected";
  return "passed";
};
