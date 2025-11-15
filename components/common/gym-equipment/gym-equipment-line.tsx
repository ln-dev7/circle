'use client';

import { Equipment } from '@/mock-data/gym-equipment';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface GymEquipmentLineProps {
  equipment: Equipment;
}

const categoryColors = {
  Cardio: 'bg-orange-100 text-orange-800 border-orange-300',
  Strength: 'bg-purple-100 text-purple-800 border-purple-300',
  'Free Weights': 'bg-blue-100 text-blue-800 border-blue-300',
  Functional: 'bg-green-100 text-green-800 border-green-300',
  Stretching: 'bg-pink-100 text-pink-800 border-pink-300',
  'Group Fitness': 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

const statusColors = {
  Operational: 'bg-green-100 text-green-800 border-green-300',
  'Maintenance Required': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Under Repair': 'bg-orange-100 text-orange-800 border-orange-300',
  'Out of Service': 'bg-red-100 text-red-800 border-red-300',
};

const priorityColors = {
  Low: 'bg-gray-100 text-gray-800 border-gray-300',
  Medium: 'bg-blue-100 text-blue-800 border-blue-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Critical: 'bg-red-100 text-red-800 border-red-300',
};

export function GymEquipmentLine({ equipment }: GymEquipmentLineProps) {
  const isMaintenanceDue =
    new Date(equipment.nextMaintenance).getTime() - new Date().getTime() <
    7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{equipment.name}</span>
          <span className="text-xs text-muted-foreground">{equipment.model}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={categoryColors[equipment.category]}>
          {equipment.category}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{equipment.location}</span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[equipment.status]}>
          {equipment.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={priorityColors[equipment.maintenancePriority]}>
          {equipment.maintenancePriority}
        </Badge>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'text-sm',
            isMaintenanceDue && 'font-medium text-orange-600'
          )}
        >
          {format(new Date(equipment.nextMaintenance), 'MMM d, yyyy')}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{equipment.manufacturer}</span>
      </TableCell>
    </TableRow>
  );
}
