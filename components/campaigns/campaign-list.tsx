'use client';

import { useState, useEffect } from 'react';
import { Plus, Grid3X3, List, Filter, Search, MoreHorizontal } from 'lucide-react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Campaign, CampaignFilters, PaginationMeta } from '@/types/campaign';

interface CampaignListProps {
   campaigns: Campaign[];
   filters: CampaignFilters;
   pagination: PaginationMeta;
   onFilterChange: (filters: CampaignFilters) => void;
   onPageChange: (page: number) => void;
   onCreateCampaign: () => void;
   onSelectCampaign: (campaign: Campaign) => void;
   onEditCampaign: (campaign: Campaign) => void;
   onDeleteCampaign: (campaign: Campaign) => void;
   loading?: boolean;
}

const statusConfig = {
   DRAFT: { label: 'Draft', color: 'bg-gray-500' },
   PLANNING: { label: 'Planning', color: 'bg-yellow-500' },
   READY: { label: 'Ready', color: 'bg-green-500' },
   DONE: { label: 'Done', color: 'bg-blue-500' },
   CANCELED: { label: 'Canceled', color: 'bg-red-500' },
} as const;

const healthConfig = {
   ON_TRACK: { label: 'On Track', color: 'bg-green-500', icon: '🟢' },
   AT_RISK: { label: 'At Risk', color: 'bg-yellow-500', icon: '🟡' },
   OFF_TRACK: { label: 'Off Track', color: 'bg-red-500', icon: '🔴' },
} as const;

const priorityConfig = {
   NO_PRIORITY: { label: 'No Priority', color: 'bg-gray-400' },
   LOW: { label: 'Low', color: 'bg-green-400' },
   MEDIUM: { label: 'Medium', color: 'bg-yellow-400' },
   HIGH: { label: 'High', color: 'bg-orange-400' },
   URGENT: { label: 'Urgent', color: 'bg-red-500' },
} as const;

