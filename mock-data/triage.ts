import { LabelInterface, labels } from './labels';
import { Project, projects } from './projects';
import { Status, status } from './status';
import { User, users } from './users';

/* -------------------------------------------------------------------------- */
/*                                   Triage                                   */
/* -------------------------------------------------------------------------- */

/** Where a triage item came from: a teammate, or an integration (Sentry…). */
export type TriageReporter = { kind: 'user'; user: User } | { kind: 'integration'; name: string };

/** One row of the "Triage Intelligence" suggestions strip. */
export interface TriageIntelligence {
   suggestedAssignee?: User;
   suggestedProject?: Project;
   suggestedLabels: LabelInterface[];
   /** Existing issues the intake looks related to (identifier + resolved). */
   related: { identifier: string; title: string; status: Status }[];
}

/** A description block: heading + paragraph, optionally with a UI preview. */
export interface TriageSection {
   heading: string;
   body: string;
}

/**
 * A fake embedded screenshot: instead of shipping an image we re-draw a tiny
 * light-mode widget (the docs site's billing card) in plain HTML — same idea
 * as Linear's inline attachment, zero binary assets.
 */
export interface TriagePreviewCard {
   title: string;
   statusLine: string;
   statusDetail: string;
   price: string;
   priceSuffix: string;
   badge: string;
   button: string;
}

export interface TriageItem {
   id: string;
   identifier: string;
   title: string;
   teamId: string;
   reporter: TriageReporter;
   /** Human age label ("9h ago") — mock data, no clock math. */
   receivedAgo: string;
   intelligence: TriageIntelligence;
   sections: TriageSection[];
   preview?: TriagePreviewCard;
}

/* --------------------------------- helpers -------------------------------- */

const byStatus = (id: string): Status => status.find((s) => s.id === id) ?? status[0];
const byUser = (id: string): User => users.find((u) => u.id === id) ?? users[0];

/* ---------------------------------- data ---------------------------------- */

/**
 * Intake queue, per team. Invented around the LNDev UI storyline: the docs
 * portal, the Pro licensing flow and the component library itself.
 */
