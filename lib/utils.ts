import LexoRank from '@kayron013/lexorank';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

/**
 * Ordering system like JIRA's LexoRank algorithm.
 * @see https://youtu.be/OjQv9xMoFbg
 */
export { LexoRank };
