'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ContentCard } from './content-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import Link from 'next/link';

interface Content {
   id: string;
   title: string;
   body?: string;
   status: string;
   createdAt: string;
   campaign: {
      id: string;
      name: string;
   };
}

interface ContentListProps {
   orgId: string;
}

export function ContentList({ orgId }: ContentListProps) {
   const [contents, setContents] = useState<Content[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [campaignFilter, setCampaignFilter] = useState<string>('all');
   const [campaigns, setCampaigns] = useState<any[]>([]);

   useEffect(() => {
      fetchContents();
      fetchCampaigns();
   }, [orgId]);

   const fetchContents = async () => {
      try {
         const response = await fetch(`/api/${orgId}/content`);
         if (response.ok) {
            const data = await response.json();
            setContents(data.data || []);
         }
      } catch (error) {
         console.error('Error fetching contents:', error);
      } finally {
         setLoading(false);
      }
   };

   const fetchCampaigns = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns`);
         if (response.ok) {
            const data = await response.json();
            setCampaigns(data);
         }
      } catch (error) {
         console.error('Error fetching campaigns:', error);
      }
   };

   const filteredContents = contents.filter((content) => {
      const matchesSearch =
         content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         content.body?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
      const matchesCampaign = campaignFilter === 'all' || content.campaign.id === campaignFilter;

      return matchesSearch && matchesStatus && matchesCampaign;
   });

   if (loading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 max-w-md gap-2">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                     placeholder="Search content..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>
            <Link href={`/${orgId}/content/new`}>
               <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Content
               </Button>
            </Link>
         </div>

         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-muted-foreground" />
               <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
               </SelectContent>
            </Select>

            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
               <SelectTrigger className="w-40">
                  <SelectValue placeholder="Campaign" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {campaigns.map((campaign) => (
                     <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {filteredContents.length === 0 ? (
            <div className="text-center py-12">
               <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {searchTerm || statusFilter !== 'all' || campaignFilter !== 'all'
                     ? 'No content found'
                     : 'No content yet'}
               </h3>
               <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || campaignFilter !== 'all'
                     ? 'Try adjusting your filters or search terms'
                     : 'Create your first content piece to get started'}
               </p>
               {!searchTerm && statusFilter === 'all' && campaignFilter === 'all' && (
                  <Link href={`/${orgId}/content/new`}>
                     <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Content
                     </Button>
                  </Link>
               )}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredContents.map((content) => (
                  <ContentCard key={content.id} content={content} orgId={orgId} />
               ))}
            </div>
         )}
      </div>
   );
}
