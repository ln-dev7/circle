'use client';

import { UserCheck } from 'lucide-react';
import { trainers } from '@/mock-data/gym-trainers';

export function HeaderNav() {
  const activeTrainers = trainers.filter((t) => t.status === 'Active').length;
  const totalClients = trainers.reduce((sum, t) => sum + t.totalClients, 0);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <UserCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Trainers</h1>
          <p className="text-sm text-muted-foreground">
            {activeTrainers} active trainers • {totalClients} total clients
          </p>
        </div>
      </div>
    </div>
  );
}
