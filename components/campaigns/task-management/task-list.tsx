'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, MoreHorizontal, Filter, Search, Flag, Calendar, User } from 'lucide-react';
import type { CampaignTask } from '@/types/campaign';

interface TaskListProps {
   tasks: CampaignTask[];
   onTaskUpdate: (taskId: string, data: Partial<CampaignTask>) => void;
   onTaskDelete: (taskId: string) => void;
   onTaskCreate: () => void;
   onTaskClick: (task: CampaignTask) => void;
   onBulkAction: (action: string, taskIds: string[]) => void;
}

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500' },
   REVIEW: { label: 'Review', color: 'bg-yellow-500' },
   DONE: { label: 'Done', color: 'bg-green-500' },
   CANCELLED: { label: 'Cancelled', color: 'bg-red-500' },
};

const taskPriorityConfig = {
   NO_PRIORITY: { label: 'No Priority', color: 'bg-gray-400' },
   LOW: { label: 'Low', color: 'bg-green-400' },
   MEDIUM: { label: 'Medium', color: 'bg-yellow-400' },
   HIGH: { label: 'High', color: 'bg-orange-400' },
   URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

export function TaskList({
   tasks,
   onTaskUpdate,
   onTaskDelete,
   onTaskCreate,
   onTaskClick,
   onBulkAction,
}: TaskListProps) {
   const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [priorityFilter, setPriorityFilter] = useState<string>('all');
   const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

   const filteredTasks = useMemo(() => {
      return tasks.filter((task) => {
         const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
         const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
         const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
         const matchesAssignee =
            assigneeFilter === 'all' ||
            (assigneeFilter === 'unassigned' && !task.assignee) ||
            (task.assignee && task.assignee.id === assigneeFilter);

         return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
      });
   }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

   const handleSelectAll = (checked: boolean) => {
      if (checked) {
         setSelectedTasks(new Set(filteredTasks.map((task) => task.id)));
      } else {
         setSelectedTasks(new Set());
      }
   };

   const handleSelectTask = (taskId: string, checked: boolean) => {
      const newSelected = new Set(selectedTasks);
      if (checked) {
         newSelected.add(taskId);
      } else {
         newSelected.delete(taskId);
      }
      setSelectedTasks(newSelected);
   };

   const handleBulkAction = (action: string) => {
      const taskIds = Array.from(selectedTasks);
      if (taskIds.length === 0) return;

      onBulkAction(action, taskIds);
      setSelectedTasks(new Set());
   };

   const formatDate = (date: Date | string | null) => {
      if (!date) return 'Not set';
      return new Date(date).toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      });
   };

   const getDaysRemaining = (dueDate: Date | string | null) => {
      if (!dueDate) return null;
      const now = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
   };

   const renderPriorityBadge = (priority: CampaignTask['priority']) => {
      if (priority === 'NO_PRIORITY') return null;
      const config = taskPriorityConfig[priority];
      return (
         <Badge variant="outline" className={`${config.color} text-white border-0 text-xs`}>
            <Flag className="h-2 w-2 mr-1" />
            {config.label}
         </Badge>
      );
   };

   const renderStatusBadge = (status: CampaignTask['status']) => {
      const config = taskStatusConfig[status];
      return <Badge className={`${config.color} text-white text-xs`}>{config.label}</Badge>;
   };

   const renderDueDate = (dueDate: Date | string | null) => {
      if (!dueDate) return <span className="text-muted-foreground">Not set</span>;

      const daysRemaining = getDaysRemaining(dueDate);
      const formattedDate = formatDate(dueDate);

      if (daysRemaining === null) return formattedDate;

      let className = '';
      if (daysRemaining < 0) {
         className = 'text-red-600 font-medium';
      } else if (daysRemaining <= 3) {
         className = 'text-orange-600 font-medium';
      } else if (daysRemaining <= 7) {
         className = 'text-yellow-600 font-medium';
      }

      return (
         <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className={className}>{formattedDate}</span>
            {daysRemaining !== null && (
               <span className={`text-xs ${className}`}>
                  {daysRemaining < 0
                     ? `${Math.abs(daysRemaining)}d overdue`
                     : `${daysRemaining}d left`}
               </span>
            )}
         </div>
      );
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold">Tasks</h2>
               <p className="text-muted-foreground">
                  {filteredTasks.length} of {tasks.length} tasks
               </p>
            </div>
            <Button onClick={onTaskCreate}>
               <Plus className="h-4 w-4 mr-2" />
               New Task
            </Button>
         </div>

         {/* Filters and Search */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search tasks..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>

            <div className="flex gap-2">
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                     <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Status</SelectItem>
                     {Object.entries(taskStatusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                           {config.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>

               <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                     <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Priority</SelectItem>
                     {Object.entries(taskPriorityConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                           {config.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>

               <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-36">
                     <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Assignees</SelectItem>
                     <SelectItem value="unassigned">Unassigned</SelectItem>
                     {/* In a real app, you'd map through campaign members here */}
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Bulk Actions */}
         {selectedTasks.size > 0 && (
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
               <span className="text-sm font-medium">
                  {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
               </span>
               <div className="flex gap-2">
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => handleBulkAction('status', Array.from(selectedTasks))}
                  >
                     Change Status
                  </Button>
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => handleBulkAction('assign', Array.from(selectedTasks))}
                  >
                     Reassign
                  </Button>
                  <Button
                     size="sm"
                     variant="destructive"
                     onClick={() => handleBulkAction('delete', Array.from(selectedTasks))}
                  >
                     Delete
                  </Button>
               </div>
            </div>
         )}

         {/* Task Table */}
         <div className="border rounded-lg">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-12">
                        <Checkbox
                           checked={
                              selectedTasks.size === filteredTasks.length &&
                              filteredTasks.length > 0
                           }
                           onCheckedChange={handleSelectAll}
                        />
                     </TableHead>
                     <TableHead>Task</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Priority</TableHead>
                     <TableHead>Assignee</TableHead>
                     <TableHead>Due Date</TableHead>
                     <TableHead>Subtasks</TableHead>
                     <TableHead className="w-12"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredTasks.map((task) => (
                     <TableRow key={task.id} className="hover:bg-muted/50">
                        <TableCell>
                           <Checkbox
                              checked={selectedTasks.has(task.id)}
                              onCheckedChange={(checked) =>
                                 handleSelectTask(task.id, checked as boolean)
                              }
                           />
                        </TableCell>
                        <TableCell>
                           <div className="space-y-1">
                              <div
                                 className="font-medium cursor-pointer hover:text-blue-600"
                                 onClick={() => onTaskClick(task)}
                              >
                                 {task.title}
                              </div>
                              {task.description && (
                                 <p className="text-sm text-muted-foreground line-clamp-2">
                                    {task.description}
                                 </p>
                              )}
                           </div>
                        </TableCell>
                        <TableCell>{renderStatusBadge(task.status)}</TableCell>
                        <TableCell>{renderPriorityBadge(task.priority)}</TableCell>
                        <TableCell>
                           {task.assignee ? (
                              <div className="flex items-center gap-2">
                                 <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.image || ''} />
                                    <AvatarFallback className="text-xs">
                                       {task.assignee.name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                 </Avatar>
                                 <span className="text-sm">{task.assignee.name}</span>
                              </div>
                           ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                           )}
                        </TableCell>
                        <TableCell>{renderDueDate(task.dueDate)}</TableCell>
                        <TableCell>
                           {task.subtasks && task.subtasks.length > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                 {task.subtasks.length} subtask
                                 {task.subtasks.length !== 1 ? 's' : ''}
                              </Badge>
                           ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                           )}
                        </TableCell>
                        <TableCell>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuItem onClick={() => onTaskClick(task)}>
                                    View Details
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    onClick={() => onTaskUpdate(task.id, { status: 'DONE' })}
                                 >
                                    Mark as Done
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    onClick={() => onTaskDelete(task.id)}
                                    className="text-destructive"
                                 >
                                    Delete Task
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>

            {filteredTasks.length === 0 && (
               <div className="text-center py-12">
                  <p className="text-muted-foreground">No tasks found</p>
                  {searchTerm ||
                  statusFilter !== 'all' ||
                  priorityFilter !== 'all' ||
                  assigneeFilter !== 'all' ? (
                     <Button
                        variant="outline"
                        onClick={() => {
                           setSearchTerm('');
                           setStatusFilter('all');
                           setPriorityFilter('all');
                           setAssigneeFilter('all');
                        }}
                     >
                        Clear filters
                     </Button>
                  ) : (
                     <Button onClick={onTaskCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first task
                     </Button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
