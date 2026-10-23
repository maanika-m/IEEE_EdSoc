import React from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { LineageSection } from '../../components/public/LineageSection';

interface ResourcesPageProps {
  onNavigate?: (path: string) => void;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  return (
    <div className="bg-[#faf8ff] text-[#151b2a] min-h-screen flex flex-col font-body-md telemetry-grid">
      <Navbar currentPath="/resources" onNavigate={onNavigate} />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <section className="pt-4 pb-6 border-b border-[#c6c6cf]/30 flex items-center gap-2 font-mono text-xs text-[#76767f]">
            <span>IEEE EDUCATION SOCIETY</span>
            <span>/</span>
            <span>SRMIST STUDENT CHAPTER</span>
            <span>/</span>
            <span className="text-[#0d1b3d] font-semibold">RESEARCH & EDUCATIONAL RESOURCES</span>
          </section>

          {/* Header */}
          <section className="py-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#f2f3ff] border border-[#c6c6cf]/40 mb-4">
              <span className="font-mono text-xs text-[#964900] tracking-widest uppercase font-semibold">
                04 // KNOWLEDGE & PEDAGOGY
              </span>
            </div>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0d1b3d] mb-4">
              Research & Technical Resources
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#45464e] max-w-2xl leading-relaxed">
              Curated pedagogical archives, educational research standards, and instructional design tools supporting engineering scholarship at SRMIST.
            </p>
          </section>

          {/* Lineage & Roots */}
          <div className="mb-14">
            <LineageSection />
          </div>

          {/* Research & Publications Framework */}
          <section className="mb-14 bg-white border border-[#c6c6cf]/60 clip-qfp-card p-8 sm:p-10 shadow-sm relative">
            <div className="ic-lead-pins absolute top-0 left-8 right-8"></div>
            <h3 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-3">
              IEEE Education Society Publications & Conferences
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#45464e] max-w-3xl mb-8 leading-relaxed">
              Access to world-class journals and premier conferences dedicated to advances in engineering education and technical instructional methods.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#f2f3ff] border border-[#c6c6cf]/50 clip-button-chamfer">
                <span className="font-mono text-xs text-[#964900] font-bold block mb-1">TRANSACTIONS</span>
                <h4 className="font-poppins font-bold text-base text-[#0d1b3d] mb-2">IEEE Transactions on Education</h4>
                <p className="font-sans text-xs text-[#45464e]">Premier archival journal publishing educational research, course design, and pedagogical evaluation.</p>
              </div>

              <div className="p-5 bg-[#f2f3ff] border border-[#c6c6cf]/50 clip-button-chamfer">
                <span className="font-mono text-xs text-[#964900] font-bold block mb-1">FLAGSHIP CONFERENCE</span>
                <h4 className="font-poppins font-bold text-base text-[#0d1b3d] mb-2">IEEE FIE (Frontiers in Education)</h4>
                <p className="font-sans text-xs text-[#45464e]">Major international conference fostering dialogue on innovation in engineering and computing curricula.</p>
              </div>

              <div className="p-5 bg-[#f2f3ff] border border-[#c6c6cf]/50 clip-button-chamfer">
                <span className="font-mono text-xs text-[#964900] font-bold block mb-1">REGIONAL FORUM</span>
                <h4 className="font-poppins font-bold text-base text-[#0d1b3d] mb-2">IEEE EDUCON & TALE</h4>
                <p className="font-sans text-xs text-[#45464e]">Global engineering education conferences spotlighting innovative teaching methodologies and laboratory experiences.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
