import type {
   Campaign as PrismaCampaign,
   CampaignMember as PrismaCampaignMember,
   CampaignTask as PrismaCampaignTask,
   CampaignLabel as PrismaCampaignLabel,
   CampaignMilestone as PrismaCampaignMilestone,
   User,
   Content,
   Schedule,
   CampaignStatus,
   CampaignHealth,
   CampaignPriority,
   CampaignMemberRole,
   TaskStatus,
   TaskPriority,
} from '@prisma/client';

// Base interfaces
export interface Campaign extends PrismaCampaign {
   lead?: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
   } | null;
   members?: CampaignMember[];
   tasks?: CampaignTask[];
   labels?: CampaignLabel[];
   milestones?: CampaignMilestone[];
   contents?: Content[];
   schedules?: Schedule[];
   _count?: {
      tasks: number;
      members: number;
      labels: number;
      milestones: number;
      contents: number;
      schedules: number;
   };
}

export interface CampaignMember extends PrismaCampaignMember {
   user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
   };
}

export interface CampaignTask extends PrismaCampaignTask {
   assignee?: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
   } | null;
   subtasks?: CampaignTask[];
   parentTask?: CampaignTask | null;
   _count?: {
      subtasks: number;
   };
}

export interface CampaignLabel extends PrismaCampaignLabel {}

export interface CampaignMilestone extends PrismaCampaignMilestone {}

// Form interfaces
export interface CreateCampaignData {
   name: string;
   summary?: string;
   description?: string;
   status?: CampaignStatus;
   health?: CampaignHealth;
   priority?: CampaignPriority;
   leadId?: string;
   startDate?: string;
   targetDate?: string;
}

export interface UpdateCampaignData {
   name?: string;
   summary?: string;
   description?: string;
   status?: CampaignStatus;
   health?: CampaignHealth;
   priority?: CampaignPriority;
   leadId?: string;
   startDate?: string;
   targetDate?: string;
}

export interface CreateTaskData {
   title: string;
   description?: string;
   status?: TaskStatus;
   priority?: TaskPriority;
   assigneeId?: string;
   parentTaskId?: string;
   dueDate?: string;
   campaignId: string;
}

export interface UpdateTaskData {
   title?: string;
   description?: string;
   status?: TaskStatus;
   priority?: TaskPriority;
   assigneeId?: string;
   parentTaskId?: string;
   dueDate?: string;
   completedAt?: string;
}

export interface CreateLabelData {
   name: string;
   color?: string;
}

export interface UpdateLabelData {
   name?: string;
   color?: string;
}

export interface CreateMilestoneData {
   title: string;
   description?: string;
   dueDate: string;
}

export interface UpdateMilestoneData {
   title?: string;
   description?: string;
   dueDate?: string;
   completedAt?: string;
}

export interface AddMemberData {
   userId: string;
   role?: CampaignMemberRole;
}

export interface UpdateMemberData {
   role: CampaignMemberRole;
}

// Filter interfaces
export interface CampaignFilters {
   status?: CampaignStatus;
   health?: CampaignHealth;
   priority?: CampaignPriority;
   search?: string;
   leadId?: string;
   memberId?: string;
   startDate?: string;
   endDate?: string;
}

export interface TaskFilters {
   status?: TaskStatus;
   priority?: TaskPriority;
   assigneeId?: string;
   search?: string;
   parentTaskId?: string;
   dueDate?: string;
}

// Pagination interfaces
export interface PaginationParams {
   page?: number;
   limit?: number;
}

export interface PaginationMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
   data: T[];
   pagination: PaginationMeta;
}

// API response interfaces
export interface CampaignsResponse extends PaginatedResponse<Campaign> {
   campaigns: Campaign[];
}

export interface TasksResponse extends PaginatedResponse<CampaignTask> {
   tasks: CampaignTask[];
}

// Component prop interfaces
export interface CampaignListProps {
   campaigns: Campaign[];
   filters: CampaignFilters;
   pagination: PaginationMeta;
   onFilterChange: (filters: CampaignFilters) => void;
   onPageChange: (page: number) => void;
   onCreateCampaign: () => void;
   onSelectCampaign: (campaign: Campaign) => void;
   onEditCampaign: (campaign: Campaign) => void;
   onDeleteCampaign: (campaign: Campaign) => void;
}

export interface CampaignCardProps {
   campaign: Campaign;
   onSelect: (campaign: Campaign) => void;
   onEdit: (campaign: Campaign) => void;
   onDelete: (campaign: Campaign) => void;
   className?: string;
}

export interface CampaignTableProps {
   campaigns: Campaign[];
   onSelect: (campaign: Campaign) => void;
   onEdit: (campaign: Campaign) => void;
   onDelete: (campaign: Campaign) => void;
   loading?: boolean;
}

