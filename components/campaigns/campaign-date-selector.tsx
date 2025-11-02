'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format, isValid, parse } from 'date-fns';

interface CampaignDateSelectorProps {
   startDate?: string;
   endDate?: string;
   onStartDateChange: (date: string | undefined) => void;
   onEndDateChange: (date: string | undefined) => void;
   disabled?: boolean;
   className?: string;
}

export default function CampaignDateSelector({
   startDate,
   endDate,
   onStartDateChange,
   onEndDateChange,
   disabled = false,
   className = '',
}: CampaignDateSelectorProps) {
   const [startDateOpen, setStartDateOpen] = useState(false);
   const [endDateOpen, setEndDateOpen] = useState(false);
   const [startDateInput, setStartDateInput] = useState(startDate || '');
   const [endDateInput, setEndDateInput] = useState(endDate || '');

   const handleStartDateSelect = (date: Date | undefined) => {
      if (date) {
         const dateString = format(date, 'yyyy-MM-dd');
         onStartDateChange(dateString);
         setStartDateInput(dateString);
         setStartDateOpen(false);
      }
   };

   const handleEndDateSelect = (date: Date | undefined) => {
      if (date) {
         const dateString = format(date, 'yyyy-MM-dd');
         onEndDateChange(dateString);
         setEndDateInput(dateString);
         setEndDateOpen(false);
      }
   };

   const handleStartDateInputChange = (value: string) => {
      setStartDateInput(value);
      const date = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
         onStartDateChange(value);
      }
   };

   const handleEndDateInputChange = (value: string) => {
      setEndDateInput(value);
      const date = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
         onEndDateChange(value);
      }
   };

   const clearStartDate = () => {
      onStartDateChange(undefined);
      setStartDateInput('');
   };

   const clearEndDate = () => {
      onEndDateChange(undefined);
      setEndDateInput('');
   };

   const getDateDisplay = (dateString: string | undefined) => {
      if (!dateString) return 'Select date';
      try {
         return format(new Date(dateString), 'MMM dd, yyyy');
      } catch {
         return 'Invalid date';
      }
   };

   const isStartDateValid = startDate && isValid(new Date(startDate));
   const isEndDateValid = endDate && isValid(new Date(endDate));
   const hasDateConflict =
      isStartDateValid && isEndDateValid && new Date(startDate) >= new Date(endDate);

   return (
      <div className={`space-y-4 ${className}`}>
         <div>
            <Label className="text-sm font-medium">Campaign Timeline</Label>
            <p className="text-xs text-muted-foreground mt-1">
               Set the start and end dates for your campaign
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
               <Label htmlFor="start-date">Start Date</Label>
               <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={disabled}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getDateDisplay(startDate)}
                        {startDate && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 clearStartDate();
                              }}
                              className="ml-auto h-6 w-6 p-0 hover:bg-transparent"
                           >
                              <X className="h-3 w-3" />
                           </Button>
                        )}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={handleStartDateSelect}
                        disabled={(date) => {
                           // Disable past dates
                           return date < new Date(new Date().setHours(0, 0, 0, 0));
                        }}
                        className="rounded-md border"
                     />
                  </PopoverContent>
               </Popover>

               {/* Manual Input */}
               <Input
                  id="start-date"
                  type="date"
                  value={startDateInput}
                  onChange={(e) => handleStartDateInputChange(e.target.value)}
                  disabled={disabled}
                  className="text-sm"
               />
            </div>

            {/* End Date */}
            <div className="space-y-2">
               <Label htmlFor="end-date">End Date</Label>
               <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={disabled}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getDateDisplay(endDate)}
                        {endDate && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 clearEndDate();
                              }}
                              className="ml-auto h-6 w-6 p-0 hover:bg-transparent"
                           >
                              <X className="h-3 w-3" />
                           </Button>
                        )}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={handleEndDateSelect}
                        disabled={(date) => {
                           // Disable dates before start date
                           if (startDate) {
                              return date <= new Date(startDate);
                           }
                           // Disable past dates
                           return date < new Date(new Date().setHours(0, 0, 0, 0));
                        }}
                        className="rounded-md border"
                     />
                  </PopoverContent>
               </Popover>

               {/* Manual Input */}
               <Input
                  id="end-date"
                  type="date"
                  value={endDateInput}
                  onChange={(e) => handleEndDateInputChange(e.target.value)}
                  disabled={disabled}
                  className="text-sm"
               />
            </div>
         </div>

         {/* Date Conflict Warning */}
         {hasDateConflict && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
               <p className="text-sm text-destructive">⚠️ End date must be after start date</p>
            </div>
         )}

         {/* Date Range Display */}
         {isStartDateValid && isEndDateValid && !hasDateConflict && (
            <div className="p-3 bg-muted/50 rounded-lg">
               <p className="text-sm text-muted-foreground">
                  Campaign duration:{' '}
                  <span className="font-medium">
                     {format(new Date(startDate), 'MMM dd, yyyy')} -{' '}
                     {format(new Date(endDate), 'MMM dd, yyyy')}
                  </span>
                  <br />
                  <span className="text-xs">
                     (
                     {Math.ceil(
                        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                           (1000 * 60 * 60 * 24)
                     )}{' '}
                     days)
                  </span>
               </p>
            </div>
         )}

         {/* Clear All Dates */}
         {(startDate || endDate) && (
            <Button
               variant="outline"
               size="sm"
               onClick={() => {
                  clearStartDate();
                  clearEndDate();
               }}
               disabled={disabled}
               className="w-full"
            >
               <X className="h-4 w-4 mr-2" />
               Clear All Dates
            </Button>
         )}
      </div>
   );
}
