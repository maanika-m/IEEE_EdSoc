import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, AdminProfile } from '../types/database';

/**
 * Server-side Supabase client for Next.js App Router (Server Components & Route Handlers).
 * Uses cookie store to maintain secure session state without localStorage.
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Never leaks secret keys to browser.
 */

export interface CookieStore {
  get: (name: string) => { name: string; value: string } | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  remove: (name: string, options?: CookieOptions) => void;
}

export function createServerSupabaseClient(
  cookieStore?: CookieStore
): SupabaseClient<Database> | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawKey = 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    '';

  const supabaseUrl = rawUrl.trim().replace(/^[=\s"']+/, '').replace(/[=\s"']+$/, '').trim();
  const supabaseKey = rawKey.trim().replace(/^[=\s"']+/, '').replace(/[=\s"']+$/, '').trim();

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
    return null;
  }

  try {
    return createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore?.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore?.set(name, value, options);
          } catch {
            // Can be ignored if called from Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore?.remove(name, options);
          } catch {
            // Can be ignored if called from Server Component
          }
        },
      },
    }
  );
  } catch {
    return null;
  }
}

/**
 * Server-side verification for protected /admin routes and server operations.
 * Verifies BOTH:
 * 1. Authenticated Supabase session
 * 2. Active record in public.admin_profiles
 */
export async function verifyAdminSessionServer(
  cookieStore?: CookieStore
): Promise<{
  isAuthenticated: boolean;
  isAuthorized: boolean;
  user: any | null;
  profile: AdminProfile | null;
}> {
  const client = createServerSupabaseClient(cookieStore);
  if (!client) {
    return {
      isAuthenticated: false,
      isAuthorized: false,
      user: null,
      profile: null,
    };
  }

  try {
    const { data: { user }, error: userError } = await client.auth.getUser();

    if (userError || !user) {
      return {
        isAuthenticated: false,
        isAuthorized: false,
        user: null,
        profile: null,
      };
    }

    const { data: profileData, error: profileError } = await client
      .from('admin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (profileError || !profileData) {
      return {
        isAuthenticated: true,
        isAuthorized: false,
        user,
        profile: null,
      };
    }

    const profile = profileData as AdminProfile;
    const isAuthorized = profile.is_active && (profile.role === 'admin' || profile.role === 'officer');

    return {
      isAuthenticated: true,
      isAuthorized,
      user,
      profile: isAuthorized ? profile : null,
    };
  } catch {
    return {
      isAuthenticated: false,
      isAuthorized: false,
      user: null,
      profile: null,
    };
  }
}
