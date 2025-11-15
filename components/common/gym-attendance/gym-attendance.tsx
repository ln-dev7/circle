'use client';

import { useMemo } from 'react';
import { attendanceRecords } from '@/mock-data/gym-attendance';
import { gymMembers } from '@/mock-data/gym-members';
import { useGymAttendanceFilterStore } from '@/store/gym-attendance-filter-store';
import { GymAttendanceLine } from './gym-attendance-line';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function GymAttendance() {
  const { selectedTypes, sortBy, searchQuery } = useGymAttendanceFilterStore();

  const filteredAndSortedAttendance = useMemo(() => {
    let filtered = [...attendanceRecords];

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((a) => selectedTypes.includes(a.type));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => {
        const member = gymMembers.find((m) => m.id === a.memberId);
        return member?.name.toLowerCase().includes(query);
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.checkInDate + ' ' + a.checkInTime).getTime() -
            new Date(b.checkInDate + ' ' + b.checkInTime).getTime();
        case 'date-desc':
          return new Date(b.checkInDate + ' ' + b.checkInTime).getTime() -
            new Date(a.checkInDate + ' ' + a.checkInTime).getTime();
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
  }, [selectedTypes, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-[180px]">Member</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[100px]">Check-In</TableHead>
              <TableHead className="w-[100px]">Check-Out</TableHead>
              <TableHead className="w-[100px]">Duration</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[200px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedAttendance.map((record) => (
              <GymAttendanceLine key={record.id} record={record} />
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedAttendance.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No attendance records found
          </div>
        )}
      </div>
    </div>
  );
}
