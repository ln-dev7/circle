'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type CreateCampaignData = {
   name: string;
   description?: string;
};

export function CampaignForm() {
   const params = useParams();
   const router = useRouter();
   const orgId = params.orgId as string;
   const [loading, setLoading] = useState(false);

   const form = useForm<CreateCampaignData>({
      resolver: zodResolver(createCampaignSchema),
      defaultValues: {
         name: '',
         description: '',
      },
   });

   const onSubmit = async (data: CreateCampaignData) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/campaigns`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         if (response.ok) {
            const campaign = await response.json();
            toast.success('Campaign created successfully!');
            router.push(`/${orgId}/campaigns/${campaign.id}`);
         } else {
            const error = await response.json();
            toast.error(error.error || 'Failed to create campaign');
         }
      } catch (error) {
         console.error('Error creating campaign:', error);
         toast.error('An unexpected error occurred');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-2">
            <Link href={`/${orgId}/campaigns`}>
               <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaigns
               </Button>
            </Link>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Campaign Details</CardTitle>
               <CardDescription>
                  Create a new marketing campaign to organize your content and schedules.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="name">Campaign Name *</Label>
                     <Input
                        id="name"
                        placeholder="Enter campaign name"
                        {...form.register('name')}
                        className={form.formState.errors.name ? 'border-red-500' : ''}
                     />
                     {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Describe your campaign goals and target audience"
                        rows={4}
                        {...form.register('description')}
                     />
                  </div>

                  <div className="flex gap-3 pt-4">
                     <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                           <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                           </>
                        ) : (
                           <>
                              <Save className="h-4 w-4 mr-2" />
                              Create Campaign
                           </>
                        )}
                     </Button>
                     <Link href={`/${orgId}/campaigns`} className="flex-1">
                        <Button type="button" variant="outline" className="w-full">
                           Cancel
                        </Button>
                     </Link>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
