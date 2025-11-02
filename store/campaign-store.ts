import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
   Campaign,
   CampaignTask,
   CampaignMember,
   CampaignLabel,
   CampaignMilestone,
   CampaignFilters,
   TaskFilters,
   PaginationMeta,
   CreateCampaignData,
   UpdateCampaignData,
   CreateTaskData,
   UpdateTaskData,
   CreateLabelData,
   UpdateLabelData,
   CreateMilestoneData,
   UpdateMilestoneData,
   AddMemberData,
   UpdateMemberData,
} from '@/types/campaign';

// Types for the store
interface CampaignState {
   // Data
   campaigns: Campaign[];
   currentCampaign: Campaign | null;
   tasks: CampaignTask[];
   members: CampaignMember[];
   labels: CampaignLabel[];
   milestones: CampaignMilestone[];

   // UI State
   loading: boolean;
   error: string | null;
   filters: CampaignFilters;
   taskFilters: TaskFilters;
   pagination: PaginationMeta;
   selectedCampaignId: string | null;

   // View State
   viewMode: 'table' | 'grid' | 'compact';
   sidebarOpen: boolean;
   detailPanelOpen: boolean;

   // Search state
   searchQuery: string;
   searchResults: Campaign[];

   // Actions
   // Campaign CRUD
   setCampaigns: (campaigns: Campaign[]) => void;
   addCampaign: (campaign: Campaign) => void;
   updateCampaign: (id: string, data: Partial<Campaign>) => void;
   removeCampaign: (id: string) => void;
   setCurrentCampaign: (campaign: Campaign | null) => void;

   // Task management
   setTasks: (tasks: CampaignTask[]) => void;
   addTask: (task: CampaignTask) => void;
   updateTask: (id: string, data: Partial<CampaignTask>) => void;
   removeTask: (id: string) => void;
   addSubtask: (parentId: string, subtask: CampaignTask) => void;

   // Member management
   setMembers: (members: CampaignMember[]) => void;
   addMember: (member: CampaignMember) => void;
   updateMember: (id: string, data: Partial<CampaignMember>) => void;
   removeMember: (id: string) => void;

   // Label management
   setLabels: (labels: CampaignLabel[]) => void;
   addLabel: (label: CampaignLabel) => void;
   updateLabel: (id: string, data: Partial<CampaignLabel>) => void;
   removeLabel: (id: string) => void;

   // Milestone management
   setMilestones: (milestones: CampaignMilestone[]) => void;
   addMilestone: (milestone: CampaignMilestone) => void;
   updateMilestone: (id: string, data: Partial<CampaignMilestone>) => void;
   removeMilestone: (id: string) => void;

   // Filtering and search
   setFilters: (filters: Partial<CampaignFilters>) => void;
   clearFilters: () => void;
   setTaskFilters: (filters: Partial<TaskFilters>) => void;
   clearTaskFilters: () => void;
   setSearchQuery: (query: string) => void;
   setSearchResults: (results: Campaign[]) => void;

   // Pagination
   setPagination: (pagination: PaginationMeta) => void;
   setPage: (page: number) => void;

   // UI state
   setLoading: (loading: boolean) => void;
   setError: (error: string | null) => void;
   setViewMode: (mode: 'table' | 'grid' | 'compact') => void;
   setSidebarOpen: (open: boolean) => void;
   setDetailPanelOpen: (open: boolean) => void;
   setSelectedCampaignId: (id: string | null) => void;

   // Computed getters
   getFilteredCampaigns: () => Campaign[];
   getFilteredTasks: () => CampaignTask[];
   getCampaignById: (id: string) => Campaign | undefined;
   getTaskById: (id: string) => CampaignTask | undefined;
   getCampaignTasks: (campaignId: string) => CampaignTask[];
   getCampaignMembers: (campaignId: string) => CampaignMember[];

   // Utility actions
   reset: () => void;
   resetCurrentCampaign: () => void;
}

const initialFilters: CampaignFilters = {};
const initialTaskFilters: TaskFilters = {};
const initialPagination: PaginationMeta = {
   page: 1,
   limit: 20,
   total: 0,
   totalPages: 0,
   hasNextPage: false,
   hasPrevPage: false,
};

