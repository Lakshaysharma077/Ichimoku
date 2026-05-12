import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for browser-side usage.
 * Used for authentication operations (sign up, sign in, Google OAuth).
 * Database/content operations still go through Prisma.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Auth Helper Functions ────────────────────────────────────────────

/**
 * Sign up a new user with email and password via Supabase Auth.
 * No email verification required — instant access.
 */
export async function signUpWithEmail(email: string, password: string, metadata?: { name?: string; tradingViewUsername?: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata?.name || '',
        trading_view_username: metadata?.tradingViewUsername || '',
      },
      // Skip email confirmation
      emailRedirectTo: undefined,
    },
  });

  return { data, error };
}

/**
 * Sign in an existing user with email and password via Supabase Auth.
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign in with Google OAuth via Supabase Auth.
 * Redirects the user to Google, then back to the app.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign out the current user from Supabase Auth.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current Supabase Auth session.
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Get the current authenticated user.
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}
