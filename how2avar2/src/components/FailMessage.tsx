import { parseMarkdown } from "@/utils/parseMarkdown";

export async function FailMessage({ filePath }: { filePath: string }) {
  const content = await parseMarkdown(filePath);
  return <div className="mt-1 text-sm">{content}</div>;
}
