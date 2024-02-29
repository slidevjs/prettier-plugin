import type { SlideInfoBase } from '@slidev/types'

export const astFormat = 'slidev-ast'

export interface MarkdownNode {
  type: 'markdown'
  raw: string
  slides: SlideNode[]
}

export interface SlideInfo extends SlideInfoBase {
  isFirstSlide: boolean
}

export interface SlideNode {
  type: 'slide'
  info: SlideInfo
}

export type ASTNode = MarkdownNode | SlideNode
