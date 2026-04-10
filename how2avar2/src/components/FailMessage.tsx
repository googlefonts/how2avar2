import { parseMarkdown } from "@/utils/parseMarkdown";

export async function FailMessage({ filePath }: { filePath: string }) {
  const content = await parseMarkdown(filePath);
  return <p className="mt-1 text-sm">{content}</p>;
}
