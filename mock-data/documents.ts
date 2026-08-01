import { User, users } from './users';

export interface TeamDocument {
   id: string;
   name: string;
   icon: string;
   creator: User;
   createdAt: string; // ISO date
   updatedAt: string; // ISO date
   pinned?: boolean;
}

export interface DocumentFolder {
   id: string;
   name: string;
   icon: string;
   documents: TeamDocument[];
}

/**
 * Team documents grouped by folder (project or theme), Linear-style.
 * All content is fake data for the LNDev UI component library.
 */
export const documentFolders: DocumentFolder[] = [
   {
      id: 'team-documents',
      name: 'Team documents',
      icon: '📁',
      documents: [
         {
            id: 'doc-1',
            name: 'LNDev UI Team Calendar',
            icon: '📆',
            creator: users[0],
            createdAt: '2026-07-08',
            updatedAt: '2026-07-30',
            pinned: true,
         },
      ],
   },
   {
      id: 'design-tokens-v2',
      name: 'Design Tokens v2',
      icon: '🎨',
      documents: [
         {
            id: 'doc-2',
            name: 'PRD - Design Tokens v2 (OKLCH migration)',
            icon: '📄',
            creator: users[2],
            createdAt: '2026-06-15',
            updatedAt: '2026-07-22',
         },
         {
            id: 'doc-3',
            name: 'Spec: Token naming conventions',
            icon: '📐',
            creator: users[4],
            createdAt: '2026-06-18',
            updatedAt: '2026-06-30',
         },
      ],
   },
   {
      id: 'component-playground',
      name: 'Component Playground',
      icon: '🧪',
      documents: [
         {
            id: 'doc-4',
            name: 'PRD - Interactive component playground',
            icon: '📄',
            creator: users[6],
            createdAt: '2026-06-02',
            updatedAt: '2026-07-12',
         },
         {
            id: 'doc-5',
            name: 'Playground sharing via URL — technical notes',
            icon: '🔗',
            creator: users[8],
            createdAt: '2026-06-10',
            updatedAt: '2026-06-25',
         },
      ],
   },
   {
      id: 'data-table-virtualization',
      name: 'Data Table Virtualization',
      icon: '🗂️',
      documents: [
         {
            id: 'doc-6',
            name: 'PRD - Virtualized Data Table (10k+ rows)',
            icon: '📄',
            creator: users[4],
            createdAt: '2026-07-05',
            updatedAt: '2026-07-28',
         },
      ],
   },
   {
      id: 'accessibility-audit',
      name: 'Accessibility Audit Q3',
      icon: '♿',
      documents: [
         {
            id: 'doc-7',
            name: 'WCAG 2.2 AA audit checklist',
            icon: '✅',
            creator: users[10],
            createdAt: '2026-06-20',
            updatedAt: '2026-07-18',
         },
         {
            id: 'doc-8',
            name: 'Focus management guidelines',
            icon: '🎯',
            creator: users[10],
            createdAt: '2026-06-22',
            updatedAt: '2026-07-02',
         },
      ],
   },
   {
      id: 'docs-revamp',
      name: 'Docs Site Revamp',
      icon: '📚',
      documents: [
         {
            id: 'doc-9',
            name: 'PRD - Docs search & prop table indexing',
            icon: '📄',
            creator: users[14],
            createdAt: '2026-05-28',
            updatedAt: '2026-07-10',
         },
         {
            id: 'doc-10',
            name: 'Content style guide for component docs',
            icon: '✍️',
            creator: users[9],
            createdAt: '2026-05-30',
            updatedAt: '2026-06-14',
         },
      ],
   },
   {
      id: 'theming-engine',
      name: 'Theming Engine',
      icon: '🌗',
      documents: [
         {
            id: 'doc-11',
            name: 'PRD - AI-assisted theme generator',
            icon: '📄',
            creator: users[7],
            createdAt: '2026-07-09',
            updatedAt: '2026-07-25',
         },
         {
            id: 'doc-12',
            name: 'High-contrast preset exploration',
            icon: '🔆',
            creator: users[12],
            createdAt: '2026-07-11',
            updatedAt: '2026-07-20',
         },
      ],
   },
   {
      id: 'release-process',
      name: 'Release Process',
      icon: '🚀',
      documents: [
         {
            id: 'doc-13',
            name: 'v2.4 release checklist',
            icon: '📋',
            creator: users[5],
            createdAt: '2026-07-15',
            updatedAt: '2026-07-29',
         },
         {
            id: 'doc-14',
            name: 'Versioning & changelog conventions',
            icon: '🏷️',
            creator: users[16],
            createdAt: '2026-05-12',
            updatedAt: '2026-06-08',
         },
      ],
   },
   {
      id: 'cli-tooling',
      name: 'CLI & Tooling',
      icon: '🛠️',
      documents: [
         {
            id: 'doc-15',
            name: 'PRD - Scaffolding CLI with test files',
            icon: '📄',
            creator: users[8],
            createdAt: '2026-07-01',
            updatedAt: '2026-07-24',
         },
      ],
   },
   {
      id: 'quality',
      name: 'Quality & Testing',
      icon: '🧷',
      documents: [
         {
            id: 'doc-16',
            name: 'Visual regression strategy (Playwright)',
            icon: '📷',
            creator: users[18],
            createdAt: '2026-05-14',
            updatedAt: '2026-06-27',
         },
      ],
   },
];

export function getAllDocuments(): TeamDocument[] {
   return documentFolders.flatMap((folder) => folder.documents);
}
