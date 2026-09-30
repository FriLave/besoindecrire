import React from 'react'

/** Shared layout helpers for the legal blocks (server components). */
export const LegalWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="container max-w-3xl space-y-8">{children}</div>
)

export const LegalSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    {children}
  </section>
)

/** Definition list; entries with an empty value are skipped. */
export const Facts = ({ items }: { items: [string, string | null | undefined][] }) => {
  const rows = items.filter(([, v]) => v)
  if (!rows.length) return null
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,14rem)_1fr]">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="font-medium">{k}</dt>
          <dd className="whitespace-pre-line">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

/** Draft/preview only: lists the facts still missing in site-settings. */
export const MissingWarning = ({ label, missing }: { label: string; missing: string[] }) =>
  missing.length ? (
    <p className="rounded-md border border-dashed border-destructive p-3 text-sm text-destructive">
      {label} {missing.join(', ')}
    </p>
  ) : null
