'use client';

import { ContentBlocks } from '@/components/common/issues/details/content-blocks';
import { IssuePropertiesPanel } from '@/components/common/issues/details/issue-properties-panel';
import { LabelBadge } from '@/components/common/issues/label-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getNotificationIcon } from '@/lib/notification-utils';
import { getIssueDetail } from '@/mock-data/issue-details';
import { InboxItem } from '@/mock-data/inbox';
import { useIssuesStore } from '@/store/issues-store';
import { useNotificationsStore } from '@/store/notifications-store';
import { ArrowUpRight, Check, Paperclip, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { NotificationBox } from './icons/motification-box';

interface IssuePreviewProps {
   notification?: InboxItem;
   onMarkAsRead?: (id: string) => void;
}

/**
 * Inbox preview pane: shows the REAL issue behind the selected
 * notification (live status/assignee from the store, rich description
 * from issue-details) plus the notification context.
 */
export default function IssuePreview({ notification, onMarkAsRead }: IssuePreviewProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const { getUnreadCount } = useNotificationsStore();
   const { issues } = useIssuesStore();

   if (!notification) {
      const unreadCount = getUnreadCount();

      return (
         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <NotificationBox className="w-16 h-16 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
               {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
               Select a notification from the list to view its details and take action.
            </p>
         </div>
      );
   }

   // Live issue from the store (falls back to the notification snapshot).
   const issue = issues.find((candidate) => candidate.identifier === notification.identifier);
   const displayIssue = issue ?? notification;
   const detail = getIssueDetail(displayIssue);

   return (
      <div className="flex flex-col h-full overflow-hidden">
         {/* Header */}
         <div className="flex items-center justify-between px-4 h-10 border-b border-border shrink-0">
            <div className="flex items-center gap-2 min-w-0">
               <displayIssue.status.icon />
               <span className="text-sm font-medium truncate">{displayIssue.identifier}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
               {!notification.read && onMarkAsRead && (
                  <Button
                     variant="outline"
                     size="xs"
                     onClick={() => onMarkAsRead(notification.id)}
                     className="gap-1"
                  >
                     <Check className="size-4" />
                     Mark as read
                  </Button>
               )}
               <Button variant="ghost" size="xs" asChild>
                  <Link href={`/${orgId ?? 'lndev-ui'}/issue/${displayIssue.identifier}`}>
                     Open
                     <ArrowUpRight className="size-3.5 ml-0.5" />
                  </Link>
               </Button>
            </div>
         </div>

         {/* Real issue preview + properties column (Linear-style) */}
         <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-1 min-w-0 overflow-y-auto">
               <div className="pt-8 pb-6 px-6 w-full max-w-3xl mx-auto">
                  {/* Notification context */}
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mb-8">
                     <div className="relative shrink-0">
                        <Avatar className="size-7">
                           <AvatarImage
                              src={notification.user.avatarUrl}
                              alt={notification.user.name}
                           />
                           <AvatarFallback className="text-xs">
                              {notification.user.name[0]}
                           </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-accent border border-background flex items-center justify-center">
                           {getNotificationIcon(notification.type, 'size-2.5')}
                        </div>
                     </div>
                     <div className="min-w-0 text-sm">
                        <span className="font-medium">{notification.user.name}</span>{' '}
                        <span className="text-muted-foreground">· {notification.timestamp}</span>
                        <p className="text-foreground/90 mt-0.5">{notification.content}</p>
                     </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground text-balance">
                     {displayIssue.title}
                  </h3>

                  {/* Properties row */}
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 text-sm xl:hidden">
                     <span className="flex items-center gap-1.5">
                        <displayIssue.status.icon />
                        {displayIssue.status.name}
                     </span>
                     <span className="flex items-center gap-1.5 text-muted-foreground">
                        <displayIssue.priority.icon className="size-3.5" />
                        {displayIssue.priority.name}
                     </span>
                     {displayIssue.assignee && (
                        <span className="flex items-center gap-1.5">
                           <Avatar className="size-4">
                              <AvatarImage
                                 src={displayIssue.assignee.avatarUrl}
                                 alt={displayIssue.assignee.name}
                              />
                              <AvatarFallback className="text-[9px]">
                                 {displayIssue.assignee.name[0]}
                              </AvatarFallback>
                           </Avatar>
                           {displayIssue.assignee.name}
                        </span>
                     )}
                     <LabelBadge label={displayIssue.labels} />
                  </div>

                  {/* Real description */}
                  <div className="mt-6">
                     <ContentBlocks blocks={detail.description} />
                  </div>

                  {/* Comment composer */}
                  <div className="relative w-full flex flex-col mt-10">
                     <Textarea
                        className="w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent pb-14 resize-none"
                        placeholder="Leave a comment..."
                        rows={3}
                     />
                     <div className="absolute right-3 bottom-3 flex items-center gap-3">
                        <Button size="icon" variant="ghost">
                           <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="secondary">
                           <Send className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
               </div>
            </div>

            {issue && (
               <aside className="hidden xl:block w-64 shrink-0 border-l overflow-y-auto bg-container px-4 py-5">
                  <IssuePropertiesPanel issue={issue} detail={detail} />
               </aside>
            )}
         </div>
      </div>
   );
}
