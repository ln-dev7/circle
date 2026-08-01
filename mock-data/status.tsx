import React from 'react';

/**
 * Status categories, used to build the "Active" / "Backlog" views,
 * to order statuses in a workflow-friendly way and to compute
 * progress (completed vs remaining) in cycles.
 */
export type StatusCategory =
   | 'triage'
   | 'backlog'
   | 'unstarted'
   | 'started'
   | 'completed'
   | 'canceled';

export interface Status {
   id: string;
   name: string;
   color: string;
   category: StatusCategory;
   icon: React.FC;
}

/* -------------------------------------------------------------------------- */
/*                            Generic icon builders                           */
/* -------------------------------------------------------------------------- */

/**
 * Dashed gear icon (used by "Idea" and "Backlog" — Linear style).
 */
const GEAR_PATH =
   'M13.9408 7.91426L11.9576 7.65557C11.9855 7.4419 12 7.22314 12 7C12 6.77686 11.9855 6.5581 11.9576 6.34443L13.9408 6.08573C13.9799 6.38496 14 6.69013 14 7C14 7.30987 13.9799 7.61504 13.9408 7.91426ZM13.4688 4.32049C13.2328 3.7514 12.9239 3.22019 12.5538 2.73851L10.968 3.95716C11.2328 4.30185 11.4533 4.68119 11.6214 5.08659L13.4688 4.32049ZM11.2615 1.4462L10.0428 3.03204C9.69815 2.76716 9.31881 2.54673 8.91341 2.37862L9.67951 0.531163C10.2486 0.767153 10.7798 1.07605 11.2615 1.4462ZM7.91426 0.0591659L7.65557 2.04237C7.4419 2.01449 7.22314 2 7 2C6.77686 2 6.5581 2.01449 6.34443 2.04237L6.08574 0.059166C6.38496 0.0201343 6.69013 0 7 0C7.30987 0 7.61504 0.0201343 7.91426 0.0591659ZM4.32049 0.531164L5.08659 2.37862C4.68119 2.54673 4.30185 2.76716 3.95716 3.03204L2.73851 1.4462C3.22019 1.07605 3.7514 0.767153 4.32049 0.531164ZM1.4462 2.73851L3.03204 3.95716C2.76716 4.30185 2.54673 4.68119 2.37862 5.08659L0.531164 4.32049C0.767153 3.7514 1.07605 3.22019 1.4462 2.73851ZM0.0591659 6.08574C0.0201343 6.38496 0 6.69013 0 7C0 7.30987 0.0201343 7.61504 0.059166 7.91426L2.04237 7.65557C2.01449 7.4419 2 7.22314 2 7C2 6.77686 2.01449 6.5581 2.04237 6.34443L0.0591659 6.08574ZM0.531164 9.67951L2.37862 8.91341C2.54673 9.31881 2.76716 9.69815 3.03204 10.0428L1.4462 11.2615C1.07605 10.7798 0.767153 10.2486 0.531164 9.67951ZM2.73851 12.5538L3.95716 10.968C4.30185 11.2328 4.68119 11.4533 5.08659 11.6214L4.32049 13.4688C3.7514 13.2328 3.22019 12.9239 2.73851 12.5538ZM6.08574 13.9408L6.34443 11.9576C6.5581 11.9855 6.77686 12 7 12C7.22314 12 7.4419 11.9855 7.65557 11.9576L7.91427 13.9408C7.61504 13.9799 7.30987 14 7 14C6.69013 14 6.38496 13.9799 6.08574 13.9408ZM9.67951 13.4688L8.91341 11.6214C9.31881 11.4533 9.69815 11.2328 10.0428 10.968L11.2615 12.5538C10.7798 12.9239 10.2486 13.2328 9.67951 13.4688ZM12.5538 11.2615L10.968 10.0428C11.2328 9.69815 11.4533 9.31881 11.6214 8.91341L13.4688 9.67951C13.2328 10.2486 12.924 10.7798 12.5538 11.2615Z';

export const StatusGearIcon: React.FC<{ color: string }> = ({ color }) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill={color} role="img" focusable="false">
      <path d={GEAR_PATH} stroke="none" />
   </svg>
);

/**
 * Partially-filled circle ("pie") icon used for unstarted / started statuses.
 * `fraction` is the filled portion of the inner pie (0 → empty, 1 → full).
 */
