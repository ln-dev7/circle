'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { createScheduleSchema } from '@/lib/schemas';

interface Content {
   id: string;
   title: string;
   campaign: {
      id: string;
      name: string;
   };
}

interface Campaign {
   id: string;
   name: string;
   contents: Content[];
}

interface ScheduleContentModalProps {
   orgId: string;
   trigger: React.ReactNode;
   onScheduleCreated?: () => void;
}

export function ScheduleContentModal({
   orgId,
   trigger,
   onScheduleCreated,
}: ScheduleContentModalProps) {
   const [open, setOpen] = useState(false);
   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
   const [loading, setLoading] = useState(false);

   const form = useForm({
      resolver: zodResolver(createScheduleSchema),
      defaultValues: {
         runAt: '',
         status: 'PENDING',
         campaignId: '',
         contentId: '',
      },
   });

   useEffect(() => {
      if (open) {
         fetchCampaigns();
      }
   }, [open]);

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

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/schedules`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         if (response.ok) {
            setOpen(false);
            form.reset();
            onScheduleCreated?.();
         } else {
            const error = await response.json();
            console.error('Error creating schedule:', error);
         }
      } catch (error) {
         console.error('Error creating schedule:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleCampaignChange = (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      setSelectedCampaign(campaign || null);
      form.setValue('campaignId', campaignId);
      form.setValue('contentId', ''); // Reset content selection
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{trigger}</DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Schedule Content Publication</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                     control={form.control}
                     name="campaignId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Campaign</FormLabel>
                           <Select onValueChange={handleCampaignChange} value={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select a campaign" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {campaigns.map((campaign) => (
                                    <SelectItem key={campaign.id} value={campaign.id}>
                                       {campaign.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {selectedCampaign && selectedCampaign.contents.length > 0 && (
                     <FormField
                        control={form.control}
                        name="contentId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Content (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select content to schedule" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {selectedCampaign.contents.map((content) => (
                                       <SelectItem key={content.id} value={content.id}>
                                          {content.title}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}

                  <FormField
                     control={form.control}
                     name="runAt"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel>Publication Date & Time</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button
                                       variant={'outline'}
                                       className={cn(
                                          'w-full pl-3 text-left font-normal',
                                          !field.value && 'text-muted-foreground'
                                       )}
                                    >
                                       {field.value ? (
                                          format(new Date(field.value), "PPP 'at' p")
                                       ) : (
                                          <span>Pick a date and time</span>
                                       )}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => {
                                       if (date) {
                                          // Set time to current time if no time is set
                                          const now = new Date();
                                          date.setHours(now.getHours(), now.getMinutes());
                                          field.onChange(date.toISOString());
                                       }
                                    }}
                                    disabled={(date) =>
                                       date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                 />
                                 <div className="p-3 border-t">
                                    <div className="flex items-center space-x-2">
                                       <Clock className="h-4 w-4" />
                                       <Input
                                          type="time"
                                          value={
                                             field.value
                                                ? format(new Date(field.value), 'HH:mm')
                                                : ''
                                          }
                                          onChange={(e) => {
                                             if (field.value) {
                                                const date = new Date(field.value);
                                                const [hours, minutes] = e.target.value.split(':');
                                                date.setHours(parseInt(hours), parseInt(minutes));
                                                field.onChange(date.toISOString());
                                             }
                                          }}
                                       />
                                    </div>
                                 </div>
                              </PopoverContent>
                           </Popover>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="status"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Status</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="PENDING">Pending</SelectItem>
                                 <SelectItem value="PUBLISHED">Published</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                     <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={loading}>
                        {loading ? 'Scheduling...' : 'Schedule Content'}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
