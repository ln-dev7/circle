'use client';

import { ClipboardCheck } from 'lucide-react';
import { attendanceRecords } from '@/mock-data/gym-attendance';

export function HeaderNav() {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter((a) => a.checkInDate === today).length;
  const totalRecords = attendanceRecords.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ClipboardCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {todayRecords} check-ins today • {totalRecords} total records
          </p>
        </div>
      </div>
    </div>
  );
}
