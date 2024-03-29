import type { Doc, Options, Printer } from 'prettier'
import { doc } from 'prettier'
import type { ASTNode, SlideInfo } from './ast'

const { join, line, hardline } = doc.builders

export const printer: Printer<ASTNode> = {
  print(path, _options, print, _args) {
    const node = path.getNode()

    if (!node)
      throw new Error('Node is null')

    if (node.type === 'markdown')
      return join([hardline, '---', hardline], path.map(print, 'slides'))

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
  info: SlideInfo,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  return [
    ...(await printFrontmatter(info, textToDoc)),
    ...(await printContent(info, textToDoc)),
    ...printNote(info),
  ]
}

async function printFrontmatter(
  info: SlideInfo,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  const trimed = info.frontmatterRaw?.trim() ?? ''
  if (trimed.length === 0)
    return info.isFirstSlide ? [] : [hardline]

  const formatted = await textToDoc(trimed, {
    parser: 'yaml',
  })
  const end = info.content.trim() ? [hardline] : []

  return info.frontmatterStyle === 'yaml'
    ? [hardline, '```yaml', hardline, formatted, hardline, '```', hardline, end]
    : [info.isFirstSlide ? ['---', hardline] : [], formatted, hardline, '---', hardline, end]
}

async function printContent(
  info: SlideInfo,
  textToDoc: (text: string, options: Options) => Promise<Doc>,
): Promise<Doc[]> {
  if (info.content.trim().length === 0)
    return []

  return [
    await textToDoc(info.content, {
      parser: 'markdown',
    }),
    hardline,
  ]
}

function printNote(info: SlideInfo): Doc[] {
  if (!info.note)
    return []
  return [hardline, '<!--', line, info.note.trim(), line, '-->', hardline]
}

function printSlideNoEmbed(info: SlideInfo): Doc[] {
  return [
    ...(printFrontmatterNoEmbed(info)),
    ...(printContentNoEmbed(info)),
    ...printNote(info),
  ]
}

function printFrontmatterNoEmbed(info: SlideInfo): Doc[] {
  const trimed = info.frontmatterRaw?.trim() ?? ''
  if (trimed.length === 0)
    return info.isFirstSlide ? [] : [hardline]

  const end = info.content.trim() ? [hardline] : []

  return info.frontmatterStyle === 'yaml'
    ? [hardline, '```yaml', hardline, trimed, hardline, '```', hardline, end]
    : [info.isFirstSlide ? ['---', hardline] : [], trimed, hardline, '---', hardline, end]
}

function printContentNoEmbed(info: SlideInfo): Doc[] {
  if (info.content.trim().length === 0)
    return []

  return [
    info.content,
    hardline,
  ]
}
