import { parse } from '@slidev/parser'
import type { Parser } from 'prettier'
import type { ASTNode } from './ast'
import { astFormat } from './ast'

export const parser: Parser<ASTNode> = {
  astFormat,
  locStart(node) {
    if (node.type !== 'markdown')
      throw new Error('not implemented')
    return 0
  },
  locEnd(node) {
    if (node.type !== 'markdown')
      throw new Error('not implemented')
    return node.raw.length
  },
  async parse(src) {
    const { slides, raw } = await parse(src)
    return {
      type: 'markdown',
      raw,
      slides: slides.map(info => ({
        type: 'slide',
        info,
      })),
    }
  },
}
