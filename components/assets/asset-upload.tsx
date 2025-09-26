'use client';

import { useState } from 'react';
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
import { Upload, X } from 'lucide-react';

interface AssetUploadProps {
   orgId: string;
   contentId?: string;
   onUploadComplete: () => void;
}

export function AssetUpload({ orgId, contentId, onUploadComplete }: AssetUploadProps) {
   const { data: session } = useSession();
   const [file, setFile] = useState<File | null>(null);
   const [uploading, setUploading] = useState(false);
   const [selectedContentId, setSelectedContentId] = useState(contentId || '');

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);
      }
   };

   const handleUpload = async () => {
      if (!file || !selectedContentId) return;

      setUploading(true);
      try {
         const formData = new FormData();
         formData.append('file', file);
         formData.append('contentId', selectedContentId);

         const response = await fetch(`/api/${orgId}/assets/upload`, {
            method: 'POST',
            body: formData,
         });

         if (response.ok) {
            onUploadComplete();
            setFile(null);
            setSelectedContentId('');
         } else {
            const error = await response.json();
            alert(`Upload failed: ${error.error}`);
         }
      } catch (error) {
         console.error('Upload error:', error);
         alert('Upload failed. Please try again.');
      } finally {
         setUploading(false);
      }
   };

   const removeFile = () => {
      setFile(null);
   };

   return (
      <div className="space-y-4">
         <div>
            <Label htmlFor="file">Select File</Label>
            <Input
               id="file"
               type="file"
               accept="image/*,video/*,audio/*,.pdf"
               onChange={handleFileSelect}
               className="mt-1"
            />
         </div>

         {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
               <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                     ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
               </div>
               <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
               </Button>
            </div>
         )}

         <div>
            <Label htmlFor="content">Associate with Content</Label>
            <Select value={selectedContentId} onValueChange={setSelectedContentId}>
               <SelectTrigger>
                  <SelectValue placeholder="Select content" />
               </SelectTrigger>
               <SelectContent>
                  {/* This would be populated with actual content from the API */}
                  <SelectItem value="content-1">Sample Content 1</SelectItem>
                  <SelectItem value="content-2">Sample Content 2</SelectItem>
               </SelectContent>
            </Select>
         </div>

         <Button
            onClick={handleUpload}
            disabled={!file || !selectedContentId || uploading}
            className="w-full"
         >
            {uploading ? 'Uploading...' : 'Upload Asset'}
         </Button>
      </div>
   );
}
