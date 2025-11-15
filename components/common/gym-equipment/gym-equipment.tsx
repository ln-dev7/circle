'use client';

import { useMemo } from 'react';
import { equipment } from '@/mock-data/gym-equipment';
import { useGymEquipmentFilterStore } from '@/store/gym-equipment-filter-store';
import { GymEquipmentLine } from './gym-equipment-line';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function GymEquipment() {
  const { selectedCategories, selectedStatuses, selectedPriorities, sortBy, searchQuery } =
    useGymEquipmentFilterStore();

  const filteredAndSortedEquipment = useMemo(() => {
    let filtered = [...equipment];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((eq) =>
        selectedCategories.includes(eq.category)
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((eq) =>
        selectedStatuses.includes(eq.status)
      );
    }

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((eq) =>
        selectedPriorities.includes(eq.maintenancePriority)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (eq) =>
          eq.name.toLowerCase().includes(query) ||
          eq.manufacturer.toLowerCase().includes(query) ||
          eq.location.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'purchase-asc':
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        case 'purchase-desc':
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
        case 'maintenance-asc':
          return new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime();
        case 'maintenance-desc':
          return new Date(b.nextMaintenance).getTime() - new Date(a.nextMaintenance).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategories, selectedStatuses, selectedPriorities, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-[200px]">Equipment</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[150px]">Location</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Next Maint.</TableHead>
              <TableHead className="w-[150px]">Manufacturer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEquipment.map((eq) => (
              <GymEquipmentLine key={eq.id} equipment={eq} />
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedEquipment.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No equipment found
          </div>
        )}
      </div>
    </div>
  );
}
