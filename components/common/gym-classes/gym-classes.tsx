'use client';

import { useMemo } from 'react';
import { gymClasses } from '@/mock-data/gym-classes';
import { useGymClassesFilterStore } from '@/store/gym-classes-filter-store';
import { GymClassCard } from './gym-class-card';

export default function GymClasses() {
  const { selectedCategories, selectedDifficulties, sortBy, searchQuery } =
    useGymClassesFilterStore();

  const filteredAndSortedClasses = useMemo(() => {
    let filtered = [...gymClasses];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((cls) =>
        selectedCategories.includes(cls.category)
      );
    }

    // Filter by difficulty
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((cls) =>
        selectedDifficulties.includes(cls.difficulty)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(query) ||
          cls.description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'capacity-asc':
          return a.capacity - b.capacity;
        case 'capacity-desc':
          return b.capacity - a.capacity;
        case 'enrolled-asc':
          return a.enrolled - b.enrolled;
        case 'enrolled-desc':
          return b.enrolled - a.enrolled;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategories, selectedDifficulties, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedClasses.map((gymClass) => (
            <GymClassCard key={gymClass.id} gymClass={gymClass} />
          ))}
        </div>
        {filteredAndSortedClasses.length === 0 && (
          <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
            No classes found
          </div>
        )}
      </div>
    </div>
  );
}
