'use client';

import { GymMember } from '@/mock-data/gym-members';
import { trainers } from '@/mock-data/gym-trainers';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface GymMemberLineProps {
  member: GymMember;
}

const tierColors = {
  Trial: 'bg-gray-100 text-gray-800 border-gray-300',
  Basic: 'bg-blue-100 text-blue-800 border-blue-300',
  Premium: 'bg-purple-100 text-purple-800 border-purple-300',
  VIP: 'bg-amber-100 text-amber-800 border-amber-300',
};

const statusColors = {
  Active: 'bg-green-100 text-green-800 border-green-300',
  Expired: 'bg-red-100 text-red-800 border-red-300',
  Suspended: 'bg-orange-100 text-orange-800 border-orange-300',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

export function GymMemberLine({ member }: GymMemberLineProps) {
  const trainer = member.assignedTrainerId
    ? trainers.find((t) => t.id === member.assignedTrainerId)
    : null;

  const isExpiringSoon =
    member.membershipStatus === 'Active' &&
    new Date(member.expiryDate).getTime() - new Date().getTime() <
      30 * 24 * 60 * 60 * 1000; // 30 days

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{member.name}</span>
            <span className="text-xs text-muted-foreground">{member.gender}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm">{member.email}</span>
          <span className="text-xs text-muted-foreground">{member.phone}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={tierColors[member.membershipTier]}>
          {member.membershipTier}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[member.membershipStatus]}>
          {member.membershipStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(member.joinedDate), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'text-sm',
            isExpiringSoon && 'font-medium text-orange-600'
          )}
        >
          {format(new Date(member.expiryDate), 'MMM d, yyyy')}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{member.age}</span>
      </TableCell>
      <TableCell>
        {trainer ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
              <AvatarFallback className="text-xs">
                {trainer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{trainer.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}
