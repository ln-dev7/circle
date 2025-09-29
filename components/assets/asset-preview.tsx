'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Image, Video, FileText, Music } from 'lucide-react';

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

interface AssetPreviewProps {
   asset: Asset | null;
   onClose: () => void;
}

export function AssetPreview({ asset, onClose }: AssetPreviewProps) {
   if (!asset) return null;

   const getAssetIcon = (type: string) => {
      if (type.startsWith('image/')) return <Image className="h-12 w-12" />;
      if (type.startsWith('video/')) return <Video className="h-12 w-12" />;
      if (type.startsWith('audio/')) return <Music className="h-12 w-12" />;
      if (type === 'application/pdf') return <FileText className="h-12 w-12" />;
      return <FileText className="h-12 w-12" />;
   };

   const getTypeBadgeColor = (type: string) => {
      if (type.startsWith('image/')) return 'bg-green-100 text-green-800';
      if (type.startsWith('video/')) return 'bg-blue-100 text-blue-800';
      if (type.startsWith('audio/')) return 'bg-purple-100 text-purple-800';
      return 'bg-gray-100 text-gray-800';
   };

   const renderAssetContent = () => {
      if (asset.type.startsWith('image/')) {
         return (
            <img
               src={asset.url}
               alt={asset.content.title}
               className="max-w-full max-h-96 object-contain rounded-lg"
            />
         );
      }

      if (asset.type.startsWith('video/')) {
         return <video src={asset.url} controls className="max-w-full max-h-96 rounded-lg" />;
      }

      if (asset.type.startsWith('audio/')) {
         return <audio src={asset.url} controls className="w-full" />;
      }

      if (asset.type === 'application/pdf') {
         return (
            <iframe
               src={asset.url}
               className="w-full h-96 border rounded-lg"
               title={asset.content.title}
            />
         );
      }

      return (
         <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            {getAssetIcon(asset.type)}
            <p className="mt-2">Preview not available for this file type</p>
         </div>
      );
   };

   const handleDownload = () => {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = asset.content.title;
      link.click();
   };

   const handleOpenInNewTab = () => {
      window.open(asset.url, '_blank');
   };

   return (
      <Dialog open={!!asset} onOpenChange={() => onClose()}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                  <span>{asset.content.title}</span>
                  <Badge className={getTypeBadgeColor(asset.type)}>
                     {asset.type.split('/')[0]}
                  </Badge>
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
               <div className="flex justify-center">{renderAssetContent()}</div>

               <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                     <p>
                        <strong>Type:</strong> {asset.type}
                     </p>
                     <p>
                        <strong>Uploaded:</strong> {new Date(asset.createdAt).toLocaleString()}
                     </p>
                  </div>
                  <div className="flex space-x-2">
                     <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                     </Button>
                     <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                     </Button>
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
