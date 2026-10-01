import type { CollectionAfterReadHook } from 'payload'

import type { Post } from '@/payload-types'

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook<Post> = async ({ doc, req }) => {
  if (!doc?.authors?.length) return doc

  const ids = doc.authors.map((author) => (typeof author === 'object' ? author.id : author))
  const { docs } = await req.payload.find({
    collection: 'users',
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    pagination: false,
    select: { name: true },
    req,
  })

  // Keep the editor's author order.
  const byId = new Map(docs.map((u) => [u.id, u]))
  doc.populatedAuthors = ids.flatMap((id) => {
    const author = byId.get(id)
    return author ? [{ id: String(author.id), name: author.name }] : []
  })

  return doc
}
