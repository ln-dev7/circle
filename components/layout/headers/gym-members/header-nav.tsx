'use client';

import { Users } from 'lucide-react';
import { gymMembers } from '@/mock-data/gym-members';

export function HeaderNav() {
  const activeMembers = gymMembers.filter(
    (m) => m.membershipStatus === 'Active'
  ).length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Gym Members</h1>
          <p className="text-sm text-muted-foreground">
            {activeMembers} active members • {gymMembers.length} total
          </p>
        </div>
      </div>
    </div>
  );
}
