'use client';

import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
   Bell,
   Blocks,
   Bot,
   Code,
   Compass,
   FileText,
   Flame,
   HeartHandshake,
   KeyRound,
   LucideIcon,
   MessageCircleQuestion,
   Rocket,
   Settings,
   Smile,
   Sparkles,
   Tag,
   Target,
   UserRound,
   Users,
   Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface SettingsNavItem {
   name: string;
   /** Path under /{orgId}. Items without a dedicated page point to /settings. */
   url: string;
   icon: LucideIcon;
}

interface SettingsNavGroup {
   label: string;
   items: SettingsNavItem[];
}

/** Linear-style settings navigation. */
export const settingsNav: SettingsNavGroup[] = [
   {
      label: 'Personal',
      items: [
         { name: 'Preferences', url: '/settings/preferences', icon: Settings },
         { name: 'Profile', url: '/settings/profile', icon: UserRound },
         { name: 'Notifications', url: '/settings/notifications', icon: Bell },
         { name: 'Code & reviews', url: '/settings/code-and-reviews', icon: Code },
         { name: 'Security & access', url: '/settings/security', icon: KeyRound },
         { name: 'Connected accounts', url: '/settings/connected-accounts', icon: Users },
         { name: 'Agent personalization', url: '/settings/agent-personalization', icon: Bot },
      ],
   },
   {
      label: 'Issues',
      items: [
         { name: 'Labels', url: '/settings/issue-labels', icon: Tag },
         { name: 'Templates', url: '/settings/issue-templates', icon: FileText },
         { name: 'SLAs', url: '/settings', icon: Flame },
      ],
   },
   {
      label: 'Projects',
      items: [
         { name: 'Labels', url: '/settings', icon: Tag },
         { name: 'Templates', url: '/settings', icon: FileText },
         { name: 'Statuses', url: '/settings/project-statuses', icon: Target },
         { name: 'Updates', url: '/settings', icon: Zap },
      ],
   },
   {
      label: 'Features',
      items: [
         { name: 'AI & Agents', url: '/settings/ai', icon: Sparkles },
         { name: 'Initiatives', url: '/settings', icon: Compass },
         { name: 'Documents', url: '/settings', icon: FileText },
         { name: 'Customer requests', url: '/settings', icon: HeartHandshake },
         { name: 'Releases', url: '/settings', icon: Rocket },
         { name: 'Pulse', url: '/settings', icon: Zap },
         { name: 'Asks', url: '/settings', icon: MessageCircleQuestion },
         { name: 'Emojis', url: '/settings', icon: Smile },
         { name: 'Integrations', url: '/settings', icon: Blocks },
      ],
   },
];

export function NavSettings() {
   const { orgId } = useParams<{ orgId: string }>();
   const pathname = usePathname();

   return (
      <>
         {settingsNav.map((group) => (
            <SidebarGroup key={group.label} className="group-data-[collapsible=icon]:hidden">
               <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
               <SidebarMenu>
                  {group.items.map((item) => {
                     const href = `/${orgId}${item.url}`;
                     const isActive = item.url !== '/settings' ? pathname === href : false;
                     return (
                        <SidebarMenuItem key={`${group.label}-${item.name}`}>
                           <SidebarMenuButton asChild isActive={isActive}>
                              <Link href={href}>
                                 <item.icon className="size-4" />
                                 <span>{item.name}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     );
                  })}
               </SidebarMenu>
            </SidebarGroup>
         ))}
      </>
   );
}
