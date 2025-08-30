import { z } from 'zod';

export const taskPriorityEnum = z.enum(['LOW', 'MED', 'HIGH', 'URGENT']);
export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'PAUSED', 'WAITING']);

export const memberStatusEnum = z.enum(['online', 'offline', 'away']);
export const memberRoleEnum = z.enum(['Member', 'Admin', 'Guest']);

export const teamSchema = z.object({
   id: z.string(),
   name: z.string(),
   icon: z.string(),
   color: z.string(),
   joined: z.boolean().default(false),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
});

export const memberSchema = z.object({
   id: z.string(),
   name: z.string(),
   email: z.string().email(),
   avatarUrl: z.string().url().optional(),
   status: memberStatusEnum,
   role: memberRoleEnum,
   joinedAt: z.date().optional(),
});

export const projectSchema = z.object({
   id: z.string(),
   name: z.string(),
   status: z.string(),
   icon: z.string().optional(),
   percentComplete: z.number().int().min(0).max(100).default(0),
   startDate: z.date().optional(),
   teamId: z.string().optional(),
   leadId: z.string().optional(),
   priority: z.string().optional(),
   health: z.string().optional(),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
});

export const taskSchema = z.object({
   id: z.number().int(),
   title: z.string(),
   description: z.string().optional(),
   priority: taskPriorityEnum,
   status: taskStatusEnum,
   dueAt: z.date().nullable(),
   createdAt: z.date(),
   updatedAt: z.date(),
   effortMinutes: z.number().int().nullable(),
   person: z.string().nullable(),
   context: z.string().nullable(),
   impact: z.string().nullable(),
   waitingOn: z.string().nullable(),
   why: z.string().nullable(),
   projectId: z.string().nullable(),
   assigneeId: z.string().nullable(),
});

export const commentSchema = z.object({
   id: z.number().int(),
   taskId: z.number().int(),
   authorId: z.string(),
   body: z.string(),
   createdAt: z.date(),
   updatedAt: z.date(),
});

export const projectMemberSchema = z.object({
   projectId: z.string(),
   memberId: z.string(),
});

export const teamMemberSchema = z.object({
   teamId: z.string(),
   memberId: z.string(),
});
