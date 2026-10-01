import { createRevalidateHooks } from '@/utilities/revalidateCollection'

const hooks = createRevalidateHooks('pages')

export const revalidatePage = hooks.afterChange
export const revalidatePageBeforeDelete = hooks.beforeDelete
export const revalidateDelete = hooks.afterDelete
