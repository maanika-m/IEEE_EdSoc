import { createClient, isSupabaseConfigured } from './client';
import type { AdminProfile } from '../types/database';

export type AuthState = 
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'unauthorized'; email: string; userId: string; user: any }
  | { status: 'authenticated'; user: any; profile: AdminProfile };

export interface SignInResult {
  success: boolean;
  error?: string;
  status?: 'authenticated' | 'unauthorized';
  profile?: AdminProfile;
  user?: any;
}

/**
 * Verifies whether the provided user ID has an active chapter administrator profile.
 * Follows the database constraint:
 * admin_profiles.user_id = auth.uid() AND admin_profiles.is_active = true
 */
export async function verifyAdminAuthorization(userId: string): Promise<{
  isAuthorized: boolean;
  profile: AdminProfile | null;
}> {
  const client = createClient();
  if (!client) {
    return { isAuthorized: false, profile: null };
  }

  try {
    const { data, error } = await client
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return { isAuthorized: false, profile: null };
    }

    const profile = data as AdminProfile;
    // Both 'admin' and 'officer' roles with is_active = true are authorized
    if (profile.is_active && (profile.role === 'admin' || profile.role === 'officer')) {
      return { isAuthorized: true, profile };
    }

    return { isAuthorized: false, profile: null };
  } catch {
    return { isAuthorized: false, profile: null };
  }
}

/**
 * Sign in an administrator / chapter officer with email and password.
 * Enforces BOTH:
 * 1. Valid Supabase authenticated session
 * 2. Active admin_profiles record for that authenticated user's ID
 *
 * Password is kept strictly unchanged (no trimming, mutation, or transformation).
 * Supabase error messages are safely surfaced for debugging rather than uniformly masked.
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<SignInResult> {
  // Field validation
  if (!email || !email.trim()) {
    return { success: false, error: 'Please enter your officer email address.' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const client = createClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.',
    };
  }

  try {
    // 1. Authenticate with Supabase Auth (email/password)
    // IMPORTANT: Password must be passed unchanged! Do NOT trim, slice, or transform password.
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError || !authData?.user) {
      let errorMsg = authError?.message || 'Authentication failed. Please verify your officer credentials.';
      if (errorMsg.toLowerCase().includes('database error querying schema')) {
        errorMsg = 'Database error querying schema: Supabase Auth server failed to read user records (GoTrue scanner issue with auth.users columns). Please run the SQL remediation script in your Supabase SQL Editor.';
      }
      return {
        success: false,
        error: errorMsg,
      };
    }

    // 2. Check authorization: must have an active record in public.admin_profiles
    const { isAuthorized, profile } = await verifyAdminAuthorization(authData.user.id);

    if (!isAuthorized || !profile) {
      return {
        success: false,
        status: 'unauthorized',
        user: authData.user,
        error: 'Access Denied: This account is authenticated in Supabase but does not have an active Chapter Administrator record in public.admin_profiles.',
      };
    }

    return {
      success: true,
      status: 'authenticated',
      profile,
      user: authData.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected connection error occurred during sign-in. Please try again.',
    };
  }
}

/**
 * Signs out the currently authenticated administrator.
 * Clears session through the Supabase client.
 */
export async function signOutAdmin(): Promise<{ error: string | null }> {
  const client = createClient();
  if (!client) {
    return { error: null };
  }

  try {
    const { error } = await client.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err?.message || 'Error during sign out' };
  }
}

/**
 * Checks the current session and returns full authentication & authorization state.
 * Uses getSession() first to avoid premature unauthenticated resets during page load,
 * followed by verifyAdminAuthorization() validation.
 */
export async function getCurrentAdminAuthState(): Promise<AuthState> {
  const client = createClient();
  if (!client) {
    return { status: 'unauthenticated' };
  }

  try {
    // 1. First retrieve local stored session
    const { data: { session }, error: sessionError } = await client.auth.getSession();

    if (sessionError || !session || !session.user) {
      return { status: 'unauthenticated' };
    }

    // 2. Validate current user
    const user = session.user;

    // 3. Verify admin profile authorization
    const { isAuthorized, profile } = await verifyAdminAuthorization(user.id);

    if (!isAuthorized || !profile) {
      return {
        status: 'unauthorized',
        email: user.email || '',
        userId: user.id,
        user,
      };
    }

    return {
      status: 'authenticated',
      user,
      profile,
    };
  } catch {
    return { status: 'unauthenticated' };
  }
}
