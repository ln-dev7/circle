/** Data of the Integrations settings page (settings/integrations). */

export type IntegrationStatus = 'enabled' | 'pre-installed';

export interface Integration {
   id: string;
   name: string;
   description: string;
   status?: IntegrationStatus;
   /** Background color of the generated icon. */
   color: string;
}

export interface IntegrationCategory {
   id: string;
   label: string;
   /** Integration ids, in display order. */
   items: string[];
}

const list: Integration[] = [
   // Engineering / essentials
   {
      id: 'github',
      name: 'GitHub',
      description:
         'Connect GitHub to automate PR workflows, review code in Circle, sync issues and understand your codebase',
      status: 'enabled',
      color: '#24292f',
   },
   {
      id: 'slack',
      name: 'Slack',
      description: 'Create issues from Slack messages and sync threads',
      status: 'enabled',
      color: '#611f69',
   },
   {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Automate your Merge Request workflow',
      color: '#fc6d26',
   },
   {
      id: 'figma',
      name: 'Figma',
      description: 'Create and link issues directly from Figma',
      status: 'enabled',
      color: '#0acf83',
   },
   {
      id: 'intercom',
      name: 'Intercom',
      description: 'Keep a tight feedback loop with customers and streamline bug reports',
      color: '#286efa',
   },
   {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Build custom dashboards and analytics from issue and project data',
      status: 'enabled',
      color: '#0f9d58',
   },
   {
      id: 'asks-for-slack',
      name: 'Asks for Slack',
      description:
         'Turn requests from Slack or email into actionable issues and enable helpdesk workflows',
      status: 'enabled',
      color: '#4a154b',
   },
   {
      id: 'notion',
      name: 'Notion',
      description: 'Previews of issues, views and projects and query Notion AI',
      status: 'enabled',
      color: '#191919',
   },
   {
      id: 'zapier',
      name: 'Zapier',
      description: 'Build custom automations to create or update issues',
      color: '#ff4f00',
   },
   {
      id: 'jira',
      name: 'Jira',
      description: 'Smoothly transition from Jira to Circle',
      color: '#2684ff',
   },
   // Agents
   {
      id: 'codex',
      name: 'Codex',
      description: 'Delegate issues to Codex directly from Circle',
      status: 'enabled',
      color: '#10a37f',
   },
   {
      id: 'cursor',
      name: 'Cursor',
      description: 'Turn issues into pull requests with Cursor cloud agents',
      color: '#111111',
   },
   {
      id: 'github-copilot',
      name: 'GitHub Copilot',
      description: 'Turn issues into code with the GitHub Copilot coding agent',
      color: '#6e40c9',
   },
   {
      id: 'factory',
      name: 'Factory',
      description: 'Assign issues from your backlog to Droids',
      color: '#3d3d3d',
   },
   {
      id: 'sentry-agent',
      name: 'Sentry Agent',
      description: 'Resolve issues automatically with Seer by Sentry',
      status: 'enabled',
      color: '#362d59',
   },
   {
      id: 'devin',
      name: 'Devin',
      description: 'Automate work from issue to tested PR with Devin',
      color: '#2563eb',
   },
   {
      id: 'chatprd',
      name: 'ChatPRD',
      description: 'Writes requirements, manages issues, and gives feedback on your product work',
      color: '#f59e0b',
   },
   {
      id: 'charlie',
      name: 'Charlie',
      description: 'Plans, implements, and reviews your TypeScript PRs',
      color: '#e11d48',
   },
   {
      id: 'cyrus',
      name: 'Cyrus',
      description: 'An AI engineering agent that works through your backlog',
      status: 'enabled',
      color: '#7c3aed',
   },
   // AI clients
   {
      id: 'cursor-mcp',
      name: 'Cursor MCP',
      description: 'Connect Cursor to the Circle MCP server',
      color: '#111111',
   },
   {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'Connect ChatGPT deep research to Circle',
      color: '#10a37f',
   },
   {
      id: 'claude',
      name: 'Claude',
      description: 'Connect Claude to the Circle MCP server',
      color: '#d97757',
   },
   {
      id: 'v0-mcp',
      name: 'v0 by Vercel MCP connector',
      description: 'Connect v0 and Circle through MCP',
      color: '#000000',
   },
   {
      id: 'windsurf',
      name: 'Windsurf',
      description: 'Connect Windsurf to the Circle MCP server',
      color: '#0ea5e9',
   },
   {
      id: 'replit',
      name: 'Replit',
      description: 'Build apps & automations',
      color: '#f26207',
   },
   {
      id: 'dust',
      name: 'Dust',
      description: 'Build AI workflows with your issues',
      color: '#64748b',
   },
   {
      id: 'adk',
      name: 'ADK',
      description: 'Connect your Google ADK agents to Circle',
      color: '#4285f4',
   },
   // Engineering
   {
      id: 'pagerduty',
      name: 'PagerDuty Triage Responsibility',
      description: 'Automate the rotation of triage responsibility with PagerDuty schedules',
      color: '#06ac38',
   },
   {
      id: 'sentry',
      name: 'Sentry',
      description: 'Create and link issues with Sentry and automate issue creation',
      status: 'enabled',
      color: '#362d59',
   },
   {
      id: 'vscode',
      name: 'VS Code',
      description: 'Easily build VS Code extensions with Circle Connect',
      color: '#007acc',
   },
   {
      id: 'datadog',
      name: 'Datadog',
      description: 'Create issues from Datadog Cases and Monitors',
      color: '#632ca6',
   },
   {
      id: 'incident-io',
      name: 'incident.io',
      description: 'Manage incidents and triage responsibility directly in Circle',
      color: '#f25533',
   },
   {
      id: 'raycast',
      name: 'Raycast',
      description: 'Create, search, and modify your issues from anywhere',
      status: 'enabled',
      color: '#ff6363',
   },
   // Bug reporting
   {
      id: 'bird-eats-bug',
      name: 'Bird Eats Bug',
      description: 'Speed up your bug reporting workflow with Bird Eats Bug',
      color: '#16a34a',
   },
   {
      id: 'honeybadger',
      name: 'Honeybadger',
      description: 'Manage Honeybadger errors via Circle issues',
      color: '#ea580c',
   },
   {
      id: 'jam',
      name: 'Jam',
      description: 'Create issues with all the details developers need to resolve bugs faster',
      color: '#dc2626',
   },
   {
      id: 'vercel',
      name: 'Vercel',
      description: 'Turn Vercel Preview Deployment comments into action items',
      color: '#000000',
   },
   {
      id: 'arc',
      name: 'Arc',
      description: 'Create new issues right from your browser command bar',
      status: 'pre-installed',
      color: '#fb6b6b',
   },
   // Automations
   {
      id: 'email-intake',
      name: 'Create issues via email',
      description: 'Set up email addresses for teams or templates to create issues via email',
      status: 'pre-installed',
      color: '#475569',
   },
   {
      id: 'fivetran',
      name: 'Fivetran',
      description: 'Sync your workspace data with the Fivetran connector',
      color: '#0073ff',
   },
   {
      id: 'axolo',
      name: 'Axolo',
      description: 'Make code reviews easier by syncing pull request channels with your issues',
      color: '#6366f1',
   },
   {
      id: 'circleback',
      name: 'Circleback',
      description: 'Automatically create issues from meeting action items',
      color: '#0f172a',
   },
   {
      id: 'fillout',
      name: 'Fillout',
      description: 'Create issues from a customizable intake form',
      color: '#8b5cf6',
   },
   // Customer experience
   {
      id: 'zendesk',
      name: 'Zendesk',
      description: 'Keep a tight feedback loop with customers and streamline bug reports',
      color: '#03363d',
   },
   {
      id: 'front',
      name: 'Front',
      description: 'Keep a tight feedback loop with customers and streamline bug reports',
      color: '#a857f1',
   },
   {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Create issues from Salesforce cases',
      color: '#00a1e0',
   },
   {
      id: 'attio',
      name: 'Attio',
      description: 'Add customer requests and issues, plus sync customer details, directly from Attio',
      color: '#3b82f6',
   },
   {
      id: 'gong',
      name: 'Gong',
      description: 'Automatically create customer requests from Gong calls',
      color: '#7c2d92',
   },
   {
      id: 'productlane',
      name: 'Productlane',
      description: 'Helpdesk, customer requests portal, public roadmap, and changelog built on Circle',
      color: '#2dd4bf',
   },
   {
      id: 'arkweaver',
      name: 'Arkweaver',
      description: 'Automatically message the right customers and teammates when projects go live',
      color: '#334155',
   },
   // Collaboration
   {
      id: 'discord',
      name: 'Discord',
      description: 'Create issues, share updates, and keep everyone in sync',
      color: '#5865f2',
   },
   {
      id: 'glean',
      name: 'Glean',
      description: 'Search your workspace for instant insights',
      color: '#0284c7',
   },
   {
      id: 'range',
      name: 'Range',
      description: 'Pull issues into async check-ins to keep your software development team in sync',
      color: '#f43f5e',
   },
   // Media & design
   {
      id: 'canva',
      name: 'Canva AI Connector',
      description: 'Create and link workflow content directly within Canva',
      color: '#00c4cc',
   },
   {
      id: 'claap',
      name: 'Claap',
      description: 'Record bugs and directly create issues in Circle',
      color: '#7c3aed',
   },
   {
      id: 'descript',
      name: 'Descript',
      description: 'Embed Descript share URLs in issues and documents',
      status: 'pre-installed',
      color: '#1e293b',
   },
   {
      id: 'miro',
      name: 'Miro',
      description: 'Import, create and manage issues directly in Miro',
      color: '#ffd02f',
   },
   {
      id: 'screenpresso',
      name: 'Screenpresso',
      description: 'Effectively report an issue with embedded screenshots and videos',
      color: '#0891b2',
   },
   {
      id: 'youtube',
      name: 'YouTube',
      description: 'Embed YouTube videos in issues and documents',
      status: 'pre-installed',
      color: '#ff0000',
   },
   {
      id: 'loom',
      name: 'Loom',
      description: 'Embed Loom videos in issues and documents',
      status: 'pre-installed',
      color: '#625df5',
   },
   {
      id: 'tella',
      name: 'Tella',
      description: 'Embed Tella videos in your issues',
      color: '#ef4444',
   },
   // Analytics
   {
      id: 'airbyte',
      name: 'Airbyte',
      description: 'Consolidate workspace data in data warehouses, lakes, and databases',
      color: '#615eff',
   },
   {
      id: 'retool',
      name: 'Retool',
      description: 'Create, update, and analyze issues in custom internal tools',
      color: '#3d3d3d',
   },
   {
      id: 'span',
      name: 'Span',
      description: 'See how work translates into engineering impact',
      color: '#0ea5e9',
   },
   {
      id: 'jellyfish',
      name: 'Jellyfish',
      description: 'Developer productivity insights and AI impact signals in one dashboard',
      color: '#ec4899',
   },
   {
      id: 'cycle-report',
      name: 'Cycle Report',
      description: 'Create reports of your cycles that your clients can review and sign off on',
      color: '#14b8a6',
   },
   {
      id: 'everhour',
      name: 'Everhour',
      description: 'Track time, estimate tasks, set up a fixed-fee or recurring budget for projects',
      color: '#22c55e',
   },
   {
      id: 'swarmia',
      name: 'Swarmia',
      description: 'Engineering effectiveness insights from your issues and code',
      status: 'enabled',
      color: '#1d4ed8',
   },
   // Security & compliance
   {
      id: 'aikido',
      name: 'Aikido Security',
      description: 'Put your application security on autopilot',
      color: '#7c3aed',
   },
   {
      id: 'cloudback',
      name: 'Cloudback',
      description: 'Automated daily backups of your workspace with on-demand restore',
      color: '#0369a1',
   },
   {
      id: 'fencer',
      name: 'Fencer',
      description: 'Create and link issues directly from Fencer',
      color: '#334155',
   },
   {
      id: 'secureslate',
      name: 'SecureSlate',
      description: 'Create and link SecureSlate security tickets to your issues',
      color: '#059669',
   },
   {
      id: 'kawach',
      name: 'Kawach AI',
      description: 'Keep your workspace compliant with org policies using Kawach AI',
      color: '#b45309',
   },
   {
      id: 'vanta',
      name: 'Vanta',
      description: 'Automate compliance. Simplify security. Demonstrate trust.',
      color: '#5b21b6',
   },
   {
      id: 'drata',
      name: 'Drata',
      description: 'Simplify risk and managing frameworks like SOC 2, ISO 27001, PCI and more',
      color: '#1e3a8a',
   },
   {
      id: 'orca',
      name: 'Orca Security',
      description: 'Streamline security fixes by sharing relevant context with the right people',
      color: '#0f766e',
   },
   {
      id: 'simplebackups',
      name: 'SimpleBackups',
      description: 'Never lose an issue, project, or cycle',
      color: '#334155',
   },
];

