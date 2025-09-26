'use client';

import { useState } from 'react';
import { Campaign, CampaignStatus, CampaignHealth, CampaignPriority } from '@/types/campaign';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Layers,
   FileText,
   Users,
   Calendar,
   ChevronRight,
   Search,
   Filter,
   Plus,
} from 'lucide-react';
import Link from 'next/link';

interface CampaignTableProps {
   campaigns: Campaign[];
   onSelect: (campaign: Campaign) => void;
   onEdit: (campaign: Campaign) => void;
   onDelete: (campaign: Campaign) => void;
   onCreateCampaign: () => void;
   loading?: boolean;
   orgId: string;
}

interface CampaignFilters {
   status?: CampaignStatus;
   health?: CampaignHealth;
   priority?: CampaignPriority;
   search?: string;
}

export default function CampaignTable({
   campaigns,
   onSelect,
   onEdit,
   onDelete,
   onCreateCampaign,
   loading = false,
   orgId,
}: CampaignTableProps) {
   const [filters, setFilters] = useState<CampaignFilters>({});
   const [sortBy, setSortBy] = useState<'name' | 'status' | 'health' | 'priority' | 'createdAt'>(
      'createdAt'
   );
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

   // Filter campaigns based on current filters
   const filteredCampaigns = campaigns.filter((campaign) => {
      if (filters.status && campaign.status !== filters.status) return false;
      if (filters.health && campaign.health !== filters.health) return false;
      if (filters.priority && campaign.priority !== filters.priority) return false;
      if (filters.search) {
         const searchLower = filters.search.toLowerCase();
         return (
            campaign.name.toLowerCase().includes(searchLower) ||
            campaign.description?.toLowerCase().includes(searchLower) ||
            campaign.summary?.toLowerCase().includes(searchLower)
         );
      }
      return true;
   });

   // Sort campaigns
   const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt') {
         aValue = new Date(aValue).getTime();
         bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
         return aValue > bValue ? 1 : -1;
      } else {
         return aValue < bValue ? 1 : -1;
      }
   });

   const handleSort = (field: typeof sortBy) => {
      if (sortBy === field) {
         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
         setSortBy(field);
         setSortOrder('asc');
      }
   };

   const getHealthColor = (health: CampaignHealth) => {
      switch (health) {
         case 'ON_TRACK':
            return 'default';
         case 'AT_RISK':
            return 'destructive';
         case 'OFF_TRACK':
            return 'secondary';
         default:
            return 'default';
      }
   };

   const getStatusColor = (status: CampaignStatus) => {
      switch (status) {
         case 'DRAFT':
            return 'secondary';
         case 'PLANNING':
            return 'default';
         case 'READY':
            return 'default';
         case 'DONE':
            return 'default';
         case 'CANCELED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const getPriorityColor = (priority: CampaignPriority) => {
      switch (priority) {
         case 'NO_PRIORITY':
            return 'secondary';
         case 'LOW':
            return 'default';
         case 'MEDIUM':
            return 'default';
         case 'HIGH':
            return 'destructive';
         case 'URGENT':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   };

   if (loading) {
      return (
         <div className="w-full">
            <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
               <div className="w-[35%]">Title</div>
               <div className="w-[12%]">Health</div>
               <div className="w-[12%]">Total Tasks</div>
               <div className="w-[15%]">PIC</div>
               <div className="w-[18%]">Timeline</div>
               <div className="w-[8%]">Status</div>
            </div>
            <div className="w-full">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full flex items-center py-3 px-6 border-b">
                     <div className="w-[35%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                     </div>
                     <div className="w-[12%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                     <div className="w-[12%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                     <div className="w-[15%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                     </div>
                     <div className="w-[18%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                     </div>
                     <div className="w-[8%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="w-full space-y-4">
         {/* Filters and Actions */}
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search campaigns..."
                     value={filters.search || ''}
                     onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                     className="pl-10 w-64"
                  />
               </div>

               <Select
                  value={filters.status}
                  onValueChange={(value) =>
                     setFilters({ ...filters, status: value as CampaignStatus })
                  }
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

               <Select
                  value={filters.health}
                  onValueChange={(value) =>
                     setFilters({ ...filters, health: value as CampaignHealth })
                  }
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

               <Select
                  value={filters.priority}
                  onValueChange={(value) =>
                     setFilters({ ...filters, priority: value as CampaignPriority })
                  }
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
            </div>

            <Button onClick={onCreateCampaign} className="flex items-center gap-2">
               <Plus className="h-4 w-4" />
               Create Campaign
            </Button>
         </div>

         {/* Table */}
         <div className="border rounded-lg">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead
                        className="w-[35%] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                     >
                        <div className="flex items-center gap-2">
                           Title
                           {sortBy === 'name' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                           )}
                        </div>
                     </TableHead>
                     <TableHead
                        className="w-[12%] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('health')}
                     >
                        <div className="flex items-center gap-2">
                           Health
                           {sortBy === 'health' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                           )}
                        </div>
                     </TableHead>
                     <TableHead className="w-[12%]">Total Tasks</TableHead>
                     <TableHead className="w-[15%]">PIC</TableHead>
                     <TableHead
                        className="w-[18%] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('createdAt')}
                     >
                        <div className="flex items-center gap-2">
                           Timeline
                           {sortBy === 'createdAt' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                           )}
                        </div>
                     </TableHead>
                     <TableHead
                        className="w-[8%] cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('status')}
                     >
                        <div className="flex items-center gap-2">
                           Status
                           {sortBy === 'status' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                           )}
                        </div>
                     </TableHead>
                     <TableHead className="w-[8%]">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {sortedCampaigns.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                           No campaigns found.
                        </TableCell>
                     </TableRow>
                  ) : (
                     sortedCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} className="hover:bg-muted/50">
                           <TableCell className="w-[35%]">
                              <div className="flex items-center gap-2">
                                 <div className="relative">
                                    <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                                       <Layers className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                 </div>
                                 <div className="flex flex-col items-start overflow-hidden">
                                    <span className="font-medium truncate w-full">
                                       {campaign.name}
                                    </span>
                                    {campaign.description && (
                                       <span className="text-xs text-muted-foreground truncate w-full">
                                          {campaign.description}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </TableCell>

                           <TableCell className="w-[12%]">
                              <Badge variant={getHealthColor(campaign.health)} className="text-xs">
                                 {campaign.health.replace('_', ' ')}
                              </Badge>
                           </TableCell>

                           <TableCell className="w-[12%]">
                              <div className="flex items-center gap-1">
                                 <FileText className="h-3 w-3 text-muted-foreground" />
                                 <span className="text-xs">{campaign._count?.tasks || 0}</span>
                              </div>
                           </TableCell>

                           <TableCell className="w-[15%]">
                              <div className="flex items-center gap-1">
                                 <Users className="h-3 w-3 text-muted-foreground" />
                                 <span className="text-xs truncate">
                                    {campaign.members && campaign.members.length > 0
                                       ? campaign.members.length > 1
                                          ? `${campaign.members[0].user.name || 'Unknown'} +${campaign.members.length - 1}`
                                          : campaign.members[0].user.name || 'Unknown'
                                       : 'Unassigned'}
                                 </span>
                              </div>
                           </TableCell>

                           <TableCell className="w-[18%]">
                              <div className="flex items-center gap-1">
                                 <Calendar className="h-3 w-3 text-muted-foreground" />
                                 <span className="text-xs">
                                    {campaign.startDate && campaign.targetDate
                                       ? `${formatDate(campaign.startDate)} → ${formatDate(campaign.targetDate)}`
                                       : formatDate(campaign.createdAt)}
                                 </span>
                              </div>
                           </TableCell>

                           <TableCell className="w-[8%]">
                              <Badge variant={getStatusColor(campaign.status)} className="text-xs">
                                 {campaign.status}
                              </Badge>
                           </TableCell>

                           <TableCell className="w-[8%]">
                              <div className="flex items-center gap-2">
                                 <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => onSelect(campaign)}
                                    className="hover:bg-accent"
                                 >
                                    <ChevronRight className="h-4 w-4" />
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
