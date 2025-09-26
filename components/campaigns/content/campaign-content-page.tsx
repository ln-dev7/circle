'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   Plus,
   Search,
   FileText,
   Edit,
   Eye,
   Trash2,
   Filter,
   Calendar,
   User,
   CheckCircle,
   XCircle,
   Clock,
   Send,
} from 'lucide-react';
import type {
   Campaign,
   CampaignContent,
   CreateContentData,
   UpdateContentData,
} from '@/types/campaign';

interface CampaignContentPageProps {
   orgId: string;
   campaignId: string;
   campaign: Campaign;
}

const contentStatusConfig = {
   DRAFT: { label: 'Draft', color: 'bg-gray-500', icon: '📝' },
   SUBMITTED: { label: 'Submitted', color: 'bg-yellow-500', icon: '📤' },
   APPROVED: { label: 'Approved', color: 'bg-green-500', icon: '✅' },
   PUBLISHED: { label: 'Published', color: 'bg-blue-500', icon: '🌐' },
   REJECTED: { label: 'Rejected', color: 'bg-red-500', icon: '❌' },
};

const contentTypeConfig = {
   BLOG_POST: { label: 'Blog Post', icon: '📝' },
   SOCIAL_MEDIA: { label: 'Social Media', icon: '📱' },
   EMAIL: { label: 'Email', icon: '📧' },
   VIDEO: { label: 'Video', icon: '🎥' },
   IMAGE: { label: 'Image', icon: '🖼️' },
   DOCUMENT: { label: 'Document', icon: '📄' },
};

