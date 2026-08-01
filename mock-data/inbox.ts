import { Issue, issues } from './issues';
import { User, users } from './users';

export type NotificationType =
   | 'comment'
   | 'mention'
   | 'assignment'
   | 'status'
   | 'reopened'
   | 'closed'
   | 'edited'
   | 'created'
   | 'upload';

/**
 * An inbox notification. It extends the real `Issue` it belongs to
 * (found by identifier) so the preview pane can show the actual issue.
 */
export interface InboxItem extends Issue {
   /** Notification-specific fields */
   content: string;
   type: NotificationType;
   user: User;
   timestamp: string;
   read: boolean;
}

/**
 * Notification seeds referencing REAL issues by identifier:
 * [identifier, type, actorIdx (users), content, timestamp, read]
 */
type InboxSeed = [string, NotificationType, number, string, string, boolean];

const seeds: InboxSeed[] = [
   [
      'LNUI-703',
      'comment',
      1,
      'Heads up: Radix solves this with a DismissableLayer tree — worth reading before we reinvent it.',
      '2h',
      false,
   ],
   ['LNUI-710', 'status', 3, 'marked this issue as blocked by LNUI-707', '4h', false],
   [
      'LNUI-704',
      'mention',
      4,
      '@leonel.ngoya can you sanity-check the windowing overscan value on your machine?',
      '6h',
      false,
   ],
   ['LNUI-726', 'closed', 4, 'moved this issue from In Progress to Done', '9h', false],
   [
      'LNUI-701',
      'comment',
      7,
      'Confirmed on Firefox and Safari as well — the backwards iterator starts at index instead of index - 1.',
      '12h',
      false,
   ],
   ['LNUI-736', 'created', 5, 'created this issue and added it to Cycle 21', '1d', true],
   ['LNUI-715', 'assignment', 9, 'assigned this issue to you', '1d', false],
   [
      'LNUI-702',
      'comment',
      13,
      'Design is fine with a simple opacity crossfade on low-end devices — key it on prefers-reduced-motion.',
      '2d',
      true,
   ],
   ['LNUI-819', 'created', 16, 'created this issue from docs feedback', '2d', true],
   ['LNUI-706', 'edited', 12, 'updated the token mapping section of the description', '3d', true],
   ['LNUI-735', 'closed', 3, 'moved this issue from Technical Review to Shipped', '3d', true],
   [
      'LNUI-722',
      'mention',
      19,
      '@leonel.ngoya the CVD simulation looks good — can we lock the anchors this week?',
      '4d',
      true,
   ],
   [
      'LNUI-744',
      'reopened',
      0,
      'reopened this issue — still reproducible on iOS 19 beta',
      '5d',
      true,
   ],
   ['LNUI-731', 'upload', 14, 'attached the search indexing benchmark results', '6d', true],
];

const issueByIdentifier = new Map(issues.map((issue) => [issue.identifier, issue]));

export const inboxItems: InboxItem[] = seeds
   .map(([identifier, type, actorIdx, content, timestamp, read], index) => {
      const issue = issueByIdentifier.get(identifier);
      if (!issue) return null;

      return {
         ...issue,
         id: `notification-${index + 1}`,
         content,
         type,
         user: users[actorIdx],
         timestamp,
         read,
      };
   })
   .filter((item): item is InboxItem => item !== null);
