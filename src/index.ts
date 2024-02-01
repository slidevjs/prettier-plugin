import { Plugin } from "prettier";
import { astFormat } from "./ast";
import { parser } from "./parser";
import { printer } from "./printer";

export default {
  languages: [
    {
      name: "slidev",
      parsers: ["slidev"],
      extensions: [".md"],
      vscodeLanguageIds: ["markdown"],
    },
  ],
  parsers: {
    slidev: parser,
  },
  printers: {
    [astFormat]: printer,
  },
} as Plugin;
