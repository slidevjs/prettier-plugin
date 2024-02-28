import type { SlideInfoBase } from '@slidev/types'
import type { Doc, Options, Printer } from 'prettier'
import { doc } from 'prettier'
import type { ASTNode } from './ast'

const { join, line, hardline } = doc.builders

export const printer: Printer<ASTNode> = {
  print(path, _options, print, _args) {
    const node = path.getNode()

    if (!node)
      throw new Error('Node is null')

    if (node.type === 'markdown') {
      return [
        '---',
        hardline,
        join([hardline, '---', hardline], path.map(print, 'slides')),
      ]
    }

    if (node.type === 'slide')
      return printSlideNoEmbed(node.info)

    throw new Error(`Unknown node type: ${node}`)
  },
  embed(path) {
    const node = path.getNode() as ASTNode

    if (node.type === 'slide')
      return textToDoc => printSlide(node.info, textToDoc)

    return null
  },
}

async function printSlide(
  info: SlideInfoBase,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  return [
    ...(await printFrontmatter(info, textToDoc)),
    ...(await printContent(info, textToDoc)),
    ...printNote(info),
  ]
}

async function printFrontmatter(
  info: SlideInfoBase,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  const trimed = info.frontmatterRaw?.trim() ?? ''
  if (trimed.length === 0)
    return []

  const formatted = await textToDoc(trimed, {
    parser: 'yaml',
  })
  return info.frontmatterStyle === 'yaml'
    ? [hardline, '```yaml', hardline, formatted, hardline, '```', hardline]
    : [formatted, hardline, '---', hardline]
}

async function printContent(
  info: SlideInfoBase,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  if (info.content.trim().length === 0)
    return []

  return [
    hardline,
    await textToDoc(info.content, {
      parser: 'markdown',
    }),
    hardline,
  ]
}

function printNote(info: SlideInfoBase): Doc[] {
  if (!info.note)
    return []
  return [hardline, '<!--', line, info.note.trim(), line, '-->', hardline]
}

function printSlideNoEmbed(info: SlideInfoBase): Doc[] {
  return [
    ...(printFrontmatterNoEmbed(info)),
    ...(printContentNoEmbed(info)),
    ...printNote(info),
  ]
}

function printFrontmatterNoEmbed(info: SlideInfoBase): Doc[] {
  const trimed = info.frontmatterRaw?.trim() ?? ''
  if (trimed.length === 0)
    return []

  return info.frontmatterStyle === 'yaml'
    ? [hardline, '```yaml', hardline, trimed, hardline, '```', hardline]
    : [trimed, hardline, '---', hardline]
}

function printContentNoEmbed(info: SlideInfoBase): Doc[] {
  if (info.content.trim().length === 0)
    return []

  return [
    hardline,
    info.content,
    hardline,
  ]
}
