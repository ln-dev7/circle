import { groupIssuesByStatus, Issue, issues as mockIssues } from '@/mock-data/issues';
import { LabelInterface } from '@/mock-data/labels';
import { Priority } from '@/mock-data/priorities';
import { Project } from '@/mock-data/projects';
import { Status } from '@/mock-data/status';
import { User } from '@/mock-data/users';
import { create } from 'zustand';

interface FilterOptions {
   status?: string[];
   assignee?: string[];
   priority?: string[];
   labels?: string[];
   project?: string[];
}

interface IssuesState {
   // Data
   issues: Issue[];
   issuesByStatus: Record<string, Issue[]>;

   //
   getAllIssues: () => Issue[];

   // Actions
   addIssue: (issue: Issue) => void;
   updateIssue: (id: string, updatedIssue: Partial<Issue>) => void;
   deleteIssue: (id: string) => void;

   // Filters
   filterByStatus: (statusId: string) => Issue[];
   filterByPriority: (priorityId: string) => Issue[];
   filterByAssignee: (userId: string | null) => Issue[];
   filterByLabel: (labelId: string) => Issue[];
   filterByProject: (projectId: string) => Issue[];
   searchIssues: (query: string) => Issue[];
   filterIssues: (filters: FilterOptions) => Issue[];

   // Status management
   updateIssueStatus: (issueId: string, newStatus: Status) => void;
   moveIssueInList: (issueId: string, newStatus: Status, newRank: string) => void;

   // Priority management
   updateIssuePriority: (issueId: string, newPriority: Priority) => void;

   // Assignee management
   updateIssueAssignee: (issueId: string, newAssignee: User | null) => void;

   // Labels management
   addIssueLabel: (issueId: string, label: LabelInterface) => void;
   removeIssueLabel: (issueId: string, labelId: string) => void;

   // Project management
   updateIssueProject: (issueId: string, newProject: Project | undefined) => void;

   // Utility functions
   getIssueById: (id: string) => Issue | undefined;
}

export const useIssuesStore = create<IssuesState>((set, get) => ({
   // Initial state
   issues: mockIssues.sort((a, b) => b.rank.localeCompare(a.rank)),
   issuesByStatus: groupIssuesByStatus(mockIssues),

   //
   getAllIssues: () => get().issues,

   // Actions
   addIssue: (issue: Issue) => {
      set((state) => {
         const newIssues = [...state.issues, issue];
         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   updateIssue: (id: string, updatedIssue: Partial<Issue>) => {
      set((state) => {
         const newIssues = state.issues.map((issue) =>
            issue.id === id ? { ...issue, ...updatedIssue } : issue
         );

         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   deleteIssue: (id: string) => {
      set((state) => {
         const newIssues = state.issues.filter((issue) => issue.id !== id);
         return {
            issues: newIssues,
            issuesByStatus: groupIssuesByStatus(newIssues),
         };
      });
   },

   // Filters
   filterByStatus: (statusId: string) => {
      return get().issues.filter((issue) => issue.status.id === statusId);
   },

   filterByPriority: (priorityId: string) => {
      return get().issues.filter((issue) => issue.priority.id === priorityId);
   },

   filterByAssignee: (userId: string | null) => {
      if (userId === null) {
         return get().issues.filter((issue) => issue.assignee === null);
      }
      return get().issues.filter((issue) => issue.assignee?.id === userId);
   },

   filterByLabel: (labelId: string) => {
      return get().issues.filter((issue) => issue.labels.some((label) => label.id === labelId));
   },

   filterByProject: (projectId: string) => {
      return get().issues.filter((issue) => issue.project?.id === projectId);
   },

   searchIssues: (query: string) => {
      const lowerCaseQuery = query.toLowerCase();
      return get().issues.filter(
         (issue) =>
            issue.title.toLowerCase().includes(lowerCaseQuery) ||
            issue.identifier.toLowerCase().includes(lowerCaseQuery)
      );
   },

   filterIssues: (filters: FilterOptions) => {
      let filteredIssues = get().issues;

      // Filter by status
      if (filters.status && filters.status.length > 0) {
         filteredIssues = filteredIssues.filter((issue) =>
            filters.status!.includes(issue.status.id)
         );
      }

      // Filter by assignee
      if (filters.assignee && filters.assignee.length > 0) {
         filteredIssues = filteredIssues.filter((issue) => {
            if (filters.assignee!.includes('unassigned')) {
               // If 'unassigned' is selected and the issue has no assignee
               if (issue.assignee === null) {
                  return true;
               }
            }
            // Check if the issue's assignee is in the selected assignees
            return issue.assignee && filters.assignee!.includes(issue.assignee.id);
         });
      }

      // Filter by priority
      if (filters.priority && filters.priority.length > 0) {
         filteredIssues = filteredIssues.filter((issue) =>
            filters.priority!.includes(issue.priority.id)
         );
      }

      // Filter by labels
      if (filters.labels && filters.labels.length > 0) {
         filteredIssues = filteredIssues.filter((issue) =>
            issue.labels.some((label) => filters.labels!.includes(label.id))
         );
      }

      // Filter by project
      if (filters.project && filters.project.length > 0) {
         filteredIssues = filteredIssues.filter(
            (issue) => issue.project && filters.project!.includes(issue.project.id)
         );
      }

      return filteredIssues;
   },

   // Status management
   updateIssueStatus: (issueId: string, newStatus: Status) => {
      get().updateIssue(issueId, { status: newStatus });
   },
   moveIssueInList: (issueId: string, newStatus: Status, newRank: string) => {
      get().updateIssue(issueId, { status: newStatus, rank: newRank });
   },

   // Priority management
   updateIssuePriority: (issueId: string, newPriority: Priority) => {
      get().updateIssue(issueId, { priority: newPriority });
   },

   // Assignee management
   updateIssueAssignee: (issueId: string, newAssignee: User | null) => {
      get().updateIssue(issueId, { assignee: newAssignee });
   },

   // Labels management
   addIssueLabel: (issueId: string, label: LabelInterface) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
         const updatedLabels = [...issue.labels, label];
         get().updateIssue(issueId, { labels: updatedLabels });
      }
   },

   removeIssueLabel: (issueId: string, labelId: string) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
         const updatedLabels = issue.labels.filter((label) => label.id !== labelId);
         get().updateIssue(issueId, { labels: updatedLabels });
      }
   },

   // Project management
   updateIssueProject: (issueId: string, newProject: Project | undefined) => {
      get().updateIssue(issueId, { project: newProject });
   },

   // Utility functions
   getIssueById: (id: string) => {
      return get().issues.find((issue) => issue.id === id);
   },
}));
