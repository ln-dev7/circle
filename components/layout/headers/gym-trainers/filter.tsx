'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGymTrainersFilterStore } from '@/store/gym-trainers-filter-store';
import { TrainerStatus, TrainerSpecialty } from '@/mock-data/gym-trainers';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const statuses: TrainerStatus[] = ['Active', 'On Leave', 'Part-time'];

const specialties: TrainerSpecialty[] = [
  'Personal Training',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Boxing',
  'Zumba',
  'Spinning',
  'Nutrition',
  'Sports Therapy',
];

export function FilterPopover({ children }: FilterPopoverProps) {
  const {
    selectedStatuses,
    selectedSpecialties,
    setSelectedStatuses,
    setSelectedSpecialties,
    resetFilters,
  } = useGymTrainersFilterStore();

  const handleStatusToggle = (status: TrainerStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleSpecialtyToggle = (specialty: TrainerSpecialty) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Trainers</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-auto p-0 text-xs"
            >
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
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Specialties</Label>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center gap-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <Label
                      htmlFor={`specialty-${specialty}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
