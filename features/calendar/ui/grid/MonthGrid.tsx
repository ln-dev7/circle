'use client';

import { useDrop } from 'react-dnd';
import {
   format,
   startOfMonth,
   endOfMonth,
   eachDayOfInterval,
   isToday,
   isSameDay,
   isSameMonth,
   startOfWeek,
   endOfWeek,
} from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { Schedule, Channel } from '../../types';

interface DropZoneProps {
   day: Date;
   onDrop: (day: Date) => (item: any) => void;
}

function DropZone({ day, onDrop }: DropZoneProps) {
   const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: 'DRAFT_CONTENT',
      drop: onDrop(day),
      collect: (monitor) => ({
         isOver: monitor.isOver(),
         canDrop: monitor.canDrop(),
      }),
   });

   return (
      <div
         ref={dropRef as any}
         className={`absolute inset-0 z-10 ${
            isOver && canDrop ? 'bg-blue-100 border-2 border-blue-400' : ''
         }`}
      />
   );
}

interface MonthGridProps {
   date: Date;
   schedules: Schedule[];
   onDrop: (contentId: string, channel: Channel, targetDate: Date, targetTime: string) => void;
   isLoading: boolean;
}

export function MonthGrid({ date, schedules, onDrop, isLoading }: MonthGridProps) {
   const monthStart = startOfMonth(date);
   const monthEnd = endOfMonth(date);
   const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
   const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

   const calendarDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
   });

   const handleDrop = (day: Date) => {
      return (item: any) => {
         // Default to 9 AM for month view drops
         const targetDate = new Date(day);
         targetDate.setHours(9, 0, 0, 0);
         const targetTime = '09:00';

         onDrop(item.contentId, item.channel, targetDate, targetTime);
      };
   };

   const getSchedulesForDay = (day: Date) => {
      return schedules.filter((schedule) => {
         return isSameDay(new Date(schedule.runAt), day);
      });
   };

   const isCurrentMonth = (day: Date) => {
      return isSameMonth(day, date);
   };

   if (isLoading) {
      return (
         <Card>
            <CardContent className="p-6">
               <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardContent className="p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="px-2 py-3 text-center">
                     <span className="text-sm font-medium text-gray-600">{day}</span>
                  </div>
               ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-200">
               {calendarDays.map((day) => {
                  const isCurrentDay = isToday(day);
                  const isInCurrentMonth = isCurrentMonth(day);
                  const daySchedules = getSchedulesForDay(day);

                  return (
                     <div
                        key={day.toISOString()}
                        className={`min-h-[120px] p-2 relative ${isCurrentDay ? 'bg-blue-50' : ''}`}
                     >
                        {/* Day number */}
                        <div
                           className={`text-sm font-medium mb-1 ${
                              isCurrentDay
                                 ? 'text-blue-600'
                                 : isInCurrentMonth
                                   ? 'text-gray-900'
                                   : 'text-gray-400'
                           }`}
                        >
                           {format(day, 'd')}
                           {isCurrentDay && (
                              <Badge variant="default" className="ml-1 text-xs">
                                 Today
                              </Badge>
                           )}
                        </div>

                        {/* Drop Zone */}
                        <DropZone day={day} onDrop={handleDrop} />

                        {/* Schedules for this day */}
                        <div className="space-y-1">
                           {daySchedules.slice(0, 3).map((schedule) => (
                              <div
                                 key={schedule.id}
                                 className="bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs"
                              >
                                 <div className="flex items-center space-x-1">
                                    <span className="text-lg">
                                       {schedule.channel === 'FACEBOOK'
                                          ? '📘'
                                          : schedule.channel === 'INSTAGRAM'
                                            ? '📷'
                                            : schedule.channel === 'TWITTER'
                                              ? '🐦'
                                              : schedule.channel === 'YOUTUBE'
                                                ? '📺'
                                                : schedule.channel === 'LINKEDIN'
                                                  ? '💼'
                                                  : schedule.channel === 'TIKTOK'
                                                    ? '🎵'
                                                    : '📝'}
                                    </span>
                                    <span className="font-medium truncate">
                                       {schedule.content?.title?.slice(0, 15) || 'Untitled'}
                                    </span>
                                 </div>
                                 <div className="text-gray-600 text-xs flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{format(new Date(schedule.runAt), 'HH:mm')}</span>
                                 </div>
                                 <div className="text-gray-600 text-xs">
                                    {schedule.campaign.name}
                                 </div>
                              </div>
                           ))}

                           {daySchedules.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                 +{daySchedules.length - 3} more
                              </div>
                           )}
                        </div>

                        {/* Drop hint for empty days */}
                        {daySchedules.length === 0 && isInCurrentMonth && (
                           <div className="text-xs text-gray-400 text-center mt-2">
                              Drop content here
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
