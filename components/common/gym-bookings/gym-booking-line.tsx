'use client';

import { Booking } from '@/mock-data/gym-bookings';
import { gymMembers } from '@/mock-data/gym-members';
import { gymClasses } from '@/mock-data/gym-classes';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

interface GymBookingLineProps {
  booking: Booking;
}

const statusColors = {
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  Cancelled: 'bg-red-100 text-red-800 border-red-300',
  Completed: 'bg-green-100 text-green-800 border-green-300',
  'No-Show': 'bg-orange-100 text-orange-800 border-orange-300',
  Waitlist: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

export function GymBookingLine({ booking }: GymBookingLineProps) {
  const member = gymMembers.find((m) => m.id === booking.memberId);
  const gymClass = gymClasses.find((c) => c.id === booking.classId);

  return (
    <TableRow>
      <TableCell>
        {member && (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={member.avatarUrl} alt={member.name} />
              <AvatarFallback className="text-xs">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{member.name}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{gymClass?.name || 'Unknown'}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(booking.sessionDate), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{booking.sessionTime}</span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[booking.status]}>
          {booking.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {booking.checkedIn ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          {booking.checkedInTime && (
            <span className="text-xs text-muted-foreground">{booking.checkedInTime}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
        </span>
      </TableCell>
    </TableRow>
  );
}
