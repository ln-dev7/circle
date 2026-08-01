'use client';

interface CapacityRingProps {
   /** 0 → 100 */
   value: number;
   size?: number;
   color?: string;
   trackColor?: string;
}

/**
 * Small circular progress indicator, used for cycle capacity and
 * per-assignee completion in the cycle details panel.
 */
export function CapacityRing({
   value,
   size = 16,
   color = '#5e6ad2',
   trackColor = 'var(--border)',
}: CapacityRingProps) {
   const clamped = Math.max(0, Math.min(value, 100));
   const radius = 6;
   const circumference = 2 * Math.PI * radius;
   const offset = circumference * (1 - clamped / 100);

   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 16 16"
         role="img"
         aria-label={`${clamped}%`}
         className="shrink-0"
      >
         <circle cx="8" cy="8" r={radius} stroke={trackColor} strokeWidth="2" fill="none" />
         <circle
            cx="8"
            cy="8"
            r={radius}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 8 8)"
         />
      </svg>
   );
}
