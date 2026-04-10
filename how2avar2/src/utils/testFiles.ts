import { glob } from "node:fs/promises";
import path from "node:path";
import sortOn from "sort-on";
import { match } from "ts-pattern";
import type { Status } from "@/components/StatusBadge";

type FileGroup = { htmls: string[]; pngs: string[]; mds: string[] };

export const testsDirectory = path.resolve("public/tests/static");

const fileGroupKey = (fileName: string): keyof FileGroup =>
  match(fileName)
    .returnType<keyof FileGroup>()
    .when(
      (fileName) => fileName.endsWith(".html"),
      () => "htmls",
    )
    .when(
      (fileName) => fileName.endsWith(".fail.md"),
      () => "mds",
    )
    .otherwise(() => "pngs");

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

const htmlSortKey = (name: string) =>
  match(name)
    .returnType<number>()
    .when(
      (n) => n.includes("mismatch"),
      () => 2,
    )
    .when(
      (n) => n.includes("expected"),
      () => 1,
    )
    .otherwise(() => 0);

export function sortHtmls(htmls: string[]): string[] {
  return sortOn(htmls, [htmlSortKey, (name: string) => name]);
}

export const screenshotStatusOf = (
  htmlName: string,
  failMdPath: string | null,
): Status =>
  match({ htmlName, failMdPath })
    .returnType<Status>()
    .when(
      ({ failMdPath }) => failMdPath !== null,
      () => "failed",
    )
    .when(
      ({ htmlName }) => htmlName.includes("expected-mismatch"),
      () => "expected-mismatch",
    )
    .when(
      ({ htmlName }) => htmlName.includes("expected"),
      () => "expected",
    )
    .otherwise(() => "passed");

