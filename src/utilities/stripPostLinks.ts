type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => Boolean(v) && typeof v === 'object' && !Array.isArray(v)

// Lexical link node pointing at a post.
const isLexicalPostLink = (n: unknown): n is Obj & { children?: unknown[] } => {
  if (!isObj(n) || n.type !== 'link' || !isObj(n.fields)) return false
  const doc = n.fields.doc
  return n.fields.linkType === 'internal' && isObj(doc) && doc.relationTo === 'posts'
}

/**
 * Pure: neutralises every link to a post in `node`.
 * - CMS `link` groups (`type: 'reference'`, `reference.relationTo: 'posts'`)
 *   become destination-less custom links (`CMSLink` renders plain text).
 * - Lexical `link` nodes to a post are unwrapped: replaced by their own
 *   children in the parent's `children`, so the text stays.
 */
export function stripPostLinks<T>(node: T): T {
  if (Array.isArray(node)) {
    return node.flatMap((child) =>
      isLexicalPostLink(child)
        ? stripPostLinks<unknown[]>(child.children ?? [])
        : [stripPostLinks(child)],
    ) as T
  }
  if (isObj(node)) {
    const ref = node.reference as { relationTo?: string } | null | undefined
    const isPostLink = node.type === 'reference' && ref?.relationTo === 'posts'
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => [
        key,
        isPostLink && key === 'reference'
          ? null
          : isPostLink && key === 'type'
            ? 'custom'
            : stripPostLinks(value),
      ]),
    ) as T
  }
  return node
}