export const useCampaignStore = create<CampaignState>()(
   devtools(
      (set, get) => ({
         // Initial state
         campaigns: [],
         currentCampaign: null,
         tasks: [],
         members: [],
         labels: [],
         milestones: [],

         loading: false,
         error: null,
         filters: initialFilters,
         taskFilters: initialTaskFilters,
         pagination: initialPagination,
         selectedCampaignId: null,

         viewMode: 'table',
         sidebarOpen: true,
         detailPanelOpen: false,

         searchQuery: '',
         searchResults: [],

         // Campaign CRUD actions
         setCampaigns: (campaigns) => set({ campaigns }, false, 'setCampaigns'),

         addCampaign: (campaign) =>
            set(
               (state) => ({
                  campaigns: [campaign, ...state.campaigns],
               }),
               false,
               'addCampaign'
            ),

         updateCampaign: (id, data) =>
            set(
               (state) => ({
                  campaigns: state.campaigns.map((campaign) =>
                     campaign.id === id ? { ...campaign, ...data } : campaign
                  ),
                  currentCampaign:
                     state.currentCampaign?.id === id
                        ? { ...state.currentCampaign, ...data }
                        : state.currentCampaign,
               }),
               false,
               'updateCampaign'
            ),

         removeCampaign: (id) =>
            set(
               (state) => ({
                  campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
                  currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
                  selectedCampaignId:
                     state.selectedCampaignId === id ? null : state.selectedCampaignId,
               }),
               false,
               'removeCampaign'
            ),

         setCurrentCampaign: (campaign) =>
            set({ currentCampaign: campaign }, false, 'setCurrentCampaign'),

         // Task management actions
         setTasks: (tasks) => set({ tasks }, false, 'setTasks'),

         addTask: (task) =>
            set(
               (state) => ({
                  tasks: [...state.tasks, task],
               }),
               false,
               'addTask'
            ),

         updateTask: (id, data) =>
            set(
               (state) => ({
                  tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...data } : task)),
               }),
               false,
               'updateTask'
            ),

         removeTask: (id) =>
            set(
               (state) => ({
                  tasks: state.tasks.filter((task) => task.id !== id),
               }),
               false,
               'removeTask'
            ),

         addSubtask: (parentId, subtask) =>
            set(
               (state) => ({
                  tasks: state.tasks.map((task) =>
                     task.id === parentId
                        ? {
                             ...task,
                             subtasks: [...(task.subtasks || []), subtask],
                             _count: {
                                ...task._count,
                                subtasks: (task._count?.subtasks || 0) + 1,
                             },
                          }
                        : task
                  ),
               }),
               false,
               'addSubtask'
            ),

         // Member management actions
         setMembers: (members) => set({ members }, false, 'setMembers'),

         addMember: (member) =>
            set(
               (state) => ({
                  members: [...state.members, member],
               }),
               false,
               'addMember'
            ),

         updateMember: (id, data) =>
            set(
               (state) => ({
                  members: state.members.map((member) =>
                     member.id === id ? { ...member, ...data } : member
                  ),
               }),
               false,
               'updateMember'
            ),

         removeMember: (id) =>
            set(
               (state) => ({
                  members: state.members.filter((member) => member.id !== id),
               }),
               false,
               'removeMember'
            ),

         // Label management actions
         setLabels: (labels) => set({ labels }, false, 'setLabels'),

         addLabel: (label) =>
            set(
               (state) => ({
                  labels: [...state.labels, label],
               }),
               false,
               'addLabel'
            ),

         updateLabel: (id, data) =>
            set(
               (state) => ({
                  labels: state.labels.map((label) =>
                     label.id === id ? { ...label, ...data } : label
                  ),
               }),
               false,
               'updateLabel'
            ),

         removeLabel: (id) =>
            set(
               (state) => ({
                  labels: state.labels.filter((label) => label.id !== id),
               }),
               false,
               'removeLabel'
            ),

         // Milestone management actions
         setMilestones: (milestones) => set({ milestones }, false, 'setMilestones'),

         addMilestone: (milestone) =>
            set(
               (state) => ({
                  milestones: [...state.milestones, milestone],
               }),
               false,
               'addMilestone'
            ),

         updateMilestone: (id, data) =>
            set(
               (state) => ({
                  milestones: state.milestones.map((milestone) =>
                     milestone.id === id ? { ...milestone, ...data } : milestone
                  ),
               }),
               false,
               'updateMilestone'
            ),

         removeMilestone: (id) =>
            set(
               (state) => ({
                  milestones: state.milestones.filter((milestone) => milestone.id !== id),
               }),
               false,
               'removeMilestone'
            ),

         // Filtering and search actions
         setFilters: (newFilters) =>
            set(
               (state) => ({
                  filters: { ...state.filters, ...newFilters },
               }),
               false,
               'setFilters'
            ),

         clearFilters: () => set({ filters: initialFilters }, false, 'clearFilters'),

         setTaskFilters: (newFilters) =>
            set(
               (state) => ({
                  taskFilters: { ...state.taskFilters, ...newFilters },
               }),
               false,
               'setTaskFilters'
            ),

         clearTaskFilters: () =>
            set({ taskFilters: initialTaskFilters }, false, 'clearTaskFilters'),

         setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),

         setSearchResults: (results) => set({ searchResults: results }, false, 'setSearchResults'),

         // Pagination actions
         setPagination: (pagination) => set({ pagination }, false, 'setPagination'),

         setPage: (page) =>
            set(
               (state) => ({
                  pagination: { ...state.pagination, page },
               }),
               false,
               'setPage'
            ),

         // UI state actions
         setLoading: (loading) => set({ loading }, false, 'setLoading'),

         setError: (error) => set({ error }, false, 'setError'),

         setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

         setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),

         setDetailPanelOpen: (open) => set({ detailPanelOpen: open }, false, 'setDetailPanelOpen'),

         setSelectedCampaignId: (id) =>
            set({ selectedCampaignId: id }, false, 'setSelectedCampaignId'),

         // Computed getters
         getFilteredCampaigns: () => {
            const { campaigns, filters, searchQuery } = get();
            let filtered = campaigns;

            // Apply status filter
            if (filters.status) {
               filtered = filtered.filter((campaign) => campaign.status === filters.status);
            }

            // Apply health filter
            if (filters.health) {
               filtered = filtered.filter((campaign) => campaign.health === filters.health);
            }

            // Apply priority filter
            if (filters.priority) {
               filtered = filtered.filter((campaign) => campaign.priority === filters.priority);
            }

            // Apply lead filter
            if (filters.leadId) {
               filtered = filtered.filter((campaign) => campaign.leadId === filters.leadId);
            }

            // Apply member filter
            if (filters.memberId) {
               filtered = filtered.filter((campaign) =>
                  campaign.members?.some((member) => member.userId === filters.memberId)
               );
            }

            // Apply search filter
            const query = filters.search || searchQuery;
            if (query) {
               const lowerQuery = query.toLowerCase();
               filtered = filtered.filter(
                  (campaign) =>
                     campaign.name.toLowerCase().includes(lowerQuery) ||
                     campaign.summary?.toLowerCase().includes(lowerQuery) ||
                     campaign.description?.toLowerCase().includes(lowerQuery)
               );
            }

            // Apply date filters
            if (filters.startDate) {
               const startDate = new Date(filters.startDate);
               filtered = filtered.filter(
                  (campaign) => campaign.startDate && new Date(campaign.startDate) >= startDate
               );
            }

            if (filters.endDate) {
               const endDate = new Date(filters.endDate);
               filtered = filtered.filter(
                  (campaign) => campaign.targetDate && new Date(campaign.targetDate) <= endDate
               );
            }

            return filtered;
         },

         getFilteredTasks: () => {
            const { tasks, taskFilters } = get();
            let filtered = tasks;

            // Apply status filter
            if (taskFilters.status) {
               filtered = filtered.filter((task) => task.status === taskFilters.status);
            }

            // Apply priority filter
            if (taskFilters.priority) {
               filtered = filtered.filter((task) => task.priority === taskFilters.priority);
            }

            // Apply assignee filter
            if (taskFilters.assigneeId) {
               filtered = filtered.filter((task) => task.assigneeId === taskFilters.assigneeId);
            }

            // Apply parent task filter
            if (taskFilters.parentTaskId) {
               filtered = filtered.filter((task) => task.parentTaskId === taskFilters.parentTaskId);
            }

            // Apply search filter
            if (taskFilters.search) {
               const lowerQuery = taskFilters.search.toLowerCase();
               filtered = filtered.filter(
                  (task) =>
                     task.title.toLowerCase().includes(lowerQuery) ||
                     task.description?.toLowerCase().includes(lowerQuery)
               );
            }

            // Apply due date filter
            if (taskFilters.dueDate) {
               const dueDate = new Date(taskFilters.dueDate);
               filtered = filtered.filter(
                  (task) => task.dueDate && new Date(task.dueDate) <= dueDate
               );
            }

            return filtered;
         },

         getCampaignById: (id) => {
            return get().campaigns.find((campaign) => campaign.id === id);
         },

         getTaskById: (id) => {
            return get().tasks.find((task) => task.id === id);
         },

         getCampaignTasks: (campaignId) => {
            return get().tasks.filter((task) => task.campaignId === campaignId);
         },

         getCampaignMembers: (campaignId) => {
            return get().members.filter((member) => member.campaignId === campaignId);
         },

         // Utility actions
         reset: () =>
            set(
               {
                  campaigns: [],
                  currentCampaign: null,
                  tasks: [],
                  members: [],
                  labels: [],
                  milestones: [],
                  loading: false,
                  error: null,
                  filters: initialFilters,
                  taskFilters: initialTaskFilters,
                  pagination: initialPagination,
                  selectedCampaignId: null,
                  viewMode: 'table',
                  sidebarOpen: true,
                  detailPanelOpen: false,
                  searchQuery: '',
                  searchResults: [],
               },
               false,
               'reset'
            ),

         resetCurrentCampaign: () =>
            set(
               {
                  currentCampaign: null,
                  tasks: [],
                  members: [],
                  labels: [],
                  milestones: [],
                  selectedCampaignId: null,
                  detailPanelOpen: false,
               },
               false,
               'resetCurrentCampaign'
            ),
      }),
      {
         name: 'campaign-store',
      }
   )
);

