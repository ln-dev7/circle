'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { X, Plus, Tag } from 'lucide-react';
import { CampaignLabel, CreateLabelData } from '@/types/campaign';

interface CampaignLabelsSelectorProps {
   value: CampaignLabel[];
   onChange: (labels: CampaignLabel[]) => void;
   availableLabels?: CampaignLabel[];
   onCreateLabel?: (data: CreateLabelData) => void;
   disabled?: boolean;
   className?: string;
}

const DEFAULT_COLORS = [
   '#3B82F6', // Blue
   '#EF4444', // Red
   '#10B981', // Green
   '#F59E0B', // Yellow
   '#8B5CF6', // Purple
   '#F97316', // Orange
   '#06B6D4', // Cyan
   '#84CC16', // Lime
   '#EC4899', // Pink
   '#6B7280', // Gray
];

export default function CampaignLabelsSelector({
   value,
   onChange,
   availableLabels = [],
   onCreateLabel,
   disabled = false,
   className = '',
}: CampaignLabelsSelectorProps) {
   const [isCreating, setIsCreating] = useState(false);
   const [newLabelName, setNewLabelName] = useState('');
   const [newLabelColor, setNewLabelColor] = useState(DEFAULT_COLORS[0]);
   const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

   const allLabels = [...availableLabels, ...value];

   const addLabel = (label: CampaignLabel) => {
      if (!value.find((l) => l.id === label.id)) {
         onChange([...value, label]);
      }
   };

   const removeLabel = (labelId: string) => {
      onChange(value.filter((label) => label.id !== labelId));
   };

   const createNewLabel = () => {
      if (newLabelName.trim() && onCreateLabel) {
         onCreateLabel({
            name: newLabelName.trim(),
            color: newLabelColor,
         });
         setNewLabelName('');
         setNewLabelColor(DEFAULT_COLORS[0]);
         setIsCreating(false);
      }
   };

   const handleColorSelect = (color: string) => {
      setNewLabelColor(color);
      setIsColorPickerOpen(false);
   };

   return (
      <div className={`space-y-3 ${className}`}>
         <Label className="text-sm font-medium">Labels</Label>

         {/* Selected Labels */}
         <div className="flex flex-wrap gap-2">
            {value.map((label) => (
               <Badge
                  key={label.id}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                  style={{ backgroundColor: label.color, color: 'white' }}
               >
                  <Tag className="h-3 w-3" />
                  <span>{label.name}</span>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => removeLabel(label.id)}
                     disabled={disabled}
                     className="h-4 w-4 p-0 ml-1 hover:bg-white/20"
                  >
                     <X className="h-3 w-3" />
                  </Button>
               </Badge>
            ))}
         </div>

         {/* Add Labels */}
         <div className="space-y-2">
            {!isCreating ? (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                  disabled={disabled}
                  className="w-full"
               >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Labels
               </Button>
            ) : (
               <div className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                     <Tag className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Create New Label</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <Input
                        placeholder="Label name"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        disabled={disabled}
                        className="text-sm"
                     />

                     <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className="w-full justify-start"
                              disabled={disabled}
                           >
                              <div
                                 className="w-4 h-4 rounded mr-2"
                                 style={{ backgroundColor: newLabelColor }}
                              />
                              Color
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-3">
                           <div className="grid grid-cols-5 gap-2">
                              {DEFAULT_COLORS.map((color) => (
                                 <button
                                    key={color}
                                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                                    style={{
                                       backgroundColor: color,
                                       borderColor:
                                          color === newLabelColor ? '#000' : 'transparent',
                                    }}
                                    onClick={() => handleColorSelect(color)}
                                 />
                              ))}
                           </div>
                           <div className="mt-3">
                              <Input
                                 type="color"
                                 value={newLabelColor}
                                 onChange={(e) => setNewLabelColor(e.target.value)}
                                 className="w-full h-10"
                              />
                           </div>
                        </PopoverContent>
                     </Popover>
                  </div>

                  <div className="flex gap-2">
                     <Button
                        size="sm"
                        onClick={createNewLabel}
                        disabled={!newLabelName.trim() || disabled}
                        className="flex-1"
                     >
                        Create
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                           setIsCreating(false);
                           setNewLabelName('');
                           setNewLabelColor(DEFAULT_COLORS[0]);
                        }}
                        className="flex-1"
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* Available Labels */}
         {availableLabels.length > 0 && (
            <div className="space-y-2">
               <Label className="text-sm font-medium text-muted-foreground">Available Labels</Label>
               <div className="flex flex-wrap gap-2">
                  {availableLabels.map((label) => (
                     <Button
                        key={label.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addLabel(label)}
                        disabled={disabled || value.find((l) => l.id === label.id)}
                        className="flex items-center gap-1 px-2 py-1 h-auto"
                     >
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: label.color }} />
                        <span>{label.name}</span>
                        {value.find((l) => l.id === label.id) && (
                           <Badge variant="secondary" className="ml-1 text-xs">
                              Added
                           </Badge>
                        )}
                     </Button>
                  ))}
               </div>
            </div>
         )}

         {/* No Labels Message */}
         {value.length === 0 && availableLabels.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
               No labels available. Create your first label to get started.
            </p>
         )}
      </div>
   );
}
