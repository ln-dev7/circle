import { groupIssuesByStatus, Issue, issues as mockIssues } from '@/lib/mock-data/issues';
import { LabelInterface } from '@/lib/mock-data/labels';
import { Priority } from '@/lib/mock-data/priorities';
import { Project } from '@/lib/mock-data/projects';
import { Status } from '@/lib/mock-data/status';
import { User } from '@/lib/mock-data/users';
import { create } from 'zustand';

interface IssuesState {
   // Data
   issues: Issue[];
   issuesByStatus: Record<string, Issue[]>;

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

   // Status management
   updateIssueStatus: (issueId: string, newStatus: Status) => void;

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
         return get().issues.filter((issue) => issue.assignees === null);
      }
      return get().issues.filter((issue) => issue.assignees?.id === userId);
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

   // Status management
   updateIssueStatus: (issueId: string, newStatus: Status) => {
      get().updateIssue(issueId, { status: newStatus });
   },

   // Priority management
   updateIssuePriority: (issueId: string, newPriority: Priority) => {
      get().updateIssue(issueId, { priority: newPriority });
   },

   // Assignee management
   updateIssueAssignee: (issueId: string, newAssignee: User | null) => {
      get().updateIssue(issueId, { assignees: newAssignee });
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
