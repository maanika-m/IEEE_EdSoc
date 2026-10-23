import { createClient, isSupabaseConfigured } from './client';
import type {
  Event,
  EventPhoto,
  EventReport,
  EventResource,
  Member,
  SiteSettings,
  AdminProfile,
} from '../types/database';

// ==============================================================================
// PUBLIC DATA ACCESS LAYER
// ==============================================================================

/**
 * Fetch all published events for public visitors.
 * Enforces RLS: only events with status = 'published' are returned.
 */
export async function getPublishedEvents(): Promise<Event[]> {
  const client = createClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (error) {
    console.warn('[Supabase] Failed to fetch published events:', error.message);
    return [];
  }

  return (data as Event[]) || [];
}

/**
 * Fetch a single event by unique slug.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const client = createClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Event;
}

/**
 * Fetch curated photographs for a specific event.
 */
export async function getEventPhotos(eventId: string): Promise<EventPhoto[]> {
  const client = createClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('event_photos')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });

  if (error) {
    return [];
  }

  return (data as EventPhoto[]) || [];
}

/**
 * Fetch official PDF report document for a specific event.
 */
export async function getEventReport(eventId: string): Promise<EventReport | null> {
  const client = createClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('event_reports')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as EventReport;
}

/**
 * Fetch additional educational resources (slides, repos, recordings) for an event.
 */
export async function getEventResources(eventId: string): Promise<EventResource[]> {
  const client = createClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('event_resources')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });

  if (error) {
    return [];
  }

  return (data as EventResource[]) || [];
}

/**
 * Fetch visible chapter leadership and advisory members.
 */
export async function getVisibleMembers(): Promise<Member[]> {
  const client = createClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('members')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    return [];
  }

  return (data as Member[]) || [];
}

/**
 * Fetch structured site settings.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = createClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as SiteSettings;
}

// ==============================================================================
// ADMINISTRATIVE DATA ACCESS LAYER (Requires Chapter Admin Authorization)
// ==============================================================================

/**
 * Fetch all events (including drafts and published) for the admin dashboard.
 */
export async function getAllEventsAdmin(): Promise<Event[]> {
  const client = createClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Supabase Admin] Failed to fetch events:', error.message);
    return [];
  }

  return (data as Event[]) || [];
}

/**
 * Check if a slug is available for a new event or an existing event being edited.
 */
export async function checkEventSlugAvailable(slug: string, excludeEventId?: string): Promise<boolean> {
  const client = createClient();
  if (!client) {
    return true;
  }

  let query = client
    .from('events')
    .select('id')
    .eq('slug', slug);

  if (excludeEventId) {
    query = query.neq('id', excludeEventId);
  }

  const { data, error } = await query;
  if (error || !data) {
    return true;
  }

  return data.length === 0;
}

/**
 * Create a new event draft or published record.
 */
export async function createEventAdmin(
  eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Event | null; error: string | null }> {
  const client: any = createClient();
  if (!client) {
    return { data: null, error: 'Database connection not configured' };
  }

  const { data, error } = await client
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Event, error: null };
}

/**
 * Update an existing event.
 */
export async function updateEventAdmin(
  id: string,
  updates: Partial<Omit<Event, 'id' | 'created_at'>>
): Promise<{ data: Event | null; error: string | null }> {
  const client: any = createClient();
  if (!client) {
    return { data: null, error: 'Database connection not configured' };
  }

  const { data, error } = await client
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Event, error: null };
}

/**
 * Delete an event and automatically cascade delete its photos, reports, and resources.
 */
export async function deleteEventAdmin(id: string): Promise<{ success: boolean; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { success: false, error: 'Database connection not configured' };
  }

  const { error } = await client
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Upload an event cover image to the `event-covers` storage bucket.
 */
export async function uploadEventCover(
  file: File
): Promise<{ publicUrl: string | null; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { publicUrl: null, error: 'Storage not configured' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error: uploadError } = await client.storage
    .from('event-covers')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { publicUrl: null, error: uploadError.message };
  }

  const { data } = client.storage.from('event-covers').getPublicUrl(filePath);
  return { publicUrl: data.publicUrl, error: null };
}

/**
 * Upload an event photo to `event-photos` bucket and link it in `event_photos` table.
 */
export async function uploadEventPhoto(
  eventId: string,
  file: File,
  caption?: string
): Promise<{ data: EventPhoto | null; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { data: null, error: 'Storage not configured' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${eventId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from('event-photos')
    .upload(fileName, file);

  if (uploadError) {
    return { data: null, error: uploadError.message };
  }

  const { data: urlData } = client.storage.from('event-photos').getPublicUrl(fileName);

  const { data, error: insertError } = await client
    .from('event_photos')
    .insert({
      event_id: eventId,
      image_url: urlData.publicUrl,
      caption: caption || null,
      display_order: 0,
    } as any)
    .select()
    .single();

  if (insertError) {
    return { data: null, error: insertError.message };
  }

  return { data: data as EventPhoto, error: null };
}

/**
 * Upload an official event report PDF to `event-reports` bucket and link it in `event_reports` table.
 */
export async function uploadEventReport(
  eventId: string,
  file: File
): Promise<{ data: EventReport | null; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { data: null, error: 'Storage not configured' };
  }

  const fileName = `${eventId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

  const { error: uploadError } = await client.storage
    .from('event-reports')
    .upload(fileName, file, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    return { data: null, error: uploadError.message };
  }

  const { data: urlData } = client.storage.from('event-reports').getPublicUrl(fileName);

  const { data, error: insertError } = await client
    .from('event_reports')
    .upsert({
      event_id: eventId,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
    } as any, { onConflict: 'event_id' })
    .select()
    .single();

  if (insertError) {
    return { data: null, error: insertError.message };
  }

  return { data: data as EventReport, error: null };
}

/**
 * Add an external resource link to an event.
 */
export async function addEventResource(
  resource: Omit<EventResource, 'id' | 'created_at'>
): Promise<{ data: EventResource | null; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { data: null, error: 'Database not configured' };
  }

  const { data, error } = await client
    .from('event_resources')
    .insert(resource as any)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as EventResource, error: null };
}

// ==============================================================================
// AUTHENTICATION & AUTHORIZATION HELPERS
// ==============================================================================

/**
 * Sign in a Chapter Officer with Supabase Auth credentials.
 */
export async function signInOfficer(
  email: string,
  password: string
): Promise<{ user: any; error: string | null }> {
  const client = createClient();
  if (!client) {
    return { user: null, error: 'Supabase authentication service not initialized.' };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

/**
 * Sign out of current officer session.
 */
export async function signOutOfficer(): Promise<{ error: string | null }> {
  const client = createClient();
  if (!client) {
    return { error: null };
  }

  const { error } = await client.auth.signOut();
  return { error: error ? error.message : null };
}

/**
 * Verify whether the currently logged-in user is a designated Chapter Administrator.
 * Uses the `is_chapter_admin()` RPC function or queries `admin_profiles`.
 */
export async function checkIsChapterAdmin(): Promise<boolean> {
  const client = createClient();
  if (!client) {
    return false;
  }

  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    return false;
  }

  const { data, error } = await client
    .from('admin_profiles')
    .select('is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return Boolean((data as any).is_active);
}
