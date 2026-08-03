'use client';

import { format, parseISO } from 'date-fns';
import { Area, ComposedChart, Line, ResponsiveContainer, XAxis } from 'recharts';

interface ProjectProgressChartProps {
   startDate: string;
   endDate: string;
   scope: number;
   started: number;
   completed: number;
}

const COLORS = { scope: '#8f9299', started: '#facc15', completed: '#6771c5' };

/** Deterministic burn-up-style points for the project Progress card. */
function buildPoints(scope: number, started: number, completed: number) {
   const points: { index: number; scope: number; started: number; completed: number }[] = [];
   const steps = 12;
   for (let index = 0; index <= steps; index++) {
      const t = index / steps;
      // Ease-out scope growth, ease-in-out completion.
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const scopeAt = Math.round(scope * Math.min(1, 0.35 + 0.65 * Math.min(1, t * 1.6)));
      const completedAt = Math.round(completed * eased);
      const startedAt = Math.min(
         scopeAt,
         completedAt + Math.round(started * Math.sin(Math.min(1, t * 1.2) * Math.PI * 0.5))
      );
      points.push({ index, scope: scopeAt, started: startedAt, completed: completedAt });
   }
   return points;
}

/** Compact Scope / Started / Completed area chart (Linear project panel style). */
export function ProjectProgressChart({
   startDate,
   endDate,
   scope,
   started,
   completed,
}: ProjectProgressChartProps) {
   const data = buildPoints(scope, started, completed);

   return (
      <div>
         <ResponsiveContainer width="100%" height={130}>
            <ComposedChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
               <defs>
                  <linearGradient id="project-completed-fill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor={COLORS.completed} stopOpacity={0.45} />
                     <stop offset="100%" stopColor={COLORS.completed} stopOpacity={0.05} />
                  </linearGradient>
               </defs>
               <XAxis dataKey="index" hide />
               <Line
                  type="monotone"
                  dataKey="scope"
                  stroke={COLORS.scope}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
               />
               <Line
                  type="monotone"
                  dataKey="started"
                  stroke={COLORS.started}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
               />
               <Area
                  type="monotone"
                  dataKey="completed"
                  stroke={COLORS.completed}
                  strokeWidth={1.75}
                  fill="url(#project-completed-fill)"
                  isAnimationActive={false}
               />
            </ComposedChart>
         </ResponsiveContainer>
         <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
            <span>{format(parseISO(startDate), 'MMM d')}</span>
            <span>{format(parseISO(endDate), 'MMM d')}</span>
         </div>
      </div>
   );
}