export const INTEGRATIONS: Record<string, Integration> = Object.fromEntries(
   list.map((integration) => [integration.id, integration])
);

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
   {
      id: 'essentials',
      label: 'Essentials',
      items: ['github', 'slack', 'gitlab', 'figma', 'intercom', 'google-sheets'],
   },
   {
      id: 'agents',
      label: 'Agents',
      items: [
         'codex',
         'cursor',
         'github-copilot',
         'factory',
         'sentry-agent',
         'devin',
         'chatprd',
         'charlie',
         'cyrus',
      ],
   },
   {
      id: 'ai-clients',
      label: 'AI clients',
      items: ['cursor-mcp', 'chatgpt', 'claude', 'v0-mcp', 'windsurf', 'replit', 'dust', 'adk'],
   },
   {
      id: 'engineering',
      label: 'Engineering',
      items: [
         'github',
         'gitlab',
         'pagerduty',
         'sentry',
         'vscode',
         'datadog',
         'incident-io',
         'raycast',
      ],
   },
   {
      id: 'crafted',
      label: 'Circle crafted',
      items: [
         'github',
         'slack',
         'gitlab',
         'figma',
         'asks-for-slack',
         'notion',
         'pagerduty',
         'zapier',
      ],
   },
   {
      id: 'bug-reporting',
      label: 'Bug Reporting',
      items: [
         'asks-for-slack',
         'sentry',
         'incident-io',
         'bird-eats-bug',
         'honeybadger',
         'jam',
         'vercel',
         'arc',
      ],
   },
   {
      id: 'automations',
      label: 'Automations',
      items: [
         'zapier',
         'email-intake',
         'jira',
         'raycast',
         'fivetran',
         'axolo',
         'circleback',
         'fillout',
      ],
   },
   {
      id: 'customer-experience',
      label: 'Customer Experience',
      items: [
         'zendesk',
         'intercom',
         'front',
         'salesforce',
         'attio',
         'gong',
         'productlane',
         'arkweaver',
      ],
   },
   {
      id: 'collaboration',
      label: 'Collaboration',
      items: [
         'slack',
         'asks-for-slack',
         'notion',
         'discord',
         'glean',
         'attio',
         'productlane',
         'range',
      ],
   },
   {
      id: 'media-design',
      label: 'Media & Design',
      items: [
         'figma',
         'canva',
         'claap',
         'descript',
         'miro',
         'screenpresso',
         'youtube',
         'loom',
         'tella',
      ],
   },
   {
      id: 'analytics',
      label: 'Analytics',
      items: [
         'airbyte',
         'google-sheets',
         'fivetran',
         'retool',
         'span',
         'jellyfish',
         'cycle-report',
         'everhour',
         'swarmia',
      ],
   },
   {
      id: 'security-compliance',
      label: 'Security & Compliance',
      items: [
         'aikido',
         'cloudback',
         'fencer',
         'secureslate',
         'kawach',
         'vanta',
         'drata',
         'orca',
         'simplebackups',
      ],
   },
];

export const ENABLED_INTEGRATIONS: Integration[] = list.filter(
   (integration) => integration.status === 'enabled'
);