export const StatusPieIcon: React.FC<{ color: string; fraction: number }> = ({
   color,
   fraction,
}) => {
   const clamped = Math.max(0, Math.min(fraction, 0.9999));
   const angle = clamped * 2 * Math.PI;
   const x = 3.5 + 3.5 * Math.sin(angle);
   const y = 3.5 - 3.5 * Math.cos(angle);
   const largeArc = clamped > 0.5 ? 1 : 0;

   return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" role="img" focusable="false">
         <rect x="1" y="1" width="12" height="12" rx="6" stroke={color} strokeWidth="1.5" />
         {clamped > 0 && (
            <path
               fill={color}
               stroke="none"
               d={`M 3.5,3.5 L3.5,0 A3.5,3.5 0 ${largeArc},1 ${x.toFixed(4)},${y.toFixed(4)} z`}
               transform="translate(3.5,3.5)"
            />
         )}
      </svg>
   );
};

/**
 * Filled circle with a check mark (used by "Done" and "Shipped").
 */
export const StatusCheckIcon: React.FC<{ color: string }> = ({ color }) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill={color} role="img" focusable="false">
      <path
         fillRule="evenodd"
         clipRule="evenodd"
         d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM11.101 5.10104C11.433 4.76909 11.433 4.23091 11.101 3.89896C10.7691 3.56701 10.2309 3.56701 9.89896 3.89896L5.5 8.29792L4.10104 6.89896C3.7691 6.56701 3.2309 6.56701 2.89896 6.89896C2.56701 7.2309 2.56701 7.7691 2.89896 8.10104L4.89896 10.101C5.2309 10.433 5.7691 10.433 6.10104 10.101L11.101 5.10104Z"
      />
   </svg>
);

/**
 * Filled circle with an X (used by "Canceled").
 */
export const StatusXIcon: React.FC<{ color: string }> = ({ color }) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill={color} role="img" focusable="false">
      <path
         fillRule="evenodd"
         clipRule="evenodd"
         d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z"
         stroke="none"
      />
   </svg>
);

/**
 * Filled circle with a "slash equal" mark (used by "Duplicate").
 */
export const StatusDuplicateIcon: React.FC<{ color: string }> = ({ color }) => (
   <svg width="14" height="14" viewBox="0 0 14 14" fill={color} role="img" focusable="false">
      <path
         fillRule="evenodd"
         clipRule="evenodd"
         d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM9.5791 5.71973C9.872 5.42684 10.3468 5.42686 10.6396 5.71973C10.9325 6.01262 10.9325 6.48738 10.6396 6.78027L6.78027 10.6396C6.48738 10.9325 6.01262 10.9325 5.71973 10.6396C5.42686 10.3468 5.42684 9.872 5.71973 9.5791L9.5791 5.71973ZM7.21973 3.36035C7.51261 3.06746 7.98738 3.06747 8.28027 3.36035C8.57315 3.65325 8.57316 4.12801 8.28027 4.4209L4.4209 8.28027C4.12801 8.57316 3.65325 8.57315 3.36035 8.28027C3.06747 7.98738 3.06746 7.51261 3.36035 7.21973L7.21973 3.36035Z"
         stroke="none"
      />
   </svg>
);

/**
 * Triage icon (filled circle with opposite arrows).
 */
export const StatusTriageIcon: React.FC<{ color: string }> = ({ color }) => (
   <svg width="14" height="14" viewBox="0 0 14 14" role="img" focusable="false">
      <path
         fill={color}
         d="M7 14C10.866 14 14 10.866 14 7C14 3.13403 10.866 0 7 0C3.134 0 0 3.13403 0 7C0 10.866 3.134 14 7 14ZM8.0126 9.50781V7.98224H5.9874V9.50787C5.9874 9.92908 5.4767 10.1549 5.14897 9.8786L2.17419 7.37073C1.94194 7.17493 1.94194 6.82513 2.17419 6.62933L5.14897 4.12146C5.4767 3.84515 5.9874 4.07098 5.9874 4.49219V6.01764H8.0126V4.49213C8.0126 4.07092 8.5233 3.84509 8.85103 4.1214L11.8258 6.62927C12.0581 6.82507 12.0581 7.17487 11.8258 7.37067L8.85103 9.87854C8.5233 10.1548 8.0126 9.92902 8.0126 9.50781Z"
      />
   </svg>
);

/* -------------------------------------------------------------------------- */
/*                             Status definitions                             */
/* -------------------------------------------------------------------------- */

