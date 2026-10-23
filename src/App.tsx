import React, { useState, useEffect, useCallback } from 'react';
import HomePage from './app/page';
import EventsPage from './app/events/page';
import EventDetailPage from './app/events/[slug]/page';
import ResourcesPage from './app/resources/page';
import LeadershipPage from './app/leadership/page';
import AdminDashboardPage from './app/admin/page';
import AdminEventsPage from './app/admin/events/page';
import AdminMembersPage from './app/admin/members/page';
import AdminSettingsPage from './app/admin/settings/page';
import AdminLoginPage from './app/admin/login/page';
import { AdminUnauthorized } from './components/admin/AdminUnauthorized';
import type { Event, EventPhoto, EventReport, EventResource, AdminProfile } from './lib/types/database';
import { slugify } from './lib/utils/format';
import {
  getPublishedEvents,
  getAllEventsAdmin,
  createEventAdmin,
  updateEventAdmin,
  deleteEventAdmin,
  checkEventSlugAvailable,
  getEventBySlug,
  getEventPhotos,
  getEventReport,
  getEventResources,
} from './lib/supabase/queries';
import {
  getCurrentAdminAuthState,
  signOutAdmin,
  verifyAdminAuthorization,
  type AuthState,
} from './lib/supabase/auth';
import { createClient, isSupabaseConfigured } from './lib/supabase/client';
import type { EventFormData } from './components/admin/EventEditor';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Admin Authentication & Authorization State
  const [adminAuthState, setAdminAuthState] = useState<AuthState>({ status: 'loading' });

  // Events state: starts empty (genuine zero records state per specification)
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Active event detail state for /events/[slug]
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailLoading, setEventDetailLoading] = useState<boolean>(false);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [eventReport, setEventReport] = useState<EventReport | null>(null);
  const [eventResources, setEventResources] = useState<EventResource[]>([]);

  // Refresh admin authentication and authorization status
  const refreshAuthState = useCallback(async () => {
    try {
      const state = await getCurrentAdminAuthState();
      setAdminAuthState(state);
    } catch {
      setAdminAuthState({ status: 'unauthenticated' });
    }
  }, []);

  useEffect(() => {
    refreshAuthState();

    const client = createClient();
    if (!client) {
      setAdminAuthState({ status: 'unauthenticated' });
      return;
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminAuthState({ status: 'unauthenticated' });
      } else if (session?.user) {
        // Handle INITIAL_SESSION (with session), SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED
        const { isAuthorized, profile } = await verifyAdminAuthorization(session.user.id);
        if (isAuthorized && profile) {
          setAdminAuthState({ status: 'authenticated', user: session.user, profile });
        } else {
          setAdminAuthState({
            status: 'unauthorized',
            email: session.user.email || '',
            userId: session.user.id,
            user: session.user,
          });
        }
      } else if (event === 'INITIAL_SESSION' && !session) {
        // Initial session check completed with no stored session
        setAdminAuthState({ status: 'unauthenticated' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAuthState]);

  // Load events from Supabase based on route and authorization
  const refreshEvents = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setEventsLoading(false);
      return;
    }

    setEventsLoading(true);
    setEventsError(null);

    try {
      const isAdminRoute = currentPath.startsWith('/admin');
      if (isAdminRoute && adminAuthState.status === 'authenticated') {
        const adminEvents = await getAllEventsAdmin();
        setEvents(adminEvents || []);
      } else {
        const publicEvents = await getPublishedEvents();
        setEvents(publicEvents || []);
      }
    } catch (err: any) {
      console.warn('[App] Supabase fetch error:', err);
      setEventsError(err.message || 'Failed to load events from database');
    } finally {
      setEventsLoading(false);
    }
  }, [currentPath, adminAuthState.status]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('#')) {
      const el = document.getElementById(path.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Guard rule: If an unauthenticated user visits a protected admin route -> redirect to /admin/login
  useEffect(() => {
    if (
      adminAuthState.status === 'unauthenticated' &&
      currentPath.startsWith('/admin') &&
      currentPath !== '/admin/login'
    ) {
      if (window.location.pathname !== '/admin/login') {
        window.history.replaceState({}, '', '/admin/login');
      }
      setCurrentPath('/admin/login');
    }
  }, [adminAuthState.status, currentPath]);

  // 2. Guard rule: If an authenticated and authorized admin visits /admin/login -> redirect to /admin
  useEffect(() => {
    if (
      adminAuthState.status === 'authenticated' &&
      currentPath === '/admin/login'
    ) {
      if (window.location.pathname !== '/admin') {
        window.history.replaceState({}, '', '/admin');
      }
      setCurrentPath('/admin');
    }
  }, [adminAuthState.status, currentPath]);

  // Sign out handler
  const handleSignOut = async () => {
    await signOutAdmin();
    setAdminAuthState({ status: 'unauthenticated' });
    navigate('/admin/login');
  };

  // Sign in success callback
  const handleLoginSuccess = (profile: AdminProfile) => {
    setAdminAuthState((prev) =>
      prev.status === 'authenticated'
        ? prev
        : { status: 'authenticated', user: null, profile }
    );
    navigate('/admin');
  };

  // Fetch event detail assets when navigating to /events/[slug]
  useEffect(() => {
    if (currentPath.startsWith('/events/')) {
      const slug = currentPath.replace('/events/', '').trim();
      if (!slug) {
        setSelectedEvent(null);
        return;
      }

      setEventDetailLoading(true);

      getEventBySlug(slug)
        .then(async (dbEvent) => {
          // Strictly only accept published events for public visitors
          if (dbEvent && dbEvent.status === 'published') {
            setSelectedEvent(dbEvent);
            const [photos, report, resources] = await Promise.all([
              getEventPhotos(dbEvent.id),
              getEventReport(dbEvent.id),
              getEventResources(dbEvent.id),
            ]);
            setEventPhotos(photos);
            setEventReport(report);
            setEventResources(resources);
          } else {
            setSelectedEvent(null);
            setEventPhotos([]);
            setEventReport(null);
            setEventResources([]);
          }
        })
        .catch((err) => {
          console.warn('[App] Failed to fetch event by slug:', err);
          setSelectedEvent(null);
        })
        .finally(() => {
          setEventDetailLoading(false);
        });
    }
  }, [currentPath]);

  const handleAddEvent = async (eventData: EventFormData): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Database connection not configured' };
    }

    const currentUserId = adminAuthState.status === 'authenticated' && adminAuthState.user
      ? adminAuthState.user.id
      : null;

    // Check slug uniqueness
    const isSlugAvailable = await checkEventSlugAvailable(eventData.slug);
    if (!isSlugAvailable) {
      return { success: false, error: `The slug "${eventData.slug}" is already in use by another event. Please choose a different title or slug.` };
    }

    const insertPayload: any = {
      title: eventData.title,
      slug: eventData.slug,
      category: eventData.category,
      status: eventData.status,
      date: eventData.date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      venue: eventData.venue,
      speaker: eventData.speaker,
      description: eventData.description,
      cover_image_url: eventData.cover_image_url || null,
      created_by: currentUserId,
      published_at: eventData.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await createEventAdmin(insertPayload);
    if (error || !data) {
      return { success: false, error: error || 'Failed to create event in database' };
    }

    // Refresh events from database to ensure fresh state
    await refreshEvents();
    return { success: true };
  };

  const handleUpdateEvent = async (eventData: EventFormData): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !eventData.id) {
      return { success: false, error: 'Event ID or database connection missing' };
    }

    // Check slug uniqueness excluding this event
    const isSlugAvailable = await checkEventSlugAvailable(eventData.slug, eventData.id);
    if (!isSlugAvailable) {
      return { success: false, error: `The slug "${eventData.slug}" is already in use by another event.` };
    }

    // Find existing event to preserve published_at when already published
    const existing = events.find((e) => e.id === eventData.id);
    let publishedAt = existing?.published_at || null;
    if (eventData.status === 'published' && !publishedAt) {
      publishedAt = new Date().toISOString();
    } else if (eventData.status === 'draft') {
      publishedAt = null;
    }

    const updatePayload: Partial<Event> = {
      title: eventData.title,
      slug: eventData.slug,
      category: eventData.category,
      status: eventData.status,
      date: eventData.date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      venue: eventData.venue,
      speaker: eventData.speaker,
      description: eventData.description,
      cover_image_url: eventData.cover_image_url || null,
      published_at: publishedAt,
    };

    const { data, error } = await updateEventAdmin(eventData.id, updatePayload);
    if (error || !data) {
      return { success: false, error: error || 'Failed to update event in database' };
    }

    // Refresh events from database
    await refreshEvents();
    return { success: true };
  };

  const handleDeleteEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Database connection not configured' };
    }

    const { success, error } = await deleteEventAdmin(id);
    if (!success) {
      return { success: false, error: error || 'Failed to delete event' };
    }

    // Refresh events list
    await refreshEvents();
    return { success: true };
  };

  // ============================================================================
  // ROUTE RENDERING & GUARDS
  // ============================================================================

  // 1. ALL ADMIN ROUTES (/admin/*)
  if (currentPath.startsWith('/admin')) {
    // 1A. /admin/login
    if (currentPath === '/admin/login') {
      if (adminAuthState.status === 'authenticated') {
        // Redirection handled by effect
        return null;
      }
      return (
        <AdminLoginPage
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    // 1B. Loading session & clearance verification
    if (adminAuthState.status === 'loading') {
      return (
        <div className="min-h-screen bg-[#0d1b3d] text-white flex items-center justify-center pcb-substrate-dark font-body-md antialiased">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#ff8928] border-t-transparent animate-spin"></div>
            <span className="font-mono text-xs text-[#ffdcc6] tracking-wider uppercase">
              Verifying Chapter Officer Clearance...
            </span>
          </div>
        </div>
      );
    }

    // 1C. Unauthenticated user on protected /admin/* route
    // (Redirect to /admin/login is scheduled; render login view immediately)
    if (adminAuthState.status === 'unauthenticated') {
      return (
        <AdminLoginPage
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    // 1D. Authenticated user without active admin_profiles record:
    // -> Do not expose admin dashboard or CMS
    // -> Show appropriate unauthorized state
    if (adminAuthState.status === 'unauthorized') {
      return (
        <AdminUnauthorized
          email={adminAuthState.email}
          userId={adminAuthState.userId}
          onSignOut={handleSignOut}
          onNavigate={navigate}
        />
      );
    }

    // 1E. Fully Authenticated and Authorized Chapter Administrator
    const profile = adminAuthState.profile;

    if (currentPath === '/admin') {
      return (
        <AdminDashboardPage
          events={events}
          profile={profile}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      );
    }
    if (currentPath === '/admin/events') {
      return (
        <AdminEventsPage
          events={events}
          profile={profile}
          isLoading={eventsLoading}
          errorMessage={eventsError}
          onRetry={refreshEvents}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      );
    }
    if (currentPath === '/admin/members') {
      return (
        <AdminMembersPage
          profile={profile}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      );
    }
    if (currentPath === '/admin/settings') {
      return (
        <AdminSettingsPage
          profile={profile}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
      );
    }

    // Fallback for any other /admin/* subpaths
    return (
      <AdminDashboardPage
        events={events}
        profile={profile}
        onNavigate={navigate}
        onSignOut={handleSignOut}
      />
    );
  }

  // 2. PUBLIC EXACT ROUTES
  if (currentPath === '/events') {
    return (
      <EventsPage
        events={events}
        isLoading={eventsLoading}
        errorMessage={eventsError}
        onRetry={refreshEvents}
        onNavigate={navigate}
      />
    );
  }
  if (currentPath === '/resources') {
    return <ResourcesPage onNavigate={navigate} />;
  }
  if (currentPath === '/leadership') {
    return <LeadershipPage onNavigate={navigate} />;
  }

  // 3. DYNAMIC EVENT SLUG ROUTE (/events/[slug])
  if (currentPath.startsWith('/events/')) {
    const slug = currentPath.replace('/events/', '');
    return (
      <EventDetailPage
        slug={slug}
        event={selectedEvent || undefined}
        photos={eventPhotos}
        report={eventReport}
        resources={eventResources}
        isLoading={eventDetailLoading}
        onNavigate={navigate}
      />
    );
  }

  // 4. DEFAULT: PUBLIC HOMEPAGE
  return <HomePage events={events} onNavigate={navigate} />;
}
