'use client';

import { Trainer } from '@/mock-data/gym-trainers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Award } from 'lucide-react';
import { format } from 'date-fns';

interface GymTrainerCardProps {
  trainer: Trainer;
}

const statusColors = {
  Active: 'bg-green-100 text-green-800 border-green-300',
  'On Leave': 'bg-orange-100 text-orange-800 border-orange-300',
  'Part-time': 'bg-blue-100 text-blue-800 border-blue-300',
};

export function GymTrainerCard({ trainer }: GymTrainerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trainer.avatarUrl} alt={trainer.name} />
            <AvatarFallback>
              {trainer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{trainer.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{trainer.rating.toFixed(1)}</span>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[trainer.status]}>
            {trainer.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{trainer.bio}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {trainer.totalClients} active clients
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {trainer.certifications.length} certifications
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Specialties</div>
          <div className="flex flex-wrap gap-1.5">
            {trainer.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Hired {format(new Date(trainer.hireDate), 'MMM yyyy')}</span>
            <span>{trainer.availability.length} days/week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
