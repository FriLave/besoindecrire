/**
 * Minimal builders for the Lexical rich-text JSON that Payload's seed data
 * stores in `richText`/`confirmationMessage`/`introContent` fields.
 *
 * Payload's generated types for these fields are intentionally loose past
 * the root node (`children` is typed as `{ type: any; version: number;
 * [k: string]: unknown }[]`), so these small, precisely-typed node shapes
 * are enough to satisfy them - no `any` needed.
 *
 * Purpose: seeding two locales means every page/form needs its rich text
 * built twice (fr/en) with the same structure and different words. Rather
 * than duplicating ~500 lines of nested Lexical JSON per locale, seed data
 * modules call these builders with locale-specific strings - the tree
 * shape lives here once, the copy lives in a per-locale dictionary next to
 * each seed module.
 */

export type TextNode = {
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  type: 'text'
  version: number
}

export type LinkNode = {
  children: TextNode[]
  direction: 'ltr'
  fields: {
    linkType: 'custom'
    newTab: boolean
    url: string
  }
  format: ''
  indent: number
  type: 'link'
  version: number
}

export type InlineNode = LinkNode | TextNode

export type HeadingNode = {
  children: TextNode[]
  direction: 'ltr'
  format: ''
  indent: number
  tag: 'h1' | 'h2' | 'h3' | 'h4'
  type: 'heading'
  version: number
}

export type ParagraphNode = {
  children: InlineNode[]
  direction: 'ltr'
  format: ''
  indent: number
  textFormat: number
  type: 'paragraph'
  version: number
}

export type BlockNode = HeadingNode | ParagraphNode

export type RichTextRoot = {
  root: {
    children: BlockNode[]
    direction: 'ltr'
    format: ''
    indent: number
    type: 'root'
    version: number
  }
}

export const text = (value: string): TextNode => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  type: 'text',
  version: 1,
})

export const link = (value: string, url: string, newTab = false): LinkNode => ({
  children: [text(value)],
  direction: 'ltr',
  fields: {
    linkType: 'custom',
    newTab,
    url,
  },
  format: '',
  indent: 0,
  type: 'link',
  version: 2,
})

export const heading = (tag: HeadingNode['tag'], value: string): HeadingNode => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  type: 'heading',
  version: 1,
})

export const paragraph = (children: InlineNode[]): ParagraphNode => ({
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
})

export const richText = (children: BlockNode[]): RichTextRoot => ({
  root: {
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})
