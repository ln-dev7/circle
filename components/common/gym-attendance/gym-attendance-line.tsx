'use client';

import { AttendanceRecord } from '@/mock-data/gym-attendance';
import { gymMembers } from '@/mock-data/gym-members';
import { gymClasses } from '@/mock-data/gym-classes';
import { trainers } from '@/mock-data/gym-trainers';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface GymAttendanceLineProps {
  record: AttendanceRecord;
}

const typeColors = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300',
  General: 'bg-gray-100 text-gray-800 border-gray-300',
  'Personal Training': 'bg-purple-100 text-purple-800 border-purple-300',
};

export function GymAttendanceLine({ record }: GymAttendanceLineProps) {
  const member = gymMembers.find((m) => m.id === record.memberId);
  const gymClass = record.classId ? gymClasses.find((c) => c.id === record.classId) : null;
  const trainer = record.trainerId ? trainers.find((t) => t.id === record.trainerId) : null;

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
        <span className="text-sm">{format(new Date(record.checkInDate), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm font-mono">{record.checkInTime}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm font-mono">{record.checkOutTime || '-'}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{record.duration ? `${record.duration} min` : '-'}</span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={typeColors[record.type]}>
          {record.type}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {gymClass && gymClass.name}
          {trainer && `PT with ${trainer.name}`}
          {!gymClass && !trainer && 'General Access'}
        </span>
      </TableCell>
    </TableRow>
  );
}
