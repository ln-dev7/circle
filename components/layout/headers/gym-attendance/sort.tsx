'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGymAttendanceFilterStore, GymAttendanceSortOption } from '@/store/gym-attendance-filter-store';
import { cn } from '@/lib/utils';

interface SortPopoverProps {
  children: React.ReactNode;
}

const sortOptions: { value: GymAttendanceSortOption; label: string }[] = [
  { value: 'date-desc', label: 'Date (Newest First)' },
  { value: 'date-asc', label: 'Date (Oldest First)' },
  { value: 'member-asc', label: 'Member (A-Z)' },
  { value: 'member-desc', label: 'Member (Z-A)' },
];

export function SortPopover({ children }: SortPopoverProps) {
  const { sortBy, setSortBy } = useGymAttendanceFilterStore();

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
