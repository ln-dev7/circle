'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Globe, AlertCircle } from 'lucide-react';
import { Channel } from '../types';

interface ScheduleSheetProps {
   isOpen: boolean;
   onClose: () => void;
   contentId: string;
   channel: Channel;
   onSubmit: (data: { contentId: string; channel: Channel; runAt: Date; timezone: string }) => void;
}

const TIMEZONES = [
   { value: 'America/New_York', label: 'Eastern Time (ET)' },
   { value: 'America/Chicago', label: 'Central Time (CT)' },
   { value: 'America/Denver', label: 'Mountain Time (MT)' },
   { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
   { value: 'Europe/London', label: 'London (GMT)' },
   { value: 'Europe/Paris', label: 'Paris (CET)' },
   { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
   { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
   { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

const TIME_SLOTS = [
   '00:00',
   '00:15',
   '00:30',
   '00:45',
   '01:00',
   '01:15',
   '01:30',
   '01:45',
   '02:00',
   '02:15',
   '02:30',
   '02:45',
   '03:00',
   '03:15',
   '03:30',
   '03:45',
   '04:00',
   '04:15',
   '04:30',
   '04:45',
   '05:00',
   '05:15',
   '05:30',
   '05:45',
   '06:00',
   '06:15',
   '06:30',
   '06:45',
   '07:00',
   '07:15',
   '07:30',
   '07:45',
   '08:00',
   '08:15',
   '08:30',
   '08:45',
   '09:00',
   '09:15',
   '09:30',
   '09:45',
   '10:00',
   '10:15',
   '10:30',
   '10:45',
   '11:00',
   '11:15',
   '11:30',
   '11:45',
   '12:00',
   '12:15',
   '12:30',
   '12:45',
   '13:00',
   '13:15',
   '13:30',
   '13:45',
   '14:00',
   '14:15',
   '14:30',
   '14:45',
   '15:00',
   '15:15',
   '15:30',
   '15:45',
   '16:00',
   '16:15',
   '16:30',
   '16:45',
   '17:00',
   '17:15',
   '17:30',
   '17:45',
   '18:00',
   '18:15',
   '18:30',
   '18:45',
   '19:00',
   '19:15',
   '19:30',
   '19:45',
   '20:00',
   '20:15',
   '20:30',
   '20:45',
   '21:00',
   '21:15',
   '21:30',
   '21:45',
   '22:00',
   '22:15',
   '22:30',
   '22:45',
   '23:00',
   '23:15',
   '23:30',
   '23:45',
];

export function ScheduleSheet({
   isOpen,
   onClose,
   contentId,
   channel,
   onSubmit,
}: ScheduleSheetProps) {
   const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
   const [selectedTime, setSelectedTime] = useState('09:00');
   const [selectedChannel, setSelectedChannel] = useState<Channel>(channel);
   const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async () => {
      if (!selectedDate || !selectedTime || !selectedChannel || !selectedTimezone) {
         return;
      }

      setIsSubmitting(true);

      try {
         // Combine date and time
         const dateTimeString = `${selectedDate}T${selectedTime}`;
         const runAt = new Date(dateTimeString);

         // Check if the selected time is in the past
         if (runAt < new Date()) {
            alert('Cannot schedule content in the past. Please select a future time.');
            setIsSubmitting(false);
            return;
         }

         await onSubmit({
            contentId,
            channel: selectedChannel,
            runAt,
            timezone: selectedTimezone,
         });

         onClose();
      } catch (error) {
         console.error('Error creating schedule:', error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const getChannelIcon = (ch: Channel) => {
      switch (ch) {
         case 'FACEBOOK':
            return '📘';
         case 'INSTAGRAM':
            return '📷';
         case 'TWITTER':
            return '🐦';
         case 'YOUTUBE':
            return '📺';
         case 'LINKEDIN':
            return '💼';
         case 'TIKTOK':
            return '🎵';
         case 'BLOG':
            return '📝';
         default:
            return '📄';
      }
   };

   const getChannelName = (ch: Channel) => {
      switch (ch) {
         case 'FACEBOOK':
            return 'Facebook';
         case 'INSTAGRAM':
            return 'Instagram';
         case 'TWITTER':
            return 'Twitter';
         case 'YOUTUBE':
            return 'YouTube';
         case 'LINKEDIN':
            return 'LinkedIn';
         case 'TIKTOK':
            return 'TikTok';
         case 'BLOG':
            return 'Blog';
         default:
            return 'Unknown';
      }
   };

   return (
      <Sheet open={isOpen} onOpenChange={onClose}>
         <SheetContent className="w-96 sm:w-[540px]">
            <SheetHeader>
               <SheetTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Content</span>
               </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
               {/* Channel Selection */}
               <div className="space-y-2">
                  <Label htmlFor="channel">Platform</Label>
                  <Select
                     value={selectedChannel}
                     onValueChange={(value: Channel) => setSelectedChannel(value)}
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="FACEBOOK">📘 Facebook</SelectItem>
                        <SelectItem value="INSTAGRAM">📷 Instagram</SelectItem>
                        <SelectItem value="TWITTER">🐦 Twitter</SelectItem>
                        <SelectItem value="YOUTUBE">📺 YouTube</SelectItem>
                        <SelectItem value="LINKEDIN">💼 LinkedIn</SelectItem>
                        <SelectItem value="TIKTOK">🎵 TikTok</SelectItem>
                        <SelectItem value="BLOG">📝 Blog</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               {/* Date Selection */}
               <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10"
                        min={format(new Date(), 'yyyy-MM-dd')}
                     />
                  </div>
               </div>

               {/* Time Selection */}
               <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                     <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="pl-10">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>
                                 {time}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               {/* Timezone Selection */}
               <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <div className="relative">
                     <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                        <SelectTrigger className="pl-10">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                 {tz.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               {/* Preview */}
               <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Schedule Preview</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                     <div className="flex items-center space-x-2">
                        <span className="font-medium">Platform:</span>
                        <span>
                           {getChannelIcon(selectedChannel)} {getChannelName(selectedChannel)}
                        </span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="font-medium">Date:</span>
                        <span>{format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="font-medium">Time:</span>
                        <span>
                           {selectedTime} ({selectedTimezone})
                        </span>
                     </div>
                  </div>
               </div>

               {/* Warning for past time */}
               {selectedDate &&
                  selectedTime &&
                  (() => {
                     const dateTimeString = `${selectedDate}T${selectedTime}`;
                     const runAt = new Date(dateTimeString);
                     const now = new Date();

                     if (runAt < now) {
                        return (
                           <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm text-yellow-800">
                                 Warning: Selected time is in the past. Please choose a future time.
                              </span>
                           </div>
                        );
                     }
                     return null;
                  })()}

               {/* Actions */}
               <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSubmit}
                     disabled={isSubmitting || !selectedDate || !selectedTime}
                     className="flex-1"
                  >
                     {isSubmitting ? 'Scheduling...' : 'Schedule Content'}
                  </Button>
               </div>
            </div>
         </SheetContent>
      </Sheet>
   );
}