export function CampaignContentPage({ orgId, campaignId, campaign }: CampaignContentPageProps) {
   const router = useRouter();
   const [contents, setContents] = useState<CampaignContent[]>([]);
   const [loading, setLoading] = useState(true);
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [editingContent, setEditingContent] = useState<CampaignContent | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [typeFilter, setTypeFilter] = useState<string>('all');
   const [newContentData, setNewContentData] = useState({
      title: '',
      description: '',
      body: '',
      type: 'BLOG_POST' as CampaignContent['type'],
      status: 'DRAFT' as CampaignContent['status'],
      tags: '',
   });

   useEffect(() => {
      fetchContents();
   }, [orgId, campaignId]);

   const fetchContents = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/contents`);
         if (!response.ok) {
            throw new Error('Failed to fetch contents');
         }
         const data = await response.json();
         setContents(data.contents || []);
      } catch (error) {
         console.error('Error fetching contents:', error);
         toast.error('Failed to fetch contents');
      } finally {
         setLoading(false);
      }
   };

   const handleCreateContent = async () => {
      if (!newContentData.title.trim()) {
         toast.error('Please enter a title');
         return;
      }

      try {
         const contentData = {
            ...newContentData,
            tags: newContentData.tags
               ? newContentData.tags.split(',').map((tag) => tag.trim())
               : [],
            campaignId,
         };

         const response = await fetch(`/api/${orgId}/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentData),
         });

         if (!response.ok) {
            throw new Error('Failed to create content');
         }

         const newContent = await response.json();
         setContents((prev) => [...prev, newContent.content]);
         setShowCreateModal(false);
         setNewContentData({
            title: '',
            description: '',
            body: '',
            type: 'BLOG_POST',
            status: 'DRAFT',
            tags: '',
         });
         toast.success('Content created successfully');
      } catch (error) {
         console.error('Error creating content:', error);
         toast.error('Failed to create content');
      }
   };

   const handleUpdateContent = async () => {
      if (!editingContent || !newContentData.title.trim()) {
         toast.error('Please enter a title');
         return;
      }

      try {
         const contentData = {
            ...newContentData,
            tags: newContentData.tags
               ? newContentData.tags.split(',').map((tag) => tag.trim())
               : [],
         };

         const response = await fetch(`/api/${orgId}/content/${editingContent.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentData),
         });

         if (!response.ok) {
            throw new Error('Failed to update content');
         }

         const updatedContent = await response.json();
         setContents((prev) =>
            prev.map((content) =>
               content.id === editingContent.id
                  ? { ...content, ...updatedContent.content }
                  : content
            )
         );
         setShowEditModal(false);
         setEditingContent(null);
         toast.success('Content updated successfully');
      } catch (error) {
         console.error('Error updating content:', error);
         toast.error('Failed to update content');
      }
   };

   const handleDeleteContent = async (contentId: string) => {
      if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
         return;
      }

      try {
         const response = await fetch(`/api/${orgId}/content/${contentId}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error('Failed to delete content');
         }

         setContents((prev) => prev.filter((content) => content.id !== contentId));
         toast.success('Content deleted successfully');
      } catch (error) {
         console.error('Error deleting content:', error);
         toast.error('Failed to delete content');
      }
   };

   const handleEditContent = (content: CampaignContent) => {
      setEditingContent(content);
      setNewContentData({
         title: content.title || '',
         description: content.description || '',
         body: content.body || '',
         type: content.type,
         status: content.status,
         tags: content.tags?.join(', ') || '',
      });
      setShowEditModal(true);
   };

   const handleStatusChange = async (contentId: string, newStatus: CampaignContent['status']) => {
      try {
         const content = contents.find((c) => c.id === contentId);
         if (!content) return;

         const response = await fetch(`/api/${orgId}/content/${contentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...content, status: newStatus }),
         });

         if (!response.ok) {
            throw new Error('Failed to update content status');
         }

         const updatedContent = await response.json();
         setContents((prev) =>
            prev.map((c) => (c.id === contentId ? { ...c, ...updatedContent.content } : c))
         );
         toast.success(`Content status updated to ${contentStatusConfig[newStatus].label}`);
      } catch (error) {
         console.error('Error updating content status:', error);
         toast.error('Failed to update content status');
      }
   };

   const filteredContents = contents.filter((content) => {
      const matchesSearch =
         content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         content.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
      const matchesType = typeFilter === 'all' || content.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
   });

   const getStatusStats = () => {
      return contents.reduce(
         (acc, content) => {
            acc[content.status] = (acc[content.status] || 0) + 1;
            return acc;
         },
         {} as Record<string, number>
      );
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
               <p className="text-muted-foreground">Loading content management...</p>
            </div>
         </div>
      );
   }

   const statusStats = getStatusStats();

   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Content Management</h1>
               <p className="text-muted-foreground">
                  Manage content for campaign: <span className="font-medium">{campaign.title}</span>
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
               </Button>
               <Button
                  variant="outline"
                  onClick={() => router.push(`/${orgId}/campaigns/${campaignId}`)}
               >
                  Back to Campaign
               </Button>
            </div>
         </div>

         {/* Content Statistics */}
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(contentStatusConfig).map(([status, config]) => {
               const count = statusStats[status] || 0;
               return (
                  <Card key={status}>
                     <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                           <span>{config.icon}</span>
                           <span className="text-sm font-medium">{config.label}</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">{count}</p>
                        <p className="text-xs text-muted-foreground">content items</p>
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         {/* Search and Filters */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search content..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(contentStatusConfig).map(([status, config]) => (
                     <SelectItem key={status} value={status}>
                        {config.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
               <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(contentTypeConfig).map(([type, config]) => (
                     <SelectItem key={type} value={type}>
                        {config.icon} {config.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {/* Content List */}
         <Card>
            <CardHeader>
               <CardTitle>Content Items ({filteredContents.length})</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {filteredContents.map((content) => (
                     <div
                        key={content.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                           </div>

                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <h4 className="font-medium">{content.title}</h4>
                                 <Badge
                                    className={`${contentStatusConfig[content.status].color} text-white`}
                                 >
                                    {contentStatusConfig[content.status].icon}{' '}
                                    {contentStatusConfig[content.status].label}
                                 </Badge>
                                 <Badge variant="outline">
                                    {contentTypeConfig[content.type].icon}{' '}
                                    {contentTypeConfig[content.type].label}
                                 </Badge>
                              </div>

                              {content.description && (
                                 <p className="text-sm text-muted-foreground line-clamp-2">
                                    {content.description}
                                 </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                 {content.createdAt && (
                                    <div className="flex items-center gap-1">
                                       <Calendar className="h-3 w-3" />
                                       Created {new Date(content.createdAt).toLocaleDateString()}
                                    </div>
                                 )}
                                 {content.updatedAt && (
                                    <div className="flex items-center gap-1">
                                       <Clock className="h-3 w-3" />
                                       Updated {new Date(content.updatedAt).toLocaleDateString()}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <Select
                              value={content.status}
                              onValueChange={(value) =>
                                 handleStatusChange(content.id, value as CampaignContent['status'])
                              }
                           >
                              <SelectTrigger className="w-32">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 {Object.entries(contentStatusConfig).map(([status, config]) => (
                                    <SelectItem key={status} value={status}>
                                       {config.icon} {config.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>

                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(content)}
                           >
                              <Edit className="h-4 w-4" />
                           </Button>

                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/${orgId}/content/${content.id}`)}
                           >
                              <Eye className="h-4 w-4" />
                           </Button>

                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="text-red-600 hover:text-red-700"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  ))}

                  {filteredContents.length === 0 && (
                     <div className="text-center py-12">
                        <p className="text-muted-foreground">No content found</p>
                        {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
                           <Button
                              variant="outline"
                              onClick={() => {
                                 setSearchTerm('');
                                 setStatusFilter('all');
                                 setTypeFilter('all');
                              }}
                           >
                              Clear filters
                           </Button>
                        ) : (
                           <Button onClick={() => setShowCreateModal(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create your first content
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Create Content Modal */}
         <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="sm:max-w-[600px]">
               <DialogHeader>
                  <DialogTitle>Create New Content</DialogTitle>
                  <DialogDescription>Create new content for this campaign</DialogDescription>
               </DialogHeader>

               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                           id="title"
                           value={newContentData.title}
                           onChange={(e) =>
                              setNewContentData((prev) => ({ ...prev, title: e.target.value }))
                           }
                           placeholder="Enter content title"
                           required
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="type">Content Type</Label>
                        <Select
                           value={newContentData.type}
                           onValueChange={(value) =>
                              setNewContentData((prev) => ({
                                 ...prev,
                                 type: value as CampaignContent['type'],
                              }))
                           }
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {Object.entries(contentTypeConfig).map(([type, config]) => (
                                 <SelectItem key={type} value={type}>
                                    {config.icon} {config.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        value={newContentData.description}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Brief description of the content..."
                        rows={3}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="body">Content Body</Label>
                     <Textarea
                        id="body"
                        value={newContentData.body}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, body: e.target.value }))
                        }
                        placeholder="Enter the main content..."
                        rows={6}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="tags">Tags</Label>
                     <Input
                        id="tags"
                        value={newContentData.tags}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, tags: e.target.value }))
                        }
                        placeholder="Enter tags separated by commas"
                     />
                  </div>
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                     Cancel
                  </Button>
                  <Button onClick={handleCreateContent}>Create Content</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Edit Content Modal */}
         <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="sm:max-w-[600px]">
               <DialogHeader>
                  <DialogTitle>Edit Content</DialogTitle>
                  <DialogDescription>Update content details</DialogDescription>
               </DialogHeader>

               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="edit-title">Title *</Label>
                        <Input
                           id="edit-title"
                           value={newContentData.title}
                           onChange={(e) =>
                              setNewContentData((prev) => ({ ...prev, title: e.target.value }))
                           }
                           placeholder="Enter content title"
                           required
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="edit-type">Content Type</Label>
                        <Select
                           value={newContentData.type}
                           onValueChange={(value) =>
                              setNewContentData((prev) => ({
                                 ...prev,
                                 type: value as CampaignContent['type'],
                              }))
                           }
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {Object.entries(contentTypeConfig).map(([type, config]) => (
                                 <SelectItem key={type} value={type}>
                                    {config.icon} {config.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="edit-description">Description</Label>
                     <Textarea
                        id="edit-description"
                        value={newContentData.description}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Brief description of the content..."
                        rows={3}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="edit-body">Content Body</Label>
                     <Textarea
                        id="edit-body"
                        value={newContentData.body}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, body: e.target.value }))
                        }
                        placeholder="Enter the main content..."
                        rows={6}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="edit-tags">Tags</Label>
                     <Input
                        id="edit-tags"
                        value={newContentData.tags}
                        onChange={(e) =>
                           setNewContentData((prev) => ({ ...prev, tags: e.target.value }))
                        }
                        placeholder="Enter tags separated by commas"
                     />
                  </div>
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                     Cancel
                  </Button>
                  <Button onClick={handleUpdateContent}>Update Content</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
