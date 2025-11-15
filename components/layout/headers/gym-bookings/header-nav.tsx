'use client';

import { Calendar } from 'lucide-react';
import { bookings } from '@/mock-data/gym-bookings';

export function HeaderNav() {
  const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter((b) => b.sessionDate === today).length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            {confirmed} confirmed • {todaysBookings} today
          </p>
        </div>
      </div>
    </div>
  );
}
