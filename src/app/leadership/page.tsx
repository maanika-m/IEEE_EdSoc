import React from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { LeadershipSection } from '../../components/public/LeadershipSection';

interface LeadershipPageProps {
  onNavigate?: (path: string) => void;
}

export default function LeadershipPage({ onNavigate }: LeadershipPageProps) {
  return (
    <div className="bg-[#faf8ff] text-[#151b2a] min-h-screen flex flex-col font-body-md telemetry-grid">
      <Navbar currentPath="/leadership" onNavigate={onNavigate} />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <section className="pt-4 pb-6 border-b border-[#c6c6cf]/30 flex items-center gap-2 font-mono text-xs text-[#76767f]">
            <span>IEEE EDUCATION SOCIETY</span>
            <span>/</span>
            <span>SRMIST STUDENT CHAPTER</span>
            <span>/</span>
            <span className="text-[#0d1b3d] font-semibold">CHAPTER LEADERSHIP & ADVISORY</span>
          </section>

          {/* Full Verified Leadership Roster */}
          <LeadershipSection />

          {/* Chapter Governance & Charter */}
          <section className="mt-8 bg-white border border-[#c6c6cf]/60 clip-qfp-card p-8 sm:p-10 shadow-sm relative">
            <div className="ic-lead-pins absolute top-0 left-8 right-8"></div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#964900] font-bold">
              <span>GOVERNANCE & CHARTER</span>
            </div>
            <h3 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-4">
              Student Chapter Governance
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#45464e] leading-relaxed max-w-3xl mb-6">
              The IEEE Education Society Student Chapter at SRM Institute of Science and Technology operates under the official charter of the IEEE Education Society (Region 10 — Asia and Pacific). The Executive Committee is elected annually to plan technical sessions, workshops, pedagogical initiatives, and student outreach.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2e8fc] font-mono text-xs text-[#45464e]">
              <div>
                <span className="text-[#76767f] block">CHAPTER CODE</span>
                <span className="text-[#0d1b3d] font-bold">CH-ID: 10429</span>
              </div>
              <div>
                <span className="text-[#76767f] block">GEOGRAPHIC UNIT</span>
                <span className="text-[#0d1b3d] font-bold">Region 10 (Asia-Pacific)</span>
              </div>
              <div>
                <span className="text-[#76767f] block">PARENT SECTION</span>
                <span className="text-[#0d1b3d] font-bold">IEEE Madras Section</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
