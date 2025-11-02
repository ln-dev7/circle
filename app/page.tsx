import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function Home() {
   try {
      const session = await auth();
      console.log('Home page - Session:', session);

      if (!session?.user?.id) {
         console.log('Home page - No session, redirecting to signin');
         redirect('/auth/signin');
      }

      // Check if user has membership by session user ID first
      let membership = await prisma.membership.findFirst({
         where: { userId: session.user.id },
      });

      // If no membership found by session ID, check by email
      if (!membership && session.user.email) {
         console.log('Home page - No membership by ID, checking by email...');
         const userByEmail = await prisma.user.findUnique({
            where: { email: session.user.email },
         });

         if (userByEmail) {
            console.log('Home page - User found by email:', userByEmail);
            membership = await prisma.membership.findFirst({
               where: { userId: userByEmail.id },
            });
         }
      }

      console.log('Home page - Membership:', membership);

      if (!membership) {
         console.log('Home page - No membership, redirecting to onboarding');
         redirect('/onboarding');
      }

      // User has membership, redirect to their organization
      const redirectUrl = `/${membership.organizationId}/projects`;
      console.log('Home page - Redirecting to:', redirectUrl);
      redirect(redirectUrl);
   } catch (error) {
      // Don't log NEXT_REDIRECT errors as they are expected
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
         // This is expected behavior, not an error
         throw error; // Re-throw to let Next.js handle the redirect
      }

      console.error('Home page - Actual error:', error);
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
               <h1 className="text-3xl font-bold text-gray-800 mb-6">❌ Error Loading Page</h1>

               <div className="space-y-6">
                  <div className="p-4 bg-red-100 border border-red-300 rounded">
                     <h2 className="font-semibold text-red-800">Error Details</h2>
                     <p className="text-red-700 mb-4">
                        {error instanceof Error ? error.message : 'Unknown error'}
                     </p>
                     <a
                        href="/"
                        className="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                     >
                        Try Again
                     </a>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}
