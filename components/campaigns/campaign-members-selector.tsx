'use client';

import { useState } from 'react';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Users, Plus } from 'lucide-react';
import { User, CampaignMemberRole, CAMPAIGN_MEMBER_ROLES } from '@/types/campaign';

interface CampaignMember {
   userId: string;
   role: CampaignMemberRole;
   user: User;
}

interface CampaignMembersSelectorProps {
   value: CampaignMember[];
   onChange: (members: CampaignMember[]) => void;
   availableMembers: User[];
   disabled?: boolean;
   className?: string;
}

export default function CampaignMembersSelector({
   value,
   onChange,
   availableMembers,
   disabled = false,
   className = '',
}: CampaignMembersSelectorProps) {
   const [isAddingMember, setIsAddingMember] = useState(false);
   const [selectedUserId, setSelectedUserId] = useState<string>('');
   const [selectedRole, setSelectedRole] = useState<CampaignMemberRole>('MEMBER');

   const availableUsers = availableMembers.filter(
      (user) => !value.find((member) => member.userId === user.id)
   );

   const addMember = () => {
      if (selectedUserId && selectedRole) {
         const user = availableMembers.find((u) => u.id === selectedUserId);
         if (user) {
            const newMember: CampaignMember = {
               userId: selectedUserId,
               role: selectedRole,
               user,
            };
            onChange([...value, newMember]);
            setSelectedUserId('');
            setSelectedRole('MEMBER');
            setIsAddingMember(false);
         }
      }
   };

   const removeMember = (userId: string) => {
      onChange(value.filter((member) => member.userId !== userId));
   };

   const updateMemberRole = (userId: string, newRole: CampaignMemberRole) => {
      onChange(
         value.map((member) => (member.userId === userId ? { ...member, role: newRole } : member))
      );
   };

   const getInitials = (name: string | null) => {
      if (!name) return '?';
      return name
         .split(' ')
         .map((word) => word.charAt(0))
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };

   const getRoleColor = (role: CampaignMemberRole) => {
      switch (role) {
         case 'OWNER':
            return 'destructive';
         case 'MANAGER':
            return 'default';
         case 'MEMBER':
            return 'secondary';
         case 'VIEWER':
            return 'outline';
         default:
            return 'secondary';
      }
   };

   return (
      <div className={`space-y-3 ${className}`}>
         <label className="text-sm font-medium">Team Members</label>

         {/* Current Members */}
         <div className="space-y-2">
            {value.map((member) => (
               <div
                  key={member.userId}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
               >
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback className="text-sm">
                           {getInitials(member.user.name)}
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col">
                        <span className="font-medium text-sm">{member.user.name || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{member.user.email}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <Select
                        value={member.role}
                        onValueChange={(newRole) =>
                           updateMemberRole(member.userId, newRole as CampaignMemberRole)
                        }
                        disabled={disabled}
                     >
                        <SelectTrigger className="w-24 h-8">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {CAMPAIGN_MEMBER_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                 <Badge variant={getRoleColor(role)} className="text-xs">
                                    {role}
                                 </Badge>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.userId)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            ))}
         </div>

         {/* Add Member Section */}
         {!isAddingMember ? (
            <Button
               variant="outline"
               size="sm"
               onClick={() => setIsAddingMember(true)}
               disabled={disabled || availableUsers.length === 0}
               className="w-full"
            >
               <Plus className="h-4 w-4 mr-2" />
               Add Member
            </Button>
         ) : (
            <div className="p-3 border rounded-lg space-y-3">
               <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Add New Member</span>
               </div>

               <div className="grid grid-cols-2 gap-2">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                     </SelectTrigger>
                     <SelectContent>
                        {availableUsers.map((user) => (
                           <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                 <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.image || undefined} />
                                    <AvatarFallback className="text-xs">
                                       {getInitials(user.name)}
                                    </AvatarFallback>
                                 </Avatar>
                                 <span>{user.name || user.email}</span>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Select
                     value={selectedRole}
                     onValueChange={(value) => setSelectedRole(value as CampaignMemberRole)}
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {CAMPAIGN_MEMBER_ROLES.map((role) => (
                           <SelectItem key={role} value={role}>
                              <Badge variant={getRoleColor(role)} className="text-xs">
                                 {role}
                              </Badge>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="flex gap-2">
                  <Button
                     size="sm"
                     onClick={addMember}
                     disabled={!selectedUserId || !selectedRole}
                     className="flex-1"
                  >
                     Add
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                        setIsAddingMember(false);
                        setSelectedUserId('');
                        setSelectedRole('MEMBER');
                     }}
                     className="flex-1"
                  >
                     Cancel
                  </Button>
               </div>
            </div>
         )}

         {availableUsers.length === 0 && value.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
               All available members have been added to the campaign
            </p>
         )}
      </div>
   );
}