export const InProgressIcon: React.FC = () => <StatusPieIcon color="#facc15" fraction={0.25} />;
export const TechnicalReviewIcon: React.FC = () => <StatusPieIcon color="#22c55e" fraction={0.4} />;
export const DoneIcon: React.FC = () => <StatusCheckIcon color="#5e6ad2" />;
export const PausedIcon: React.FC = () => <StatusPieIcon color="#26b5ce" fraction={0.5} />;
export const ToDoIcon: React.FC = () => <StatusPieIcon color="#99a2b2" fraction={0} />;
export const BacklogIcon: React.FC = () => <StatusGearIcon color="#95a2b3" />;
export const TriageIcon: React.FC = () => <StatusTriageIcon color="#f2790f" />;
export const IdeaIcon: React.FC = () => <StatusGearIcon color="#5e6ad2" />;
export const ProductFeedbackIcon: React.FC = () => <StatusPieIcon color="#f2994a" fraction={0.8} />;
export const BlockedIcon: React.FC = () => <StatusPieIcon color="#eb5757" fraction={0.65} />;
export const ShippedIcon: React.FC = () => <StatusCheckIcon color="#4cb782" />;
export const CanceledIcon: React.FC = () => <StatusXIcon color="#95a2b3" />;
export const DuplicateIcon: React.FC = () => <StatusDuplicateIcon color="#95a2b3" />;

/**
 * All workflow statuses.
 *
 * NOTE: the first six entries keep the same indexes as the historical
 * status list (in-progress, technical-review, done, paused, to-do, backlog)
 * so mock data referencing `status[0..5]` keeps working.
 */
export const status: Status[] = [
   {
      id: 'in-progress',
      name: 'In Progress',
      color: '#facc15',
      category: 'started',
      icon: InProgressIcon,
   },
   {
      id: 'technical-review',
      name: 'Technical Review',
      color: '#22c55e',
      category: 'started',
      icon: TechnicalReviewIcon,
   },
   { id: 'done', name: 'Done', color: '#5e6ad2', category: 'completed', icon: DoneIcon },
   { id: 'paused', name: 'Paused', color: '#26b5ce', category: 'started', icon: PausedIcon },
   { id: 'to-do', name: 'Todo', color: '#99a2b2', category: 'unstarted', icon: ToDoIcon },
   { id: 'backlog', name: 'Backlog', color: '#95a2b3', category: 'backlog', icon: BacklogIcon },
   { id: 'triage', name: 'Triage', color: '#f2790f', category: 'triage', icon: TriageIcon },
   { id: 'idea', name: 'Idea', color: '#5e6ad2', category: 'backlog', icon: IdeaIcon },
   {
      id: 'product-feedback',
      name: 'Product Feedback',
      color: '#f2994a',
      category: 'started',
      icon: ProductFeedbackIcon,
   },
   { id: 'blocked', name: 'Blocked', color: '#eb5757', category: 'started', icon: BlockedIcon },
   { id: 'shipped', name: 'Shipped', color: '#4cb782', category: 'completed', icon: ShippedIcon },
   { id: 'canceled', name: 'Canceled', color: '#95a2b3', category: 'canceled', icon: CanceledIcon },
   {
      id: 'duplicate',
      name: 'Duplicate',
      color: '#95a2b3',
      category: 'canceled',
      icon: DuplicateIcon,
   },
];

/**
 * Workflow ordering (triage → backlog → unstarted → started → completed → canceled),
 * used by the insights table.
 */
const CATEGORY_ORDER: Record<StatusCategory, number> = {
   triage: 0,
   backlog: 1,
   unstarted: 2,
   started: 3,
   completed: 4,
   canceled: 5,
};

/** Display order used by grouped issue views (started statuses first, Linear-like). */
const DISPLAY_CATEGORY_ORDER: Record<StatusCategory, number> = {
   started: 0,
   unstarted: 1,
   triage: 2,
   backlog: 3,
   completed: 4,
   canceled: 5,
};

export const workflowOrderedStatus: Status[] = [...status].sort(
   (a, b) =>
      CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category] ||
      status.indexOf(a) - status.indexOf(b)
);

export const displayOrderedStatus: Status[] = [...status].sort(
   (a, b) =>
      DISPLAY_CATEGORY_ORDER[a.category] - DISPLAY_CATEGORY_ORDER[b.category] ||
      status.indexOf(a) - status.indexOf(b)
);

export function getStatusesByCategory(categories: StatusCategory[]): Status[] {
   return displayOrderedStatus.filter((s) => categories.includes(s.category));
}

export const StatusIcon: React.FC<{ statusId: string }> = ({ statusId }) => {
   const currentStatus = status.find((s) => s.id === statusId);
   if (!currentStatus) return null;

   const IconComponent = currentStatus.icon;
   return <IconComponent />;
};
