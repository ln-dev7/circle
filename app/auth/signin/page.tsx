'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [callbackUrl, setCallbackUrl] = useState<string>('/');
   const router = useRouter();

   useEffect(() => {
      if (typeof window !== 'undefined') {
         try {
            const url = new URL(window.location.href);
            const cb = url.searchParams.get('callbackUrl');
            if (cb) setCallbackUrl(cb);
         } catch {}
      }
   }, []);

   async function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      const res = await signIn('credentials', {
         email,
         password,
         redirect: false,
         callbackUrl,
      });
      setLoading(false);
      if (res?.ok) {
         try {
            const me = await fetch('/api/me').then((r) =>
               r.ok ? r.json() : { hasMembership: false }
            );

            if (!me.hasMembership) {
               router.push('/onboarding');
               return;
            }

            // If user has membership, check if callbackUrl is valid
            // If callbackUrl is from an org route but user doesn't have access, use their actual org
            let targetUrl = callbackUrl;

            if (callbackUrl) {
               // Check if callbackUrl is an org route (contains orgId)
               const urlParts = callbackUrl.split('/').filter(Boolean);
               if (
                  urlParts.length >= 1 &&
                  urlParts[0] !== 'auth' &&
                  urlParts[0] !== 'api' &&
                  urlParts[0] !== '_next'
               ) {
                  // This looks like an org route, verify it matches user's org
                  const callbackOrgId = urlParts[0];
                  if (callbackOrgId !== me.organizationId) {
                     targetUrl = `/${me.organizationId}/projects`;
                  }
               }
            }

            targetUrl = targetUrl || `/${me.organizationId}/projects`;
            router.push(targetUrl);
         } catch (error) {
            router.push('/onboarding');
         }
      } else {
         alert('Invalid credentials (dev: check DEV_LOGIN_PASSWORD)');
      }
   }

   return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
         <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4" aria-label="Sign in form">
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <label className="block text-sm" htmlFor="email">
               Email
            </label>
            <Input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               placeholder="you@aim.local"
            />
            <label className="block text-sm" htmlFor="password">
               Password
            </label>
            <Input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               placeholder="DEV_LOGIN_PASSWORD"
            />
            <Button type="submit" disabled={loading} className="w-full">
               {loading ? 'Signing in...' : 'Sign in'}
            </Button>
         </form>
      </div>
   );
}
