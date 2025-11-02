'use client';

import { useState } from 'react';
import {
   CampaignFilters,
   CampaignStatus,
   CampaignHealth,
   CampaignPriority,
} from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignFiltersProps {
   filters: CampaignFilters;
   onChange: (filters: CampaignFilters) => void;
   onClear: () => void;
}

export default function CampaignFilters({ filters, onChange, onClear }: CampaignFiltersProps) {
   const [isOpen, setIsOpen] = useState(false);

   const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
      onChange({ ...filters, [key]: value });
   };

   const handleClearFilter = (key: keyof CampaignFilters) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      onChange(newFilters);
   };

   const hasActiveFilters = Object.keys(filters).some(
      (key) => filters[key as keyof CampaignFilters] !== undefined
   );

   return (
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
         {/* Search */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
               placeholder="Search campaigns..."
               value={filters.search || ''}
               onChange={(e) => handleFilterChange('search', e.target.value)}
               className="pl-10 w-64"
            />
            {filters.search && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClearFilter('search')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
               >
                  <X className="h-3 w-3" />
               </Button>
            )}
         </div>

         {/* Status Filter */}
         <Select
            value={filters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value || undefined)}
         >
            <SelectTrigger className="w-32">
               <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">All Status</SelectItem>
               <SelectItem value="DRAFT">Draft</SelectItem>
               <SelectItem value="PLANNING">Planning</SelectItem>
               <SelectItem value="READY">Ready</SelectItem>
               <SelectItem value="DONE">Done</SelectItem>
               <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
         </Select>

         {/* Health Filter */}
         <Select
            value={filters.health || ''}
            onValueChange={(value) => handleFilterChange('health', value || undefined)}
         >
            <SelectTrigger className="w-32">
               <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">All Health</SelectItem>
               <SelectItem value="ON_TRACK">On Track</SelectItem>
               <SelectItem value="AT_RISK">At Risk</SelectItem>
               <SelectItem value="OFF_TRACK">Off Track</SelectItem>
            </SelectContent>
         </Select>

         {/* Priority Filter */}
         <Select
            value={filters.priority || ''}
            onValueChange={(value) => handleFilterChange('priority', value || undefined)}
         >
            <SelectTrigger className="w-32">
               <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">All Priority</SelectItem>
               <SelectItem value="NO_PRIORITY">No Priority</SelectItem>
               <SelectItem value="LOW">Low</SelectItem>
               <SelectItem value="MEDIUM">Medium</SelectItem>
               <SelectItem value="HIGH">High</SelectItem>
               <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
         </Select>

         {/* Date Range Filter */}
         <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
               <Button variant="outline" className="w-32 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate || filters.endDate ? (
                     <span className="truncate">
                        {filters.startDate && format(new Date(filters.startDate), 'MMM dd')}
                        {filters.startDate && filters.endDate && ' - '}
                        {filters.endDate && format(new Date(filters.endDate), 'MMM dd')}
                     </span>
                  ) : (
                     <span>Date range</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <div className="p-3">
                  <div className="space-y-2">
                     <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Calendar
                           mode="single"
                           selected={filters.startDate ? new Date(filters.startDate) : undefined}
                           onSelect={(date) =>
                              handleFilterChange(
                                 'startDate',
                                 date ? format(date, 'yyyy-MM-dd') : undefined
                              )
                           }
                           className="rounded-md border"
                        />
                     </div>
                     <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Calendar
                           mode="single"
                           selected={filters.endDate ? new Date(filters.endDate) : undefined}
                           onSelect={(date) =>
                              handleFilterChange(
                                 'endDate',
                                 date ? format(date, 'yyyy-MM-dd') : undefined
                              )
                           }
                           className="rounded-md border"
                        />
                     </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                           handleClearFilter('startDate');
                           handleClearFilter('endDate');
                        }}
                     >
                        Clear Dates
                     </Button>
                  </div>
               </div>
            </PopoverContent>
         </Popover>

         {/* Clear All Filters */}
         {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
               <X className="h-4 w-4 mr-2" />
               Clear All
            </Button>
         )}

         {/* Active Filters Display */}
         {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
               {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     Status: {filters.status}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearFilter('status')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </Badge>
               )}
               {filters.health && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     Health: {filters.health}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearFilter('health')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </Badge>
               )}
               {filters.priority && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     Priority: {filters.priority}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearFilter('priority')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </Badge>
               )}
               {filters.startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     From: {format(new Date(filters.startDate), 'MMM dd')}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearFilter('startDate')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </Badge>
               )}
               {filters.endDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                     To: {format(new Date(filters.endDate), 'MMM dd')}
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearFilter('endDate')}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </Badge>
               )}
            </div>
         )}
      </div>
   );
}
