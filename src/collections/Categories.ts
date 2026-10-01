import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { whenBlog } from '../access/blogEnabled'
import { editorOrAbove } from '../access/roles'
import { slugify } from '../utilities/slugify'
import { slugField } from 'payload'
import { groups } from '../utilities/adminGroups'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: whenBlog(editorOrAbove),
    delete: whenBlog(editorOrAbove),
    read: whenBlog(anyone),
    update: whenBlog(editorOrAbove),
  },
  admin: {
    group: groups.content,
    useAsTitle: 'title',
  },
  labels: {
    singular: { en: 'Category', fr: 'Catégorie' },
    plural: { en: 'Categories', fr: 'Catégories' },
  },
  fields: [
    {
      name: 'title',
      label: { en: 'Title', fr: 'Titre' },
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
