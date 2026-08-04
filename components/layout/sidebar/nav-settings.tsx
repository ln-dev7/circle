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
   /** Path under /{orgId}. */
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
         { name: 'SLAs', url: '/settings/slas', icon: Flame },
      ],
   },
   {
      label: 'Projects',
      items: [
         { name: 'Labels', url: '/settings/project-labels', icon: Tag },
         { name: 'Templates', url: '/settings/project-templates', icon: FileText },
         { name: 'Statuses', url: '/settings/project-statuses', icon: Target },
         { name: 'Updates', url: '/settings/project-updates', icon: Zap },
      ],
   },
   {
      label: 'Features',
      items: [
         { name: 'AI & Agents', url: '/settings/ai', icon: Sparkles },
         { name: 'Initiatives', url: '/settings/initiatives', icon: Compass },
         { name: 'Documents', url: '/settings/documents', icon: FileText },
         { name: 'Customer requests', url: '/settings/customer-requests', icon: HeartHandshake },
         { name: 'Releases', url: '/settings/releases', icon: Rocket },
         { name: 'Pulse', url: '/settings/pulse', icon: Zap },
         { name: 'Asks', url: '/settings/asks', icon: MessageCircleQuestion },
         { name: 'Emojis', url: '/settings/emojis', icon: Smile },
         { name: 'Integrations', url: '/settings/integrations', icon: Blocks },
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
                     const isActive = pathname === href;
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
