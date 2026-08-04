import { redirect } from 'next/navigation';

/** /settings has no page of its own — it opens on Preferences. */
export default async function SettingsPage({
   params,
}: {
   params: Promise<{ orgId: string }>;
}) {
   const { orgId } = await params;
   redirect(`/${orgId}/settings/preferences`);
}
