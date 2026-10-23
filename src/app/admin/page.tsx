import React from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminFooter } from '../../components/admin/AdminFooter';
import type { Event, AdminProfile } from '../../lib/types/database';
import { isSupabaseConfigured } from '../../lib/supabase/client';

interface AdminDashboardPageProps {
  events: Event[];
  profile?: AdminProfile | null;
  onNavigate: (path: string) => void;
  onSignOut?: () => void;
}

export default function AdminDashboardPage({
  events,
  profile,
  onNavigate,
  onSignOut,
}: AdminDashboardPageProps) {
  const publishedCount = events.filter((e) => e.status === 'published').length;
  const draftCount = events.filter((e) => e.status === 'draft').length;

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] font-body-md antialiased min-h-screen flex flex-col selection:bg-[#ff8928] selection:text-white">
      <AdminHeader
        profile={profile}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />

      <div className="flex flex-1 w-full max-w-[1720px] mx-auto">
        <AdminSidebar currentPath="/admin" onNavigate={onNavigate} />

        <main className="flex-1 p-6 lg:p-10 space-y-8 grid-bg overflow-x-hidden">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8928]"></span>
                <span className="font-mono text-xs text-[#964900] uppercase font-bold tracking-wider">
                  CHAPTER OFFICER DASHBOARD
                </span>
              </div>
              <h1 className="font-headline-lg text-3xl font-bold text-[#151b2a]">
                Chapter Console
              </h1>
              <p className="font-sans text-sm text-[#45464e] mt-0.5">
                IEEE Education Society Student Chapter — SRMIST Kattankulathur [CH-ID: 10429]
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/admin/events')}
                className="chamfer-btn inline-flex items-center gap-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs uppercase px-4 py-2.5 font-bold shadow transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#76767f] font-mono text-xs mb-2">
                <span>TOTAL EVENTS</span>
                <span className="material-symbols-outlined text-lg text-[#ff8928]">event</span>
              </div>
              <div className="font-poppins font-bold text-3xl text-[#151b2a]">{events.length}</div>
              <p className="font-mono text-[10px] text-[#76767f] mt-1">Logged in chapter repository</p>
            </div>

            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#76767f] font-mono text-xs mb-2">
                <span>PUBLISHED ARCHIVE</span>
                <span className="material-symbols-outlined text-lg text-emerald-600">check_circle</span>
              </div>
              <div className="font-poppins font-bold text-3xl text-emerald-700">{publishedCount}</div>
              <p className="font-mono text-[10px] text-[#76767f] mt-1">Visible on public site</p>
            </div>

            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#76767f] font-mono text-xs mb-2">
                <span>DRAFT EVENTS</span>
                <span className="material-symbols-outlined text-lg text-[#964900]">edit_note</span>
              </div>
              <div className="font-poppins font-bold text-3xl text-[#964900]">{draftCount}</div>
              <p className="font-mono text-[10px] text-[#76767f] mt-1">In progress & pending materials</p>
            </div>

            <div className="bg-white border border-[#e2e8fc] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#76767f] font-mono text-xs mb-2">
                <span>OFFICE BEARERS</span>
                <span className="material-symbols-outlined text-lg text-[#0d1b3d]">group</span>
              </div>
              <div className="font-poppins font-bold text-3xl text-[#0d1b3d]">4</div>
              <p className="font-mono text-[10px] text-[#76767f] mt-1">+ 2 Faculty Advisors</p>
            </div>
          </div>

          {/* Quick Shortcuts & Database Architecture Ready state */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#e2e8fc] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8fc] pb-3">
                <h3 className="font-headline-sm text-base font-bold text-[#151b2a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8928]">bolt</span>
                  <span>Quick Actions</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => onNavigate('/admin/events')}
                  className="p-4 bg-[#f2f3ff] border border-[#e2e8fc] hover:border-[#ff8928] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#ff8928]">event_note</span>
                    <h4 className="font-poppins font-bold text-sm text-[#0d1b3d]">Manage Events</h4>
                  </div>
                  <p className="font-sans text-xs text-[#45464e]">Create new workshops, upload keynote reports, and manage photo galleries.</p>
                </div>

                <div
                  onClick={() => onNavigate('/admin/members')}
                  className="p-4 bg-[#f2f3ff] border border-[#e2e8fc] hover:border-[#ff8928] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#0d1b3d]">badge</span>
                    <h4 className="font-poppins font-bold text-sm text-[#0d1b3d]">Executive Committee</h4>
                  </div>
                  <p className="font-sans text-xs text-[#45464e]">Review official advisory appointments and elected student office bearers.</p>
                </div>

                <div
                  onClick={() => onNavigate('/')}
                  className="p-4 bg-[#f2f3ff] border border-[#e2e8fc] hover:border-[#ff8928] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-emerald-600">visibility</span>
                    <h4 className="font-poppins font-bold text-sm text-[#0d1b3d]">Public Homepage</h4>
                  </div>
                  <p className="font-sans text-xs text-[#45464e]">Inspect how published chapter initiatives appear to students and visitors.</p>
                </div>

                <div
                  onClick={() => onNavigate('/admin/settings')}
                  className="p-4 bg-[#f2f3ff] border border-[#e2e8fc] hover:border-[#ff8928] rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#76767f]">tune</span>
                    <h4 className="font-poppins font-bold text-sm text-[#0d1b3d]">Chapter Settings</h4>
                  </div>
                  <p className="font-sans text-xs text-[#45464e]">Configure institutional metadata, social accounts, and Supabase keys.</p>
                </div>
              </div>
            </div>

            {/* Supabase Integration Ready Panel */}
            <div className="bg-white border border-[#e2e8fc] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2e8fc] pb-3">
                <h3 className="font-headline-sm text-base font-bold text-[#151b2a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0d1b3d]">database</span>
                  <span>Backend Integration</span>
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#f2f3ff] rounded border border-[#e2e8fc]">
                  <span className="text-[#76767f] block text-[10px]">SUPABASE DATA LAYER</span>
                  <span className={`font-bold flex items-center gap-1.5 mt-0.5 ${isSupabaseConfigured ? 'text-emerald-700' : 'text-[#964900]'}`}>
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-[#ff8928]'}`}></span>
                    {isSupabaseConfigured ? 'Live Connection Active' : 'Architecture & RLS Ready'}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#45464e] leading-relaxed">
                  PostgreSQL schema, RLS policies, Storage buckets, and SSR client are configured.
                  {isSupabaseConfigured
                    ? ' Reading and writing live to Supabase.'
                    : ' Provide NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to activate live database.'}
                </p>

                <div className="pt-2 text-[11px] text-[#76767f] space-y-1">
                  <div>✓ RLS: Strict public/officer policies on all tables</div>
                  <div>✓ Storage: 5 designated buckets (covers, photos, reports, members, assets)</div>
                  <div>✓ Auth: RBAC via public.admin_profiles &amp; is_chapter_admin()</div>
                  <div>✓ SQL Script: supabase/schema.sql</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminFooter />
    </div>
  );
}
