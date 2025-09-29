'use client';

import { useDrop } from 'react-dnd';
import {
   format,
   startOfWeek,
   endOfWeek,
   eachDayOfInterval,
   isToday,
   isSameDay,
   addDays,
} from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { Schedule, Channel } from '../../types';

interface DropZoneProps {
   day: Date;
   hour: number;
   minute: number;
   onDrop: (day: Date, hour: number, minute: number) => (item: any) => void;
}

function DropZone({ day, hour, minute, onDrop }: DropZoneProps) {
   const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: 'DRAFT_CONTENT',
      drop: onDrop(day, hour, minute),
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

interface WeekGridProps {
   date: Date;
   schedules: Schedule[];
   onDrop: (contentId: string, channel: Channel, targetDate: Date, targetTime: string) => void;
   isLoading: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekGrid({ date, schedules, onDrop, isLoading }: WeekGridProps) {
   const weekStart = startOfWeek(date, { weekStartsOn: 1 });
   const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(date, { weekStartsOn: 1 }),
   });

   const handleDrop = (day: Date, hour: number, minute: number) => {
      return (item: any) => {
         const targetDate = new Date(day);
         targetDate.setHours(hour, minute, 0, 0);
         const targetTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

         onDrop(item.contentId, item.channel, targetDate, targetTime);
      };
   };

   const getSchedulesForDayAndHour = (day: Date, hour: number) => {
      return schedules.filter((schedule) => {
         const scheduleDate = new Date(schedule.runAt);
         return isSameDay(scheduleDate, day) && scheduleDate.getHours() === hour;
      });
   };

   const getTimeLabel = (hour: number) => {
      if (hour === 0) return '12 AM';
      if (hour === 12) return '12 PM';
      if (hour < 12) return `${hour} AM`;
      return `${hour - 12} PM`;
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
            <div className="grid grid-cols-8 divide-x divide-gray-200">
               {/* Time column */}
               <div className="bg-gray-50">
                  <div className="h-16 border-b border-gray-200 flex items-center justify-center">
                     <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  {HOURS.map((hour) => (
                     <div key={hour} className="h-16 border-b border-gray-200 px-2 py-1">
                        <div className="text-xs font-medium text-gray-600">
                           {getTimeLabel(hour)}
                        </div>
                     </div>
                  ))}
               </div>

               {/* Day columns */}
               {weekDays.map((day) => {
                  const isCurrentDay = isToday(day);

                  return (
                     <div key={day.toISOString()} className="min-w-0">
                        {/* Day header */}
                        <div
                           className={`h-16 border-b border-gray-200 px-2 py-1 flex flex-col items-center justify-center ${
                              isCurrentDay ? 'bg-blue-50' : 'bg-gray-50'
                           }`}
                        >
                           <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                           <div
                              className={`text-lg font-bold ${
                                 isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                              }`}
                           >
                              {format(day, 'd')}
                           </div>
                           {isCurrentDay && (
                              <Badge variant="default" className="text-xs mt-1">
                                 Today
                              </Badge>
                           )}
                        </div>

                        {/* Hour rows */}
                        {HOURS.map((hour) => {
                           const hourSchedules = getSchedulesForDayAndHour(day, hour);
                           const isCurrentHour = isCurrentDay && new Date().getHours() === hour;

                           return (
                              <div key={hour} className="h-16 border-b border-gray-200 relative">
                                 {/* 15-minute slots */}
                                 {[0, 15, 30, 45].map((minute) => {
                                    const slotTime = new Date(day);
                                    slotTime.setHours(hour, minute, 0, 0);
                                    const isPast = slotTime < new Date();
                                    const isCurrentSlot =
                                       isCurrentDay &&
                                       new Date().getHours() === hour &&
                                       Math.floor(new Date().getMinutes() / 15) * 15 === minute;

                                    return (
                                       <div
                                          key={minute}
                                          className={`h-4 border-l border-dashed ${
                                             isCurrentSlot
                                                ? 'border-blue-400 bg-blue-50'
                                                : isPast
                                                  ? 'border-gray-300 bg-gray-50'
                                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                          } transition-colors relative`}
                                       >
                                          {/* Drop Zone */}
                                          <DropZone
                                             day={day}
                                             hour={hour}
                                             minute={minute}
                                             onDrop={handleDrop}
                                          />

                                          {/* Schedules in this slot */}
                                          {hourSchedules
                                             .filter((schedule) => {
                                                const scheduleMinute = new Date(
                                                   schedule.runAt
                                                ).getMinutes();
                                                return (
                                                   Math.floor(scheduleMinute / 15) * 15 === minute
                                                );
                                             })
                                             .map((schedule) => (
                                                <div
                                                   key={schedule.id}
                                                   className="absolute inset-0 bg-blue-100 border border-blue-200 rounded text-xs overflow-hidden"
                                                >
                                                   <div className="px-1 py-0.5">
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
                                                                     : schedule.channel ===
                                                                         'LINKEDIN'
                                                                       ? '💼'
                                                                       : schedule.channel ===
                                                                           'TIKTOK'
                                                                         ? '🎵'
                                                                         : '📝'}
                                                         </span>
                                                         <span className="font-medium truncate text-xs">
                                                            {schedule.content?.title?.slice(
                                                               0,
                                                               10
                                                            ) || 'Untitled'}
                                                         </span>
                                                      </div>
                                                   </div>
                                                </div>
                                             ))}
                                       </div>
                                    );
                                 })}
                              </div>
                           );
                        })}
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
