'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   Calendar,
   FileText,
   Sparkles,
   TrendingUp,
   Clock,
   CheckCircle,
   AlertCircle,
   Loader2,
   BarChart3,
   Eye,
   MousePointer,
   Target,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

interface CreatorDashboardProps {
   orgId: string;
}

export function CreatorDashboard({ orgId }: CreatorDashboardProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [ideas, setIdeas] = useState<string[]>([]);
   const [summary, setSummary] = useState('');
   const [translatedContent, setTranslatedContent] = useState('');
   const [ideaTopic, setIdeaTopic] = useState('');
   const [contentToSummarize, setContentToSummarize] = useState('');
   const [contentToTranslate, setContentToTranslate] = useState('');
   const [targetLanguage, setTargetLanguage] = useState('Spanish');
   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
   const [generationPrompt, setGenerationPrompt] = useState('');
   const [selectedCampaign, setSelectedCampaign] = useState('');
   const [generatedContent, setGeneratedContent] = useState('');

   const { metrics, loading: analyticsLoading, trackEvent } = useAnalytics(orgId);

   // Mock data - in real app, this would come from API
   const campaigns = [
      {
         id: '1',
         name: 'Summer Campaign 2024',
         status: 'active',
         progress: 75,
         dueDate: '2024-08-15',
         contentCount: 12,
      },
      {
         id: '2',
         name: 'Product Launch',
         status: 'draft',
         progress: 30,
         dueDate: '2024-09-01',
         contentCount: 5,
      },
   ];

   const recentContent = [
      {
         id: '1',
         title: 'Social Media Post - Summer Vibes',
         status: 'approved',
         campaign: 'Summer Campaign 2024',
         createdAt: '2024-07-10',
      },
      {
         id: '2',
         title: 'Blog Post - Product Features',
         status: 'pending',
         campaign: 'Product Launch',
         createdAt: '2024-07-08',
      },
   ];

   const generateIdeas = async () => {
      if (!ideaTopic.trim()) return;

      setIsLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/content/ideas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: ideaTopic, count: 5, type: 'general' }),
         });

         if (response.ok) {
            const data = await response.json();
            setIdeas(data.ideas);
         }
      } catch (error) {
         console.error('Error generating ideas:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const summarizeContent = async () => {
      if (!contentToSummarize.trim()) return;

      setIsLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/content/summarize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: contentToSummarize, length: 'brief' }),
         });

         if (response.ok) {
            const data = await response.json();
            setSummary(data.summary);
         }
      } catch (error) {
         console.error('Error summarizing content:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const translateContent = async () => {
      if (!contentToTranslate.trim()) return;

      setIsLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/content/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               content: contentToTranslate,
               targetLanguage,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            setTranslatedContent(data.translatedContent);
         }
      } catch (error) {
         console.error('Error translating content:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const generateNewContent = async () => {
      if (!generationPrompt.trim() || !selectedCampaign) return;

      setIsLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/content/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               prompt: generationPrompt,
               campaignId: selectedCampaign,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            setGeneratedContent(data.body);
            setIsCreateDialogOpen(false);
            // Reset form
            setGenerationPrompt('');
            setSelectedCampaign('');
            // Refresh the page or update the content list
            window.location.reload();
         }
      } catch (error) {
         console.error('Error generating content:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Creator Dashboard</h1>
               <p className="text-muted-foreground">
                  Manage your campaigns and create amazing content
               </p>
            </div>
            <Button>
               <Sparkles className="mr-2 h-4 w-4" />
               AI Assistant
            </Button>
         </div>

         {/* Quick Stats */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 due this month</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Created</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">3 urgent</p>
               </CardContent>
            </Card>
         </div>

         {/* Main Content */}
         <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
               <TabsTrigger value="campaigns">Campaign Overview</TabsTrigger>
               <TabsTrigger value="content">Content Studio</TabsTrigger>
               <TabsTrigger value="analytics">Analytics</TabsTrigger>
               <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Active Campaigns</CardTitle>
                     <CardDescription>
                        Track progress and deadlines for your campaigns
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {campaigns.map((campaign) => (
                        <div
                           key={campaign.id}
                           className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                           <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                 <h3 className="font-medium">{campaign.name}</h3>
                                 <Badge
                                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                                 >
                                    {campaign.status}
                                 </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                 <span>{campaign.contentCount} pieces of content</span>
                                 <span>Due: {campaign.dueDate}</span>
                              </div>
                              <Progress value={campaign.progress} className="w-full" />
                           </div>
                           <Button variant="outline" size="sm">
                              View Details
                           </Button>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Content Studio</CardTitle>
                     <CardDescription>Create and manage your content pieces</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Recent Content</h3>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                           <DialogTrigger asChild>
                              <Button>
                                 <Sparkles className="mr-2 h-4 w-4" />
                                 Create AI Content
                              </Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                 <DialogTitle>Create AI-Powered Content</DialogTitle>
                                 <DialogDescription>
                                    Generate new content using AI based on your prompt and selected
                                    campaign.
                                 </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="campaign-select">Select Campaign</Label>
                                    <Select
                                       value={selectedCampaign}
                                       onValueChange={setSelectedCampaign}
                                    >
                                       <SelectTrigger>
                                          <SelectValue placeholder="Choose a campaign..." />
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
                                 <div className="space-y-2">
                                    <Label htmlFor="generation-prompt">Content Prompt</Label>
                                    <Textarea
                                       id="generation-prompt"
                                       placeholder="Describe the content you want to generate... e.g., 'Write a social media post about summer fashion trends'"
                                       value={generationPrompt}
                                       onChange={(e) => setGenerationPrompt(e.target.value)}
                                       rows={4}
                                    />
                                 </div>
                                 <div className="flex justify-end space-x-2">
                                    <Button
                                       variant="outline"
                                       onClick={() => setIsCreateDialogOpen(false)}
                                    >
                                       Cancel
                                    </Button>
                                    <Button
                                       onClick={generateNewContent}
                                       disabled={
                                          isLoading || !generationPrompt.trim() || !selectedCampaign
                                       }
                                    >
                                       {isLoading ? (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                       ) : (
                                          <Sparkles className="mr-2 h-4 w-4" />
                                       )}
                                       Generate Content
                                    </Button>
                                 </div>
                              </div>
                           </DialogContent>
                        </Dialog>
                     </div>
                     {recentContent.map((content) => (
                        <div
                           key={content.id}
                           className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                           <div className="flex-1">
                              <h4 className="font-medium">{content.title}</h4>
                              <p className="text-sm text-muted-foreground">{content.campaign}</p>
                           </div>
                           <div className="flex items-center space-x-2">
                              {content.status === 'approved' ? (
                                 <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                 <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                              <Badge
                                 variant={content.status === 'approved' ? 'default' : 'secondary'}
                              >
                                 {content.status}
                              </Badge>
                           </div>
                           <Button variant="outline" size="sm">
                              Edit
                           </Button>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">
                           {metrics?.views.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Total content views</p>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">
                           {metrics?.clicks.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">User interactions</p>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CTR</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{metrics?.ctr.toFixed(2) || 0}%</div>
                        <p className="text-xs text-muted-foreground">Click-through rate</p>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">
                           {metrics?.totalEvents.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">All tracked events</p>
                     </CardContent>
                  </Card>
               </div>

               <Card>
                  <CardHeader>
                     <CardTitle>Content Performance</CardTitle>
                     <CardDescription>Analytics for your created content</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {analyticsLoading ? (
                        <div className="text-center py-8">
                           <Loader2 className="mx-auto h-8 w-8 animate-spin mb-4" />
                           <p>Loading analytics...</p>
                        </div>
                     ) : metrics?.campaignMetrics && metrics.campaignMetrics.length > 0 ? (
                        <div className="space-y-4">
                           {metrics.campaignMetrics.map((campaign) => (
                              <div key={campaign.id} className="border rounded-lg p-4">
                                 <h4 className="font-medium mb-2">{campaign.name}</h4>
                                 <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                       <p className="text-sm text-muted-foreground">
                                          Campaign Events
                                       </p>
                                       <p className="text-lg font-semibold">
                                          {campaign.totalEvents}
                                       </p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-muted-foreground">
                                          Content Pieces
                                       </p>
                                       <p className="text-lg font-semibold">
                                          {campaign.contentCount}
                                       </p>
                                    </div>
                                 </div>
                                 {campaign.contentMetrics.length > 0 && (
                                    <div className="mt-4">
                                       <p className="text-sm font-medium mb-2">
                                          Content Breakdown:
                                       </p>
                                       <div className="space-y-2">
                                          {campaign.contentMetrics.slice(0, 3).map((content) => (
                                             <div
                                                key={content.id}
                                                className="flex justify-between text-sm"
                                             >
                                                <span className="truncate max-w-[200px]">
                                                   {content.title}
                                                </span>
                                                <span>{content.events} events</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-8 text-muted-foreground">
                           <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                           <p>No analytics data available yet</p>
                           <p className="text-sm">
                              Start creating content to see performance metrics
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2">
                  {/* Content Ideas Generator */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Content Ideas Generator</CardTitle>
                        <CardDescription>
                           Generate creative content ideas for your campaigns
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="idea-topic">Topic</Label>
                           <Input
                              id="idea-topic"
                              placeholder="Enter a topic for idea generation..."
                              value={ideaTopic}
                              onChange={(e) => setIdeaTopic(e.target.value)}
                           />
                        </div>
                        <Button
                           className="w-full"
                           onClick={generateIdeas}
                           disabled={isLoading || !ideaTopic.trim()}
                        >
                           {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                           )}
                           Generate Ideas
                        </Button>
                        {ideas.length > 0 && (
                           <div className="space-y-2">
                              <Label>Generated Ideas:</Label>
                              <div className="space-y-1">
                                 {ideas.map((idea, index) => (
                                    <div key={index} className="p-2 bg-muted rounded text-sm">
                                       {idea}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Content Summarizer */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Content Summarizer</CardTitle>
                        <CardDescription>
                           Summarize long content into concise versions
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="content-to-summarize">Content to Summarize</Label>
                           <Textarea
                              id="content-to-summarize"
                              placeholder="Paste your content here..."
                              value={contentToSummarize}
                              onChange={(e) => setContentToSummarize(e.target.value)}
                              rows={4}
                           />
                        </div>
                        <Button
                           className="w-full"
                           onClick={summarizeContent}
                           disabled={isLoading || !contentToSummarize.trim()}
                        >
                           {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           ) : (
                              <FileText className="mr-2 h-4 w-4" />
                           )}
                           Summarize Content
                        </Button>
                        {summary && (
                           <div className="space-y-2">
                              <Label>Summary:</Label>
                              <div className="p-3 bg-muted rounded text-sm">{summary}</div>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Content Translator */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Content Translator</CardTitle>
                        <CardDescription>Translate content to different languages</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="content-to-translate">Content to Translate</Label>
                           <Textarea
                              id="content-to-translate"
                              placeholder="Enter content to translate..."
                              value={contentToTranslate}
                              onChange={(e) => setContentToTranslate(e.target.value)}
                              rows={4}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="target-language">Target Language</Label>
                           <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                              <SelectTrigger>
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Spanish">Spanish</SelectItem>
                                 <SelectItem value="French">French</SelectItem>
                                 <SelectItem value="German">German</SelectItem>
                                 <SelectItem value="Italian">Italian</SelectItem>
                                 <SelectItem value="Portuguese">Portuguese</SelectItem>
                                 <SelectItem value="Chinese">Chinese</SelectItem>
                                 <SelectItem value="Japanese">Japanese</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <Button
                           className="w-full"
                           onClick={translateContent}
                           disabled={isLoading || !contentToTranslate.trim()}
                        >
                           {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           ) : (
                              <TrendingUp className="mr-2 h-4 w-4" />
                           )}
                           Translate Content
                        </Button>
                        {translatedContent && (
                           <div className="space-y-2">
                              <Label>Translated Content:</Label>
                              <div className="p-3 bg-muted rounded text-sm">
                                 {translatedContent}
                              </div>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Content Generation */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">AI Content Generation</CardTitle>
                        <CardDescription>Generate new content based on prompts</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label>Content Generation</Label>
                           <p className="text-sm text-muted-foreground">
                              Use the "Create New Content" button in the Content Studio tab to
                              generate AI-powered content for your campaigns.
                           </p>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                           <a href="#content-studio">
                              <FileText className="mr-2 h-4 w-4" />
                              Go to Content Studio
                           </a>
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
