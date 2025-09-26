'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, UserPlus, Mail, Phone, MapPin, Settings, Trash2 } from 'lucide-react';
import type { Campaign, CampaignMember, AddMemberData } from '@/types/campaign';

interface CampaignMembersPageProps {
   orgId: string;
   campaignId: string;
   campaign: Campaign;
}

const memberRoleConfig = {
   OWNER: { label: 'Owner', color: 'bg-purple-500', description: 'Full campaign control' },
   MANAGER: { label: 'Manager', color: 'bg-blue-500', description: 'Manage tasks and members' },
   ADMIN: { label: 'Admin', color: 'bg-green-500', description: 'Edit campaign details' },
   MEMBER: { label: 'Member', color: 'bg-gray-500', description: 'View and contribute' },
   VIEWER: { label: 'Viewer', color: 'bg-slate-500', description: 'Read-only access' },
};

export function CampaignMembersPage({ orgId, campaignId, campaign }: CampaignMembersPageProps) {
   const router = useRouter();
   const [members, setMembers] = useState<CampaignMember[]>([]);
   const [loading, setLoading] = useState(true);
   const [showAddMemberModal, setShowAddMemberModal] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [roleFilter, setRoleFilter] = useState<string>('all');
   const [newMemberData, setNewMemberData] = useState({
      userId: '',
      role: 'MEMBER' as CampaignMember['role'],
   });

   useEffect(() => {
      fetchMembers();
   }, [orgId, campaignId]);

   const fetchMembers = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/members`);
         if (!response.ok) {
            throw new Error('Failed to fetch members');
         }
         const data = await response.json();
         setMembers(data.members || []);
      } catch (error) {
         console.error('Error fetching members:', error);
         toast.error('Failed to fetch members');
      } finally {
         setLoading(false);
      }
   };

   const handleAddMember = async () => {
      if (!newMemberData.userId) {
         toast.error('Please select a user');
         return;
      }

      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMemberData),
         });

         if (!response.ok) {
            throw new Error('Failed to add member');
         }

         const newMember = await response.json();
         setMembers((prev) => [...prev, newMember.member]);
         setShowAddMemberModal(false);
         setNewMemberData({ userId: '', role: 'MEMBER' });
         toast.success('Member added successfully');
      } catch (error) {
         console.error('Error adding member:', error);
         toast.error('Failed to add member');
      }
   };

   const handleRemoveMember = async (memberId: string) => {
      if (!confirm('Are you sure you want to remove this member?')) {
         return;
      }

      try {
         // TODO: Implement remove member API
         toast.info('Remove member functionality coming soon');
      } catch (error) {
         console.error('Error removing member:', error);
         toast.error('Failed to remove member');
      }
   };

   const handleRoleChange = async (memberId: string, newRole: CampaignMember['role']) => {
      try {
         // TODO: Implement role change API
         toast.info('Role change functionality coming soon');
      } catch (error) {
         console.error('Error changing role:', error);
         toast.error('Failed to change role');
      }
   };

   const filteredMembers = members.filter((member) => {
      const matchesSearch =
         member.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      return matchesSearch && matchesRole;
   });

   const getRoleStats = () => {
      return members.reduce(
         (acc, member) => {
            acc[member.role] = (acc[member.role] || 0) + 1;
            return acc;
         },
         {} as Record<string, number>
      );
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
               <p className="text-muted-foreground">Loading member management...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Team Management</h1>
               <p className="text-muted-foreground">
                  Manage team members for campaign:{' '}
                  <span className="font-medium">{campaign.title}</span>
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => setShowAddMemberModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
               </Button>
               <Button
                  variant="outline"
                  onClick={() => router.push(`/${orgId}/campaigns/${campaignId}`)}
               >
                  Back to Campaign
               </Button>
            </div>
         </div>

         {/* Member Statistics */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(memberRoleConfig).map(([role, config]) => {
               const count = getRoleStats()[role] || 0;
               return (
                  <Card key={role}>
                     <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 ${config.color} rounded-full`} />
                           <span className="text-sm font-medium">{config.label}</span>
                        </div>
                        <p className="text-2xl font-bold mt-1">{count}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                     </CardContent>
                  </Card>
               );
            })}
         </div>

         {/* Search and Filters */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search members..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
               <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(memberRoleConfig).map(([role, config]) => (
                     <SelectItem key={role} value={role}>
                        {config.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {/* Members List */}
         <Card>
            <CardHeader>
               <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {filteredMembers.map((member) => (
                     <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                     >
                        <div className="flex items-center gap-4">
                           <Avatar className="h-12 w-12">
                              <AvatarImage src={member.user.image || ''} />
                              <AvatarFallback>
                                 {member.user.name?.slice(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                           </Avatar>

                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <h4 className="font-medium">{member.user.name}</h4>
                                 <Badge
                                    className={`${memberRoleConfig[member.role].color} text-white`}
                                 >
                                    {memberRoleConfig[member.role].label}
                                 </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                 {member.user.email && (
                                    <div className="flex items-center gap-1">
                                       <Mail className="h-3 w-3" />
                                       {member.user.email}
                                    </div>
                                 )}
                                 {member.user.phone && (
                                    <div className="flex items-center gap-1">
                                       <Phone className="h-3 w-3" />
                                       {member.user.phone}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <Select
                              value={member.role}
                              onValueChange={(value) =>
                                 handleRoleChange(member.id, value as CampaignMember['role'])
                              }
                           >
                              <SelectTrigger className="w-32">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 {Object.entries(memberRoleConfig).map(([role, config]) => (
                                    <SelectItem key={role} value={role}>
                                       {config.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>

                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-700"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  ))}

                  {filteredMembers.length === 0 && (
                     <div className="text-center py-12">
                        <p className="text-muted-foreground">No members found</p>
                        {searchTerm || roleFilter !== 'all' ? (
                           <Button
                              variant="outline"
                              onClick={() => {
                                 setSearchTerm('');
                                 setRoleFilter('all');
                              }}
                           >
                              Clear filters
                           </Button>
                        ) : (
                           <Button onClick={() => setShowAddMemberModal(true)}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add your first member
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Add Member Modal */}
         <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
            <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>Add a new member to the campaign team</DialogDescription>
               </DialogHeader>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="userId">Select User</Label>
                     <Select
                        value={newMemberData.userId}
                        onValueChange={(value) =>
                           setNewMemberData((prev) => ({ ...prev, userId: value }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Choose a user to add" />
                        </SelectTrigger>
                        <SelectContent>
                           {/* In a real app, you'd fetch available users from the organization */}
                           <SelectItem value="user1">John Doe (john@example.com)</SelectItem>
                           <SelectItem value="user2">Jane Smith (jane@example.com)</SelectItem>
                           <SelectItem value="user3">Bob Johnson (bob@example.com)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="role">Role</Label>
                     <Select
                        value={newMemberData.role}
                        onValueChange={(value) =>
                           setNewMemberData((prev) => ({
                              ...prev,
                              role: value as CampaignMember['role'],
                           }))
                        }
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(memberRoleConfig).map(([role, config]) => (
                              <SelectItem key={role} value={role}>
                                 <div className="flex items-center gap-2">
                                    <span>{config.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                       ({config.description})
                                    </span>
                                 </div>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>
                     Cancel
                  </Button>
                  <Button onClick={handleAddMember}>Add Member</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
