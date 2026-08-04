/** Config of the generic settings pages that don't have a dedicated UI yet. */
export interface PlaceholderConfig {
   title: string;
   description?: string;
   actionLabel?: string;
   emptyLabel: string;
}

export const PLACEHOLDER_SECTIONS: Record<string, PlaceholderConfig> = {
   slas: {
      title: 'SLAs',
      description: 'Automatically apply deadlines to issues based on their properties',
      actionLabel: 'New SLA',
      emptyLabel: 'No SLAs',
   },
   'project-labels': {
      title: 'Project labels',
      actionLabel: 'New label',
      emptyLabel: 'No project labels',
   },
   'project-templates': {
      title: 'Project templates',
      actionLabel: 'New template',
      emptyLabel: 'No project templates',
   },
   'project-updates': {
      title: 'Project updates',
      description: 'Configure how project updates are collected across the workspace',
      emptyLabel: 'No updates',
   },
   initiatives: {
      title: 'Initiatives',
      description: 'Group projects into larger bodies of work',
      actionLabel: 'New initiative',
      emptyLabel: 'No initiatives',
   },
   documents: {
      title: 'Documents',
      actionLabel: 'New document',
      emptyLabel: 'No documents',
   },
   'customer-requests': {
      title: 'Customer requests',
      description: 'Track and manage customer requests alongside your team’s work',
      actionLabel: 'New request',
      emptyLabel: 'No customer requests',
   },
   releases: {
      title: 'Releases',
      actionLabel: 'New release',
      emptyLabel: 'No releases',
   },
   pulse: {
      title: 'Pulse',
      description: 'A feed of important updates across your workspace',
      emptyLabel: 'No updates',
   },
   asks: {
      title: 'Asks',
      description: 'Turn requests into actionable issues',
      actionLabel: 'New Ask',
      emptyLabel: 'No asks',
   },
   emojis: {
      title: 'Emojis',
      actionLabel: 'Upload',
      emptyLabel: 'No emojis',
   },
};
