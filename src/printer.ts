import { SlideInfoBase } from "@slidev/types";
import YAML from "js-yaml";
import type { Doc, Options, Printer } from "prettier";
import { ASTNode } from "./ast";

import { doc } from "prettier";

const { join, line, hardline } = doc.builders;

export const printer: Printer<ASTNode> = {
  print(path, _options, print, _args) {
    const node = path.getNode();

    if (!node) {
      throw new Error("Node is null");
    }

    if (node.type === "markdown") {
      return [
        "---",
        hardline,
        join([hardline, "---", hardline], path.map(print, "slides")),
      ];
    }

    throw new Error(`Unknown node type: ${node.type}`);
  },
  embed(path) {
    const node = path.getNode() as ASTNode;

    if (node.type === "slide") {
      return async (textToDoc) => {
        return [
          ...(await printFrontmatter(node.info, textToDoc)),
          ...(await printContent(node.info, textToDoc)),
          ...printNote(node.info),
        ];
      };
    }
    return null;
  },
};

async function printFrontmatter(
  info: SlideInfoBase,
  textToDoc: (text: string, options: Options) => Promise<Doc>
): Promise<Doc[]> {
  const trimed = info.frontmatterRaw?.trim() ?? "";
  if (trimed.length === 0) return [];

  const formatted = await textToDoc(trimed, {
    parser: "yaml",
  });
  return info.frontmatterStyle === "yaml"
    ? [hardline, "```yaml", hardline, formatted, hardline, "```", hardline]
    : [formatted, hardline, "---", hardline];
}

async function printContent(
  info: SlideInfoBase,
  textToDoc: (text: string, options: Options) => Promise<Doc>
): Promise<Doc[]> {
  if (info.content.trim().length === 0) return [];

  return [
    hardline,
    await textToDoc(info.content, {
      parser: "markdown",
    }),
    hardline,
  ];
}

function printNote(info: SlideInfoBase): Doc[] {
  if (!info.note) return [];
  return [hardline, "<!--", line, info.note.trim(), line, "-->", hardline];
}
