import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// --- Enums -----------------------------------------------------------------

export const taskPriorityEnum = ['LOW', 'MED', 'HIGH', 'URGENT'] as const;
export const taskStatusEnum = ['TODO', 'IN_PROGRESS', 'DONE', 'PAUSED', 'WAITING'] as const;
export const memberStatusEnum = ['online', 'offline', 'away'] as const;
export const memberRoleEnum = ['Member', 'Admin', 'Guest'] as const;

// --- Tables ----------------------------------------------------------------

export const teams = sqliteTable('teams', {
   id: text('id').primaryKey(),
   name: text('name').notNull(),
   icon: text('icon').notNull(),
   color: text('color').notNull(),
   joined: integer('joined', { mode: 'boolean' }).default(false).notNull(),
   createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
   updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
});

export const members = sqliteTable('members', {
   id: text('id').primaryKey(),
   name: text('name').notNull(),
   email: text('email').notNull(),
   avatarUrl: text('avatar_url'),
   status: text('status', { enum: memberStatusEnum }).default('offline').notNull(),
   role: text('role', { enum: memberRoleEnum }).default('Member').notNull(),
   joinedAt: integer('joined_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
});

export const teamMembers = sqliteTable(
   'team_members',
   {
      teamId: text('team_id')
         .notNull()
         .references(() => teams.id, { onDelete: 'cascade' }),
      memberId: text('member_id')
         .notNull()
         .references(() => members.id, { onDelete: 'cascade' }),
   },
   (t) => ({
      pk: primaryKey({ columns: [t.teamId, t.memberId] }),
   })
);

export const projects = sqliteTable('projects', {
   id: text('id').primaryKey(),
   name: text('name').notNull(),
   status: text('status').notNull(),
   icon: text('icon'),
   percentComplete: integer('percent_complete').default(0).notNull(),
   startDate: integer('start_date', { mode: 'timestamp' }),
   teamId: text('team_id').references(() => teams.id, { onDelete: 'set null' }),
   leadId: text('lead_id').references(() => members.id, { onDelete: 'set null' }),
   priority: text('priority'),
   health: text('health'),
   createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
   updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
});

export const projectMembers = sqliteTable(
   'project_members',
   {
      projectId: text('project_id')
         .notNull()
         .references(() => projects.id, { onDelete: 'cascade' }),
      memberId: text('member_id')
         .notNull()
         .references(() => members.id, { onDelete: 'cascade' }),
   },
   (t) => ({
      pk: primaryKey({ columns: [t.projectId, t.memberId] }),
   })
);

export const tasks = sqliteTable('tasks', {
   id: integer('id').primaryKey({ autoIncrement: true }),
   title: text('title').notNull(),
   description: text('description'),
   priority: text('priority', { enum: taskPriorityEnum }).default('MED').notNull(),
   status: text('status', { enum: taskStatusEnum }).default('TODO').notNull(),
   dueAt: integer('due_at', { mode: 'timestamp' }),
   createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
   updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
   effortMinutes: integer('effort_minutes'),
   person: text('person'),
   context: text('context'),
   impact: text('impact'),
   waitingOn: text('waiting_on'),
   why: text('why'),
   projectId: text('project_id').references(() => projects.id, {
      onDelete: 'set null',
   }),
   assigneeId: text('assignee_id').references(() => members.id, {
      onDelete: 'set null',
   }),
});

export const comments = sqliteTable('comments', {
   id: integer('id').primaryKey({ autoIncrement: true }),
   taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
   authorId: text('author_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
   body: text('body').notNull(),
   createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
   updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
});

// --- Relations --------------------------------------------------------------

export const teamsRelations = relations(teams, ({ many }) => ({
   projects: many(projects),
   members: many(teamMembers),
}));

export const membersRelations = relations(members, ({ many }) => ({
   teams: many(teamMembers),
   projects: many(projectMembers),
   assignedTasks: many(tasks),
   comments: many(comments),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
   team: one(teams, {
      fields: [teamMembers.teamId],
      references: [teams.id],
   }),
   member: one(members, {
      fields: [teamMembers.memberId],
      references: [members.id],
   }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
   team: one(teams, {
      fields: [projects.teamId],
      references: [teams.id],
   }),
   lead: one(members, {
      fields: [projects.leadId],
      references: [members.id],
   }),
   tasks: many(tasks),
   members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
   project: one(projects, {
      fields: [projectMembers.projectId],
      references: [projects.id],
   }),
   member: one(members, {
      fields: [projectMembers.memberId],
      references: [members.id],
   }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
   project: one(projects, {
      fields: [tasks.projectId],
      references: [projects.id],
   }),
   assignee: one(members, {
      fields: [tasks.assigneeId],
      references: [members.id],
   }),
   comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
   task: one(tasks, {
      fields: [comments.taskId],
      references: [tasks.id],
   }),
   author: one(members, {
      fields: [comments.authorId],
      references: [members.id],
   }),
}));