export interface CampaignFormProps {
   campaign?: Campaign;
   onSubmit: (data: CreateCampaignData | UpdateCampaignData) => void;
   onCancel: () => void;
   teams: User[];
   members: User[];
   loading?: boolean;
}

export interface CampaignDetailProps {
   campaign: Campaign;
   onUpdate: (data: UpdateCampaignData) => void;
   onDelete: () => void;
   onAddMember: (data: AddMemberData) => void;
   onRemoveMember: (memberId: string) => void;
   onCreateTask: (data: CreateTaskData) => void;
   onUpdateTask: (taskId: string, data: UpdateTaskData) => void;
   onDeleteTask: (taskId: string) => void;
   loading?: boolean;
}

export interface CampaignFiltersProps {
   filters: CampaignFilters;
   onChange: (filters: CampaignFilters) => void;
   teams: User[];
   members: User[];
}

export interface CampaignSearchProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
}

export interface CampaignStatsProps {
   stats: {
      total: number;
      draft: number;
      planning: number;
      ready: number;
      done: number;
      canceled: number;
      onTrack: number;
      atRisk: number;
      offTrack: number;
   };
}

// Task component interfaces
export interface TaskListProps {
   tasks: CampaignTask[];
   onUpdateTask: (taskId: string, data: UpdateTaskData) => void;
   onDeleteTask: (taskId: string) => void;
   onCreateSubtask: (parentTaskId: string, data: CreateTaskData) => void;
   loading?: boolean;
}

export interface TaskItemProps {
   task: CampaignTask;
   onUpdate: (data: UpdateTaskData) => void;
   onDelete: () => void;
   onCreateSubtask: (data: CreateTaskData) => void;
   level?: number;
}

export interface TaskFormProps {
   task?: CampaignTask;
   parentTask?: CampaignTask;
   onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
   onCancel: () => void;
   members: User[];
   loading?: boolean;
}

// Label component interfaces
export interface LabelListProps {
   labels: CampaignLabel[];
   onUpdate: (labelId: string, data: UpdateLabelData) => void;
   onDelete: (labelId: string) => void;
   editable?: boolean;
}

export interface LabelItemProps {
   label: CampaignLabel;
   onUpdate?: (data: UpdateLabelData) => void;
   onDelete?: () => void;
   editable?: boolean;
   size?: 'sm' | 'md' | 'lg';
}

export interface LabelFormProps {
   label?: CampaignLabel;
   onSubmit: (data: CreateLabelData | UpdateLabelData) => void;
   onCancel: () => void;
   loading?: boolean;
}

// Milestone component interfaces
export interface MilestoneListProps {
   milestones: CampaignMilestone[];
   onUpdate: (milestoneId: string, data: UpdateMilestoneData) => void;
   onDelete: (milestoneId: string) => void;
   editable?: boolean;
}

export interface MilestoneItemProps {
   milestone: CampaignMilestone;
   onUpdate?: (data: UpdateMilestoneData) => void;
   onDelete?: () => void;
   editable?: boolean;
}

export interface MilestoneFormProps {
   milestone?: CampaignMilestone;
   onSubmit: (data: CreateMilestoneData | UpdateMilestoneData) => void;
   onCancel: () => void;
   loading?: boolean;
}

// Status and priority utilities
export const CAMPAIGN_STATUSES: CampaignStatus[] = [
   'DRAFT',
   'PLANNING',
   'READY',
   'DONE',
   'CANCELED',
];

export const CAMPAIGN_HEALTH_OPTIONS: CampaignHealth[] = ['ON_TRACK', 'AT_RISK', 'OFF_TRACK'];

export const CAMPAIGN_PRIORITIES: CampaignPriority[] = [
   'NO_PRIORITY',
   'LOW',
   'MEDIUM',
   'HIGH',
   'URGENT',
];

export const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED'];

export const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const CAMPAIGN_MEMBER_ROLES: CampaignMemberRole[] = ['OWNER', 'MANAGER', 'MEMBER', 'VIEWER'];

// Utility type guards
export const isCampaignStatus = (value: string): value is CampaignStatus => {
   return CAMPAIGN_STATUSES.includes(value as CampaignStatus);
};

export const isCampaignHealth = (value: string): value is CampaignHealth => {
   return CAMPAIGN_HEALTH_OPTIONS.includes(value as CampaignHealth);
};

export const isCampaignPriority = (value: string): value is CampaignPriority => {
   return CAMPAIGN_PRIORITIES.includes(value as CampaignPriority);
};

export const isTaskStatus = (value: string): value is TaskStatus => {
   return TASK_STATUSES.includes(value as TaskStatus);
};

export const isTaskPriority = (value: string): value is TaskPriority => {
   return TASK_PRIORITIES.includes(value as TaskPriority);
};

export const isCampaignMemberRole = (value: string): value is CampaignMemberRole => {
   return CAMPAIGN_MEMBER_ROLES.includes(value as CampaignMemberRole);
};
