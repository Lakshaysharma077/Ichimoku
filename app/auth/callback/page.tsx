'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * OAuth callback handler.
 * After Supabase Google OAuth redirects back here, we:
 * 1. Exchange the code for a session
 * 2. Sync the user to our Prisma database
 * 3. Sign into NextAuth for session continuity
 * 4. Redirect to homepage
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase handles the OAuth code exchange automatically
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Sync user to Prisma database via API
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              image: session.user.user_metadata?.avatar_url || '',
              provider: 'google',
              supabaseId: session.user.id,
            }),
          });

          // Sign into NextAuth to maintain existing session system
          const { signIn } = await import('next-auth/react');
          await signIn('credentials', {
            email: session.user.email,
            password: `__supabase_oauth__${session.user.id}`,
            redirect: false,
          });
        }

        router.push('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
