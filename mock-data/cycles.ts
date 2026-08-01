import { format, parseISO } from 'date-fns';

export type CycleStatus = 'planned' | 'upcoming' | 'current' | 'completed';

/** One data point of a cycle burn-up chart. */
export interface CycleBurnupPoint {
   date: string; // ISO date (yyyy-MM-dd)
   scope: number;
   started: number;
   completed: number;
   ideal: number;
}

export interface Cycle {
   id: string;
   number: number;
   name: string;
   teamId: string;
   status: CycleStatus;
   startDate: string; // ISO date
   endDate: string; // ISO date
   /** Percentage of the team capacity currently allocated to the cycle. */
   capacity: number;
   /** Total number of issues in the cycle. */
   scope: number;
   /** Scope variation (in %) since the beginning of the cycle. */
   scopeDelta: number;
   /** Number of issues started but not completed. */
   started: number;
   /** Number of completed issues. */
   completed: number;
   /** Completed / scope, for finished cycles ("67% success"). */
   successRate?: number;
   /** Burn-up chart points (only meaningful for current / completed cycles). */
   burnup?: CycleBurnupPoint[];
}

/**
 * Generates a plausible burn-up curve between startDate and endDate.
 * Deterministic (no randomness) so SSR and client render the same chart.
 */
const generateBurnup = (
   startDate: string,
   days: number,
   startScope: number,
   endScope: number,
   completedTarget: number,
   startedTarget: number
): CycleBurnupPoint[] => {
   const points: CycleBurnupPoint[] = [];
   const start = parseISO(startDate);

   for (let i = 0; i <= days; i++) {
      const t = i / days;
      // Ease-in-out curve for completion, slightly stepped scope growth.
      const eased = t * t * (3 - 2 * t);
      const scope = Math.round(startScope + (endScope - startScope) * Math.min(1, t * 1.35));
      const completed = Math.round(completedTarget * eased);
      const started = Math.min(
         scope - completed,
         Math.round(startedTarget * (0.4 + 0.6 * Math.sin(t * Math.PI)))
      );
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      points.push({
         date: format(date, 'yyyy-MM-dd'),
         scope,
         started: completed + Math.max(0, started),
         completed,
         ideal: Math.round(endScope * t),
      });
   }

   return points;
};

/**
 * Cycles of the CORE team. One `current`, one `upcoming`, one `planned`,
 * the rest `completed` — two-week iterations, most recent first.
 */
export const cycles: Cycle[] = [
   {
      id: '23',
      number: 23,
      name: 'Cycle 23',
      teamId: 'CORE',
      status: 'planned',
      startDate: '2026-08-17',
      endDate: '2026-08-30',
      capacity: 0,
      scope: 0,
      scopeDelta: 0,
      started: 0,
      completed: 0,
   },
   {
      id: '22',
      number: 22,
      name: 'Cycle 22',
      teamId: 'CORE',
      status: 'upcoming',
      startDate: '2026-08-03',
      endDate: '2026-08-16',
      capacity: 12,
      scope: 24,
      scopeDelta: 0,
      started: 4,
      completed: 0,
      burnup: generateBurnup('2026-08-03', 13, 24, 24, 0, 4),
   },
   {
      id: '21',
      number: 21,
      name: 'Cycle 21',
      teamId: 'CORE',
      status: 'current',
      startDate: '2026-07-20',
      endDate: '2026-08-02',
      capacity: 68,
      scope: 111,
      scopeDelta: 44,
      started: 33,
      completed: 34,
      burnup: generateBurnup('2026-07-20', 13, 78, 111, 34, 33),
   },
   {
      id: '20',
      number: 20,
      name: 'Cycle 20',
      teamId: 'CORE',
      status: 'completed',
      startDate: '2026-07-06',
      endDate: '2026-07-19',
      capacity: 82,
      scope: 21,
      scopeDelta: 20,
      started: 0,
      completed: 18,
      successRate: 86,
      burnup: generateBurnup('2026-07-06', 13, 17, 21, 18, 3),
   },
   {
      id: '19',
      number: 19,
      name: 'Cycle 19',
      teamId: 'CORE',
      status: 'completed',
      startDate: '2026-06-22',
      endDate: '2026-07-05',
      capacity: 90,
      scope: 21,
      scopeDelta: 12,
      started: 0,
      completed: 17,
      successRate: 81,
      burnup: generateBurnup('2026-06-22', 13, 18, 21, 17, 4),
   },
   {
      id: '18',
      number: 18,
      name: 'Cycle 18',
      teamId: 'CORE',
      status: 'completed',
      startDate: '2026-06-08',
      endDate: '2026-06-21',
      capacity: 76,
      scope: 18,
      scopeDelta: 35,
      started: 0,
      completed: 16,
      successRate: 89,
      burnup: generateBurnup('2026-06-08', 13, 14, 18, 16, 2),
   },
   {
      id: '17',
      number: 17,
      name: 'Cycle 17',
      teamId: 'CORE',
      status: 'completed',
      startDate: '2026-05-25',
      endDate: '2026-06-07',
      capacity: 64,
      scope: 18,
      scopeDelta: 8,
      started: 0,
      completed: 15,
      successRate: 83,
      burnup: generateBurnup('2026-05-25', 13, 16, 18, 15, 3),
   },
   {
      id: '16',
      number: 16,
      name: 'Cycle 16',
      teamId: 'CORE',
      status: 'completed',
      startDate: '2026-05-11',
      endDate: '2026-05-24',
      capacity: 58,
      scope: 15,
      scopeDelta: 15,
      started: 0,
      completed: 14,
      successRate: 93,
      burnup: generateBurnup('2026-05-11', 13, 13, 15, 14, 1),
   },
];

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

export function getCurrentCycle(): Cycle {
   return cycles.find((c) => c.status === 'current') ?? cycles[0];
}

export function getUpcomingCycle(): Cycle {
   return cycles.find((c) => c.status === 'upcoming') ?? cycles[0];
}

export function getCycleById(id: string): Cycle | undefined {
   return cycles.find((c) => c.id === id);
}

export function getCyclesByTeam(teamId: string): Cycle[] {
   return cycles.filter((c) => c.teamId === teamId);
}

export function formatCycleDateRange(cycle: Cycle): string {
   return `${format(parseISO(cycle.startDate), 'MMM d')} → ${format(parseISO(cycle.endDate), 'MMM d')}`;
}

export const cycleStatusLabel: Record<CycleStatus, string> = {
   planned: 'Planned',
   upcoming: 'Upcoming',
   current: 'Current',
   completed: 'Completed',
};
