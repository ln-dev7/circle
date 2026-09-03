'use client';

import { InitiativeStatus } from '@/mock-data/initiatives';

/** Linear-style initiative status icon: dashed planned ring, partial active pie, check when completed, crossed circle when canceled. */
export function InitiativeStatusIcon({
   status,
   size = 14,
}: {
   status: InitiativeStatus;
   size?: number;
}) {
   if (status === 'planned') {
      return (
         <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
            <circle
               cx="8"
               cy="8"
               r="5.5"
               fill="none"
               stroke="#95a2b3"
               strokeWidth="1.6"
               strokeDasharray="2.4 2"
            />
         </svg>
      );
   }
   if (status === 'canceled') {
      return (
         <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="#95a2b3" />
            <path
               d="M5.6 5.6 10.4 10.4 M10.4 5.6 5.6 10.4"
               fill="none"
               stroke="white"
               strokeWidth="1.6"
               strokeLinecap="round"
            />
         </svg>
      );
   }
   if (status === 'completed') {
      return (
         <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="#5e6ad2" />
            <path
               d="M5 8.2 7.2 10.4 11 6.2"
               fill="none"
               stroke="white"
               strokeWidth="1.6"
               strokeLinecap="round"
               strokeLinejoin="round"
            />
         </svg>
      );
   }
   // active — yellow ring with a partial pie
   return (
      <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
         <circle cx="8" cy="8" r="5.5" fill="none" stroke="#f2c94c" strokeWidth="1.6" />
         <path d="M8 8 L8 3.6 A4.4 4.4 0 0 1 12.4 8 Z" fill="#f2c94c" />
      </svg>
   );
}
