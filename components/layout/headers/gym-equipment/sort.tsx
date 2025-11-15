'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGymEquipmentFilterStore, GymEquipmentSortOption } from '@/store/gym-equipment-filter-store';
import { cn } from '@/lib/utils';

interface SortPopoverProps {
  children: React.ReactNode;
}

const sortOptions: { value: GymEquipmentSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'purchase-asc', label: 'Purchase Date (Oldest)' },
  { value: 'purchase-desc', label: 'Purchase Date (Newest)' },
  { value: 'maintenance-asc', label: 'Next Maintenance (Soonest)' },
  { value: 'maintenance-desc', label: 'Next Maintenance (Latest)' },
];

export function SortPopover({ children }: SortPopoverProps) {
  const { sortBy, setSortBy } = useGymEquipmentFilterStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
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
