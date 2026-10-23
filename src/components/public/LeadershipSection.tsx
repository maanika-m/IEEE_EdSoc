
import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { getVisibleMembers } from '../../lib/supabase/queries';
import type { Member } from '../../lib/types/database';

export const JAGADEESH_PHOTO_PATH = '/assets/aistudio/sir_4e8b1d45.jpg';
export const JANSI_PHOTO_PATH = '/assets/aistudio/mam_cc31977a.jpg';

export interface AdvisorProfile {
  name: string;
  role: string;
  designation: string;
  category: string;
  institution: string;
  email: string;
  photoUrl: string;
  initials: string;
}

export interface OfficerProfile {
  name: string;
  role: string;
  category: string;
  institution: string;
  initials: string;
  email: string;
  featured?: boolean;
}

export const DEFAULT_ADVISORS: AdvisorProfile[] = [
  {
    name: 'Dr. Jansi K R',
    role: 'Advisor',
    designation: 'Associate Professor',
    category: 'CHAPTER ADVISORY',
    institution: 'SRM Institute of Science and Technology',
    email: 'jansik@srmist.edu.in',
    photoUrl: JANSI_PHOTO_PATH,
    initials: 'JK',
  },
  {
    name: 'Dr. Jagadeesh M',
    role: 'Faculty Advisor',
    designation: 'Assistant Professor',
    category: 'FACULTY ADVISOR',
    institution: 'SRM Institute of Science and Technology',
    email: 'jagadeem4@srmist.edu.in',
    photoUrl: JAGADEESH_PHOTO_PATH,
    initials: 'JM',
  },
];

export const DEFAULT_OFFICE_BEARERS: OfficerProfile[] = [
  {
    initials: 'PC',
    category: 'EXECUTIVE LEAD',
    name: 'Piyasha Chakraborty',
    role: 'Chair',
    institution: 'SRMIST Student Chapter',
    email: 'pc7882@srmist.edu.in',
    featured: true,
  },
  {
    initials: 'MM',
    category: 'EXECUTIVE LEAD',
    name: 'Maanika Mishra',
    role: 'Vice Chair',
    institution: 'SRMIST Student Chapter',
    email: 'mm4458@srmist.edu.in',
    featured: false,
  },
  {
    initials: 'SK',
    category: 'ADMINISTRATION',
    name: 'Svar Kalavadia',
    role: 'Secretary',
    institution: 'SRMIST Student Chapter',
    email: 'sk8742@srmist.edu.in',
    featured: false,
  },
  {
    initials: 'AR',
    category: 'FINANCE',
    name: 'Archana RG',
    role: 'Treasurer',
    institution: 'SRMIST Student Chapter',
    email: 'ar3946@srmist.edu.in',
    featured: false,
  },
];

