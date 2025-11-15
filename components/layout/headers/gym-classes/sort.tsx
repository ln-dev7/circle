'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGymClassesFilterStore, GymClassesSortOption } from '@/store/gym-classes-filter-store';
import { cn } from '@/lib/utils';

interface SortPopoverProps {
  children: React.ReactNode;
}

const sortOptions: { value: GymClassesSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'capacity-asc', label: 'Capacity (Low to High)' },
  { value: 'capacity-desc', label: 'Capacity (High to Low)' },
  { value: 'enrolled-asc', label: 'Enrolled (Low to High)' },
  { value: 'enrolled-desc', label: 'Enrolled (High to Low)' },
];

export function SortPopover({ children }: SortPopoverProps) {
  const { sortBy, setSortBy } = useGymClassesFilterStore();

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
