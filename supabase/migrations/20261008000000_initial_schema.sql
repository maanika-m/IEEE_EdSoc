-- ==============================================================================
-- IEEE Education Society Student Chapter (SRMIST Kattankulathur)
-- Initial Production Database Schema & RLS Policies
-- Compatibility: Supabase PostgreSQL (Migration Safe)
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. UTILITY: AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. TABLE: ADMIN_PROFILES (Chapter Officer / Admin Authorization)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'officer' CHECK (role IN ('admin', 'officer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on user_id for high-performance auth lookups
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON public.admin_profiles(user_id);

CREATE OR REPLACE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 3. SECURITY DEFINER: IS_CHAPTER_ADMIN()
-- Checks if the authenticated user is an active designated chapter administrator.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_chapter_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$;

-- ==============================================================================
-- 4. TABLE: EVENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE,
  end_time TIME WITHOUT TIME ZONE,
  venue TEXT,
  speaker TEXT,
  description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

CREATE OR REPLACE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically sync published_at when event status flips to published
CREATE OR REPLACE FUNCTION public.handle_event_publish_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status = 'draft' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  ELSIF NEW.status = 'draft' THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_event_publish_timestamp
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_event_publish_timestamp();

-- ==============================================================================
-- 5. TABLE: EVENT_PHOTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_event_photos_event_id ON public.event_photos(event_id);
CREATE INDEX IF NOT EXISTS idx_event_photos_order ON public.event_photos(event_id, display_order);

-- ==============================================================================
-- 6. TABLE: EVENT_REPORTS (0 or 1 Official PDF Report per event)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_event_reports_event_id ON public.event_reports(event_id);

-- ==============================================================================
-- 7. TABLE: EVENT_RESOURCES (Keynote slides, GitHub repo, vTools recordings, etc.)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'other',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON public.event_resources(event_id);

-- ==============================================================================
-- 8. TABLE: MEMBERS (Advisory & Office Bearers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'executive_committee' CHECK (category IN ('advisor', 'executive_committee', 'other')),
  designation TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_category_visible ON public.members(category, is_visible, display_order);

CREATE OR REPLACE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 9. TABLE: SITE_SETTINGS (Structured Chapter Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_name TEXT NOT NULL DEFAULT 'IEEE Education Society Student Chapter',
  institution_name TEXT NOT NULL DEFAULT 'SRM Institute of Science and Technology',
  location TEXT NOT NULL DEFAULT 'Kattankulathur, Chennai',
  description TEXT NOT NULL DEFAULT 'Advancing technical learning, academic and engineering education, student collaboration, and research-oriented engagement under IEEE Education Society standards at SRMIST.',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  linkedin_url TEXT DEFAULT 'https://linkedin.com',
  ieee_chapter_profile_url TEXT DEFAULT 'https://vtools.ieee.org',
  join_chapter_url TEXT DEFAULT '#join-chapter',
  edsoc_logo_url TEXT,
  srmist_logo_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default site settings record if empty
INSERT INTO public.site_settings (
  chapter_name,
  institution_name,
  location,
  description
)
SELECT
  'IEEE Education Society Student Chapter',
  'SRM Institute of Science and Technology',
  'Kattankulathur, Chennai',
  'Advancing technical learning, academic and engineering education, student collaboration, and research-oriented engagement under IEEE Education Society standards at SRMIST.'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict least-privilege enforcement across all tables
-- ==============================================================================

-- 10.1 ADMIN_PROFILES RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own admin profile"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all admin profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_chapter_admin());

CREATE POLICY "Admins can manage admin profiles"
  ON public.admin_profiles FOR ALL
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

-- 10.2 EVENTS RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select published events"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can select all events including drafts"
  ON public.events FOR SELECT
  TO authenticated
  USING (public.is_chapter_admin());

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_chapter_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.is_chapter_admin());

-- 10.3 EVENT_PHOTOS RLS
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select photos of published events"
  ON public.event_photos FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_photos.event_id
        AND events.status = 'published'
    )
  );

CREATE POLICY "Admins can manage all event photos"
  ON public.event_photos FOR ALL
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

-- 10.4 EVENT_REPORTS RLS
ALTER TABLE public.event_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select reports of published events"
  ON public.event_reports FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_reports.event_id
        AND events.status = 'published'
    )
  );

CREATE POLICY "Admins can manage all event reports"
  ON public.event_reports FOR ALL
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

-- 10.5 EVENT_RESOURCES RLS
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select resources of published events"
  ON public.event_resources FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_resources.event_id
        AND events.status = 'published'
    )
  );

CREATE POLICY "Admins can manage all event resources"
  ON public.event_resources FOR ALL
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

-- 10.6 MEMBERS RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can select visible members"
  ON public.members FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins can manage all members"
  ON public.members FOR ALL
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

-- 10.7 SITE_SETTINGS RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_chapter_admin())
  WITH CHECK (public.is_chapter_admin());

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_chapter_admin());

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKETS SETUP & STORAGE RLS POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('event-covers', 'event-covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('event-photos', 'event-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('event-reports', 'event-reports', true, 26214400, ARRAY['application/pdf']),
  ('member-photos', 'member-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Objects RLS: Public Read Access
CREATE POLICY "Public can view objects in chapter buckets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('event-covers', 'event-photos', 'event-reports', 'member-photos', 'site-assets'));

-- Storage Objects RLS: Chapter Admin Upload/Update/Delete Access
CREATE POLICY "Admins can upload objects to chapter buckets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('event-covers', 'event-photos', 'event-reports', 'member-photos', 'site-assets')
    AND public.is_chapter_admin()
  );

CREATE POLICY "Admins can update objects in chapter buckets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('event-covers', 'event-photos', 'event-reports', 'member-photos', 'site-assets')
    AND public.is_chapter_admin()
  );

CREATE POLICY "Admins can delete objects in chapter buckets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('event-covers', 'event-photos', 'event-reports', 'member-photos', 'site-assets')
    AND public.is_chapter_admin()
  );
