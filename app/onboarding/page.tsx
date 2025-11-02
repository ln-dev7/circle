import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function OnboardingPage() {
   try {
      const session = await auth();

      if (!session?.user?.id) {
         redirect('/auth/signin');
      }

      console.log('Onboarding - User ID:', session.user.id);
      console.log('Onboarding - User email:', session.user.email);

      // First, check if user exists by ID
      let user = await prisma.user.findUnique({
         where: { id: session.user.id },
      });

      if (!user) {
         // Check if user exists by email (might have different ID)
         const existingUserByEmail = await prisma.user.findUnique({
            where: { email: session.user.email! },
         });

         if (existingUserByEmail) {
            console.log('Onboarding - User found by email with different ID:', existingUserByEmail);

            // Check if this user already has membership
            const existingMembership = await prisma.membership.findFirst({
               where: { userId: existingUserByEmail.id },
            });

            if (existingMembership) {
               console.log('Onboarding - Existing user has membership, redirecting');
               redirect(`/${existingMembership.organizationId}/projects`);
            }

            // Use the existing user ID for membership creation
            user = existingUserByEmail;
         } else {
            console.log('Onboarding - User not found in DB, creating...');
            // Create user if it doesn't exist
            user = await prisma.user.create({
               data: {
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.name || 'Unknown User',
               },
            });
            console.log('Onboarding - User created:', user);
         }
      } else {
         console.log('Onboarding - User found in DB:', user);
      }

      // Check if user already has membership
      const membership = await prisma.membership.findFirst({
         where: { userId: user.id },
      });

      if (membership) {
         console.log('Onboarding - User already has membership, redirecting');
         // User already has membership, redirect to their org
         redirect(`/${membership.organizationId}/projects`);
      }

      console.log('Onboarding - Creating organization and membership...');

      // Create default organization and membership for the user
      const org = await prisma.organization.create({
         data: {
            name: `${user.name || 'My'}'s Organization`,
         },
      });

      console.log('Onboarding - Organization created:', org);

      const newMembership = await prisma.membership.create({
         data: {
            userId: user.id,
            organizationId: org.id,
            role: 'ADMIN',
         },
      });

      console.log('Onboarding - Membership created:', newMembership);

      // Redirect to the new organization
      redirect(`/${org.id}/projects`);
   } catch (error) {
      console.error('Onboarding error:', error);
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">🎯 Welcome to AiM!</h1>

               <div className="space-y-6">
                  <div className="p-4 bg-red-100 border border-red-300 rounded">
                     <h2 className="font-semibold text-red-800">❌ Setup Error</h2>
                     <p className="text-red-700 mb-4">
                        {error instanceof Error ? error.message : 'Unknown error occurred'}
                     </p>
                  </div>

                  <div className="p-4 bg-blue-100 border border-blue-300 rounded">
                     <h2 className="font-semibold text-blue-800">🔍 Debug Info</h2>
                     <p className="text-blue-700">
                        Check the server console for detailed error information.
                     </p>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t">
                  <a
                     href="/"
                     className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                     Back to Home
                  </a>
               </div>
            </div>
         </div>
      );
   }
}
