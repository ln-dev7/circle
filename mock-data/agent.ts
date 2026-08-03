import { LucideIcon, Box, Search, Workflow } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                          Agent page mock behaviors                         */
/* -------------------------------------------------------------------------- */

export interface AgentExample {
   id: string;
   icon: LucideIcon;
   title: string;
   description: string;
   prompt: string;
}

export const agentExamples: AgentExample[] = [
   {
      id: 'create-project',
      icon: Box,
      title: 'Create a new project',
      description: 'Turn an idea into a well-scoped project',
      prompt: 'Create a project to ship a command palette for the docs site',
   },
   {
      id: 'research-topic',
      icon: Search,
      title: 'Research a topic',
      description: 'Research a topic across the issue backlog',
      prompt: 'What do we know about combobox accessibility issues?',
   },
   {
      id: 'automated-loop',
      icon: Workflow,
      title: 'Create automated loop',
      description: 'Learn what loops can do and create your first one',
      prompt: 'Help me set up a weekly triage loop for the Core team',
   },
];

export const agentSkills = ['Triage', 'Research', 'Project drafting', 'Weekly summary'];

interface CannedReply {
   keywords: string[];
   reply: string;
}

const CANNED_REPLIES: CannedReply[] = [
   {
      keywords: ['project', 'create', 'scope'],
      reply: `Here's a well-scoped draft based on your idea:

**Project — Docs command palette**
A ⌘K palette for the documentation site: fuzzy search across components, props and guides, with recent items and keyboard-first navigation.

**Suggested milestones**
1. Search index built from the docs content (1 week)
2. Palette UI on the shared Dialog primitive (1 week)
3. Recents, shortcuts and analytics (3 days)

**Suggested issues** — 6 issues across LNDev Core, lead **leonel.ngoya**, target date in 3 weeks.

Want me to create the project with these milestones and assign the first issues?`,
   },
   {
      keywords: ['research', 'know', 'accessib', 'combobox', 'backlog'],
      reply: `I looked across the backlog — here's what stands out:

**Combobox accessibility — 7 related issues**
- **LNUI-633** aria-live announcements for async results (Done, cycle 18)
- **LNUI-856** filter breaks with diacritics in options (Triage)
- **LNUI-783** windowed list rendering above 1k options (Technical Review)
- **LNUI-746** creatable option row pinned to the list bottom (Todo)

**Signals**
Screen-reader support improved in cycle 18, but virtualized lists still skip focus for windowed options — that's the main open risk, tracked in LNUI-783.

**Suggestion** — group the three open issues under a "Combobox a11y" label so they land in the same cycle. Want me to do that?`,
   },
   {
      keywords: ['loop', 'weekly', 'triage', 'automat'],
      reply: `Loops run on a schedule and act on your workspace. Here's the one I'd set up:

**Weekly triage loop — Core team**
- **Every Monday 9:00** — collect issues in Triage older than 3 days
- **Assess** — suggest a priority and an owner based on similar past issues
- **Report** — post a summary in the team channel and flag anything urgent

Last week this would have processed **16 issues** and flagged 2 as urgent (LNUI-794, LNUI-795).

Should I activate it for the LNDev Core team?`,
   },
   {
      keywords: ['cycle', 'progress', 'status'],
      reply: `**Cycle 21 — day 12 of 14**

- **Scope** 111 issues (+44% since start)
- **Completed** 34 (31%) · **Started** 33 (30%)
- Todo is still heavy (38 issues) — at the current pace ~19 will roll over to Cycle 22.

**Risks** — LNUI-787 and LNUI-789 are blocked on upstream fixes; LNUI-710 has been blocked for 9 days.

Want a breakdown by assignee or a draft plan for what to move to Cycle 22?`,
   },
];

const DEFAULT_REPLY = `Here's what I can do from this workspace:

- **Draft projects** from a one-line idea, with milestones and starter issues
- **Research the backlog** — summarize what we know about any component or theme
- **Watch cycles** — progress, risks and what's likely to slip
- **Automate** recurring chores with loops (triage, summaries, reminders)

Try asking about the current cycle, or pick one of the examples to get started.`;

/** Deterministic canned reply — no network, no randomness. */
export function getAgentReply(input: string): string {
   const normalized = input.toLowerCase();
   let best: { score: number; reply: string } = { score: 0, reply: DEFAULT_REPLY };
   for (const candidate of CANNED_REPLIES) {
      const score = candidate.keywords.filter((keyword) => normalized.includes(keyword)).length;
      if (score > best.score) best = { score, reply: candidate.reply };
   }
   return best.reply;
}

/** Short chat title derived from the first user message. */
export function chatTitleFrom(input: string): string {
   const clean = input.trim().replace(/\s+/g, ' ');
   return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean || 'New chat';
}
