'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';
import { ScheduleContentModal } from './schedule-content-modal';
import 'react-day-picker/dist/style.css';

interface Schedule {
   id: string;
   date: string;
   status: string;
   campaign: {
      id: string;
      name: string;
   };
   content?: {
      id: string;
      title: string;
   };
}

interface ScheduleCalendarProps {
   orgId: string;
   onDateSelect?: (date: Date) => void;
   onScheduleCreate?: (date: Date) => void;
}

export function ScheduleCalendar({ orgId, onDateSelect, onScheduleCreate }: ScheduleCalendarProps) {
   const [schedules, setSchedules] = useState<Schedule[]>([]);
   const [selectedDate, setSelectedDate] = useState<Date>();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchSchedules();
   }, [orgId]);

   const fetchSchedules = async () => {
      try {
         const response = await fetch(`/api/${orgId}/schedules`);
         if (response.ok) {
            const data = await response.json();
            setSchedules(data);
         }
      } catch (error) {
         console.error('Error fetching schedules:', error);
      } finally {
         setLoading(false);
      }
   };

   const getScheduledDates = () => {
      return schedules.map((schedule) => new Date(schedule.date));
   };

   const getSchedulesForDate = (date: Date) => {
      return schedules.filter(
         (schedule) => format(new Date(schedule.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
   };

   const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date);
      if (date && onDateSelect) {
         onDateSelect(date);
      }
   };

   const handleScheduleCreated = () => {
      fetchSchedules(); // Refresh the schedules
   };

   const modifiers = {
      scheduled: getScheduledDates(),
   };

   const modifiersStyles = {
      scheduled: {
         backgroundColor: '#3b82f6',
         color: 'white',
         fontWeight: 'bold',
      },
   };

   if (loading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Calendar
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Calendar
               </CardTitle>
            </CardHeader>
            <CardContent>
               <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="w-full"
               />
               <div className="mt-4 flex justify-center">
                  <ScheduleContentModal
                     orgId={orgId}
                     trigger={
                        <Button disabled={!selectedDate} className="flex items-center gap-2">
                           <Plus className="h-4 w-4" />
                           Schedule Content
                        </Button>
                     }
                     onScheduleCreated={handleScheduleCreated}
                  />
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a Date'}
               </CardTitle>
            </CardHeader>
            <CardContent>
               {selectedDate ? (
                  <div className="space-y-3">
                     {getSchedulesForDate(selectedDate).length > 0 ? (
                        getSchedulesForDate(selectedDate).map((schedule) => (
                           <div key={schedule.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                 <Badge
                                    variant={
                                       schedule.status === 'published' ? 'default' : 'secondary'
                                    }
                                 >
                                    {schedule.status}
                                 </Badge>
                                 <span className="text-sm text-gray-500">
                                    {format(new Date(schedule.date), 'HH:mm')}
                                 </span>
                              </div>
                              <h4 className="font-medium">{schedule.campaign.name}</h4>
                              {schedule.content && (
                                 <p className="text-sm text-gray-600 mt-1">
                                    {schedule.content.title}
                                 </p>
                              )}
                           </div>
                        ))
                     ) : (
                        <p className="text-gray-500 text-center py-4">No schedules for this date</p>
                     )}
                  </div>
               ) : (
                  <p className="text-gray-500 text-center py-4">Select a date to view schedules</p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
