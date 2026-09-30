/** Server component: renders one schema.org JSON-LD block. */
export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    type="application/ld+json"
  />
)
