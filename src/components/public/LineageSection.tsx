import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { LogoPlaceholder } from '../ui/LogoPlaceholder';

export const LineageSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#faf8ff] relative pcb-substrate-grid" id="lineage">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeader
          number="01"
          category="LINEAGE & ROOTS"
          title="How We Fit Into IEEE"
          description="From a global professional organization to the IEEE Education Society and its student chapter at SRMIST."
        />

        {/* Verified Institutional Logos (SRMIST + IEEE Education Society) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <LogoPlaceholder type="srmist" variant="card" />
          <LogoPlaceholder type="edsoc" variant="card" />
        </div>

        {/* 3 Nodes: IEEE -> EdSoc -> SRMIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12">
          {/* Node 1: IEEE */}
          <div className="bg-[#ffffff] border border-[#c6c6cf]/60 clip-qfp-card p-6 shadow-sm hover:border-[#F58220] transition-all duration-200 flex flex-col justify-between relative group">
            <div className="ic-pins-top w-full mb-4"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] bg-[#e9edff] px-2.5 py-1 text-[#151b2a] font-semibold tracking-wider">
                  GLOBAL PARENT
                </span>
                <span className="font-mono text-[10px] text-[#76767f]">NODE 01</span>
              </div>
              <h3 className="font-poppins font-bold text-2xl text-[#151b2a] mb-2">IEEE</h3>
              <p className="font-sans text-xs sm:text-sm text-[#45464e] leading-relaxed">
                Institute of Electrical and Electronics Engineers. The world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#e9edff] font-mono text-[10px] text-[#76767f] font-medium">
              Global Technical Organization
            </div>
          </div>

          {/* Node 2: IEEE Education Society */}
          <div className="bg-[#ffffff] border border-[#c6c6cf]/60 clip-qfp-card p-6 shadow-sm hover:border-[#F58220] transition-all duration-200 flex flex-col justify-between relative group">
            <div className="ic-pins-top w-full mb-4"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] bg-[#F58220]/15 text-[#964900] px-2.5 py-1 font-semibold tracking-wider">
                  TECHNICAL SOCIETY
                </span>
                <span className="font-mono text-[10px] text-[#76767f]">NODE 02</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-[#151b2a] mb-2">
                IEEE Education Society
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#45464e] leading-relaxed">
                Dedicated society focused on engineering and technology education, educational methods, instructional design, educational technology, and professional development worldwide.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#e9edff] font-mono text-[10px] text-[#76767f] font-medium">
              Field of Interest: Education & Pedagogy
            </div>
          </div>

          {/* Node 3: SRMIST Chapter (Emphasized) */}
          <div className="bg-[#0d1b3d] text-[#faf8ff] border border-[#F58220]/80 clip-qfp-card p-6 shadow-md hover:shadow-[#F58220]/20 transition-all duration-200 flex flex-col justify-between relative group">
            <div className="ic-pins-gold w-full mb-4"></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] bg-[#F58220] text-white px-2.5 py-1 font-bold tracking-wider">
                  LOCAL CHAPTER
                </span>
                <span className="font-mono text-[10px] text-[#ffdcc6]">NODE 03</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-white mb-2">
                IEEE EdSoc Student Chapter — SRMIST
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#edf0ff]/85 leading-relaxed">
                The student chapter at SRM Institute of Science and Technology (Region 10 — Asia and Pacific), advancing IEEE Education Society objectives locally through student-led activities.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-[#dde2f7]/20 font-mono text-[10px] text-[#ffdcc6] font-bold">
              Region 10 (Asia-Pacific) • Student Chapter
            </div>
          </div>
        </div>

        {/* Compact Historical Milestone Line */}
        <div className="bg-[#f2f3ff] border border-[#c6c6cf]/50 p-4 clip-button-chamfer flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-[#45464e] text-center">
          <span className="font-semibold text-[#151b2a]">1957</span>
          <span>— Education Society origins</span>
          <span className="text-[#c6c6cf] hidden sm:inline">·</span>
          <span className="font-semibold text-[#151b2a]">1963</span>
          <span>— IEEE formed</span>
          <span className="text-[#c6c6cf] hidden sm:inline">·</span>
          <span className="font-semibold text-[#151b2a]">1978</span>
          <span>— IEEE Education Society name adopted</span>
          <span className="text-[#c6c6cf] hidden sm:inline">·</span>
          <span className="font-semibold text-[#F58220]">2024</span>
          <span>— SRMIST Student Chapter established</span>
        </div>
      </div>
    </section>
  );
};
