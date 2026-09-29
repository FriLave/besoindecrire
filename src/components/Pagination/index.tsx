import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'
import React from 'react'

// Server Component: every page is a real <a href> (crawlable). Page 1 is the
// blog index itself, never `/page/1` (no duplicate URL).
export const Pagination: React.FC<{
  className?: string
  locale: Locale
  page: number
  totalPages: number
}> = (props) => {
  const { className, locale, page, totalPages } = props
  const blogPath = getLocalizedPath(locale, null, 'posts')
  const pageHref = (n: number) => (n <= 1 ? blogPath : `${blogPath}/page/${n}`)

  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious href={pageHref(page - 1)} locale={locale} />
            </PaginationItem>
          )}

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={pageHref(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={pageHref(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={pageHref(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasNextPage && (
            <PaginationItem>
              <PaginationNext href={pageHref(page + 1)} locale={locale} />
            </PaginationItem>
          )}
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
