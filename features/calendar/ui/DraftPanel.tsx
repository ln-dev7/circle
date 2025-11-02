'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, FileText, Image, Video, Calendar } from 'lucide-react';
import { Content, Channel } from '../types';
import { useDrag } from 'react-dnd';

interface DraftPanelProps {
   content: Content[];
   isLoading: boolean;
   selectedChannels: Channel[];
   selectedCampaigns: string[];
   onChannelsChange: (channels: Channel[]) => void;
   onCampaignsChange: (campaigns: string[]) => void;
}

interface DraftItemProps {
   content: Content;
   onDragStart: (contentId: string, channel: Channel) => void;
}

function DraftItem({ content, onDragStart }: DraftItemProps) {
   const [{ isDragging }, drag] = useDrag({
      type: 'DRAFT_CONTENT',
      item: { contentId: content.id, channel: 'FACEBOOK' as Channel }, // Default channel
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   });

   const getChannelIcon = (channel: Channel) => {
      switch (channel) {
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

   const getAssetIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
      if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
      return <FileText className="h-4 w-4" />;
   };

   return (
      <div
         ref={drag as any}
         className={`p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
            isDragging ? 'opacity-50' : ''
         }`}
         onClick={() => onDragStart(content.id, 'FACEBOOK')}
      >
         <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
               <span className="text-lg">{getChannelIcon('FACEBOOK')}</span>
               <Badge variant="secondary" className="text-xs">
                  {content.campaign.name}
               </Badge>
            </div>
            <div className="flex items-center space-x-1">
               {content.assets.slice(0, 2).map((asset, index) => (
                  <div key={asset.id} className="text-gray-500">
                     {getAssetIcon(asset.type)}
                  </div>
               ))}
               {content.assets.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                     +{content.assets.length - 2}
                  </Badge>
               )}
            </div>
         </div>

         <h4 className="font-medium text-sm mb-2 line-clamp-2">{content.title}</h4>

         {content.body && <p className="text-xs text-gray-600 line-clamp-2 mb-2">{content.body}</p>}

         <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            <div className="flex items-center space-x-1">
               <Calendar className="h-3 w-3" />
               <span>Drag to schedule</span>
            </div>
         </div>
      </div>
   );
}

export function DraftPanel({
   content,
   isLoading,
   selectedChannels,
   selectedCampaigns,
   onChannelsChange,
   onCampaignsChange,
}: DraftPanelProps) {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedChannel, setSelectedChannel] = useState<Channel>('FACEBOOK');

   // Get unique campaigns from content
   const campaigns = useMemo(() => {
      const unique = new Set(content.map((item) => item.campaign.name));
      return Array.from(unique).sort();
   }, [content]);

   // Filter content based on search and selections
   const filteredContent = useMemo(() => {
      return content.filter((item) => {
         const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.body && item.body.toLowerCase().includes(searchTerm.toLowerCase()));

         const matchesCampaign =
            selectedCampaigns.length === 0 || selectedCampaigns.includes(item.campaign.name);

         return matchesSearch && matchesCampaign;
      });
   }, [content, searchTerm, selectedCampaigns]);

   const handleChannelChange = (channel: Channel) => {
      setSelectedChannel(channel);
      if (!selectedChannels.includes(channel)) {
         onChannelsChange([...selectedChannels, channel]);
      }
   };

   const handleCampaignToggle = (campaign: string) => {
      if (selectedCampaigns.includes(campaign)) {
         onCampaignsChange(selectedCampaigns.filter((c) => c !== campaign));
      } else {
         onCampaignsChange([...selectedCampaigns, campaign]);
      }
   };

   const handleDragStart = (contentId: string, channel: Channel) => {
      // This will be handled by the parent component
      console.log('Drag started:', { contentId, channel });
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Draft Posts</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
               <FileText className="h-5 w-5" />
               <span>Draft Posts</span>
               <Badge variant="secondary">{filteredContent.length}</Badge>
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="Search drafts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
               <label className="text-sm font-medium">Default Channel</label>
               <Select
                  value={selectedChannel}
                  onValueChange={(value: Channel) => handleChannelChange(value)}
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

            {/* Campaign Filter */}
            {campaigns.length > 0 && (
               <div className="space-y-2">
                  <label className="text-sm font-medium">Filter by Campaign</label>
                  <div className="flex flex-wrap gap-2">
                     {campaigns.map((campaign) => (
                        <Badge
                           key={campaign}
                           variant={selectedCampaigns.includes(campaign) ? 'default' : 'outline'}
                           className="cursor-pointer"
                           onClick={() => handleCampaignToggle(campaign)}
                        >
                           {campaign}
                        </Badge>
                     ))}
                  </div>
               </div>
            )}

            {/* Draft Content List */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Content</span>
                  <span className="text-xs text-gray-500">Drag to schedule</span>
               </div>

               <div className="h-96 overflow-y-auto">
                  {filteredContent.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No draft content found</p>
                        {searchTerm && <p className="text-xs">Try adjusting your search</p>}
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {filteredContent.map((item) => (
                           <DraftItem key={item.id} content={item} onDragStart={handleDragStart} />
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
