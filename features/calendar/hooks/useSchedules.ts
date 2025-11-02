import { useState, useEffect } from 'react';
import {
   format,
   startOfDay,
   endOfDay,
   startOfWeek,
   endOfWeek,
   startOfMonth,
   endOfMonth,
} from 'date-fns';
import { Schedule, ScheduleQuery } from '../types';

interface UseSchedulesOptions {
   view: 'day' | 'week' | 'month';
   date: Date;
   channels?: string[];
   campaigns?: string[];
}

export function useSchedules(orgId: string, options: UseSchedulesOptions) {
   const [schedules, setSchedules] = useState<Schedule[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchSchedules = async () => {
         try {
            setIsLoading(true);
            setError(null);

            // Calculate date range based on view
            let from: Date;
            let to: Date;

            switch (options.view) {
               case 'day':
                  from = startOfDay(options.date);
                  to = endOfDay(options.date);
                  break;
               case 'week':
                  from = startOfWeek(options.date, { weekStartsOn: 1 });
                  to = endOfWeek(options.date, { weekStartsOn: 1 });
                  break;
               case 'month':
                  from = startOfMonth(options.date);
                  to = endOfMonth(options.date);
                  break;
               default:
                  from = startOfWeek(options.date, { weekStartsOn: 1 });
                  to = endOfWeek(options.date, { weekStartsOn: 1 });
            }

            // Build query parameters
            const params = new URLSearchParams({
               from: from.toISOString(),
               to: to.toISOString(),
            });

            if (options.channels && options.channels.length > 0) {
               params.append('channels', options.channels.join(','));
            }

            if (options.campaigns && options.campaigns.length > 0) {
               params.append('campaigns', options.campaigns.join(','));
            }

            const response = await fetch(`/api/${orgId}/schedules?${params.toString()}`);

            if (!response.ok) {
               throw new Error(`Failed to fetch schedules: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.ok && result.data) {
               setSchedules(result.data);
            } else {
               throw new Error(result.error?.message || 'Failed to fetch schedules');
            }
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setSchedules([]);
         } finally {
            setIsLoading(false);
         }
      };

      fetchSchedules();
   }, [orgId, options.view, options.date, options.channels, options.campaigns]);

   return { schedules, isLoading, error };
}
