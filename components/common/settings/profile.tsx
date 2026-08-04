'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { users } from '@/mock-data/users';
import { Pencil } from 'lucide-react';
import { SettingsCard, SettingsRow, SettingsSection, SettingsShell } from './shared';

/** Personal "Profile" settings. */
export default function Profile() {
   const me = users[0];

   return (
      <SettingsShell title="Profile">
         <SettingsSection>
            <SettingsCard>
               <SettingsRow
                  title="Profile picture"
                  trailing={
                     <Avatar className="size-9">
                        <AvatarImage src={me.avatarUrl} alt={me.name} />
                        <AvatarFallback>{me.name[0]}</AvatarFallback>
                     </Avatar>
                  }
               />
               <SettingsRow
                  title="Email"
                  trailing={
                     <span className="inline-flex items-center gap-2 text-foreground">
                        {me.email}
                        <Button size="icon" variant="ghost" className="size-6">
                           <Pencil className="size-3" />
                        </Button>
                     </span>
                  }
               />
               <SettingsRow
                  title="Full name"
                  trailing={<Input defaultValue="LN" className="h-8 w-44" />}
               />
               <SettingsRow
                  title="Title"
                  description="Your job title or role"
                  trailing={<Input placeholder="Software engineer" className="h-8 w-44" />}
               />
               <SettingsRow
                  title="Username"
                  description="One word, like a nickname or first name"
                  trailing={<Input defaultValue="ln" className="h-8 w-44" />}
               />
            </SettingsCard>
         </SettingsSection>

         <SettingsSection title="Workspace access">
            <SettingsCard>
               <SettingsRow
                  title="Remove yourself from workspace"
                  trailing={
                     <Button size="xs" variant="ghost" className="text-red-500 hover:text-red-500">
                        Leave workspace
                     </Button>
                  }
               />
            </SettingsCard>
         </SettingsSection>
      </SettingsShell>
   );
}
