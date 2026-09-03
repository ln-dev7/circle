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
];
