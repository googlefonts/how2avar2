import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown } from "@/utils/parseMarkdown";
import { testsDirectory } from "../utils/testFiles";

export async function FailMessage({ filePath }: { filePath: string }) {
  const text = await readFile(path.join(testsDirectory, filePath), "utf-8");
  const content = await parseMarkdown(text);
  return <div className="mt-1 text-sm">{content}</div>;
}
