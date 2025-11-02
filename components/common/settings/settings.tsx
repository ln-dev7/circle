'use client';

import { ReactNode } from 'react';
import {
   LifeBuoy,
   Package,
   BarChart3,
   Layers,
   FileText,
   BookOpen,
   GraduationCap,
   ArrowRight,
   CheckCircle2,
} from 'lucide-react';
import {
   SiZendesk,
   SiGooglesheets,
   SiZapier,
   SiSlack,
   SiGithub,
   SiGitlab,
   SiFigma,
   SiSentry,
   SiTablecheck,
} from 'react-icons/si';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './language-switcher';

interface Feature {
   icon: ReactNode;
   title: string;
   description: string;
   actionLabel?: string;
   activated?: boolean;
   teamsActivated?: number;
}

interface Integration {
   icon: ReactNode;
   title: string;
   description: string;
   enabled?: boolean;
   actionLabel: string;
}

interface Guide {
   icon: ReactNode;
   iconBg: string;
   iconColor: string;
   title: string;
   description: string;
}

const features: Feature[] = [
   {
      icon: <LifeBuoy className="" size={20} />,
      title: 'Customer requests',
      description: "Track and manage customer requests alongside your team's work",
      actionLabel: 'Try Customer requests',
   },
   {
      icon: <SiTablecheck className="" size={20} />,
      title: 'Initiatives',
      description: 'Plan strategic product work and monitor progress at scale',
      actionLabel: 'Learn more',
      activated: true,
   },
   {
      icon: <Package className="" size={20} />,
      title: 'Cycles',
      description: "Track your team's workload and velocity with Cycles",
      actionLabel: 'Learn more',
      teamsActivated: 6,
   },
   {
      icon: <BarChart3 className="" size={20} />,
      title: 'Views',
      description: 'Create filtered views that you can save and share with others',
      actionLabel: 'Open views',
   },
   {
      icon: <Layers className="" size={20} />,
      title: 'Triage',
      description:
         'Prioritize issues created from multiple your team and customer support integrations',
      actionLabel: 'Learn more',
      teamsActivated: 4,
   },
];

const guides: Guide[] = [
   {
      icon: <BookOpen size={20} />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      title: 'Start guide',
      description: 'Quick tips for beginners',
   },
   {
      icon: <FileText size={20} />,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      title: 'Feature guide',
      description: 'How Linear works',
   },
   {
      icon: <GraduationCap size={20} />,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      title: 'Linear method',
      description: 'Best practices for building',
   },
   {
      icon: <SiSlack size={20} />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      title: 'Join our Slack community',
      description: 'Ask questions and meet others',
   },
];

const integrations: Integration[] = [
   {
      icon: <SiGithub size={24} />,
      title: 'GitHub',
      description: 'Link pull requests, commits and automate workflows',
      enabled: true,
      actionLabel: 'Enabled',
   },
   {
      icon: <SiGitlab size={24} />,
      title: 'GitLab',
      description: 'Link merge requests and automate workflows',
      actionLabel: 'Open',
   },
   {
      icon: <SiSlack size={24} />,
      title: 'Slack',
      description: 'Send notifications to channels and create issues from messages',
      enabled: true,
      actionLabel: 'Enabled',
   },
   {
      icon: <SiFigma size={24} />,
      title: 'Figma',
      description: 'Embed file previews in issues',
      enabled: true,
      actionLabel: 'Enabled',
   },
   {
      icon: <SiSentry size={24} />,
      title: 'Sentry',
      description: 'Link exceptions to issues',
      actionLabel: 'Open',
   },
   {
      icon: <SiZapier size={20} />,
      title: 'Zapier',
      description: 'Build custom automations and integrations with other apps',
      actionLabel: 'Open',
   },
   {
      icon: <SiZendesk size={20} />,
      title: 'Zendesk',
      description: 'Link and automate Zendesk tickets with Linear',
      actionLabel: 'Open',
   },
   {
      icon: <SiGooglesheets size={20} />,
      title: 'Google Sheets',
      description: 'Export issues and build custom analytics',
      actionLabel: 'Open',
   },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
   return (
      <div className="bg-card rounded-lg border p-5 flex flex-col h-full">
         <div className="flex items-start gap-4 mb-3">
            {feature.icon}
            <div className="flex-1">
               <h3 className="font-medium text-card-foreground">{feature.title}</h3>
               <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            </div>
         </div>
         <div className="mt-auto flex items-center gap-3">
            {feature.activated && (
               <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Activated</span>
               </div>
            )}
            {feature.teamsActivated && (
               <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <CheckCircle2 size={14} />
                  <span>{feature.teamsActivated} teams activated</span>
               </div>
            )}
         </div>
      </div>
   );
};

const IntegrationCard = ({ integration }: { integration: Integration }) => {
   return (
      <div className="flex items-start gap-4 mb-3">
         <div className="text-card-foreground">{integration.icon}</div>
         <div className="space-y-2 h-full flex flex-col">
            <div className="flex-1">
               <h3 className="font-medium text-card-foreground">{integration.title}</h3>
               <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
            </div>
            <Button variant="outline" size="sm" className="text-sm w-fit">
               {integration.actionLabel}
            </Button>
         </div>
      </div>
   );
};

const GuideCard = ({ guide }: { guide: Guide }) => {
   return (
      <div className="bg-card rounded-lg border p-5 flex items-start gap-3">
         <div className="shrink-0">{guide.icon}</div>
         <div className="w-full -mt-1">
            <h3 className="font-medium text-sm text-card-foreground">{guide.title}</h3>
            <p className="text-xs line-clamp-1 text-muted-foreground mt-1">{guide.description}</p>
         </div>
         <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowRight size={16} />
         </Button>
      </div>
   );
};

export default function Settings() {
   return (
      <div className="w-full max-w-7xl mx-auto px-8 py-8">
         <div className="mb-10">
            <h1 className="text-2xl font-semibold mb-1">Workspace</h1>
            <p className="text-muted-foreground">
               Manage your workspace settings. Your workspace is in the{' '}
               <span className="font-medium">United States</span> region
            </p>
         </div>

         <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Language & Region</h2>
            </div>
            <LanguageSwitcher />
         </div>

         <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Explore features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
               ))}
            </div>
         </div>

         <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Integrations</h2>
               <Button variant="outline" size="sm" className="text-sm">
                  Browse all
               </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {integrations.map((integration, index) => (
                  <IntegrationCard key={index} integration={integration} />
               ))}
            </div>
         </div>

         <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold">Go further</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {guides.map((guide, index) => (
                  <GuideCard key={index} guide={guide} />
               ))}
            </div>
         </div>
      </div>
   );
}
