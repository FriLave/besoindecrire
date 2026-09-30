import React from 'react'

export const BlockHeader: React.FC<{ heading?: string | null; intro?: string | null }> = ({
  heading,
  intro,
}) => {
  if (!heading && !intro) return null
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {heading && <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>}
      {intro && <p className="mt-4 text-lg opacity-80">{intro}</p>}
    </div>
  )
}
