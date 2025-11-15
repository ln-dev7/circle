'use client';

import { Dumbbell } from 'lucide-react';
import { equipment } from '@/mock-data/gym-equipment';

export function HeaderNav() {
  const operational = equipment.filter((e) => e.status === 'Operational').length;
  const needsMaintenance = equipment.filter((e) =>
    e.status === 'Maintenance Required' || e.maintenancePriority === 'High' || e.maintenancePriority === 'Critical'
  ).length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Dumbbell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Equipment</h1>
          <p className="text-sm text-muted-foreground">
            {operational} operational • {needsMaintenance} need attention
          </p>
        </div>
      </div>
    </div>
  );
}
