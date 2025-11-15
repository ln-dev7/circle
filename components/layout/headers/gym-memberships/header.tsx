'use client';

import { CreditCard } from 'lucide-react';
import { membershipPlans } from '@/mock-data/gym-memberships';

export default function Header() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Membership Plans</h1>
            <p className="text-sm text-muted-foreground">
              {membershipPlans.length} plans available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
