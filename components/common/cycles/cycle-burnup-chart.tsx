'use client';

import { Cycle } from '@/mock-data/cycles';
import { format, parseISO } from 'date-fns';
import {
   Area,
   CartesianGrid,
   ComposedChart,
   Line,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from 'recharts';

const COLORS = {
   scope: '#8f9299',
   started: '#facc15',
   completed: '#6771c5',
   ideal: '#6771c5',
};

interface CycleBurnupChartProps {
   cycle: Cycle;
   height?: number;
   /** Compact mode hides axes details (used inside the details panel). */
   compact?: boolean;
}

/**
 * Linear-style burn-up chart: gray scope line, yellow started line,
 * indigo completed area and a dashed ideal line.
 */
export function CycleBurnupChart({ cycle, height = 210, compact = false }: CycleBurnupChartProps) {
   const data = cycle.burnup ?? [];

   if (data.length === 0) {
      return (
         <div
            className="flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md"
            style={{ height }}
         >
            No progress data yet
         </div>
      );
   }

   const first = data[0].date;
   const middle = data[Math.floor(data.length / 2)].date;
   const last = data[data.length - 1].date;

   return (
      <ResponsiveContainer width="100%" height={height}>
         <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: compact ? 0 : 4 }}>
            <defs>
               <linearGradient id={`completed-fill-${cycle.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.completed} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={COLORS.completed} stopOpacity={0.05} />
               </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.15} strokeDasharray="3 3" />
            <XAxis
               dataKey="date"
               ticks={compact ? [first, last] : [first, middle, last]}
               tickFormatter={(value: string) => format(parseISO(value), 'MMM d')}
               tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
               axisLine={false}
               tickLine={false}
            />
            <YAxis hide domain={[0, 'dataMax + 4']} />
            <Tooltip
               cursor={{ stroke: COLORS.scope, strokeOpacity: 0.3 }}
               contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
               }}
               labelFormatter={(value) => format(parseISO(String(value)), 'MMM d')}
            />
            <Line
               type="monotone"
               dataKey="ideal"
               name="Ideal"
               stroke={COLORS.ideal}
               strokeDasharray="4 4"
               strokeWidth={1.25}
               dot={false}
               isAnimationActive={false}
            />
            <Line
               type="monotone"
               dataKey="scope"
               name="Scope"
               stroke={COLORS.scope}
               strokeWidth={1.5}
               dot={false}
               isAnimationActive={false}
            />
            <Line
               type="monotone"
               dataKey="started"
               name="Started"
               stroke={COLORS.started}
               strokeWidth={1.5}
               dot={false}
               isAnimationActive={false}
            />
            <Area
               type="monotone"
               dataKey="completed"
               name="Completed"
               stroke={COLORS.completed}
               strokeWidth={1.75}
               fill={`url(#completed-fill-${cycle.id})`}
               isAnimationActive={false}
            />
         </ComposedChart>
      </ResponsiveContainer>
   );
}

export function CycleProgressLegend({ cycle }: { cycle: Cycle }) {
   const completedPercent = cycle.scope > 0 ? Math.round((cycle.completed / cycle.scope) * 100) : 0;
   const startedPercent = cycle.scope > 0 ? Math.round((cycle.started / cycle.scope) * 100) : 0;

   const rows = [
      {
         key: 'scope',
         label: 'Scope',
         swatch: COLORS.scope,
         value: cycle.scope,
         extra: cycle.scopeDelta !== 0 ? `+${cycle.scopeDelta}%` : undefined,
         extraClass: 'text-red-500',
      },
      {
         key: 'started',
         label: 'Started',
         swatch: COLORS.started,
         value: cycle.started,
         extra: `${startedPercent}%`,
         extraClass: 'text-muted-foreground',
      },
      {
         key: 'completed',
         label: 'Completed',
         swatch: COLORS.completed,
         value: cycle.completed,
         extra: `${completedPercent}%`,
         extraClass: 'text-muted-foreground',
      },
   ];

   return (
      <div className="flex flex-col divide-y divide-border/60 min-w-[200px]">
         {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-6 py-2.5">
               <div className="flex items-center gap-2">
                  <span
                     className="size-2 rounded-[2px]"
                     style={{ backgroundColor: row.swatch }}
                     aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground">{row.label}</span>
               </div>
               <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-medium">{row.value}</span>
                  {row.extra && <span className={`text-xs ${row.extraClass}`}>• {row.extra}</span>}
               </div>
            </div>
         ))}
      </div>
   );
}