// Selector hooks for performance optimization
export const useCampaigns = () => useCampaignStore((state) => state.campaigns);
export const useCurrentCampaign = () => useCampaignStore((state) => state.currentCampaign);
export const useCampaignTasks = () => useCampaignStore((state) => state.tasks);
export const useCampaignMembers = () => useCampaignStore((state) => state.members);
export const useCampaignLabels = () => useCampaignStore((state) => state.labels);
export const useCampaignMilestones = () => useCampaignStore((state) => state.milestones);
export const useCampaignLoading = () => useCampaignStore((state) => state.loading);
export const useCampaignError = () => useCampaignStore((state) => state.error);
export const useCampaignFilters = () => useCampaignStore((state) => state.filters);
export const useCampaignPagination = () => useCampaignStore((state) => state.pagination);
export const useCampaignViewMode = () => useCampaignStore((state) => state.viewMode);
export const useSelectedCampaignId = () => useCampaignStore((state) => state.selectedCampaignId);

// Actions selector hooks
export const useCampaignActions = () =>
   useCampaignStore((state) => ({
      setCampaigns: state.setCampaigns,
      addCampaign: state.addCampaign,
      updateCampaign: state.updateCampaign,
      removeCampaign: state.removeCampaign,
      setCurrentCampaign: state.setCurrentCampaign,
      setLoading: state.setLoading,
      setError: state.setError,
      setFilters: state.setFilters,
      clearFilters: state.clearFilters,
      setPagination: state.setPagination,
      setPage: state.setPage,
      setViewMode: state.setViewMode,
      setSelectedCampaignId: state.setSelectedCampaignId,
      reset: state.reset,
      resetCurrentCampaign: state.resetCurrentCampaign,
   }));

