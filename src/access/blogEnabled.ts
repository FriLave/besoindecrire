import type { Access } from 'payload'

import { whenFeature } from './featureEnabled'

export const whenBlog = (access: Access): Access => whenFeature('blog', access)
