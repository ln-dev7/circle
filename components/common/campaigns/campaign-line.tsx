import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, FileText, Users, Calendar, ChevronRight } from 'lucide-react';

interface Campaign {
   id: string;
   name: string;
   description?: string;
   health: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
   totalTasks: number;
   pic: string[];
   startDate: string;
   endDate: string;
   status: 'PLAN' | 'DO' | 'DONE' | 'CANCELED';
   createdAt: string;
   updatedAt: string;
}

interface CampaignLineProps {
   campaign: Campaign;
   orgId: string;
   onOpenDetails?: (campaignId: string) => void;
}

export default function CampaignLine({ campaign, orgId, onOpenDetails }: CampaignLineProps) {
   const getHealthColor = (health: string) => {
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

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'PLAN':
            return 'secondary';
         case 'DO':
            return 'default';
         case 'DONE':
            return 'default';
         case 'CANCELED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   };

   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
         {/* Title */}
         <div className="w-[35%] flex items-center gap-2">
            <div className="relative">
               <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                  <Layers className="size-4" />
               </div>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate w-full">
                  {campaign.name || 'Unnamed Campaign'}
               </span>
               {campaign.description && (
                  <span className="text-xs text-muted-foreground truncate w-full">
                     {campaign.description}
                  </span>
               )}
            </div>
         </div>

         {/* Health */}
         <div className="w-[12%]">
            <Badge
               variant={getHealthColor(campaign.health || 'ON_TRACK') as any}
               className="text-xs"
            >
               {(campaign.health || 'ON_TRACK').replace('_', ' ')}
            </Badge>
         </div>

         {/* Total Tasks */}
         <div className="w-[12%] flex items-center gap-1">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{campaign.totalTasks || 0}</span>
         </div>

         {/* PIC */}
         <div className="w-[15%] flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs truncate">
               {(campaign.pic || []).length > 1
                  ? `${(campaign.pic || [])[0]} +${(campaign.pic || []).length - 1}`
                  : (campaign.pic || [])[0] || 'Unassigned'}
            </span>
         </div>

         {/* Timeline */}
         <div className="w-[18%] flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">
               {campaign.startDate ? formatDate(new Date(campaign.startDate)) : 'Not set'} →{' '}
               {campaign.endDate ? formatDate(new Date(campaign.endDate)) : 'Not set'}
            </span>
         </div>

         {/* Status */}
         <div className="w-[8%]">
            <Badge variant={getStatusColor(campaign.status || 'PLAN') as any} className="text-xs">
               {campaign.status || 'PLAN'}
            </Badge>
         </div>

         {/* Actions */}
         <div className="flex items-center gap-2 ml-auto">
            <Button
               variant="ghost"
               size="xs"
               onClick={() => campaign.id && onOpenDetails?.(campaign.id)}
               className="hover:bg-accent"
            >
               <ChevronRight className="h-4 w-4" />
            </Button>
         </div>
      </div>
   );
}
