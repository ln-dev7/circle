'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGymEquipmentFilterStore } from '@/store/gym-equipment-filter-store';
import { EquipmentCategory, EquipmentStatus, MaintenancePriority } from '@/mock-data/gym-equipment';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const categories: EquipmentCategory[] = ['Cardio', 'Strength', 'Free Weights', 'Functional', 'Stretching', 'Group Fitness'];
const statuses: EquipmentStatus[] = ['Operational', 'Maintenance Required', 'Under Repair', 'Out of Service'];
const priorities: MaintenancePriority[] = ['Low', 'Medium', 'High', 'Critical'];

export function FilterPopover({ children }: FilterPopoverProps) {
  const {
    selectedCategories,
    selectedStatuses,
    selectedPriorities,
    setSelectedCategories,
    setSelectedStatuses,
    setSelectedPriorities,
    resetFilters,
  } = useGymEquipmentFilterStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Equipment</h4>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-auto p-0 text-xs">
                Reset
              </Button>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Category</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => {
                        if (selectedCategories.includes(category)) {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category));
                        } else {
                          setSelectedCategories([...selectedCategories, category]);
                        }
                      }}
                    />
                    <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
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
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Priority</Label>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center gap-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => {
                        if (selectedPriorities.includes(priority)) {
                          setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
                        } else {
                          setSelectedPriorities([...selectedPriorities, priority]);
                        }
                      }}
                    />
                    <Label htmlFor={`priority-${priority}`} className="text-sm font-normal cursor-pointer">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
