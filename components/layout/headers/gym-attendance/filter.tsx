'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGymAttendanceFilterStore } from '@/store/gym-attendance-filter-store';
import { CheckInType } from '@/mock-data/gym-attendance';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const types: CheckInType[] = ['Class', 'General', 'Personal Training'];

export function FilterPopover({ children }: FilterPopoverProps) {
  const { selectedTypes, setSelectedTypes, resetFilters } = useGymAttendanceFilterStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Attendance</h4>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-auto p-0 text-xs">
              Reset
            </Button>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm font-medium">Check-In Type</Label>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => {
                      if (selectedTypes.includes(type)) {
                        setSelectedTypes(selectedTypes.filter((t) => t !== type));
                      } else {
                        setSelectedTypes([...selectedTypes, type]);
                      }
                    }}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
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
