'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Image, Plus, Calendar, Clock } from 'lucide-react';
import { AssetLibrary } from '@/components/assets/asset-library';
import { ScheduleContentModal } from '@/components/schedules/schedule-content-modal';
import { RichTextEditor } from './rich-text-editor';

interface Content {
   id: string;
   title: string;
   body: string;
   campaignId: string;
}

interface Campaign {
   id: string;
   name: string;
}

interface Asset {
   id: string;
   url: string;
   type: string;
   createdAt: string;
   content: {
      id: string;
      title: string;
   };
}

interface ContentEditorProps {
   orgId: string;
   contentId?: string;
   onSave?: (content: Content) => void;
}

export function ContentEditor({ orgId, contentId, onSave }: ContentEditorProps) {
   const { data: session } = useSession();
   const [title, setTitle] = useState('');
   const [body, setBody] = useState('');
   const [campaignId, setCampaignId] = useState('');
   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
   const [assets, setAssets] = useState<Asset[]>([]);
   const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
   const [loading, setLoading] = useState(false);
   const [assetDialogOpen, setAssetDialogOpen] = useState(false);

   // Fetch campaigns
   useEffect(() => {
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

      if (session?.user) {
         fetchCampaigns();
      }
   }, [session, orgId]);

   // Fetch content if editing
   useEffect(() => {
      if (contentId) {
         const fetchContent = async () => {
            try {
               const response = await fetch(`/api/${orgId}/content/${contentId}`);
               if (response.ok) {
                  const content = await response.json();
                  setTitle(content.title);
                  setBody(content.body || '');
                  setCampaignId(content.campaignId);
                  setSelectedAssets(content.assets || []);
               }
            } catch (error) {
               console.error('Error fetching content:', error);
            }
         };

         fetchContent();
      }
   }, [contentId, orgId]);

   // Fetch assets for the selected campaign
   useEffect(() => {
      if (campaignId) {
         const fetchAssets = async () => {
            try {
               const response = await fetch(`/api/${orgId}/assets?contentId=${campaignId}`);
               if (response.ok) {
                  const data = await response.json();
                  setAssets(data);
               }
            } catch (error) {
               console.error('Error fetching assets:', error);
            }
         };

         fetchAssets();
      }
   }, [campaignId, orgId]);

   const handleSave = async () => {
      if (!title.trim() || !campaignId) return;

      setLoading(true);
      try {
         const contentData = {
            title: title.trim(),
            body: body.trim(),
            campaignId,
         };

         const url = contentId ? `/api/${orgId}/content/${contentId}` : `/api/${orgId}/content`;

         const response = await fetch(url, {
            method: contentId ? 'PUT' : 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(contentData),
         });

         if (response.ok) {
            const savedContent = await response.json();
            onSave?.(savedContent);
         } else {
            const error = await response.json();
            alert(`Failed to save content: ${error.error}`);
         }
      } catch (error) {
         console.error('Error saving content:', error);
         alert('Failed to save content. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleAssetSelect = (asset: Asset) => {
      if (!selectedAssets.find((a) => a.id === asset.id)) {
         setSelectedAssets([...selectedAssets, asset]);
      }
      setAssetDialogOpen(false);
   };

   const removeAsset = (assetId: string) => {
      setSelectedAssets(selectedAssets.filter((asset) => asset.id !== assetId));
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
               {contentId ? 'Edit Content' : 'Create New Content'}
            </h2>
            <Button onClick={handleSave} disabled={loading || !title.trim() || !campaignId}>
               <Save className="h-4 w-4 mr-2" />
               {loading ? 'Saving...' : 'Save Content'}
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                     id="title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="Enter content title"
                     className="mt-1"
                  />
               </div>

               <div>
                  <Label htmlFor="campaign">Campaign</Label>
                  <Select value={campaignId} onValueChange={setCampaignId}>
                     <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a campaign" />
                     </SelectTrigger>
                     <SelectContent>
                        {campaigns.map((campaign) => (
                           <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <Label htmlFor="body">Content Body</Label>
                  <RichTextEditor
                     value={body}
                     onChange={setBody}
                     placeholder="Write your content here..."
                  />
               </div>
            </div>

            <div className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center justify-between">
                        <span>Assets</span>
                        <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
                           <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                 <Plus className="h-4 w-4 mr-2" />
                                 Add Asset
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                 <DialogTitle>Select Assets</DialogTitle>
                              </DialogHeader>
                              <AssetLibrary
                                 orgId={orgId}
                                 contentId={campaignId}
                                 onAssetSelect={handleAssetSelect}
                              />
                           </DialogContent>
                        </Dialog>
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     {selectedAssets.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                           No assets selected. Click "Add Asset" to choose from your library.
                        </p>
                     ) : (
                        <div className="space-y-2">
                           {selectedAssets.map((asset) => (
                              <div
                                 key={asset.id}
                                 className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                 <div className="flex items-center space-x-2">
                                    <Image className="h-4 w-4" />
                                    <span className="text-sm truncate">{asset.content.title}</span>
                                    <Badge variant="secondary" className="text-xs">
                                       {asset.type.split('/')[0]}
                                    </Badge>
                                 </div>
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAsset(asset.id)}
                                 >
                                    ×
                                 </Button>
                              </div>
                           ))}
                        </div>
                     )}
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Schedule Publication
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-gray-600 mb-4">
                        Schedule this content for automatic publication at a specific date and time.
                     </p>
                     <ScheduleContentModal
                        orgId={orgId}
                        trigger={
                           <Button
                              className="w-full"
                              disabled={!campaignId || !title.trim()}
                              variant="outline"
                           >
                              <Clock className="h-4 w-4 mr-2" />
                              Schedule Content
                           </Button>
                        }
                        onScheduleCreated={() => {
                           // Optional: Show success message or refresh data
                           console.log('Content scheduled successfully');
                        }}
                     />
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
