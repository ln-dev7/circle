import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   email: z.string().email('Invalid email address'),
   password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const updateUserSchema = z.object({
   name: z.string().min(1, 'Name is required').optional(),
   email: z.string().email('Invalid email address').optional(),
   image: z.string().url('Invalid URL').optional(),
});

export const userLoginSchema = z.object({
   email: z.string().email('Invalid email address'),
   password: z.string().min(1, 'Password is required'),
});

// Organization schemas
export const createOrganizationSchema = z.object({
   name: z.string().min(1, 'Organization name is required'),
});

export const updateOrganizationSchema = z.object({
   name: z.string().min(1, 'Organization name is required').optional(),
});

// Membership schemas
export const createMembershipSchema = z.object({
   userId: z.string().min(1, 'User ID is required'),
   organizationId: z.string().min(1, 'Organization ID is required'),
   role: z.enum(['ADMIN', 'BRAND_OWNER', 'CREATOR']),
});

export const updateMembershipSchema = z.object({
   role: z.enum(['ADMIN', 'BRAND_OWNER', 'CREATOR']).optional(),
});

// Campaign schemas
export const createCampaignSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   description: z.string().optional(),
});

export const updateCampaignSchema = z.object({
   name: z.string().min(1, 'Name is required').optional(),
   description: z.string().optional(),
});

// Content schemas
export const createContentSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   body: z.string().optional(),
   status: z
      .enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'REJECTED'])
      .optional(),
   campaignId: z.string().min(1, 'Campaign ID is required'),
});

export const updateContentSchema = z.object({
   title: z.string().min(1, 'Title is required').optional(),
   body: z.string().optional(),
   status: z
      .enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'REJECTED'])
      .optional(),
});

export const generateContentSchema = z.object({
   prompt: z.string().min(1, 'Prompt is required'),
   campaignId: z.string().min(1, 'Campaign ID is required'),
});

// Asset schemas
export const createAssetSchema = z.object({
   url: z.string().url('Invalid URL'),
   name: z.string().optional(),
   type: z.string().min(1, 'Type is required'),
   size: z.number().optional(),
   description: z.string().optional(),
   tags: z.array(z.string()).optional(),
   contentId: z.string().min(1, 'Content ID is required'),
});

export const updateAssetSchema = z.object({
   url: z.string().url('Invalid URL').optional(),
   name: z.string().optional(),
   type: z.string().min(1, 'Type is required').optional(),
   size: z.number().optional(),
   description: z.string().optional(),
   tags: z.array(z.string()).optional(),
});

// Schedule schemas
export const createScheduleSchema = z.object({
   runAt: z.string().datetime('Invalid date'),
   timezone: z.string().min(1, 'Timezone is required'),
   channel: z.enum(['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'LINKEDIN', 'TIKTOK', 'BLOG']),
   status: z.enum(['PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED']).optional(),
   campaignId: z.string().min(1, 'Campaign ID is required'),
   contentId: z.string().min(1, 'Content ID is required'),
});

export const updateScheduleSchema = z.object({
   runAt: z.string().datetime('Invalid date').optional(),
   timezone: z.string().min(1, 'Timezone is required').optional(),
   channel: z
      .enum(['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE', 'LINKEDIN', 'TIKTOK', 'BLOG'])
      .optional(),
   status: z.enum(['PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED']).optional(),
   contentId: z.string().optional(),
});

// Analytics schemas
export const createAnalyticsEventSchema = z.object({
   event: z.string().min(1, 'Event is required'),
   data: z.record(z.any()).optional(),
   organizationId: z.string().optional(),
   campaignId: z.string().optional(),
   contentId: z.string().optional(),
});

// OrgRole enum
export const orgRoleSchema = z.enum(['ADMIN', 'BRAND_OWNER', 'CREATOR']);
