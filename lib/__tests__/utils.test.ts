import { cn } from '../utils';

describe('cn', () => {
   it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
   });

   it('should handle conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
   });

   it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toContain('px-4');
      expect(result).toContain('py-1');
   });

   it('should handle empty inputs', () => {
      expect(cn()).toBe('');
   });

   it('should handle undefined and null', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
   });
});
