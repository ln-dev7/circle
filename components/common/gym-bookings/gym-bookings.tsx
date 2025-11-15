'use client';

import { useMemo } from 'react';
import { bookings } from '@/mock-data/gym-bookings';
import { gymMembers } from '@/mock-data/gym-members';
import { gymClasses } from '@/mock-data/gym-classes';
import { useGymBookingsFilterStore } from '@/store/gym-bookings-filter-store';
import { GymBookingLine } from './gym-booking-line';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function GymBookings() {
  const { selectedStatuses, sortBy, searchQuery } = useGymBookingsFilterStore();

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings];

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((b) => selectedStatuses.includes(b.status));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((b) => {
        const member = gymMembers.find((m) => m.id === b.memberId);
        const gymClass = gymClasses.find((c) => c.id === b.classId);
        return (
          member?.name.toLowerCase().includes(query) ||
          gymClass?.name.toLowerCase().includes(query)
        );
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
        case 'date-desc':
          return new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
        case 'member-asc': {
          const memberA = gymMembers.find((m) => m.id === a.memberId);
          const memberB = gymMembers.find((m) => m.id === b.memberId);
          return (memberA?.name || '').localeCompare(memberB?.name || '');
        }
        case 'member-desc': {
          const memberA = gymMembers.find((m) => m.id === a.memberId);
          const memberB = gymMembers.find((m) => m.id === b.memberId);
          return (memberB?.name || '').localeCompare(memberA?.name || '');
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedStatuses, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-[180px]">Member</TableHead>
              <TableHead className="w-[200px]">Class</TableHead>
              <TableHead className="w-[120px]">Session Date</TableHead>
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Checked In</TableHead>
              <TableHead className="w-[120px]">Booked On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBookings.map((booking) => (
              <GymBookingLine key={booking.id} booking={booking} />
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedBookings.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
}
