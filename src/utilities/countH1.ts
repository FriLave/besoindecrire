// Counts Lexical `heading` nodes with tag h1 anywhere in the given data (hero + every block).
export const countH1 = (data: unknown): number => {
  if (Array.isArray(data)) return data.reduce((n: number, v) => n + countH1(v), 0)
  if (!data || typeof data !== 'object') return 0
  const node = data as Record<string, unknown>
  const self = node.type === 'heading' && node.tag === 'h1' ? 1 : 0
  return self + Object.values(node).reduce((n: number, v) => n + countH1(v), 0)
}
