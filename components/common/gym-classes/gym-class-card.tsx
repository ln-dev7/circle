'use client';

import { GymClass } from '@/mock-data/gym-classes';
import { trainers } from '@/mock-data/gym-trainers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GymClassCardProps {
  gymClass: GymClass;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 border-green-300',
  Intermediate: 'bg-blue-100 text-blue-800 border-blue-300',
  Advanced: 'bg-red-100 text-red-800 border-red-300',
  'All Levels': 'bg-gray-100 text-gray-800 border-gray-300',
};

const categoryColors = {
  Cardio: 'bg-orange-100 text-orange-800 border-orange-300',
  Strength: 'bg-purple-100 text-purple-800 border-purple-300',
  Flexibility: 'bg-pink-100 text-pink-800 border-pink-300',
  'Mind-Body': 'bg-teal-100 text-teal-800 border-teal-300',
  Dance: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
  Combat: 'bg-red-100 text-red-800 border-red-300',
  'Group Fitness': 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

export function GymClassCard({ gymClass }: GymClassCardProps) {
  const trainer = trainers.find((t) => t.id === gymClass.trainerId);
  const enrollmentPercent = (gymClass.enrolled / gymClass.capacity) * 100;
  const isFull = gymClass.enrolled >= gymClass.capacity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-2">{gymClass.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className={cn('text-xs', categoryColors[gymClass.category])}
              >
                {gymClass.category}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', difficultyColors[gymClass.difficulty])}
              >
                {gymClass.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {gymClass.description}
        </p>

        {trainer && (
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
            <span className="text-sm text-muted-foreground">{trainer.name}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {gymClass.enrolled}/{gymClass.capacity}
              </span>
            </div>
            {isFull && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                Full
              </Badge>
            )}
          </div>
          <Progress value={enrollmentPercent} className="h-1.5" />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{gymClass.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{gymClass.schedule.length}x/week</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">${gymClass.price}</span>
            <span className="text-xs text-muted-foreground">per session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
