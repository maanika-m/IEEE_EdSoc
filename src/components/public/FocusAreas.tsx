import React from 'react';

export const FocusAreas: React.FC = () => {
  return (
    <section className="relative overflow-hidden" id="focus-areas">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Deep Navy Pull Statement */}
        <div className="lg:col-span-6 bg-[#0d1b3d] text-[#faf8ff] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative pcb-substrate-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#F58220] pulse-solder"></div>
            <span className="font-mono text-xs text-[#ffdcc6] tracking-widest uppercase font-semibold">
              02 // WHAT WE FOCUS ON
            </span>
          </div>

          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-white mb-6">
            What We Focus On
          </h2>

          <blockquote className="font-sans text-base sm:text-lg text-[#edf0ff]/90 leading-relaxed mb-8 border-l-2 border-[#F58220] pl-4 italic">
            "Learning. Building. Sharing. Creating opportunities for students to explore engineering education, participate in technical activities, collaborate with peers, and engage with the IEEE Education Society community."
          </blockquote>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs text-[#c6c6cf]">
            <div className="border border-[#dde2f7]/20 p-3.5 bg-[#00184d]/30">
              <span className="text-[#ffdcc6] font-bold block mb-1">01 / ENGAGEMENT</span>
              Student-led academic activities & discussions.
            </div>
            <div className="border border-[#dde2f7]/20 p-3.5 bg-[#00184d]/30">
              <span className="text-[#ffdcc6] font-bold block mb-1">02 / PEDAGOGY</span>
              Advancing engineering learning methodologies.
            </div>
          </div>
        </div>

        {/* Right Side: 3 Factual Focus Pillars */}
        <div className="lg:col-span-6 bg-[#f2f3ff] text-[#151b2a] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative pcb-substrate-grid border-l border-[#c6c6cf]/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#F58220] pulse-solder"></div>
            <span className="font-mono text-xs text-[#964900] tracking-widest uppercase font-semibold">
              CHAPTER FOCUS // CORE PILLARS
            </span>
          </div>

          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-[#151b2a] mb-6">
            Core Chapter Pillars
          </h2>

          <div className="space-y-5">
            {/* Pillar 1: Engineering Education */}
            <div className="bg-[#ffffff] border border-[#c6c6cf]/60 p-5 clip-button-chamfer shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 bg-[#0d1b3d] text-[#F58220] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a] flex items-center gap-2">
                  01 — Engineering Education
                  <span className="material-symbols-outlined text-sm text-[#F58220]">check_box</span>
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#45464e] mt-1 leading-relaxed">
                  Improving how engineering and technical knowledge is learned, taught, communicated, and developed.
                </p>
              </div>
            </div>

            {/* Pillar 2: Technical & Professional Development */}
            <div className="bg-[#ffffff] border border-[#c6c6cf]/60 p-5 clip-button-chamfer shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 bg-[#0d1b3d] text-[#F58220] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">terminal</span>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a] flex items-center gap-2">
                  02 — Technical & Professional Development
                  <span className="material-symbols-outlined text-sm text-[#F58220]">check_box</span>
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#45464e] mt-1 leading-relaxed">
                  Creating opportunities for technical learning, educational sessions, workshops, seminars, networking, and professional development.
                </p>
              </div>
            </div>

            {/* Pillar 3: Community, Outreach & Student Leadership */}
            <div className="bg-[#ffffff] border border-[#c6c6cf]/60 p-5 clip-button-chamfer shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 bg-[#0d1b3d] text-[#F58220] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-lg text-[#151b2a] flex items-center gap-2">
                  03 — Community, Outreach & Student Leadership
                  <span className="material-symbols-outlined text-sm text-[#F58220]">check_box</span>
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#45464e] mt-1 leading-relaxed">
                  Building local connections, encouraging participation, supporting educational outreach, and developing student leadership within the IEEE community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
