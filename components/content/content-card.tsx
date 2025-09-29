'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Content {
   id: string;
   title: string;
   body?: string;
   status: string;
   createdAt: string;
   campaign: {
      id: string;
      name: string;
   };
}

interface ContentCardProps {
   content: Content;
   orgId: string;
}

const getStatusColor = (status: string) => {
   switch (status) {
      case 'DRAFT':
         return 'secondary';
      case 'SUBMITTED':
         return 'default';
      case 'APPROVED':
         return 'default';
      case 'PUBLISHED':
         return 'default';
      case 'REJECTED':
         return 'destructive';
      default:
         return 'secondary';
   }
};

export function ContentCard({ content, orgId }: ContentCardProps) {
   const createdDate = new Date(content.createdAt);

   return (
      <Card className="hover:shadow-md transition-shadow">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
               <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                     {content.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                     {content.campaign.name}
                  </CardDescription>
               </div>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            {content.body && (
               <p className="text-sm text-muted-foreground line-clamp-3">
                  {content.body.replace(/<[^>]*>/g, '')} {/* Remove HTML tags */}
               </p>
            )}

            <div className="flex items-center justify-between">
               <Badge variant={getStatusColor(content.status) as any}>{content.status}</Badge>
               <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
               </div>
            </div>

            <div className="flex gap-2">
               <Link href={`/${orgId}/content/${content.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                     <Eye className="h-4 w-4 mr-2" />
                     View Details
                  </Button>
               </Link>
               <Link href={`/${orgId}/content/${content.id}/edit`}>
                  <Button size="sm">Edit</Button>
               </Link>
            </div>
         </CardContent>
      </Card>
   );
}
