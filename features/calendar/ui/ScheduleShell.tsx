'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
   format,
   startOfWeek,
   endOfWeek,
   startOfMonth,
   endOfMonth,
   addDays,
   addWeeks,
   addMonths,
   subDays,
   subWeeks,
   subMonths,
} from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Calendar, Clock, Filter } from 'lucide-react';
import { DayGrid } from './grid/DayGrid';
import { WeekGrid } from './grid/WeekGrid';
import { MonthGrid } from './grid/MonthGrid';
import { DraftPanel } from './DraftPanel';
import { ScheduleSheet } from './ScheduleSheet';
import { useSchedules } from '../hooks/useSchedules';
import { useDraftContent } from '../hooks/useDraftContent';
import { Channel, Schedule } from '../types';
import { DragDropProvider } from '../drag';

interface ScheduleShellProps {
   orgId: string;
}

type ViewType = 'day' | 'week' | 'month';

export function ScheduleShell({ orgId }: ScheduleShellProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const [showDrafts, setShowDrafts] = useState(false);
   const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);
   const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
   const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState(false);
   const [dragData, setDragData] = useState<{ contentId: string; channel: Channel } | null>(null);

   // Get current view and date from URL
   const currentView = (searchParams.get('view') as ViewType) || 'week';
   const currentDate = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date();

   // Fetch schedules and draft content
   const { schedules, isLoading: schedulesLoading } = useSchedules(orgId, {
      view: currentView,
      date: currentDate,
      channels: selectedChannels,
      campaigns: selectedCampaigns,
   });

   const { draftContent, isLoading: draftsLoading } = useDraftContent(orgId, selectedCampaigns);

   // Navigation functions
   const navigateToDate = useCallback(
      (date: Date) => {
         const params = new URLSearchParams(searchParams);
         params.set('date', format(date, 'yyyy-MM-dd'));
         router.push(`${pathname}?${params.toString()}`);
      },
      [router, pathname, searchParams]
   );

   const navigateToView = useCallback(
      (view: ViewType) => {
         const params = new URLSearchParams(searchParams);
         params.set('view', view);
         router.push(`${pathname}?${params.toString()}`);
      },
      [router, pathname, searchParams]
   );

   const goToPrevious = useCallback(() => {
      let newDate: Date;
      switch (currentView) {
         case 'day':
            newDate = subDays(currentDate, 1);
            break;
         case 'week':
            newDate = subWeeks(currentDate, 1);
            break;
         case 'month':
            newDate = subMonths(currentDate, 1);
            break;
         default:
            newDate = subWeeks(currentDate, 1);
      }
      navigateToDate(newDate);
   }, [currentView, currentDate, navigateToDate]);

   const goToNext = useCallback(() => {
      let newDate: Date;
      switch (currentView) {
         case 'day':
            newDate = addDays(currentDate, 1);
            break;
         case 'week':
            newDate = addWeeks(currentDate, 1);
            break;
         case 'month':
            newDate = addMonths(currentDate, 1);
            break;
         default:
            newDate = addWeeks(currentDate, 1);
      }
      navigateToDate(newDate);
   }, [currentView, currentDate, navigateToDate]);

   const goToToday = useCallback(() => {
      navigateToDate(new Date());
   }, [navigateToDate]);

   // Handle drag and drop
   const handleDrop = useCallback(
      (contentId: string, channel: Channel, targetDate: Date, targetTime: string) => {
         setDragData({ contentId, channel });
         setIsScheduleSheetOpen(true);
      },
      []
   );

   const handleScheduleCreate = useCallback(
      async (scheduleData: {
         contentId: string;
         channel: Channel;
         runAt: Date;
         timezone: string;
      }) => {
         try {
            const content = draftContent.find((c: any) => c.id === scheduleData.contentId);
            if (!content) {
               console.error('Content not found');
               return;
            }

            const response = await fetch(`/api/${orgId}/schedules`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  ...scheduleData,
                  runAt: scheduleData.runAt.toISOString(),
                  campaignId: content.campaignId,
               }),
            });

            if (response.ok) {
               setIsScheduleSheetOpen(false);
               setDragData(null);
               // Refresh schedules
               window.location.reload();
            } else {
               const error = await response.json();
               console.error('Failed to create schedule:', error);
            }
         } catch (error) {
            console.error('Error creating schedule:', error);
         }
      },
      [orgId, draftContent]
   );

   const getViewTitle = () => {
      switch (currentView) {
         case 'day':
            return format(currentDate, 'EEEE, MMMM d, yyyy');
         case 'week':
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
         case 'month':
            return format(currentDate, 'MMMM yyyy');
         default:
            return format(currentDate, 'MMMM yyyy');
      }
   };

   return (
      <DragDropProvider>
         <div className="space-y-6">
            {/* Header with navigation and controls */}
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={goToPrevious}>
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNext}>
                     <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                     Today
                  </Button>
                  <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
               </div>

               <div className="flex items-center space-x-4">
                  {/* Filters */}
                  <div className="flex items-center space-x-2">
                     <Filter className="h-4 w-4 text-gray-500" />
                     <Badge variant="outline" className="cursor-pointer">
                        {selectedChannels.length || 'All'} Channels
                     </Badge>
                     <Badge variant="outline" className="cursor-pointer">
                        {selectedCampaigns.length || 'All'} Campaigns
                     </Badge>
                  </div>

                  {/* Draft Toggle */}
                  <div className="flex items-center space-x-2">
                     <Switch
                        id="show-drafts"
                        checked={showDrafts}
                        onCheckedChange={setShowDrafts}
                     />
                     <Label htmlFor="show-drafts">Draft Posts</Label>
                  </div>
               </div>
            </div>

            {/* View Tabs */}
            <Tabs
               value={currentView}
               onValueChange={(value) => navigateToView(value as ViewType)}
               className="w-full"
            >
               <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day" className="flex items-center space-x-2">
                     <Calendar className="h-4 w-4" />
                     <span>Day</span>
                  </TabsTrigger>
                  <TabsTrigger value="week" className="flex items-center space-x-2">
                     <Calendar className="h-4 w-4" />
                     <span>Week</span>
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex items-center space-x-2">
                     <Calendar className="h-4 w-4" />
                     <span>Month</span>
                  </TabsTrigger>
               </TabsList>

               <div className="mt-6 flex">
                  {/* Main Calendar Grid */}
                  <div className={`flex-1 ${showDrafts ? 'mr-4' : ''}`}>
                     <TabsContent value="day" className="mt-0">
                        <DayGrid
                           date={currentDate}
                           schedules={schedules}
                           onDrop={handleDrop}
                           isLoading={schedulesLoading}
                        />
                     </TabsContent>
                     <TabsContent value="week" className="mt-0">
                        <WeekGrid
                           date={currentDate}
                           schedules={schedules}
                           onDrop={handleDrop}
                           isLoading={schedulesLoading}
                        />
                     </TabsContent>
                     <TabsContent value="month" className="mt-0">
                        <MonthGrid
                           date={currentDate}
                           schedules={schedules}
                           onDrop={handleDrop}
                           isLoading={schedulesLoading}
                        />
                     </TabsContent>
                  </div>

                  {/* Draft Panel */}
                  {showDrafts && (
                     <div className="w-80">
                        <DraftPanel
                           content={draftContent}
                           isLoading={draftsLoading}
                           selectedChannels={selectedChannels}
                           selectedCampaigns={selectedCampaigns}
                           onChannelsChange={setSelectedChannels}
                           onCampaignsChange={setSelectedCampaigns}
                        />
                     </div>
                  )}
               </div>
            </Tabs>

            {/* Schedule Creation Sheet */}
            {isScheduleSheetOpen && dragData && (
               <ScheduleSheet
                  isOpen={isScheduleSheetOpen}
                  onClose={() => setIsScheduleSheetOpen(false)}
                  contentId={dragData.contentId}
                  channel={dragData.channel}
                  onSubmit={handleScheduleCreate}
               />
            )}
         </div>
      </DragDropProvider>
   );
}
