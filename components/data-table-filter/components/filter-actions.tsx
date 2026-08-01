import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FilterXIcon } from 'lucide-react'
import { memo } from 'react'
import type { DataTableFilterActions } from '../core/types'
import { type Locale, t } from '../lib/i18n'

interface FilterActionsProps {
  hasFilters: boolean
  actions?: DataTableFilterActions
  locale?: Locale
}

export const FilterActions = memo(__FilterActions)
function __FilterActions({
  hasFilters,
  actions,
  locale = 'en',
}: FilterActionsProps) {
  return (
    <Button
      className={cn('h-7 !px-2', !hasFilters && 'hidden')}
      variant="destructive"
      onClick={actions?.removeAllFilters}
    >
      <FilterXIcon />
      <span className="hidden md:block">{t('clear', locale)}</span>
    </Button>
  )
}
