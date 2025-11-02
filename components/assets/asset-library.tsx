'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Search, Image, Video, FileText, Music, Trash2, Eye } from 'lucide-react';
import { AssetUpload } from './asset-upload';
import { AssetPreview } from './asset-preview';

interface Asset {
   id: string;
   url: string;
   name?: string;
   type: string;
   size?: number;
   description?: string;
   tags?: string[];
   createdAt: string;
   content: {
      id: string;
      title: string;
   };
}

interface AssetLibraryProps {
   orgId: string;
   contentId?: string;
   onAssetSelect?: (asset: Asset) => void;
}

export function AssetLibrary({ orgId, contentId, onAssetSelect }: AssetLibraryProps) {
   const { data: session } = useSession();
   const [assets, setAssets] = useState<Asset[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedType, setSelectedType] = useState<string>('all');
   const [selectedTags, setSelectedTags] = useState<string[]>([]);
   const [sortBy, setSortBy] = useState<string>('newest');
   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
   const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

   const fetchAssets = async () => {
      try {
         const params = new URLSearchParams();
         if (contentId) params.append('contentId', contentId);

         const response = await fetch(`/api/${orgId}/assets?${params}`);
         if (response.ok) {
            const data = await response.json();
            setAssets(data);
         }
      } catch (error) {
         console.error('Error fetching assets:', error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (session?.user) {
         fetchAssets();
      }
   }, [session, orgId, contentId]);

   const filteredAssets = assets
      .filter((asset) => {
         const matchesSearch =
            !searchTerm ||
            asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

         const matchesType = selectedType === 'all' || asset.type.startsWith(selectedType);
         const matchesTags =
            selectedTags.length === 0 || selectedTags.every((tag) => asset.tags?.includes(tag));

         return matchesSearch && matchesType && matchesTags;
      })
      .sort((a, b) => {
         switch (sortBy) {
            case 'newest':
               return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
               return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'name':
               return (a.name || a.content.title).localeCompare(b.name || b.content.title);
            case 'size':
               return (b.size || 0) - (a.size || 0);
            default:
               return 0;
         }
      });

   const getAssetIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image className="h-8 w-8" />;
      if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
      if (type.startsWith('audio/')) return <Music className="h-8 w-8" />;
      if (type === 'application/pdf') return <FileText className="h-8 w-8" />;
      return <FileText className="h-8 w-8" />;
   };

   const getTypeBadgeColor = (type: string) => {
      if (type.startsWith('image/')) return 'bg-green-100 text-green-800';
      if (type.startsWith('video/')) return 'bg-blue-100 text-blue-800';
      if (type.startsWith('audio/')) return 'bg-purple-100 text-purple-800';
      return 'bg-gray-100 text-gray-800';
   };

   const handleAssetUpload = () => {
      setUploadDialogOpen(false);
      fetchAssets();
   };

   const handleDeleteAsset = async (assetId: string) => {
      if (!confirm('Are you sure you want to delete this asset?')) return;

      try {
         const response = await fetch(`/api/${orgId}/assets/${assetId}`, {
            method: 'DELETE',
         });

         if (response.ok) {
            setAssets(assets.filter((asset) => asset.id !== assetId));
         }
      } catch (error) {
         console.error('Error deleting asset:', error);
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Asset Library</h2>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
               <DialogTrigger asChild>
                  <Button>
                     <Upload className="h-4 w-4 mr-2" />
                     Upload Asset
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-md">
                  <DialogHeader>
                     <DialogTitle>Upload New Asset</DialogTitle>
                  </DialogHeader>
                  <AssetUpload
                     orgId={orgId}
                     contentId={contentId}
                     onUploadComplete={handleAssetUpload}
                  />
               </DialogContent>
            </Dialog>
         </div>

         <div className="space-y-4">
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="Search assets, tags, descriptions..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                  />
               </div>
               <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
               >
                  <option value="all">All Types</option>
                  <option value="image/">Images</option>
                  <option value="video/">Videos</option>
                  <option value="audio/">Audio</option>
                  <option value="application/pdf">PDFs</option>
               </select>
               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
               >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">Largest First</option>
               </select>
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2">
               {Array.from(new Set(assets.flatMap((asset) => asset.tags || []))).map((tag) => (
                  <button
                     key={tag}
                     onClick={() => {
                        setSelectedTags((prev) =>
                           prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                     }}
                     className={`px-3 py-1 text-sm rounded-full border ${
                        selectedTags.includes(tag)
                           ? 'bg-primary text-primary-foreground border-primary'
                           : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                     }`}
                  >
                     {tag}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
               <Card key={asset.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           {getAssetIcon(asset.type)}
                           <Badge className={getTypeBadgeColor(asset.type)}>
                              {asset.type.split('/')[0]}
                           </Badge>
                        </div>
                        <div className="flex space-x-1">
                           <Button variant="ghost" size="sm" onClick={() => setPreviewAsset(asset)}>
                              <Eye className="h-4 w-4" />
                           </Button>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        <p className="text-sm font-medium truncate">
                           {asset.name || asset.content.title}
                        </p>
                        {asset.description && (
                           <p className="text-xs text-gray-600 truncate">{asset.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                           {asset.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                 {tag}
                              </Badge>
                           ))}
                           {asset.tags && asset.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                 +{asset.tags.length - 2}
                              </Badge>
                           )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                           <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                           {asset.size && <span>{(asset.size / 1024 / 1024).toFixed(1)} MB</span>}
                        </div>
                        {onAssetSelect && (
                           <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => onAssetSelect(asset)}
                           >
                              Select
                           </Button>
                        )}
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {filteredAssets.length === 0 && (
            <div className="text-center py-12">
               <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
               <p className="text-gray-500">
                  {searchTerm || selectedType !== 'all'
                     ? 'Try adjusting your search or filter criteria.'
                     : 'Upload your first asset to get started.'}
               </p>
            </div>
         )}

         {previewAsset && (
            <AssetPreview asset={previewAsset} onClose={() => setPreviewAsset(null)} />
         )}
      </div>
   );
}
