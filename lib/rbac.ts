import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { OrgRole } from '@prisma/client';

export type UserRole = OrgRole;

// Simple in-memory cache for user roles (per request)
const roleCache = new Map<string, UserRole | null>();

export const PERMISSIONS = {
   VIEW_CAMPAIGNS: 'view_campaigns',
   MANAGE_CAMPAIGNS: 'manage_campaigns',
   MANAGE_CONTENT: 'manage_content',
   APPROVE_CONTENT: 'approve_content',
   VIEW_ANALYTICS: 'view_analytics',
   MANAGE_USERS: 'manage_users',
   MANAGE_ORGANIZATION: 'manage_organization',
   MANAGE_SCHEDULES: 'manage_schedules',
} as const;

export async function getUserRole(orgId: string): Promise<UserRole | null> {
   const session = await auth();
   if (!session?.user?.id) {
      return null;
   }

   const cacheKey = `${session.user.id}:${orgId}`;
   if (roleCache.has(cacheKey)) {
      return roleCache.get(cacheKey)!;
   }

   const membership = await prisma.membership.findFirst({
      where: {
         userId: session.user.id,
         organizationId: orgId,
      },
   });

   const role = membership?.role || null;
   roleCache.set(cacheKey, role);
   return role;
}

export async function requireRole(orgId: string, requiredRole: UserRole): Promise<boolean> {
   const userRole = await getUserRole(orgId);
   if (!userRole) return false;

   const roleHierarchy = {
      [OrgRole.CREATOR]: 1,
      [OrgRole.BRAND_OWNER]: 2,
      [OrgRole.ADMIN]: 3,
   };

   return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function requirePermission(
   userId: string,
   orgId: string,
   permission: string
): Promise<void> {
   const userRole = await getUserRole(orgId);
   if (!userRole) {
      throw new Error('Insufficient permissions');
   }

   const permissions = {
      [OrgRole.CREATOR]: [PERMISSIONS.VIEW_CAMPAIGNS, PERMISSIONS.MANAGE_CONTENT],
      [OrgRole.BRAND_OWNER]: [
         PERMISSIONS.VIEW_CAMPAIGNS,
         PERMISSIONS.MANAGE_CAMPAIGNS,
         PERMISSIONS.MANAGE_CONTENT,
         PERMISSIONS.APPROVE_CONTENT,
         PERMISSIONS.VIEW_ANALYTICS,
      ],
      [OrgRole.ADMIN]: [
         PERMISSIONS.VIEW_CAMPAIGNS,
         PERMISSIONS.MANAGE_CAMPAIGNS,
         PERMISSIONS.MANAGE_CONTENT,
         PERMISSIONS.APPROVE_CONTENT,
         PERMISSIONS.VIEW_ANALYTICS,
         PERMISSIONS.MANAGE_USERS,
         PERMISSIONS.MANAGE_ORGANIZATION,
      ],
   };

   if (!permissions[userRole]?.includes(permission as any)) {
      throw new Error('Insufficient permissions');
   }
}

export async function hasPermission(orgId: string, permission: string): Promise<boolean> {
   const userRole = await getUserRole(orgId);
   if (!userRole) return false;

   const permissions = {
      [OrgRole.CREATOR]: [PERMISSIONS.VIEW_CAMPAIGNS, PERMISSIONS.MANAGE_CONTENT],
      [OrgRole.BRAND_OWNER]: [
         PERMISSIONS.VIEW_CAMPAIGNS,
         PERMISSIONS.MANAGE_CAMPAIGNS,
         PERMISSIONS.MANAGE_CONTENT,
         PERMISSIONS.APPROVE_CONTENT,
         PERMISSIONS.VIEW_ANALYTICS,
      ],
      [OrgRole.ADMIN]: [
         PERMISSIONS.VIEW_CAMPAIGNS,
         PERMISSIONS.MANAGE_CAMPAIGNS,
         PERMISSIONS.MANAGE_CONTENT,
         PERMISSIONS.APPROVE_CONTENT,
         PERMISSIONS.VIEW_ANALYTICS,
         PERMISSIONS.MANAGE_USERS,
         PERMISSIONS.MANAGE_ORGANIZATION,
      ],
   };

   return permissions[userRole]?.includes(permission as any) || false;
}
