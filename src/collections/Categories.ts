import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { whenBlog } from '../access/blogEnabled'
import { editorOrAbove } from '../access/roles'
import { slugify } from '../utilities/slugify'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: whenBlog(editorOrAbove),
    delete: whenBlog(editorOrAbove),
    read: whenBlog(anyone),
    update: whenBlog(editorOrAbove),
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({
      localized: true,
      slugify,
      position: undefined,
    }),
  ],
}
