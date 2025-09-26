'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Clock, Layers } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignSearchProps {
   value: string;
   onChange: (value: string) => void;
   onSelect: (campaign: Campaign) => void;
   campaigns: Campaign[];
   placeholder?: string;
   className?: string;
}

export default function CampaignSearch({
   value,
   onChange,
   onSelect,
   campaigns,
   placeholder = 'Search campaigns...',
   className = '',
}: CampaignSearchProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchResults, setSearchResults] = useState<Campaign[]>([]);
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const inputRef = useRef<HTMLInputElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Filter campaigns based on search value
   useEffect(() => {
      if (!value.trim()) {
         setSearchResults([]);
         return;
      }

      const filtered = campaigns.filter((campaign) => {
         const searchLower = value.toLowerCase();
         return (
            campaign.name.toLowerCase().includes(searchLower) ||
            campaign.description?.toLowerCase().includes(searchLower) ||
            campaign.summary?.toLowerCase().includes(searchLower) ||
            campaign.status.toLowerCase().includes(searchLower) ||
            campaign.health.toLowerCase().includes(searchLower)
         );
      });

      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setHighlightedIndex(-1);
   }, [value, campaigns]);

   // Handle keyboard navigation
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isOpen || searchResults.length === 0) return;

         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault();
               setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
               break;
            case 'ArrowUp':
               e.preventDefault();
               setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
               break;
            case 'Enter':
               e.preventDefault();
               if (highlightedIndex >= 0) {
                  handleSelect(searchResults[highlightedIndex]);
               }
               break;
            case 'Escape':
               setIsOpen(false);
               setHighlightedIndex(-1);
               break;
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, searchResults, highlightedIndex]);

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
            setHighlightedIndex(-1);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setIsOpen(newValue.length > 0);
   };

   const handleInputFocus = () => {
      if (value.length > 0) {
         setIsOpen(true);
      }
   };

   const handleSelect = (campaign: Campaign) => {
      onSelect(campaign);
      onChange('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
   };

   const handleClear = () => {
      onChange('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'DRAFT':
            return 'secondary';
         case 'PLANNING':
            return 'default';
         case 'READY':
            return 'default';
         case 'DONE':
            return 'default';
         case 'CANCELED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const getHealthColor = (health: string) => {
      switch (health) {
         case 'ON_TRACK':
            return 'default';
         case 'AT_RISK':
            return 'destructive';
         case 'OFF_TRACK':
            return 'secondary';
         default:
            return 'default';
      }
   };

   const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   };

   return (
      <div className={`relative ${className}`}>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
               ref={inputRef}
               placeholder={placeholder}
               value={value}
               onChange={handleInputChange}
               onFocus={handleInputFocus}
               className="pl-10 pr-10"
            />
            {value && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
               >
                  <X className="h-3 w-3" />
               </Button>
            )}
         </div>

         {/* Search Results Dropdown */}
         {isOpen && searchResults.length > 0 && (
            <div
               ref={dropdownRef}
               className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
               {searchResults.map((campaign, index) => (
                  <div
                     key={campaign.id}
                     className={`p-3 cursor-pointer hover:bg-muted/50 border-b last:border-b-0 ${
                        index === highlightedIndex ? 'bg-muted' : ''
                     }`}
                     onClick={() => handleSelect(campaign)}
                     onMouseEnter={() => setHighlightedIndex(index)}
                  >
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                           <div className="inline-flex size-8 bg-muted/50 items-center justify-center rounded">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{campaign.name}</h4>
                              <Badge variant={getStatusColor(campaign.status)} className="text-xs">
                                 {campaign.status}
                              </Badge>
                              <Badge variant={getHealthColor(campaign.health)} className="text-xs">
                                 {campaign.health.replace('_', ' ')}
                              </Badge>
                           </div>

                           {campaign.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                 {campaign.description}
                              </p>
                           )}

                           <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                 <Clock className="h-3 w-3" />
                                 <span>
                                    {campaign.startDate && campaign.targetDate
                                       ? `${formatDate(campaign.startDate)} → ${formatDate(campaign.targetDate)}`
                                       : formatDate(campaign.createdAt)}
                                 </span>
                              </div>

                              <div className="flex items-center gap-1">
                                 <Layers className="h-3 w-3" />
                                 <span>{campaign._count?.tasks || 0} tasks</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* No Results */}
         {isOpen && value.length > 0 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 p-4">
               <div className="text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No campaigns found</p>
                  <p className="text-xs">Try different keywords or check your spelling</p>
               </div>
            </div>
         )}
      </div>
   );
}
