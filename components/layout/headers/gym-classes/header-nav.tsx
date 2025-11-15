'use client';

import { CalendarDays } from 'lucide-react';
import { gymClasses } from '@/mock-data/gym-classes';

export function HeaderNav() {
  const activeClasses = gymClasses.filter((c) => c.isActive).length;
  const totalEnrolled = gymClasses.reduce((sum, c) => sum + c.enrolled, 0);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Classes</h1>
          <p className="text-sm text-muted-foreground">
            {activeClasses} active classes • {totalEnrolled} enrolled members
          </p>
        </div>
      </div>
    </div>
  );
}
