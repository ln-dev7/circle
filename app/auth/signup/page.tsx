'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);
   const router = useRouter();

   const validateForm = () => {
      if (!name.trim()) {
         setError('Name is required');
         return false;
      }
      if (!email.trim()) {
         setError('Email is required');
         return false;
      }
      if (!email.includes('@')) {
         setError('Please enter a valid email');
         return false;
      }
      if (password.length < 6) {
         setError('Password must be at least 6 characters');
         return false;
      }
      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return false;
      }
      return true;
   };

   async function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError('');

      if (!validateForm()) {
         return;
      }

      setLoading(true);

      try {
         // For now, we'll use the same logic as signin since this is dev-only
         // In production, you'd want to create a proper signup API endpoint
         const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
         });

         if (res?.ok) {
            setSuccess(true);
            setTimeout(() => {
               router.push('/onboarding');
            }, 2000);
         } else {
            setError('Failed to create account. Please try again.');
         }
      } catch (error) {
         setError('An error occurred. Please try again.');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle className="text-2xl">Create Account</CardTitle>
               <CardDescription>
                  Join AiM Platform to start creating amazing campaigns
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={onSubmit} className="space-y-4">
                  {error && (
                     <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {error}
                     </div>
                  )}

                  {success && (
                     <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                        Account created successfully! Redirecting to onboarding...
                     </div>
                  )}

                  <div className="space-y-2">
                     <Label htmlFor="name">Full Name</Label>
                     <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        disabled={loading}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        disabled={loading}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        disabled={loading}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        disabled={loading}
                     />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                     {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                     Already have an account?{' '}
                     <button
                        type="button"
                        onClick={() => router.push('/auth/signin')}
                        className="text-blue-600 hover:underline"
                     >
                        Sign in
                     </button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
