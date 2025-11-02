'use client';

import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationMeta } from '@/types/campaign';

interface CampaignPaginationProps {
   pagination: PaginationMeta;
   onPageChange: (page: number) => void;
   onLimitChange: (limit: number) => void;
   className?: string;
}

export default function CampaignPagination({
   pagination,
   onPageChange,
   onLimitChange,
   className = '',
}: CampaignPaginationProps) {
   const { page, limit, total, totalPages, hasNextPage, hasPrevPage } = pagination;

   // Calculate page range for display
   const getPageRange = () => {
      const delta = 2; // Number of pages to show on each side of current page
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
         range.push(i);
      }

      if (page - delta > 2) {
         rangeWithDots.push(1, '...');
      } else {
         rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (page + delta < totalPages - 1) {
         rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
         rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
   };

   const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
         onPageChange(newPage);
      }
   };

   const handleLimitChange = (newLimit: string) => {
      const limitNum = parseInt(newLimit);
      if (limitNum !== limit) {
         onLimitChange(limitNum);
      }
   };

   if (total === 0) {
      return null;
   }

   return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
         {/* Page Info */}
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
               Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)}{' '}
               of {total} campaigns
            </span>
         </div>

         {/* Pagination Controls */}
         <div className="flex items-center gap-2">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">Show:</span>
               <Select value={limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-20 h-8">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                     <SelectItem value="100">100</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-1">
               {/* First Page */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!hasPrevPage}
                  className="h-8 w-8 p-0"
               >
                  <ChevronsLeft className="h-4 w-4" />
               </Button>

               {/* Previous Page */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!hasPrevPage}
                  className="h-8 w-8 p-0"
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>

               {/* Page Numbers */}
               {getPageRange().map((pageNum, index) => (
                  <div key={index}>
                     {pageNum === '...' ? (
                        <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                     ) : (
                        <Button
                           variant={pageNum === page ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => handlePageChange(pageNum as number)}
                           className="h-8 w-8 p-0"
                        >
                           {pageNum}
                        </Button>
                     )}
                  </div>
               ))}

               {/* Next Page */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasNextPage}
                  className="h-8 w-8 p-0"
               >
                  <ChevronRight className="h-4 w-4" />
               </Button>

               {/* Last Page */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={!hasNextPage}
                  className="h-8 w-8 p-0"
               >
                  <ChevronsRight className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}