export const triageItems: TriageItem[] = [
   {
      id: 'tri-1',
      identifier: 'LNUI-901',
      title: 'License receipt email never sent to yearly Pro buyers',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('mason') },
      receivedAgo: '9h ago',
      intelligence: {
         suggestedAssignee: byUser('sophia'),
         suggestedLabels: [labels[1]],
         related: [
            {
               identifier: 'LNUI-742',
               title: 'Invoice PDF misses the VAT line for EU customers',
               status: byStatus('done'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Customers who buy a yearly Pro license get the confirmation screen but never receive the receipt email. Monthly buyers get it within a minute. Reproduced twice on fresh accounts.',
         },
         {
            heading: 'Why it matters',
            body: 'Companies need the receipt for expense reports the same day they buy. Two support tickets about it this week alone.',
         },
      ],
   },
   {
      id: 'tri-2',
      identifier: 'LNUI-902',
      title: 'Checkout: declined payment shows no error in the upgrade modal',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('emma') },
      receivedAgo: '11h ago',
      intelligence: {
         suggestedAssignee: byUser('alex'),
         suggestedLabels: [labels[1], labels[0]],
         related: [
            {
               identifier: 'LNUI-618',
               title: 'Upgrade modal: retry button stays disabled after a network error',
               status: byStatus('shipped'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'When the card is declined, the upgrade modal spinner stops and… nothing. No error banner, no retry hint. The user only finds out because the plan never switches.',
         },
         {
            heading: 'Scope',
            body: 'Docs portal checkout only — the self-serve flow. The sales-assisted flow surfaces the provider error correctly.',
         },
      ],
   },
   {
      id: 'tri-3',
      identifier: 'LNUI-903',
      title: "Billing: 'Renews on' badge reads like an end date on the account page",
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('emma') },
      receivedAgo: '13h ago',
      intelligence: {
         suggestedAssignee: byUser('lucas'),
         suggestedProject: projects[1],
         suggestedLabels: [labels[0], labels[3]],
         related: [
            {
               identifier: 'LNUI-655',
               title: 'Subscription card: renewal date drifts one day after DST',
               status: byStatus('done'),
            },
            {
               identifier: 'LNUI-598',
               title: 'Account page: plan badge copy review for all locales',
               status: byStatus('shipped'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The subscription block shows a badge reading "Ends: Nov 12, 2026" while the sentence right below says the plan renews automatically. Read together they contradict each other, and at a glance the badge wins.',
         },
         {
            heading: 'Why it matters',
            body: 'This sits on the most sensitive page of the account area. The ambiguity reads as "my plan stops in November", which generates support tickets and precautionary cancellations.',
         },
         {
            heading: 'Scope',
            body: 'Subscription block of the account page. Check both states (auto-renew on / canceled plan) and the translation in every locale.',
         },
      ],
      preview: {
         title: 'Subscription',
         statusLine: "You're subscribed",
         statusDetail: 'Your plan renews automatically at the end of each period.',
         price: '$12',
         priceSuffix: '/ month',
         badge: 'Ends: Nov 12, 2026',
         button: 'Manage subscription',
      },
   },
   {
      id: 'tri-4',
      identifier: 'LNUI-904',
      title: 'Docs search: TypeError noise from empty-query analytics events',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('alex') },
      receivedAgo: '6w ago',
      intelligence: {
         suggestedAssignee: byUser('mason'),
         suggestedLabels: [labels[4]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Submitting the docs search with an empty query fires an analytics event with a null payload, which throws a TypeError in the tracking proxy. Harmless for users, but it floods the error budget.',
         },
         {
            heading: 'Why it matters',
            body: 'The noise buries real regressions — the weekly error digest is 80% this one signature.',
         },
      ],
   },
   {
      id: 'tri-5',
      identifier: 'LNUI-905',
      title: 'AUTH_LOGIN_FAILED spike on the docs portal',
      teamId: 'CORE',
      reporter: { kind: 'integration', name: 'Sentry' },
      receivedAgo: '4mo ago',
      intelligence: {
         suggestedLabels: [labels[7]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Sentry opened this automatically: AUTH_LOGIN_FAILED events tripled over a weekend, all from the same OAuth callback path. No user reports attached.',
         },
      ],
   },
   {
      id: 'tri-6',
      identifier: 'LNUI-906',
      title: 'Theme tokens page renders wrong contrast pairs in dark mode',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('olivia') },
      receivedAgo: '2d ago',
      intelligence: {
         suggestedAssignee: byUser('isabella'),
         suggestedLabels: [labels[6], labels[8]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The generated contrast table pairs foreground tokens with the light-mode surfaces even when dark mode is active, so half the "AA pass" checkmarks are wrong.',
         },
      ],
   },
   {
      id: 'tri-7',
      identifier: 'LNUI-907',
      title: 'Figma kit export drops component descriptions',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('isabella') },
      receivedAgo: '5d ago',
      intelligence: {
         suggestedAssignee: byUser('olivia'),
         suggestedLabels: [labels[3]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Exporting the library to the Figma kit keeps names and variants but silently drops the description field on every component.',
         },
      ],
   },

   /* ------------------------------- LNDev Core ------------------------------ */
   {
      id: 'tri-8',
      identifier: 'LNUI-908',
      title: 'Team seats: over-limit members are billed twice on the next invoice',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('noah') },
      receivedAgo: '1d ago',
      intelligence: {
         suggestedAssignee: byUser('sophia'),
         suggestedProject: projects[0],
         suggestedLabels: [labels[1]],
         related: [
            {
               identifier: 'LNUI-511',
               title: 'Invoice preview rounds seat totals before summing',
               status: byStatus('done'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Adding a member past the plan limit creates a prorated line AND a full-price line for the same seat. Confirmed on two workspaces by diffing the invoice preview against the final invoice.',
         },
         {
            heading: 'Why it matters',
            body: 'Double billing is the fastest way to lose a team account — this needs a look before the next billing run on the 1st.',
         },
      ],
      preview: {
         title: 'Team seats',
         statusLine: '8 seats in use',
         statusDetail:
            'Your plan includes 5 seats. Extra seats are billed at the end of the cycle.',
         price: '$8',
         priceSuffix: '/ extra seat / month',
         badge: 'Over limit',
         button: 'Manage seats',
      },
   },
   {
      id: 'tri-9',
      identifier: 'LNUI-909',
      title: 'CLI init scaffolds a config that the docs say is deprecated',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('ethan') },
      receivedAgo: '2d ago',
      intelligence: {
         suggestedAssignee: byUser('mason'),
         suggestedLabels: [labels[3], labels[4]],
         related: [
            {
               identifier: 'LNUI-733',
               title: 'Deprecate the flat theme config format',
               status: byStatus('shipped'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'lnui init still writes the flat theme config, while the docs (correctly) tell people to use the nested format. Fresh users hit the deprecation warning on their very first run.',
         },
      ],
   },
   {
      id: 'tri-10',
      identifier: 'LNUI-910',
      title: 'Playground share links 404 after twenty-four hours',
      teamId: 'CORE',
      reporter: { kind: 'user', user: byUser('harper') },
      receivedAgo: '3d ago',
      intelligence: {
         suggestedAssignee: byUser('alex'),
         suggestedLabels: [labels[1]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Sharing a playground snippet works, but the link dies the next day. Looks like the snippet store TTL got set to 24h instead of 30 days during the cache migration.',
         },
         {
            heading: 'Why it matters',
            body: 'People share these links in issues and blog posts — every dead link is public.',
         },
      ],
   },
   {
      id: 'tri-11',
      identifier: 'LNUI-911',
      title: 'UNHANDLED_REJECTION in the npm publish pipeline',
      teamId: 'CORE',
      reporter: { kind: 'integration', name: 'Sentry' },
      receivedAgo: '5d ago',
      intelligence: {
         suggestedLabels: [labels[9]],
         related: [
            {
               identifier: 'LNUI-689',
               title: 'Publish pipeline: retry flaky tarball uploads',
               status: byStatus('in-progress'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Sentry opened this automatically: the canary publish job crashes with an unhandled rejection when the registry answers 429. Three occurrences this week, all recovered on retry.',
         },
      ],
   },

   /* ------------------------------ Design System ---------------------------- */
   {
      id: 'tri-12',
      identifier: 'LNUI-912',
      title: 'Color token aliases resolve to raw hex in the exported CSS',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('amelia') },
      receivedAgo: '8h ago',
      intelligence: {
         suggestedAssignee: byUser('isabella'),
         suggestedProject: projects[1],
         suggestedLabels: [labels[6]],
         related: [
            {
               identifier: 'LNUI-471',
               title: 'Token export: keep var() references instead of flattening',
               status: byStatus('backlog'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Exporting tokens to CSS flattens every alias to its raw hex value, so downstream themes lose the semantic layer and dark mode overrides stop cascading.',
         },
      ],
   },
   {
      id: 'tri-13',
      identifier: 'LNUI-913',
      title: 'Icon grid misaligns at 20px — everything drawn on a 24px grid',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('mia') },
      receivedAgo: '1d ago',
      intelligence: {
         suggestedAssignee: byUser('olivia'),
         suggestedLabels: [labels[6], labels[0]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The new 20px icon size just scales the 24px grid down, so strokes land on half pixels and look soft on non-retina screens.',
         },
         {
            heading: 'Scope',
            body: 'All 40 icons shipped in the small size. Needs a redraw pass, not a transform.',
         },
      ],
   },
   {
      id: 'tri-14',
      identifier: 'LNUI-914',
      title: 'Dark mode: focus ring invisible on the primary button',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('charlotte') },
      receivedAgo: '4d ago',
      intelligence: {
         suggestedAssignee: byUser('amelia'),
         suggestedLabels: [labels[8]],
         related: [
            {
               identifier: 'LNUI-402',
               title: 'Audit focus states across interactive components',
               status: byStatus('in-progress'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The focus ring color and the primary button background are 1.2:1 in dark mode. Keyboard users literally cannot see where they are.',
         },
         {
            heading: 'Why it matters',
            body: 'This is a WCAG 2.4.7 failure on the most-used component in the library.',
         },
      ],
   },
   {
      id: 'tri-15',
      identifier: 'LNUI-915',
      title: 'Marketing template kit still uses the v1 logo lockup',
      teamId: 'DESIGN',
      reporter: { kind: 'user', user: byUser('nova') },
      receivedAgo: '1w ago',
      intelligence: {
         suggestedLabels: [labels[6]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The downloadable template kit on the site ships slides and social banners with the retired v1 lockup. Community posts made with it keep the old brand alive.',
         },
      ],
   },

   /* ----------------------------- Performance Lab --------------------------- */
   {
      id: 'tri-16',
      identifier: 'LNUI-916',
      title: 'DataGrid: 60k rows freeze the tab when column virtualization is off',
      teamId: 'PERF',
      reporter: { kind: 'user', user: byUser('logan') },
      receivedAgo: '10h ago',
      intelligence: {
         suggestedAssignee: byUser('atlas'),
         suggestedProject: projects[5],
         suggestedLabels: [labels[5]],
         related: [
            {
               identifier: 'LNUI-560',
               title: 'Virtualize DataGrid columns by default past 20 columns',
               status: byStatus('to-do'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'A customer repro with 60k rows and 32 columns locks the main thread for 9 seconds on mount. With column virtualization forced on, the same dataset mounts in 400ms.',
         },
         {
            heading: 'Scope',
            body: 'Decide whether the flag flips to on-by-default in the next minor, or the docs get a loud warning. Either way the repro belongs in the perf suite.',
         },
      ],
   },
   {
      id: 'tri-17',
      identifier: 'LNUI-917',
      title: 'LONG_TASK budget exceeded on the docs landing page',
      teamId: 'PERF',
      reporter: { kind: 'integration', name: 'Sentry' },
      receivedAgo: '2d ago',
      intelligence: {
         suggestedAssignee: byUser('logan'),
         suggestedLabels: [labels[5]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The perf monitor flags a 480ms long task on landing — the syntax highlighter now parses every code block eagerly, including the ones below the fold.',
         },
      ],
   },
   {
      id: 'tri-18',
      identifier: 'LNUI-918',
      title: 'Tree-shaking broken for the charts entry point since 4.2',
      teamId: 'PERF',
      reporter: { kind: 'user', user: byUser('daniel') },
      receivedAgo: '3d ago',
      intelligence: {
         suggestedAssignee: byUser('atlas'),
         suggestedLabels: [labels[5], labels[1]],
         related: [
            {
               identifier: 'LNUI-544',
               title: 'Add a bundle-size regression gate to CI',
               status: byStatus('done'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: "Importing a single chart pulls the whole charts bundle since 4.2 — a side effect in the theme registration defeats the bundler's DCE. +180kB gzip for one sparkline.",
         },
         {
            heading: 'Why it matters',
            body: 'Bundle size is the top reason cited in churn interviews. The regression gate missed it because the gate only watches the core entry.',
         },
      ],
   },
   {
      id: 'tri-19',
      identifier: 'LNUI-919',
      title: 'Animation frame drops on mid-range Android during sheet open',
      teamId: 'PERF',
      reporter: { kind: 'user', user: byUser('aiden') },
      receivedAgo: '6d ago',
      intelligence: {
         suggestedLabels: [labels[5]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The bottom sheet open animation drops to ~40fps on a mid-range Android test device — the backdrop blur repaints the whole page every frame.',
         },
      ],
   },
   {
      id: 'tri-20',
      identifier: 'LNUI-920',
      title: 'Perf suite flaky: cold-start benchmark varies 30% between runs',
      teamId: 'PERF',
      reporter: { kind: 'user', user: byUser('logan') },
      receivedAgo: '2w ago',
      intelligence: {
         suggestedLabels: [labels[9]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The cold-start benchmark swings ±30% between identical runs on CI. Either the runner needs pinned CPUs or the benchmark needs more warmup iterations — right now the numbers are noise.',
         },
      ],
   },

   /* -------------------------------- UX Guild ------------------------------- */
   {
      id: 'tri-21',
      identifier: 'LNUI-921',
      title: 'Combobox: screen reader announces every option on open',
      teamId: 'UX',
      reporter: { kind: 'user', user: byUser('abigail') },
      receivedAgo: '9h ago',
      intelligence: {
         suggestedAssignee: byUser('victoria'),
         suggestedLabels: [labels[8]],
         related: [
            {
               identifier: 'LNUI-388',
               title: 'Combobox rewrite on the new listbox primitive',
               status: byStatus('in-progress'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Opening a combobox with 200 options makes VoiceOver read the entire list before the user can type. aria-live is set on the listbox instead of the status node.',
         },
      ],
   },
   {
      id: 'tri-22',
      identifier: 'LNUI-922',
      title: 'Date range picker: no way to clear only the end date',
      teamId: 'UX',
      reporter: { kind: 'user', user: byUser('gabriel') },
      receivedAgo: '2d ago',
      intelligence: {
         suggestedAssignee: byUser('abigail'),
         suggestedLabels: [labels[0]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Clearing the end date resets the whole range. Users picking "from March, open-ended" have to re-enter the start date every time.',
         },
      ],
   },
   {
      id: 'tri-23',
      identifier: 'LNUI-923',
      title: 'Docs feedback widget: 14 reports point at the theming migration page',
      teamId: 'UX',
      reporter: { kind: 'integration', name: 'Docs feedback' },
      receivedAgo: '4d ago',
      intelligence: {
         suggestedAssignee: byUser('victoria'),
         suggestedLabels: [labels[3]],
         related: [
            {
               identifier: 'LNUI-655',
               title: 'Rewrite the theming migration guide with a worked example',
               status: byStatus('to-do'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The feedback widget aggregated 14 thumbs-down on the theming migration page in a week. The common thread in comments: the guide never shows a before/after of a real config.',
         },
      ],
   },
   {
      id: 'tri-24',
      identifier: 'LNUI-924',
      title: 'Toast stacking: fourth toast pushes actions off-screen on 13" laptops',
      teamId: 'UX',
      reporter: { kind: 'user', user: byUser('mia') },
      receivedAgo: '1w ago',
      intelligence: {
         suggestedLabels: [labels[0]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'With four stacked toasts, the action buttons of the oldest one render below the viewport. Suggest collapsing to a counter after three, like the mobile behavior.',
         },
      ],
   },

   /* ------------------------------- Data Squad ------------------------------ */
   {
      id: 'tri-25',
      identifier: 'LNUI-925',
      title: 'Docs analytics double-count page views from the versioned docs',
      teamId: 'DATA',
      reporter: { kind: 'user', user: byUser('daniel') },
      receivedAgo: '1d ago',
      intelligence: {
         suggestedAssignee: byUser('gabriel'),
         suggestedLabels: [labels[1]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Both the canonical page and its /v4/ alias fire a pageview, so every versioned page counts twice. The adoption dashboard has been ~40% optimistic since the versioned docs shipped.',
         },
         {
            heading: 'Why it matters',
            body: 'The quarterly adoption review runs on these numbers in two weeks.',
         },
      ],
   },
   {
      id: 'tri-26',
      identifier: 'LNUI-926',
      title: 'Telemetry opt-out flag ignored by the CLI update checker',
      teamId: 'DATA',
      reporter: { kind: 'user', user: byUser('ethan') },
      receivedAgo: '3d ago',
      intelligence: {
         suggestedAssignee: byUser('daniel'),
         suggestedLabels: [labels[7], labels[1]],
         related: [
            {
               identifier: 'LNUI-289',
               title: 'One switch to rule all telemetry surfaces',
               status: byStatus('shipped'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'With telemetry disabled, the CLI still pings the update endpoint with the anonymous machine id. The opt-out covers usage events but the update checker predates the flag.',
         },
         {
            heading: 'Why it matters',
            body: 'We promise "one switch, zero calls" in the privacy docs. This makes that sentence false.',
         },
      ],
   },
   {
      id: 'tri-27',
      identifier: 'LNUI-927',
      title: 'QUERY_TIMEOUT spike on the component-usage rollup',
      teamId: 'DATA',
      reporter: { kind: 'integration', name: 'Sentry' },
      receivedAgo: '5d ago',
      intelligence: {
         suggestedLabels: [labels[5]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The nightly component-usage rollup times out twice a week since the events table crossed 200M rows. Needs a partition or an incremental rollup — full scans are done.',
         },
      ],
   },

   /* -------------------------------- Mobile --------------------------------- */
   {
      id: 'tri-28',
      identifier: 'LNUI-928',
      title: 'Bottom sheet: swipe-to-dismiss fights vertical scroll inside content',
      teamId: 'MOBILE',
      reporter: { kind: 'user', user: byUser('aiden') },
      receivedAgo: '7h ago',
      intelligence: {
         suggestedAssignee: byUser('nova'),
         suggestedLabels: [labels[1], labels[0]],
         related: [
            {
               identifier: 'LNUI-731',
               title: 'Gesture arbitration layer for nested scrollables',
               status: byStatus('in-progress'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'When the sheet content scrolls, a fast upward flick sometimes dismisses the sheet instead of scrolling. The gesture threshold ignores the inner scroll position.',
         },
      ],
   },
   {
      id: 'tri-29',
      identifier: 'LNUI-929',
      title: 'Safe-area padding doubled on notched devices in landscape',
      teamId: 'MOBILE',
      reporter: { kind: 'user', user: byUser('harper') },
      receivedAgo: '2d ago',
      intelligence: {
         suggestedAssignee: byUser('aiden'),
         suggestedLabels: [labels[1]],
         related: [],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'The layout shell adds env(safe-area-inset) AND the navigation applies its own padding, so landscape on notched phones shows a 90px dead strip on the leading edge.',
         },
      ],
   },
   {
      id: 'tri-30',
      identifier: 'LNUI-930',
      title: 'Touch targets under 44px in the compact table density',
      teamId: 'MOBILE',
      reporter: { kind: 'user', user: byUser('victoria') },
      receivedAgo: '6d ago',
      intelligence: {
         suggestedLabels: [labels[8], labels[0]],
         related: [
            {
               identifier: 'LNUI-598',
               title: 'Density scale: define the mobile floor per component',
               status: byStatus('backlog'),
            },
         ],
      },
      sections: [
         {
            heading: 'What happens',
            body: 'Compact density puts row actions at 32px targets. Fine with a mouse, painful with thumbs — the density scale needs a mobile floor.',
         },
      ],
   },
];

/* --------------------------- seed-based expansion -------------------------- */
/*
 * Same trick as mock-data/issues.ts: the fully written items above carry the
 * showcase details (intelligence cards, previews); the seeds below bulk the
 * queue out so every team feels busy. One tuple per report:
 * [identifier, title, teamId, reporter ('i:Name' = integration), age,
 *  suggested assignee | null, suggested label indexes, what-happens body]
 */

type TriageSeed = [
   identifier: string,
   title: string,
   teamId: string,
   reporter: string,
   receivedAgo: string,
   assigneeId: string | null,
   labelIdxs: number[],
   body: string,
];

const seeds: TriageSeed[] = [
   /* ------------------------------ LNDev Core ------------------------------ */
   [
      'LNUI-931',
      'Pro license key rejected after workspace rename',
      'CORE',
      'charlotte',
      '3h ago',
      'sophia',
      [1],
      'Renaming a workspace invalidates the cached license fingerprint, and the key reads as tampered until the daemon restarts.',
   ],
   [
      'LNUI-932',
      'Changelog RSS feed serves stale entries for a week',
      'CORE',
      'gabriel',
      '16h ago',
      null,
      [1, 3],
      'The RSS route is cached at the edge with no revalidation tag, so releases show up days late while the HTML changelog is current.',
   ],
   [
      'LNUI-933',
      'lnui doctor reports a peer-dependency conflict that does not exist',
      'CORE',
      'atlas',
      '1d ago',
      'mason',
      [1],
      'The doctor command compares against the lockfile of the wrong package manager when both lockfiles are present in the repo.',
   ],
   [
      'LNUI-934',
      'Docs code blocks lose their language tag when copied',
      'CORE',
      'nova',
      '4d ago',
      null,
      [3],
      'The copy button grabs innerText of the highlighted block, so pasting into a markdown file drops the ```tsx fence.',
   ],
   [
      'LNUI-935',
      'Sandbox templates pin a vulnerable transitive dependency',
      'CORE',
      'i:Dependabot',
      '5d ago',
      'alex',
      [7],
      'The starter sandboxes pin an old bundler with a known advisory. Not exploitable in the sandbox, but every fork inherits the warning banner.',
   ],
   [
      'LNUI-936',
      'Account deletion email links to the marketing site 404',
      'CORE',
      'victoria',
      '2w ago',
      null,
      [1, 3],
      'The confirmation email links to /goodbye, which was dropped in the last site restructure. The deletion itself completes fine.',
   ],
   /* ----------------------------- Design System ---------------------------- */
   [
      'LNUI-937',
      'Spacing scale doc shows the 4px step twice',
      'DESIGN',
      'mia',
      '6h ago',
      null,
      [3, 6],
      'The generated spacing table renders space-1 and space-1b as the same 4px row — the half-step token never made it into the generator.',
   ],
   [
      'LNUI-938',
      'Elevation tokens flatten to the same shadow in Safari',
      'DESIGN',
      'harper',
      '1d ago',
      'amelia',
      [1, 6],
      'Layered box-shadows with color-mix() collapse to one layer in Safari 19 — levels 2 through 5 all render identically.',
   ],
   [
      'LNUI-939',
      'Brand gradient bands on 8-bit external displays',
      'DESIGN',
      'noah',
      '2d ago',
      null,
      [6],
      'The hero gradient shows visible banding on 8-bit panels. Needs a subtle noise layer or a two-stop simplification.',
   ],
   [
      'LNUI-940',
      'Empty-state illustrations ignore the density setting',
      'DESIGN',
      'abigail',
      '5d ago',
      'olivia',
      [0, 6],
      'Compact density shrinks paddings but the illustrations keep their comfortable-size box, so empty states look inflated in dense apps.',
   ],
   [
      'LNUI-941',
      'Motion tokens: reduced-motion variant missing for the sheet',
      'DESIGN',
      'charlotte',
      '1w ago',
      null,
      [8],
      'Every component maps its motion token to a reduced-motion fallback except the bottom sheet, which keeps its spring at full amplitude.',
   ],
   [
      'LNUI-942',
      'Print stylesheet renders dark-mode colors on white paper',
      'DESIGN',
      'i:Docs feedback',
      '2w ago',
      null,
      [6],
      'Three reports this month: printing a docs page from dark mode keeps the dark text tokens — light gray text on white paper.',
   ],
   /* ---------------------------- Performance Lab --------------------------- */
   [
      'LNUI-943',
      'Table sort re-renders every row twice under StrictMode',
      'PERF',
      'daniel',
      '5h ago',
      'logan',
      [5],
      'Sorting a 5k-row table fires the row renderer twice per row — the memo key includes the sort comparator identity, which is rebuilt per render.',
   ],
   [
      'LNUI-944',
      'Icon font fallback loads even when SVG icons are used',
      'PERF',
      'ethan',
      '1d ago',
      null,
      [5],
      'The legacy icon font preloads unconditionally — 40kB down the wire for users who never render a font icon.',
   ],
   [
      'LNUI-945',
      'Hydration mismatch warning on the pricing page hero',
      'PERF',
      'i:Sentry',
      '2d ago',
      'atlas',
      [1, 5],
      'Sentry groups ~200 hydration warnings a day on the pricing hero: the trial countdown renders server time, then client time.',
   ],
   [
      'LNUI-946',
      'Popover layout thrash when 20+ open triggers share a page',
      'PERF',
      'lucas',
      '4d ago',
      null,
      [5],
      'A dashboard with 24 popover triggers recomputes floating positions on every scroll frame even for closed popovers.',
   ],
   [
      'LNUI-947',
      'Source maps missing from the CDN build since 4.3.1',
      'PERF',
      'aiden',
      '6d ago',
      'logan',
      [1, 9],
      'The CDN bundle references .map files that the release job stopped uploading — every stack trace from CDN users is minified soup.',
   ],
   [
      'LNUI-948',
      'Memory leak: theme listener survives component unmount',
      'PERF',
      'i:Sentry',
      '1w ago',
      null,
      [1, 5],
      'Long-lived SPAs accumulate theme-change listeners; a session with 4h uptime showed 1,800 orphaned listeners on the media query.',
   ],
   [
      'LNUI-949',
      'CSS bundle doubled by duplicated keyframes per entry point',
      'PERF',
      'mason',
      '2w ago',
      null,
      [5, 4],
      'Each entry point inlines its own copy of the shared keyframes — apps importing three entries ship the animation block three times.',
   ],
   /* -------------------------------- UX Guild ------------------------------- */
   [
      'LNUI-950',
      'Command menu: recent items vanish after locale switch',
      'UX',
      'emma',
      '4h ago',
      'victoria',
      [1, 0],
      'Recents are keyed by localized labels, so switching the app language orphans the whole history.',
   ],
   [
      'LNUI-951',
      'Stepper: back navigation loses uncommitted field edits',
      'UX',
      'sophia',
      '12h ago',
      null,
      [0],
      'Going back one step silently drops edits in the current step. Needs either autosave-per-step or a confirm prompt.',
   ],
   [
      'LNUI-952',
      'Tooltip delay feels random on touch-with-mouse hybrids',
      'UX',
      'logan',
      '1d ago',
      'abigail',
      [0],
      'Convertible laptops that mix touch and pointer events get both the touch long-press and the hover delay, whichever fires first.',
   ],
   [
      'LNUI-953',
      'File upload: no keyboard path to remove a queued file',
      'UX',
      'nova',
      '3d ago',
      null,
      [8],
      'The remove affordance on queued files is hover-only. Keyboard users can add files but never remove one.',
   ],
   [
      'LNUI-954',
      'Inline validation reads errors before the user finishes typing',
      'UX',
      'isabella',
      '5d ago',
      'gabriel',
      [0, 8],
      'Live validation announces the error on every keystroke through aria-live, which screen-reader users describe as being talked over.',
   ],
   [
      'LNUI-955',
      'Skeleton screens flash for sub-100ms loads',
      'UX',
      'olivia',
      '1w ago',
      null,
      [0],
      'Fast responses still show a one-frame skeleton flash. Needs the standard 150ms appearance delay baked into the component.',
   ],
   [
      'LNUI-956',
      'Breadcrumb truncation hides the only distinguishing segment',
      'UX',
      'daniel',
      '2w ago',
      null,
      [0],
      'Middle truncation keeps root and leaf, but deep hierarchies differ only in the middle — two tabs can show identical breadcrumbs.',
   ],
   [
      'LNUI-957',
      'Wizard progress resets when the session token refreshes',
      'UX',
      'i:Support',
      '3w ago',
      'victoria',
      [1],
      'Support escalation: five customers lost 20-minute setup flows because the silent token refresh remounts the wizard shell.',
   ],
   /* ------------------------------- Data Squad ------------------------------ */
   [
      'LNUI-958',
      'Adoption dashboard: week starts on Sunday for EU workspaces',
      'DATA',
      'amelia',
      '8h ago',
      'daniel',
      [1],
      'Weekly rollups hardcode Sunday as the week start, so EU teams comparing against their Monday-based sprints see shifted numbers.',
   ],
   [
      'LNUI-959',
      'Event schema drift: v3 clients still send the retired props field',
      'DATA',
      'i:Sentry',
      '1d ago',
      null,
      [4],
      'Old CLI versions keep sending the retired props envelope; the ingest logs a warning per event — 2M warnings a day.',
   ],
   [
      'LNUI-960',
      'Funnel query counts bot traffic in the docs conversion step',
      'DATA',
      'gabriel',
      '2d ago',
      'ethan',
      [1],
      'The docs-to-signup funnel includes known crawler user agents in step one but filters them in step two, deflating conversion by ~8%.',
   ],
   [
      'LNUI-961',
      'Export to CSV mangles component names containing commas',
      'DATA',
      'harper',
      '4d ago',
      null,
      [1],
      'The usage export writes raw commas unquoted, so "Menu, contextual" splits into two columns and shifts every row after it.',
   ],
   [
      'LNUI-962',
      'Retention chart y-axis silently switches from % to count',
      'DATA',
      'mia',
      '6d ago',
      'gabriel',
      [0, 1],
      'Toggling a cohort flips the y-axis to absolute counts with no axis label change — two charts side by side lie to you.',
   ],
   [
      'LNUI-963',
      'Nightly rollup skips the last partial hour of the day',
      'DATA',
      'atlas',
      '1w ago',
      null,
      [1],
      'The rollup window is [00:00, 23:00) — the 23h hour is never aggregated and daily totals run ~4% low.',
   ],
   [
      'LNUI-964',
      'PII scanner flags the color token "skin-tone-3" every run',
      'DATA',
      'noah',
      '2w ago',
      null,
      [9],
      'The compliance scan pattern-matches "skin" and opens a ticket per run. Needs an allowlist entry, not thirty duplicate tickets.',
   ],
   [
      'LNUI-965',
      'Duplicate workspace ids after the region migration backfill',
      'DATA',
      'i:Sentry',
      '3w ago',
      'daniel',
      [1, 7],
      'The EU backfill re-inserted 1,200 workspaces with new ids; joins against billing now fan out and double some MRR aggregates.',
   ],
   [
      'LNUI-966',
      'Query builder timeout on the 90-day component heatmap',
      'DATA',
      'lucas',
      '1mo ago',
      null,
      [5],
      'The heatmap query joins events to sessions unpartitioned past 30 days — 90-day views time out for every large workspace.',
   ],
   /* --------------------------------- Mobile -------------------------------- */
   [
      'LNUI-967',
      'Keyboard avoidance scrolls the wrong input into view',
      'MOBILE',
      'victoria',
      '5h ago',
      'aiden',
      [1],
      'With two stacked inputs, focusing the second scrolls the first into view — the avoidance logic caches the previous focus target.',
   ],
   [
      'LNUI-968',
      'Pull-to-refresh conflicts with the horizontal carousel',
      'MOBILE',
      'emma',
      '14h ago',
      null,
      [0, 1],
      'A slightly diagonal swipe on the carousel triggers pull-to-refresh. The vertical gesture needs an angle threshold.',
   ],
   [
      'LNUI-969',
      'Haptics fire twice on long-press context menus',
      'MOBILE',
      'lucas',
      '1d ago',
      'nova',
      [1],
      'Long-press triggers both the component haptic and the system menu haptic ~80ms apart. Ours should defer when the native menu opens.',
   ],
   [
      'LNUI-970',
      'Offline banner never dismisses on flaky connections',
      'MOBILE',
      'sophia',
      '3d ago',
      null,
      [0],
      'The banner listens to the online event only; on connections that flap every few seconds it locks into the offline state.',
   ],
   [
      'LNUI-971',
      'Dynamic Type: largest accessibility size clips button labels',
      'MOBILE',
      'abigail',
      '5d ago',
      'harper',
      [8, 0],
      'At the largest accessibility text size, primary button labels clip instead of wrapping — the height cap wins over the content.',
   ],
   [
      'LNUI-972',
      'Splash-to-app transition flashes white in dark mode',
      'MOBILE',
      'i:Sentry',
      '1w ago',
      null,
      [1],
      'Session replays show a one-frame white flash between splash and shell in dark mode — the shell background paints after first frame.',
   ],
   [
      'LNUI-973',
      'Swipe actions: rubber-band overshoot reveals unstyled area',
      'MOBILE',
      'noah',
      '2w ago',
      null,
      [0],
      'Overshooting a swipe action reveals the unpainted container behind the row — needs the action background to extend past the bound.',
   ],
   [
      'LNUI-974',
      'Status bar contrast wrong when the sheet is fully expanded',
      'MOBILE',
      'daniel',
      '3w ago',
      'aiden',
      [0],
      'A fully expanded sheet darkens the backdrop but the status bar keeps its light-content style, leaving white icons on a light sheet.',
   ],
   [
      'LNUI-975',
      'Back gesture dismisses the modal AND navigates back',
      'MOBILE',
      'i:Support',
      '1mo ago',
      null,
      [1],
      'On Android, the predictive back gesture closes the modal and pops the route in one motion — users land two screens back.',
   ],
];

for (const [
   identifier,
   title,
   teamId,
   reporter,
   receivedAgo,
   assigneeId,
   labelIdxs,
   body,
] of seeds) {
   triageItems.push({
      id: `tri-${identifier.toLowerCase()}`,
      identifier,
      title,
      teamId,
      reporter: reporter.startsWith('i:')
         ? { kind: 'integration', name: reporter.slice(2) }
         : { kind: 'user', user: byUser(reporter) },
      receivedAgo,
      intelligence: {
         suggestedAssignee: assigneeId ? byUser(assigneeId) : undefined,
         suggestedLabels: labelIdxs.map((index) => labels[index]).filter(Boolean),
         related: [],
      },
      sections: [{ heading: 'What happens', body }],
   });
}
