'use client';

import { useMemo } from 'react';
import { trainers } from '@/mock-data/gym-trainers';
import { useGymTrainersFilterStore } from '@/store/gym-trainers-filter-store';
import { GymTrainerCard } from './gym-trainer-card';

export default function GymTrainers() {
  const { selectedStatuses, selectedSpecialties, sortBy, searchQuery } =
    useGymTrainersFilterStore();

  const filteredAndSortedTrainers = useMemo(() => {
    let filtered = [...trainers];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((trainer) =>
        selectedStatuses.includes(trainer.status)
      );
    }

    // Filter by specialty
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((trainer) =>
        trainer.specialties.some((s) => selectedSpecialties.includes(s))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trainer) =>
          trainer.name.toLowerCase().includes(query) ||
          trainer.email.toLowerCase().includes(query) ||
          trainer.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-asc':
          return a.rating - b.rating;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'clients-asc':
          return a.totalClients - b.totalClients;
        case 'clients-desc':
          return b.totalClients - a.totalClients;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedStatuses, selectedSpecialties, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedTrainers.map((trainer) => (
            <GymTrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
        {filteredAndSortedTrainers.length === 0 && (
          <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
            No trainers found
          </div>
        )}
      </div>
    </div>
  );
}
