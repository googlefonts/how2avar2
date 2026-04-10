import { readFile } from "node:fs/promises";
import production from "react/jsx-runtime";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeReact from "rehype-react";
import type { Schema } from "hast-util-sanitize";
import type { ReactNode } from "react";

export const inlineSchema: Schema = {
  ...defaultSchema,
  tagNames: ["ul", "li", "p", "a", "em", "strong", "code", "del", "br", "span"],
  attributes: {
    ...defaultSchema.attributes,
    a: ["href", "title"],
  },
};

export async function parseMarkdown(
  filePath: string,
  schema: Schema = inlineSchema,
): Promise<ReactNode> {
  const content = await readFile(filePath, "utf-8");
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeReact, production)
    .process(content);
  return file.result as ReactNode;
}