export function CampaignList({
   campaigns,
   filters,
   pagination,
   onFilterChange,
   onPageChange,
   onCreateCampaign,
   onSelectCampaign,
   onEditCampaign,
   onDeleteCampaign,
   loading = false,
}: CampaignListProps) {
   const [searchQuery, setSearchQuery] = useState(filters.search || '');
   const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

   // Debounced search
   useEffect(() => {
      const timer = setTimeout(() => {
         onFilterChange({ ...filters, search: searchQuery });
      }, 300);

      return () => clearTimeout(timer);
   }, [searchQuery]);

   const handleStatusFilter = (status: string) => {
      const newStatus = status === 'all' ? undefined : (status as Campaign['status']);
      onFilterChange({ ...filters, status: newStatus });
   };

   const handleHealthFilter = (health: string) => {
      const newHealth = health === 'all' ? undefined : (health as Campaign['health']);
      onFilterChange({ ...filters, health: newHealth });
   };

   const handlePriorityFilter = (priority: string) => {
      const newPriority = priority === 'all' ? undefined : (priority as Campaign['priority']);
      onFilterChange({ ...filters, priority: newPriority });
   };

   const formatDate = (date: Date | string | null) => {
      if (!date) return '--';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   };

   const formatDateRange = (startDate: Date | string | null, endDate: Date | string | null) => {
      const start = formatDate(startDate);
      const end = formatDate(endDate);
      if (start === '--' && end === '--') return '--';
      return `${start} → ${end}`;
   };

   const renderStatusBadge = (status: Campaign['status']) => {
      const config = statusConfig[status];
      return (
         <Badge variant="secondary" className={`${config.color} text-white text-xs px-2 py-1`}>
            {config.label}
         </Badge>
      );
   };

   const renderHealthIndicator = (health: Campaign['health']) => {
      const config = healthConfig[health];
      return (
         <div className="flex items-center gap-1">
            <span>{config.icon}</span>
            <span className="text-sm">{config.label}</span>
         </div>
      );
   };

   const renderPriorityBadge = (priority: Campaign['priority']) => {
      if (priority === 'NO_PRIORITY') return null;
      const config = priorityConfig[priority];
      return (
         <Badge
            variant="outline"
            className={`${config.color} text-white text-xs px-2 py-1 border-0`}
         >
            {config.label}
         </Badge>
      );
   };

   const renderTeamMembers = (campaign: Campaign) => {
      const members = campaign.members || [];
      const visibleMembers = members.slice(0, 3);
      const remainingCount = members.length - 3;

      return (
         <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">👥</span>
            <div className="flex -space-x-2">
               {visibleMembers.map((member) => (
                  <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                     <AvatarImage src={member.user.image || ''} />
                     <AvatarFallback className="text-xs">
                        {member.user.name?.slice(0, 2).toUpperCase() || 'U'}
                     </AvatarFallback>
                  </Avatar>
               ))}
               {remainingCount > 0 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                     <span className="text-xs font-medium">+{remainingCount}</span>
                  </div>
               )}
            </div>
            {campaign.lead && (
               <>
                  <span className="text-muted-foreground">,</span>
                  <Avatar className="h-6 w-6">
                     <AvatarImage src={campaign.lead.image || ''} />
                     <AvatarFallback className="text-xs">
                        {campaign.lead.name?.slice(0, 2).toUpperCase() || 'L'}
                     </AvatarFallback>
                  </Avatar>
               </>
            )}
         </div>
      );
   };

   const renderCampaignRow = (campaign: Campaign) => (
      <TableRow
         key={campaign.id}
         className="cursor-pointer hover:bg-muted/50"
         onClick={() => onSelectCampaign(campaign)}
      >
         <TableCell>
            <div className="flex items-center gap-3">
               <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                     <span className="font-medium">{campaign.name}</span>
                     {renderPriorityBadge(campaign.priority)}
                  </div>
                  {campaign.summary && (
                     <span className="text-sm text-muted-foreground">{campaign.summary}</span>
                  )}
               </div>
            </div>
         </TableCell>
         <TableCell>{renderHealthIndicator(campaign.health)}</TableCell>
         <TableCell>
            <span className="text-sm">{campaign._count?.tasks || 0}</span>
         </TableCell>
         <TableCell>{renderTeamMembers(campaign)}</TableCell>
         <TableCell>
            <span className="text-sm">
               {formatDateRange(campaign.startDate, campaign.targetDate)}
            </span>
         </TableCell>
         <TableCell>{renderStatusBadge(campaign.status)}</TableCell>
         <TableCell>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="sm"
                     className="h-8 w-8 p-0"
                     onClick={(e) => e.stopPropagation()}
                  >
                     <MoreHorizontal className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectCampaign(campaign)}>
                     View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCampaign(campaign)}>
                     Edit Campaign
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => onDeleteCampaign(campaign)}
                     className="text-destructive"
                  >
                     Delete Campaign
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </TableCell>
      </TableRow>
   );

   const renderPagination = () => {
      if (pagination.totalPages <= 1) return null;

      return (
         <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
               Showing {(pagination.page - 1) * pagination.limit + 1}-
               {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
               {pagination.total} campaigns
            </div>
            <div className="flex items-center gap-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
               >
                  ← Previous
               </Button>
               <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                     const page = i + 1;
                     return (
                        <Button
                           key={page}
                           variant={page === pagination.page ? 'default' : 'outline'}
                           size="sm"
                           className="h-8 w-8 p-0"
                           onClick={() => onPageChange(page)}
                        >
                           {page}
                        </Button>
                     );
                  })}
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
               >
                  Next →
               </Button>
            </div>
         </div>
      );
   };

   if (loading) {
      return (
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <Skeleton className="h-8 w-32" />
               <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
               {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold">Campaigns</h1>
               <p className="text-muted-foreground">
                  Manage your marketing campaigns and track their progress
               </p>
            </div>
            <Button onClick={onCreateCampaign}>
               <Plus className="h-4 w-4 mr-2" />
               Create Campaign
            </Button>
         </div>

         {/* Filters */}
         <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
               <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search campaigns..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>

            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
               </SelectContent>
            </Select>

            <Select value={filters.health || 'all'} onValueChange={handleHealthFilter}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Health" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Health</SelectItem>
                  <SelectItem value="ON_TRACK">On Track</SelectItem>
                  <SelectItem value="AT_RISK">At Risk</SelectItem>
                  <SelectItem value="OFF_TRACK">Off Track</SelectItem>
               </SelectContent>
            </Select>

            <Select value={filters.priority || 'all'} onValueChange={handlePriorityFilter}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
               </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
               <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
               >
                  <List className="h-4 w-4" />
               </Button>
               <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
               >
                  <Grid3X3 className="h-4 w-4" />
               </Button>
            </div>
         </div>

         {/* Campaign Table */}
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">📋 Campaigns Overview ({campaigns.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead>Total Tasks</TableHead>
                        <TableHead>PIC</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12">
                           <span className="sr-only">Actions</span>
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {campaigns.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={7} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="text-4xl">📋</div>
                                 <h3 className="font-medium">No campaigns found</h3>
                                 <p className="text-muted-foreground text-sm">
                                    Create your first campaign to get started
                                 </p>
                                 <Button onClick={onCreateCampaign} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Campaign
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        campaigns.map(renderCampaignRow)
                     )}
                  </TableBody>
               </Table>
               {renderPagination()}
            </CardContent>
         </Card>
      </div>
   );
}
