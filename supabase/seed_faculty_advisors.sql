-- ==============================================================================
-- IEEE Education Society SRMIST Student Chapter
-- Seed Script: Faculty Advisors, Roster & Official Brand Logos
--
-- TARGET TABLES:
-- 1. public.members (Dr. Jagadeesh M & Dr. Jansi K R + Student Office Bearers)
-- 2. public.site_settings (Official logo paths)
--
-- HOW TO RUN:
-- 1. Open Supabase Dashboard -> SQL Editor (project dpvxtpsefrfrlokjvbas)
-- 2. Paste and run this script
-- ==============================================================================

-- 1. SEED FACULTY ADVISORS & OFFICE BEARERS INTO public.members
INSERT INTO public.members (
  name,
  role,
  category,
  designation,
  bio,
  photo_url,
  display_order,
  is_visible
)
VALUES
  (
    'Dr. Jagadeesh M',
    'Faculty Advisor',
    'advisor',
    'Assistant Professor',
    'Faculty Advisor for IEEE Education Society Student Chapter at SRMIST. Email: jagadeem4@srmist.edu.in',
    '/assets/aistudio/sir_4e8b1d45.jpg',
    1,
    true
  ),
  (
    'Dr. Jansi K R',
    'Advisor',
    'advisor',
    'Associate Professor',
    'Advisor for IEEE Education Society Student Chapter at SRMIST. Email: jansik@srmist.edu.in',
    '/assets/aistudio/mam_cc31977a.jpg',
    2,
    true
  ),
  (
    'Piyasha Chakraborty',
    'Chair',
    'executive_committee',
    'Undergraduate Scholar',
    'Student Chapter Chair, IEEE Education Society SRMIST.',
    NULL,
    3,
    true
  ),
  (
    'Maanika Mishra',
    'Vice Chair',
    'executive_committee',
    'Undergraduate Scholar',
    'Student Chapter Vice Chair, IEEE Education Society SRMIST.',
    NULL,
    4,
    true
  ),
  (
    'Svar Kalavadia',
    'Secretary',
    'executive_committee',
    'Undergraduate Scholar',
    'Student Chapter Secretary, IEEE Education Society SRMIST.',
    NULL,
    5,
    true
  ),
  (
    'Archana RG',
    'Treasurer',
    'executive_committee',
    'Undergraduate Scholar',
    'Student Chapter Treasurer, IEEE Education Society SRMIST.',
    NULL,
    6,
    true
  )
ON CONFLICT DO NOTHING;

-- 2. UPDATE SITE SETTINGS WITH OFFICIAL LOGO ASSET PATHS
UPDATE public.site_settings
SET
  edsoc_logo_url = '/assets/aistudio/ieeeeducationsociety-cropped_15876e50.png',
  srmist_logo_url = '/assets/aistudio/srm_2d80ef8c.png',
  updated_at = NOW()
WHERE id IS NOT NULL;

-- 3. VERIFY THE RESULT SAFELY
SELECT id, name, role, designation, category, is_visible
FROM public.members
ORDER BY display_order ASC;
