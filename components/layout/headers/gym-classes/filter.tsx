'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGymClassesFilterStore } from '@/store/gym-classes-filter-store';
import { ClassCategory, ClassDifficulty } from '@/mock-data/gym-classes';

interface FilterPopoverProps {
  children: React.ReactNode;
}

const categories: ClassCategory[] = [
  'Cardio',
  'Strength',
  'Flexibility',
  'Mind-Body',
  'Dance',
  'Combat',
  'Group Fitness',
];

const difficulties: ClassDifficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export function FilterPopover({ children }: FilterPopoverProps) {
  const {
    selectedCategories,
    selectedDifficulties,
    setSelectedCategories,
    setSelectedDifficulties,
    resetFilters,
  } = useGymClassesFilterStore();

  const handleCategoryToggle = (category: ClassCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDifficultyToggle = (difficulty: ClassDifficulty) => {
    if (selectedDifficulties.includes(difficulty)) {
      setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty));
    } else {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Classes</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-auto p-0 text-xs"
            >
              Reset
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Difficulty</Label>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center gap-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={selectedDifficulties.includes(difficulty)}
                    onCheckedChange={() => handleDifficultyToggle(difficulty)}
                  />
                  <Label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {difficulty}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
