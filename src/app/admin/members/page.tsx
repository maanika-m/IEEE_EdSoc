import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminFooter } from '../../../components/admin/AdminFooter';
import { getVisibleMembers } from '../../../lib/supabase/queries';
import type { AdminProfile, Member } from '../../../lib/types/database';

export const JAGADEESH_PHOTO_PATH = '/assets/aistudio/sir_4e8b1d45.jpg';
export const JANSI_PHOTO_PATH = '/assets/aistudio/mam_cc31977a.jpg';

interface AdminMembersPageProps {
  profile?: AdminProfile | null;
  onNavigate: (path: string) => void;
  onSignOut?: () => void;
}

interface MemberRow {
  name: string;
  role: string;
  designation: string;
  category: string;
  affiliation: string;
  email?: string;
  photoUrl?: string;
  initials: string;
  status: string;
}

const DEFAULT_MEMBERS: MemberRow[] = [
  {
    name: 'Dr. Jansi K R',
    role: 'Advisor',
    designation: 'Associate Professor',
    category: 'CHAPTER ADVISORY',
    affiliation: 'SRMIST Kattankulathur',
    email: 'jansik@srmist.edu.in',
    photoUrl: JANSI_PHOTO_PATH,
    initials: 'JK',
    status: 'Active Advisor',
  },
  {
    name: 'Dr. Jagadeesh M',
    role: 'Faculty Advisor',
    designation: 'Assistant Professor',
    category: 'CHAPTER ADVISORY',
    affiliation: 'SRMIST Kattankulathur',
    email: 'jagadeem4@srmist.edu.in',
    photoUrl: JAGADEESH_PHOTO_PATH,
    initials: 'JM',
    status: 'Active Advisor',
  },
  {
    name: 'Piyasha Chakraborty',
    role: 'Chair',
    designation: 'Undergraduate Scholar',
    category: 'EXECUTIVE LEAD',
    affiliation: 'SRMIST Student Chapter',
    initials: 'PC',
    status: 'Elected Officer',
  },
  {
    name: 'Maanika Mishra',
    role: 'Vice Chair',
    designation: 'Undergraduate Scholar',
    category: 'EXECUTIVE LEAD',
    affiliation: 'SRMIST Student Chapter',
    initials: 'MM',
    status: 'Elected Officer',
  },
  {
    name: 'Svar Kalavadia',
    role: 'Secretary',
    designation: 'Undergraduate Scholar',
    category: 'ADMINISTRATION',
    affiliation: 'SRMIST Student Chapter',
    initials: 'SK',
    status: 'Elected Officer',
  },
  {
    name: 'Archana RG',
    role: 'Treasurer',
    designation: 'Undergraduate Scholar',
    category: 'FINANCE',
    affiliation: 'SRMIST Student Chapter',
    initials: 'AR',
    status: 'Elected Officer',
  },
];