export const useTaskActions = () =>
   useCampaignStore((state) => ({
      setTasks: state.setTasks,
      addTask: state.addTask,
      updateTask: state.updateTask,
      removeTask: state.removeTask,
      addSubtask: state.addSubtask,
      setTaskFilters: state.setTaskFilters,
      clearTaskFilters: state.clearTaskFilters,
   }));

export const useMemberActions = () =>
   useCampaignStore((state) => ({
      setMembers: state.setMembers,
      addMember: state.addMember,
      updateMember: state.updateMember,
      removeMember: state.removeMember,
   }));

export const useLabelActions = () =>
   useCampaignStore((state) => ({
      setLabels: state.setLabels,
      addLabel: state.addLabel,
      updateLabel: state.updateLabel,
      removeLabel: state.removeLabel,
   }));

export const useMilestoneActions = () =>
   useCampaignStore((state) => ({
      setMilestones: state.setMilestones,
      addMilestone: state.addMilestone,
      updateMilestone: state.updateMilestone,
      removeMilestone: state.removeMilestone,
   }));

// Computed selector hooks
export const useFilteredCampaigns = () => useCampaignStore((state) => state.getFilteredCampaigns());

export const useFilteredTasks = () => useCampaignStore((state) => state.getFilteredTasks());

export const useCampaignById = (id: string) =>
   useCampaignStore((state) => state.getCampaignById(id));

export const useTaskById = (id: string) => useCampaignStore((state) => state.getTaskById(id));

export const useCampaignTasksById = (campaignId: string) =>
   useCampaignStore((state) => state.getCampaignTasks(campaignId));

export const useCampaignMembersById = (campaignId: string) =>
   useCampaignStore((state) => state.getCampaignMembers(campaignId));
