type Node = { children?: Node[]; text?: string }

/** Lexical editor state -> plain text (paragraphs separated by a space). For JSON-LD. */
export const lexicalToText = (state: unknown): string => {
  const walk = (n: Node): string =>
    n.text ?? (n.children ?? []).map(walk).join(n.children?.[0]?.children ? ' ' : '')
  return walk((state as { root?: Node } | null)?.root ?? {}).trim()
}
