import { ReactNode } from 'react';

interface PageHeaderProps {
   title: string;
   description?: string;
   action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
   return (
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
         </div>
         {action && <div className="flex-shrink-0">{action}</div>}
      </div>
   );
}
