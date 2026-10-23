import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Modern Supabase Browser Client for Vite SPA
 * Uses @supabase/supabase-js with standard browser storage persistence (localStorage).
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 * Never exposes secret keys to the browser.
 */

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim().replace(/^[=\s"']+/, '').replace(/[=\s"']+$/, '').trim();
  if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

function sanitizeKey(rawKey?: string): string {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^[=\s"']+/, '').replace(/[=\s"']+$/, '').trim();
}

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      !parsed.hostname.includes('your-project-id') &&
      !parsed.hostname.includes('placeholder')
    );
  } catch {
    return false;
  }
}

// Safely obtain and sanitize environment variables across Vite, runtime, and global configs
const rawUrl: string =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_URL) ||
  '';

const rawKey: string =
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  '';

export const supabaseUrl = sanitizeUrl(rawUrl);
export const supabasePublishableKey = sanitizeKey(rawKey);

export const isSupabaseConfigured = Boolean(
  isValidUrl(supabaseUrl) &&
  supabasePublishableKey &&
  supabasePublishableKey.length > 5 &&
  !supabasePublishableKey.includes('your-publishable-api-key')
);

// In-memory fallback map in case localStorage is blocked in cross-origin iframe or private mode
const memoryStorage = new Map<string, string>();

const browserStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // ignore
    }
    return memoryStorage.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
    memoryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
    memoryStorage.delete(key);
  },
};

let browserClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createSupabaseClient<Database>(
        supabaseUrl,
        supabasePublishableKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: typeof window !== 'undefined' ? browserStorage : undefined,
          },
        }
      );
    } catch (err) {
      console.warn('[Supabase] Failed to initialize browser client:', err);
      return null;
    }
  }

  return browserClient;
}

export const supabase = isSupabaseConfigured ? createClient() : null;
