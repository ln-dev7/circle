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
