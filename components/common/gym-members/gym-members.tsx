'use client';

import { useMemo } from 'react';
import { gymMembers } from '@/mock-data/gym-members';
import { useGymMembersFilterStore } from '@/store/gym-members-filter-store';
import { GymMemberLine } from './gym-member-line';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function GymMembers() {
  const { selectedTiers, selectedStatuses, sortBy, searchQuery } =
    useGymMembersFilterStore();

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = [...gymMembers];

    // Filter by membership tier
    if (selectedTiers.length > 0) {
      filtered = filtered.filter((member) =>
        selectedTiers.includes(member.membershipTier)
      );
    }

    // Filter by membership status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((member) =>
        selectedStatuses.includes(member.membershipStatus)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.phone.includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'joined-asc':
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        case 'joined-desc':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'expiry-asc':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case 'expiry-desc':
          return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedTiers, selectedStatuses, sortBy, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-[250px]">Member</TableHead>
              <TableHead className="w-[200px]">Contact</TableHead>
              <TableHead className="w-[120px]">Tier</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Joined</TableHead>
              <TableHead className="w-[120px]">Expires</TableHead>
              <TableHead className="w-[80px]">Age</TableHead>
              <TableHead className="w-[150px]">Trainer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedMembers.map((member) => (
              <GymMemberLine key={member.id} member={member} />
            ))}
          </TableBody>
        </Table>
        {filteredAndSortedMembers.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No members found
          </div>
        )}
      </div>
    </div>
  );
}
