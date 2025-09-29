'use client';

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/campaign';

interface CampaignLeadSelectorProps {
   value?: string;
   onChange: (leadId: string | undefined) => void;
   members: User[];
   disabled?: boolean;
   className?: string;
}

export default function CampaignLeadSelector({
   value,
   onChange,
   members,
   disabled = false,
   className = '',
}: CampaignLeadSelectorProps) {
   const selectedLead = members.find((member) => member.id === value);

   const getInitials = (name: string | null) => {
      if (!name) return '?';
      return name
         .split(' ')
         .map((word) => word.charAt(0))
         .join('')
         .toUpperCase()
         .slice(0, 2);
   };

   return (
      <div className={`space-y-2 ${className}`}>
         <label className="text-sm font-medium">Campaign Lead</label>
         <Select
            value={value || ''}
            onValueChange={(newValue) => onChange(newValue || undefined)}
            disabled={disabled}
         >
            <SelectTrigger>
               <SelectValue>
                  {selectedLead ? (
                     <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarImage src={selectedLead.image || undefined} />
                           <AvatarFallback className="text-xs">
                              {getInitials(selectedLead.name)}
                           </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{selectedLead.name || selectedLead.email}</span>
                     </div>
                  ) : (
                     <span className="text-muted-foreground">Select a lead</span>
                  )}
               </SelectValue>
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">?</AvatarFallback>
                     </Avatar>
                     <span>No lead assigned</span>
                  </div>
               </SelectItem>
               {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                     <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                           <AvatarImage src={member.image || undefined} />
                           <AvatarFallback className="text-xs">
                              {getInitials(member.name)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                           <span className="font-medium">{member.name || 'Unknown'}</span>
                           <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                     </div>
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
}
