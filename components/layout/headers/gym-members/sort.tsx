'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGymMembersFilterStore, GymMembersSortOption } from '@/store/gym-members-filter-store';
import { cn } from '@/lib/utils';

interface SortPopoverProps {
  children: React.ReactNode;
}

const sortOptions: { value: GymMembersSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'joined-asc', label: 'Joined Date (Oldest)' },
  { value: 'joined-desc', label: 'Joined Date (Newest)' },
  { value: 'expiry-asc', label: 'Expiry Date (Soonest)' },
  { value: 'expiry-desc', label: 'Expiry Date (Latest)' },
];

export function SortPopover({ children }: SortPopoverProps) {
  const { sortBy, setSortBy } = useGymMembersFilterStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-3">
          <h4 className="font-medium">Sort By</h4>
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                  sortBy === option.value && 'bg-accent font-medium'
                )}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
