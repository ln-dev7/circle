import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const credentialsSchema = z.object({
   email: z.string().email(),
   password: z.string().min(1),
});

type TokenWithId = Record<string, unknown> & { id?: string };

export const {
   handlers: authHandlers,
   auth,
   signIn,
   signOut,
} = NextAuth({
   providers: [
      Credentials({
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
         },
         authorize: async (raw) => {
            const parsed = credentialsSchema.safeParse(raw);
            if (!parsed.success) return null;
            const { email, password } = parsed.data;

            const devPass = process.env.DEV_LOGIN_PASSWORD || 'dev';
            if (password !== devPass) return null;

            // Find or create a user for dev-only credentials login
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
               user = await prisma.user.create({ data: { email, name: email.split('@')[0] } });
            }
            return { id: user.id, email: user.email, name: user.name };
         },
      }),
   ],
   session: { strategy: 'jwt' },
   callbacks: {
      async jwt({ token, user }) {
         const t = token as TokenWithId;
         if (user && 'id' in user && typeof (user as { id?: unknown }).id === 'string') {
            t.id = (user as { id: string }).id;
         }
         return t;
      },
      async session({ session, token }) {
         const t = token as TokenWithId;
         if (session?.user && t.id) {
            (session.user as { id?: string }).id = t.id;
         }
         return session;
      },
   },
});
