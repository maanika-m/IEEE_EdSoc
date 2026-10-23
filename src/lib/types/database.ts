/**
 * Database Entity Types for IEEE EdSoc SRMIST Chapter
 * Generated for Supabase PostgreSQL schema
 */

export type EventStatus = 'draft' | 'published';

export type EventCategory = 
  | 'workshop'
  | 'seminar'
  | 'technical_session'
  | 'meeting'
  | 'outreach'
  | 'other'
  | string;

export type ResourceType =
  | 'presentation'
  | 'GitHub'
  | 'IEEE/vTools'
  | 'external resource'
  | 'other'
  | string;

export type MemberCategory =
  | 'advisor'
  | 'executive_committee'
  | 'other';

export interface Event {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  speaker: string | null;
  description: string | null;
  cover_image_url: string | null;
  status: EventStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
  uploaded_by: string | null;
}

export interface EventReport {
  id: string;
  event_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null; // bytes
  created_at: string;
  uploaded_by: string | null;
}

export interface EventResource {
  id: string;
  event_id: string;
  title: string;
  url: string;
  resource_type: ResourceType;
  display_order: number;
  created_at: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  category: MemberCategory;
  designation: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  chapter_name: string;
  institution_name: string;
  location: string;
  description: string;
  instagram_url: string | null;
  linkedin_url: string | null;
  ieee_chapter_profile_url: string | null;
  join_chapter_url: string | null;
  edsoc_logo_url: string | null;
  srmist_logo_url: string | null;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'officer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Event, 'id'>>;
      };
      event_photos: {
        Row: EventPhoto;
        Insert: Omit<EventPhoto, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<EventPhoto, 'id'>>;
      };
      event_reports: {
        Row: EventReport;
        Insert: Omit<EventReport, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<EventReport, 'id'>>;
      };
      event_resources: {
        Row: EventResource;
        Insert: Omit<EventResource, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<EventResource, 'id'>>;
      };
      members: {
        Row: Member;
        Insert: Omit<Member, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Member, 'id'>>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'updated_at'> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SiteSettings, 'id'>>;
      };
      admin_profiles: {
        Row: AdminProfile;
        Insert: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AdminProfile, 'id'>>;
      };
    };
  };
}
