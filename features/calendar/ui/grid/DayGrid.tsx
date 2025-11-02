'use client';

import { useDrop } from 'react-dnd';
import { format, isToday, isSameDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import { Schedule, Channel } from '../../types';

interface DropZoneProps {
   hour: number;
   minute: number;
   onDrop: (hour: number, minute: number) => (item: any) => void;
}

function DropZone({ hour, minute, onDrop }: DropZoneProps) {
   const [{ isOver, canDrop }, dropRef] = useDrop({
      accept: 'DRAFT_CONTENT',
      drop: onDrop(hour, minute),
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

interface DayGridProps {
   date: Date;
   schedules: Schedule[];
   onDrop: (contentId: string, channel: Channel, targetDate: Date, targetTime: string) => void;
   isLoading: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayGrid({ date, schedules, onDrop, isLoading }: DayGridProps) {
   const isCurrentDay = isToday(date);

   const handleDrop = (hour: number, minute: number) => {
      return (item: any) => {
         const targetDate = new Date(date);
         targetDate.setHours(hour, minute, 0, 0);
         const targetTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

         onDrop(item.contentId, item.channel, targetDate, targetTime);
      };
   };

   const getSchedulesForHour = (hour: number) => {
      return schedules.filter((schedule) => {
         const scheduleHour = new Date(schedule.runAt).getHours();
         return scheduleHour === hour;
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
            <div className="grid grid-cols-1 divide-y divide-gray-200">
               {HOURS.map((hour) => {
                  const hourSchedules = getSchedulesForHour(hour);
                  const isCurrentHour = isCurrentDay && new Date().getHours() === hour;

                  return (
                     <div key={hour} className="min-h-[80px] relative">
                        {/* Hour Header */}
                        <div
                           className={`px-4 py-2 border-r border-gray-200 bg-gray-50 ${
                              isCurrentHour ? 'bg-blue-50 border-blue-200' : ''
                           }`}
                        >
                           <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-sm">{getTimeLabel(hour)}</span>
                              {isCurrentHour && (
                                 <Badge variant="default" className="text-xs">
                                    Now
                                 </Badge>
                              )}
                           </div>
                        </div>

                        {/* Hour Content */}
                        <div className="px-4 py-2">
                           {/* 15-minute slots */}
                           {[0, 15, 30, 45].map((minute) => {
                              const slotTime = new Date(date);
                              slotTime.setHours(hour, minute, 0, 0);
                              const isPast = slotTime < new Date();
                              const isCurrentSlot =
                                 isCurrentDay &&
                                 new Date().getHours() === hour &&
                                 Math.floor(new Date().getMinutes() / 15) * 15 === minute;

                              return (
                                 <div
                                    key={minute}
                                    className={`h-16 border-l-2 border-dashed ${
                                       isCurrentSlot
                                          ? 'border-blue-400 bg-blue-50'
                                          : isPast
                                            ? 'border-gray-300 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    } transition-colors relative`}
                                 >
                                    {/* Drop Zone */}
                                    <DropZone hour={hour} minute={minute} onDrop={handleDrop} />

                                    {/* Time Label */}
                                    <div className="absolute left-1 top-1 text-xs text-gray-500">
                                       {minute === 0 ? '' : `${minute.toString().padStart(2, '0')}`}
                                    </div>

                                    {/* Schedules in this slot */}
                                    {hourSchedules
                                       .filter((schedule) => {
                                          const scheduleMinute = new Date(
                                             schedule.runAt
                                          ).getMinutes();
                                          return Math.floor(scheduleMinute / 15) * 15 === minute;
                                       })
                                       .map((schedule) => (
                                          <div
                                             key={schedule.id}
                                             className="absolute right-2 top-1 left-8 bg-blue-100 border border-blue-200 rounded px-2 py-1 text-xs"
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
                                                   {schedule.content?.title || 'Untitled'}
                                                </span>
                                             </div>
                                             <div className="text-gray-600 text-xs">
                                                {schedule.campaign.name}
                                             </div>
                                          </div>
                                       ))}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
