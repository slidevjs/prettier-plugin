import { SlideInfoBase } from "@slidev/types";

export const astFormat = "slidev-ast";

interface MarkdownNode {
  type: "markdown";
  raw: string;
  slides: SlideNode[];
}

interface SlideNode {
  type: "slide";
  info: SlideInfoBase;
}

export type ASTNode = MarkdownNode | SlideNode;
