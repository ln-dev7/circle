'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { CampaignTask, CampaignMember } from '@/types/campaign';

interface TaskCreationModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit: (taskData: Partial<CampaignTask>) => void;
   campaignMembers: CampaignMember[];
   parentTask?: CampaignTask | null;
   loading?: boolean;
}

const taskPriorityOptions = [
   { value: 'NO_PRIORITY', label: 'No Priority' },
   { value: 'LOW', label: 'Low' },
   { value: 'MEDIUM', label: 'Medium' },
   { value: 'HIGH', label: 'High' },
   { value: 'URGENT', label: 'Urgent' },
];

const taskStatusOptions = [
   { value: 'TODO', label: 'To Do' },
   { value: 'IN_PROGRESS', label: 'In Progress' },
   { value: 'REVIEW', label: 'Review' },
   { value: 'DONE', label: 'Done' },
   { value: 'CANCELLED', label: 'Cancelled' },
];

export function TaskCreationModal({
   open,
   onOpenChange,
   onSubmit,
   campaignMembers,
   parentTask,
   loading = false,
}: TaskCreationModalProps) {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      status: 'TODO' as CampaignTask['status'],
      priority: 'NO_PRIORITY' as CampaignTask['priority'],
      assigneeId: '',
      dueDate: null as Date | null,
      estimatedHours: '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim()) return;

      const taskData: Partial<CampaignTask> = {
         title: formData.title.trim(),
         description: formData.description.trim() || undefined,
         status: formData.status,
         priority: formData.priority,
         assigneeId: formData.assigneeId || undefined,
         dueDate: formData.dueDate || undefined,
         estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
         parentTaskId: parentTask?.id,
      };

      onSubmit(taskData);
   };

   const resetForm = () => {
      setFormData({
         title: '',
         description: '',
         status: 'TODO',
         priority: 'NO_PRIORITY',
         assigneeId: '',
         dueDate: null,
         estimatedHours: '',
      });
   };

   const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
         resetForm();
      }
      onOpenChange(newOpen);
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
               <DialogTitle>{parentTask ? 'Create Subtask' : 'Create New Task'}</DialogTitle>
               <DialogDescription>
                  {parentTask
                     ? `Add a subtask to "${parentTask.title}"`
                     : 'Create a new task for this campaign'}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="title">Task Title *</Label>
                     <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                           setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Enter task title"
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="status">Status</Label>
                     <Select
                        value={formData.status}
                        onValueChange={(value) =>
                           setFormData((prev) => ({
                              ...prev,
                              status: value as CampaignTask['status'],
                           }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {taskStatusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
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
                     value={formData.description}
                     onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                     }
                     placeholder="Describe what needs to be done..."
                     rows={3}
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="priority">Priority</Label>
                     <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                           setFormData((prev) => ({
                              ...prev,
                              priority: value as CampaignTask['priority'],
                           }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {taskPriorityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="assignee">Assignee</Label>
                     <Select
                        value={formData.assigneeId}
                        onValueChange={(value) =>
                           setFormData((prev) => ({ ...prev, assigneeId: value }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="">Unassigned</SelectItem>
                           {campaignMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                 <div className="flex items-center gap-2">
                                    <span>{member.user.name}</span>
                                    <span className="text-muted-foreground">({member.role})</span>
                                 </div>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Due Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className={cn(
                                 'w-full justify-start text-left font-normal',
                                 !formData.dueDate && 'text-muted-foreground'
                              )}
                           >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.dueDate ? format(formData.dueDate, 'PPP') : 'Pick a date'}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              mode="single"
                              selected={formData.dueDate || undefined}
                              onSelect={(date) =>
                                 setFormData((prev) => ({ ...prev, dueDate: date }))
                              }
                              initialFocus
                           />
                        </PopoverContent>
                     </Popover>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="estimatedHours">Estimated Hours</Label>
                     <Input
                        id="estimatedHours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.estimatedHours}
                        onChange={(e) =>
                           setFormData((prev) => ({ ...prev, estimatedHours: e.target.value }))
                        }
                        placeholder="e.g., 8"
                     />
                  </div>
               </div>

               {parentTask && (
                  <div className="p-3 bg-muted rounded-lg">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4" />
                        This task will be a subtask of "{parentTask.title}"
                     </div>
                  </div>
               )}

               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => handleOpenChange(false)}
                     disabled={loading}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !formData.title.trim()}>
                     {loading ? 'Creating...' : 'Create Task'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