export default function AdminMembersPage({ profile, onNavigate, onSignOut }: AdminMembersPageProps) {
  const [members, setMembers] = useState<MemberRow[]>(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchRoster() {
      setLoading(true);
      try {
        const dbMembers = await getVisibleMembers();
        if (!isMounted || !dbMembers || dbMembers.length === 0) {
          setLoading(false);
          return;
        }

        const mapped: MemberRow[] = dbMembers.map((m: Member) => {
          let photo = m.photo_url || undefined;
          let email = undefined;

          if (m.name.toLowerCase().includes('jagadeesh')) {
            photo = photo || JAGADEESH_PHOTO_PATH;
            email = 'jagadeem4@srmist.edu.in';
          } else if (m.name.toLowerCase().includes('jansi')) {
            photo = photo || JANSI_PHOTO_PATH;
            email = 'jansik@srmist.edu.in';
          }

          if (m.bio && m.bio.includes('@')) {
            const match = m.bio.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (match) email = match[0];
          }

          return {
            name: m.name,
            role: m.role,
            designation: m.designation,
            category: m.category === 'advisor' ? 'CHAPTER ADVISORY' : 'EXECUTIVE COMMITTEE',
            affiliation: 'SRMIST Kattankulathur',
            email,
            photoUrl: photo,
            initials: m.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase(),
            status: m.is_visible ? 'Active Member' : 'Inactive',
          };
        });

        // Deterministic sort: Dr. Jansi K R first, then Dr. Jagadeesh M, then student office bearers
        mapped.sort((a, b) => {
          const getRank = (m: MemberRow) => {
            const lowerName = m.name.toLowerCase();
            if (lowerName.includes('jansi')) return 1;
            if (lowerName.includes('jagadeesh')) return 2;
            if (m.category === 'CHAPTER ADVISORY') return 3;
            if (m.role.toLowerCase() === 'chair') return 4;
            if (m.role.toLowerCase().includes('vice')) return 5;
            if (m.role.toLowerCase().includes('secretary')) return 6;
            if (m.role.toLowerCase().includes('treasurer')) return 7;
            return 8;
          };
          return getRank(a) - getRank(b);
        });

        setMembers(mapped);
      } catch {
        // Fall back to default
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRoster();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] font-body-md antialiased min-h-screen flex flex-col selection:bg-[#ff8928] selection:text-white">
      <AdminHeader
        profile={profile}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />

      <div className="flex flex-1 w-full max-w-[1720px] mx-auto">
        <AdminSidebar currentPath="/admin/members" onNavigate={onNavigate} />

        <main className="flex-1 p-6 lg:p-10 space-y-8 grid-bg overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8928]"></span>
                <span className="font-mono text-xs text-[#964900] uppercase font-bold tracking-wider">
                  OFFICIAL ROSTER
                </span>
              </div>
              <h1 className="font-headline-lg text-3xl font-bold text-[#151b2a]">
                Chapter Leadership & Roster
              </h1>
              <p className="font-sans text-sm text-[#45464e] mt-0.5">
                Official faculty advisory and elected student office bearers for IEEE Education Society Student Chapter at SRMIST.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#76767f] bg-white border border-[#c6c6cf]/60 px-3 py-1.5 rounded">
                Total Members: <strong className="text-[#0d1b3d]">{members.length}</strong>
              </span>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white border border-[#e2e8fc] rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f3ff] border-b border-[#e2e8fc] text-[#45464e] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-semibold">Member / Advisor</th>
                    <th className="py-3.5 px-6 font-semibold">Role</th>
                    <th className="py-3.5 px-6 font-semibold">Designation</th>
                    <th className="py-3.5 px-6 font-semibold">Contact / Email</th>
                    <th className="py-3.5 px-6 font-semibold">Category</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr
                      key={m.name}
                      className="border-b border-[#e2e8fc] hover:bg-[#f2f3ff]/50 transition-colors text-xs font-sans"
                    >
                      <td className="py-4 px-6 font-semibold text-[#151b2a]">
                        <div className="flex items-center gap-3">
                          {m.photoUrl ? (
                            <img
                              src={m.photoUrl}
                              alt={m.name}
                              className="w-10 h-10 rounded-md object-cover object-top border border-slate-200 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-[#0d1b3d] text-[#ff8928] flex items-center justify-center font-poppins font-bold text-xs shrink-0">
                              {m.initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-sm text-[#0d1b3d]">{m.name}</div>
                            <div className="font-mono text-[11px] text-[#76767f]">{m.affiliation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-[#0d1b3d] font-semibold">{m.role}</td>
                      <td className="py-4 px-6 text-[#45464e]">{m.designation}</td>
                      <td className="py-4 px-6 font-mono text-xs">
                        {m.email ? (
                          <a
                            href={`mailto:${m.email}`}
                            className="text-[#002855] hover:text-[#ff8928] underline decoration-dotted transition-colors flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm text-[#ff8928]">mail</span>
                            <span>{m.email}</span>
                          </a>
                        ) : (
                          <span className="text-[#c6c6cf] italic">Internal</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#964900] text-[11px] font-medium">{m.category}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AdminFooter />
    </div>
  );
}
