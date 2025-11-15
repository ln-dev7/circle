'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGymBookingsFilterStore } from '@/store/gym-bookings-filter-store';
import { BookingStatus } from '@/mock-data/gym-bookings';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const statuses: BookingStatus[] = ['Confirmed', 'Cancelled', 'Completed', 'No-Show', 'Waitlist'];

export function FilterPopover({ children }: FilterPopoverProps) {
  const { selectedStatuses, setSelectedStatuses, resetFilters } = useGymBookingsFilterStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Bookings</h4>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-auto p-0 text-xs">
              Reset
            </Button>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={() => {
                      if (selectedStatuses.includes(status)) {
                        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
                      } else {
                        setSelectedStatuses([...selectedStatuses, status]);
                      }
                    }}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