export const LeadershipSection: React.FC = () => {
  const [advisors, setAdvisors] = useState<AdvisorProfile[]>(DEFAULT_ADVISORS);
  const [officeBearers] = useState<OfficerProfile[]>(DEFAULT_OFFICE_BEARERS);

  // Sync faculty advisors with the live Supabase members table if populated.
  useEffect(() => {
    let isMounted = true;

    async function loadMembers() {
      try {
        const dbMembers = await getVisibleMembers();

        if (!isMounted || !dbMembers || dbMembers.length === 0) return;

        const dbAdvisors = dbMembers.filter(
          (m: Member) =>
            m.category === 'advisor' ||
            m.role.toLowerCase().includes('advisor')
        );

        if (dbAdvisors.length > 0) {
          const mapped = dbAdvisors.map((m: Member) => {
            let photo = m.photo_url || '';

            if (m.name.toLowerCase().includes('jagadeesh')) {
              photo = photo || JAGADEESH_PHOTO_PATH;
            } else if (m.name.toLowerCase().includes('jansi')) {
              photo = photo || JANSI_PHOTO_PATH;
            }

            let email = 'contact@srmist.edu.in';

            if (m.bio && m.bio.includes('@')) {
              const match = m.bio.match(
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
              );

              if (match) email = match[0];
            } else if (m.name.toLowerCase().includes('jagadeesh')) {
              email = 'jagadeem4@srmist.edu.in';
            } else if (m.name.toLowerCase().includes('jansi')) {
              email = 'jansik@srmist.edu.in';
            }

            return {
              name: m.name,
              role: m.role,
              designation: m.designation || 'Faculty Member',
              category: m.role.toLowerCase().includes('faculty')
                ? 'FACULTY ADVISOR'
                : 'CHAPTER ADVISORY',
              institution: 'SRM Institute of Science and Technology',
              email,
              photoUrl: photo,
              initials: m.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase(),
            };
          });

          // Keep Dr. Jansi K R first and Dr. Jagadeesh M second.
          mapped.sort((a, b) => {
            const aIsJansi = a.name.toLowerCase().includes('jansi');
            const bIsJansi = b.name.toLowerCase().includes('jansi');

            if (aIsJansi && !bIsJansi) return -1;
            if (!aIsJansi && bIsJansi) return 1;

            return 0;
          });

          setAdvisors(mapped);
        }
      } catch {
        // Retain the verified default advisors if the network request fails.
      }
    }

    loadMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="py-24 bg-[#faf8ff] relative pcb-substrate-grid"
      id="leadership"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeader
          number="05"
          category="CHAPTER LEADERSHIP & ADVISORY"
          title="Chapter Leadership & Advisory"
          description="Official faculty advisory and elected student office bearers of the IEEE Education Society Student Chapter at SRMIST."
        />

        {/* Subsection 1: Faculty Advisory */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs text-[#964900] font-bold tracking-wider uppercase">
              01 // CHAPTER FACULTY ADVISORY
            </span>
            <div className="h-px bg-[#c6c6cf]/60 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {advisors.map((adv) => (
              <div
                key={adv.name}
                className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 sm:p-7 shadow-sm hover:border-[#ff8928] hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between"
              >
                <div className="ic-pins-top w-full mb-4" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden border-2 border-[#0d1b3d]/15 shadow-sm group-hover:border-[#ff8928] transition-colors relative bg-[#0d1b3d]">
                    <img
                      src={adv.photoUrl}
                      alt={`${adv.name} - ${adv.role}`}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#964900] bg-[#ff8928]/10 border border-[#ff8928]/20 px-2 py-0.5 rounded-xs inline-block mb-1.5">
                      {adv.category}
                    </span>

                    <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#151b2a] leading-tight group-hover:text-[#0d1b3d] transition-colors">
                      {adv.name}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm font-semibold text-[#0d1b3d] mt-1">
                      {adv.role}
                    </p>

                    <p className="font-sans text-xs text-[#45464e] mt-0.5">
                      {adv.designation} • {adv.institution}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#f0f2fa] flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${adv.email}`}
                    className="inline-flex min-w-0 items-center gap-2 font-mono text-xs text-[#0d1b3d] hover:text-[#ff8928] transition-colors group/link"
                    title={`Send email to ${adv.name} (${adv.email})`}
                  >
                    <span className="w-6 h-6 rounded bg-[#ff8928]/10 text-[#ff8928] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[15px]">
                        mail
                      </span>
                    </span>
                    <span className="underline decoration-dotted underline-offset-4 group-hover/link:decoration-solid break-all">
                      {adv.email}
                    </span>
                  </a>

                  <span className="hidden sm:inline-block font-mono text-[10px] text-[#76767f] uppercase">
                    SRMIST Kattankulathur
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subsection 2: Student Office Bearers */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs text-[#964900] font-bold tracking-wider uppercase">
              02 // STUDENT OFFICE BEARERS
            </span>
            <div className="h-px bg-[#c6c6cf]/60 flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeBearers.map((officer) => (
              <div
                key={officer.name}
                className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 shadow-sm hover:border-[#ff8928] transition-all duration-200 min-w-0"
              >
                <div
                  className={`w-full mb-4 ${
                    officer.featured ? 'ic-pins-gold' : 'ic-pins-top'
                  }`}
                />

                <div className="w-12 h-12 mb-3 bg-[#0d1b3d] text-[#ff8928] border border-[#ff8928]/40 clip-button-chamfer flex items-center justify-center font-poppins font-bold text-base">
                  {officer.initials}
                </div>

                <span className="font-mono text-[10px] text-[#964900] font-semibold uppercase">
                  {officer.category}
                </span>

                <h3 className="font-poppins font-bold text-lg text-[#151b2a] mt-1">
                  {officer.name}
                </h3>

                <p className="font-mono text-xs text-[#45464e]">
                  {officer.role}
                </p>

                <p className="font-mono text-[10px] text-[#76767f] mt-0.5">
                  {officer.institution}
                </p>

                {/* Clickable Core Team Email */}
                <a
                  href={`mailto:${officer.email}`}
                  className="mt-3 inline-flex max-w-full min-w-0 items-start gap-2 font-mono text-xs text-[#0d1b3d] hover:text-[#ff8928] transition-colors"
                  title={`Send email to ${officer.name} (${officer.email})`}
                >
                  <span className="material-symbols-outlined text-[15px] shrink-0">
                    mail
                  </span>
                  <span className="break-all underline decoration-dotted underline-offset-4">
                    {officer.email}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
