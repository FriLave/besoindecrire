import type { ButtonProps } from '@/components/ui/button'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { getUI } from '@/i18n/ui'
import { defaultLocale, type Locale } from '@/utilities/getLocalizedPath'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

/**
 * This primitive currently has no call site in the app (the blog/archive
 * feature it was scaffolded for is disabled by default - see CLAUDE.md
 * section 3). With nothing rendering it, there is no server component in
 * scope to thread a real `locale` down from, so it takes an optional
 * `locale` prop defaulting to `defaultLocale`: the smallest fix that keeps
 * it correct today and trivially wired up by whoever gives it a real call
 * site later.
 */

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    role="navigation"
    {...props}
  />
)

const PaginationContent: React.FC<
  { ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>
> = ({ className, ref, ...props }) => (
  <ul className={cn('flex flex-row items-center gap-1', className)} ref={ref} {...props} />
)

const PaginationItem: React.FC<
  { ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={cn('', className)} ref={ref} {...props} />

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'button'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? 'outline' : 'ghost',
      }),
      className,
    )}
    {...props}
  />
)

const PaginationPrevious = ({
  className,
  locale = defaultLocale,
  ...props
}: { locale?: Locale } & React.ComponentProps<typeof PaginationLink>) => {
  const ui = getUI(locale)
  return (
    <PaginationLink
      aria-label={ui.pagination.previous}
      className={cn('gap-1 pl-2.5', className)}
      size="default"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{ui.pagination.previous}</span>
    </PaginationLink>
  )
}

const PaginationNext = ({
  className,
  locale = defaultLocale,
  ...props
}: { locale?: Locale } & React.ComponentProps<typeof PaginationLink>) => {
  const ui = getUI(locale)
  return (
    <PaginationLink
      aria-label={ui.pagination.next}
      className={cn('gap-1 pr-2.5', className)}
      size="default"
      {...props}
    >
      <span>{ui.pagination.next}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
