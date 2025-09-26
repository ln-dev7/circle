'use client';

import {
   Layers,
   LayoutList,
   MoreHorizontal,
   Home,
   FileText,
   BarChart3,
   Users,
   Settings,
   Sparkles,
   Image,
   Calendar,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { OrgRole } from '@prisma/client';
import { useEffect, useState } from 'react';

interface NavItem {
   name: string;
   url: string;
   icon: React.ComponentType<any>;
   roles: OrgRole[];
}

export function NavWorkspace() {
   const params = useParams();
   const orgId = params.orgId as string;
   const [userRole, setUserRole] = useState<OrgRole | null>(null);
   const t = useTranslations('navigation');

   useEffect(() => {
      // Fetch user role - in a real app, this would be done server-side or through a context
      const fetchUserRole = async () => {
         try {
            const response = await fetch(`/api/me/role?orgId=${orgId}`);
            if (response.ok) {
               const data = await response.json();
               setUserRole(data.role);
            }
         } catch (error) {
            console.error('Failed to fetch user role:', error);
         }
      };

      if (orgId) {
         fetchUserRole();
      }
   }, [orgId]);

   const navigationItems: NavItem[] = [
      {
         name: t('dashboard'),
         url: '',
         icon: Home,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER, OrgRole.CREATOR],
      },
      {
         name: t('campaigns'),
         url: '/campaigns',
         icon: FileText,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER, OrgRole.CREATOR],
      },
      {
         name: t('content_studio'),
         url: '/content',
         icon: Sparkles,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER, OrgRole.CREATOR],
      },
      {
         name: t('schedules'),
         url: '/schedules',
         icon: Calendar,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER, OrgRole.CREATOR],
      },
      {
         name: t('assets'),
         url: '/assets',
         icon: Image,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER, OrgRole.CREATOR],
      },
      {
         name: t('analytics'),
         url: '/analytics',
         icon: BarChart3,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER],
      },
      {
         name: t('members'),
         url: '/members',
         icon: Users,
         roles: [OrgRole.ADMIN, OrgRole.BRAND_OWNER],
      },
      {
         name: t('settings'),
         url: '/settings',
         icon: Settings,
         roles: [OrgRole.ADMIN],
      },
   ];

   const filteredItems = navigationItems.filter(
      (item) => userRole && item.roles.includes(userRole)
   );

   return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
         <SidebarGroupLabel>{t('workspace')}</SidebarGroupLabel>
         <SidebarMenu>
            {filteredItems.map((item) => (
               <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                     <Link href={`/${orgId}${item.url}`}>
                        <item.icon />
                        <span>{item.name}</span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton asChild>
                        <span>
                           <MoreHorizontal />
                           <span>{t('more')}</span>
                        </span>
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 rounded-lg" side="bottom" align="start">
                     <DropdownMenuItem>
                        <Layers className="text-muted-foreground" />
                        <span>{t('views')}</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <LayoutList className="text-muted-foreground" />
                        <span>{t('customize_sidebar')}</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarGroup>
   );
}
