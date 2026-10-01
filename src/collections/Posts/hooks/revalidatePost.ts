import { createRevalidateHooks } from '@/utilities/revalidateCollection'

const hooks = createRevalidateHooks('posts')

export const revalidatePost = hooks.afterChange
export const revalidatePostBeforeDelete = hooks.beforeDelete
export const revalidateDelete = hooks.afterDelete
