'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, SortAsc } from 'lucide-react';
import { FilterPopover } from './filter';
import { SortPopover } from './sort';
import { useGymEquipmentFilterStore } from '@/store/gym-equipment-filter-store';

export function HeaderOptions() {
  const { searchQuery, setSearchQuery, selectedCategories, selectedStatuses, selectedPriorities } =
    useGymEquipmentFilterStore();

  const filterCount = selectedCategories.length + selectedStatuses.length + selectedPriorities.length;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search equipment by name, manufacturer, or location..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <FilterPopover>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {filterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {filterCount}
            </span>
          )}
        </Button>
      </FilterPopover>
      <SortPopover>
        <Button variant="outline" size="sm" className="gap-2">
          <SortAsc className="h-4 w-4" />
          Sort
        </Button>
      </SortPopover>
    </div>
  );
}
