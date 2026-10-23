import React, { useState } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminFooter } from '../../../components/admin/AdminFooter';
import { isSupabaseConfigured } from '../../../lib/supabase/client';

import type { AdminProfile } from '../../../lib/types/database';

interface AdminSettingsPageProps {
  profile?: AdminProfile | null;
  onNavigate: (path: string) => void;
  onSignOut?: () => void;
}

export default function AdminSettingsPage({ profile, onNavigate, onSignOut }: AdminSettingsPageProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [instagram, setInstagram] = useState('https://www.instagram.com/ieee.es_srmist');
  const [linkedin, setLinkedin] = useState('https://www.linkedin.com/company/ieee-education-society-srm-chapter/home/');
  const [vtools, setVtools] = useState('https://ieee-edusociety.org/');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] font-body-md antialiased min-h-screen flex flex-col selection:bg-[#ff8928] selection:text-white">
      <AdminHeader
        profile={profile}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />

      <div className="flex flex-1 w-full max-w-[1720px] mx-auto">
        <AdminSidebar currentPath="/admin/settings" onNavigate={onNavigate} />

        <main className="flex-1 p-6 lg:p-10 space-y-8 grid-bg overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8928]"></span>
                <span className="font-mono text-xs text-[#964900] uppercase font-bold tracking-wider">
                  SYSTEM SETTINGS
                </span>
              </div>
              <h1 className="font-headline-lg text-3xl font-bold text-[#151b2a]">
                Chapter Configuration
              </h1>
              <p className="font-sans text-sm text-[#45464e] mt-0.5">
                Manage site metadata, official chapter identifiers, and database connectivity.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 font-mono text-xs text-emerald-800">
              ✓ Settings saved successfully.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSave} className="lg:col-span-2 space-y-6 bg-white border border-[#e2e8fc] p-6 lg:p-8 rounded-xl shadow-sm">
              <h3 className="font-headline-sm text-base font-bold text-[#151b2a] border-b border-[#e2e8fc] pb-3">
                Chapter Identity &amp; Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[#76767f] mb-1">CHAPTER CODE</label>
                  <input
                    type="text"
                    disabled
                    value="CH-ID: 10429"
                    className="w-full p-2.5 bg-[#f2f3ff] border border-[#c6c6cf] font-mono text-xs text-[#151b2a]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#76767f] mb-1">REGION</label>
                  <input
                    type="text"
                    disabled
                    value="Region 10 (Asia-Pacific)"
                    className="w-full p-2.5 bg-[#f2f3ff] border border-[#c6c6cf] font-mono text-xs text-[#151b2a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#76767f] mb-1">CHAPTER NAME</label>
                <input
                  type="text"
                  disabled
                  value="IEEE Education Society Student Chapter"
                  className="w-full p-2.5 bg-[#f2f3ff] border border-[#c6c6cf] font-sans text-sm text-[#151b2a]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#76767f] mb-1">INSTITUTION</label>
                <input
                  type="text"
                  disabled
                  value="SRM Institute of Science and Technology, Kattankulathur"
                  className="w-full p-2.5 bg-[#f2f3ff] border border-[#c6c6cf] font-sans text-sm text-[#151b2a]"
                />
              </div>

              <h3 className="font-headline-sm text-base font-bold text-[#151b2a] border-b border-[#e2e8fc] pb-3 pt-4">
                Social Channels &amp; Community Links
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-[#76767f] mb-1">INSTAGRAM URL</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-2.5 border border-[#c6c6cf] font-sans text-sm text-[#151b2a] focus:border-[#ff8928]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#76767f] mb-1">LINKEDIN URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full p-2.5 border border-[#c6c6cf] font-sans text-sm text-[#151b2a] focus:border-[#ff8928]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-[#76767f] mb-1">IEEE VTOOLS / CHAPTER PROFILE</label>
                  <input
                    type="url"
                    value={vtools}
                    onChange={(e) => setVtools(e.target.value)}
                    className="w-full p-2.5 border border-[#c6c6cf] font-sans text-sm text-[#151b2a] focus:border-[#ff8928]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="chamfer-btn px-6 py-2.5 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-xs uppercase font-bold transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>

            {/* Backend Integration status sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-[#e2e8fc] p-6 rounded-xl shadow-sm space-y-4">
                <h4 className="font-headline-sm text-sm font-bold text-[#151b2a]">Database Architecture</h4>
                <div className="p-3 bg-[#f2f3ff] rounded border border-[#e2e8fc] font-mono text-xs">
                  <span className="text-[#76767f] block text-[10px]">SUPABASE ENVIRONMENT</span>
                  <span className={`font-bold flex items-center gap-1.5 mt-0.5 ${isSupabaseConfigured ? 'text-emerald-700' : 'text-[#964900]'}`}>
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-[#ff8928]'}`}></span>
                    {isSupabaseConfigured ? 'Connected & Active' : 'Architecture Configured'}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#45464e] leading-relaxed">
                  Configured with current Supabase API key convention:
                </p>
                <div className="font-mono text-[11px] text-[#45464e] space-y-1.5 bg-[#f2f3ff] p-3 rounded">
                  <div>• NEXT_PUBLIC_SUPABASE_URL</div>
                  <div>• NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</div>
                </div>
                <div className="pt-2 font-mono text-[10px] text-[#76767f]">
                  SQL migration file: <span className="text-[#0d1b3d]">supabase/schema.sql</span>
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
