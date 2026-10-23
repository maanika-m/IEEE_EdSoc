import React from 'react';
import { ChamferButton } from '../ui/ChamferButton';

interface HeroProps {
  onJoinClick?: () => void;
  onMeetTeamClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onMeetTeamClick }) => {
  return (
    <section
      className="relative bg-[#0d1b3d] text-[#faf8ff] pt-20 pb-24 overflow-hidden border-b border-[#0d1b3d]"
      id="about"
    >
      {/* Circuit Grid & SVG Traces Substrate */}
      <div className="absolute inset-0 pcb-substrate-dark opacity-40 pointer-events-none"></div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none stroke-[#F58220]/15 stroke-[1.25] fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,120 L280,120 L340,180 L800,180" />
        <path d="M600,40 L680,120 L950,120 L1020,190 L1400,190" />
        <path d="M120,400 L240,400 L300,340 L650,340" />
        <circle className="fill-[#F58220]" cx="280" cy="120" r="3.5" />
        <circle className="fill-[#F58220]" cx="340" cy="180" r="3.5" />
        <circle className="fill-[#F58220]" cx="680" cy="120" r="3.5" />
        <circle className="fill-[#F58220]" cx="300" cy="340" r="3.5" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* Section Node Anchor */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3.5 h-3.5 rounded-full bg-[#F58220] pulse-solder flex items-center justify-center -ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          {/* Eyebrow Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00184d]/80 border border-[#F58220]/40 clip-button-chamfer">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[10px] text-[#ffdcc6] tracking-widest uppercase font-semibold">
              IEEE EDUCATION SOCIETY STUDENT CHAPTER • SRMIST KATTANKULATHUR
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="max-w-4xl">
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Engineering the Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58220] via-[#ffdcc6] to-white">
              Technical Education.
            </span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#edf0ff]/90 max-w-2xl leading-relaxed mb-10">
            Advancing technical learning, academic and engineering education, student collaboration, and research-oriented engagement under IEEE Education Society standards at SRMIST.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <ChamferButton
              variant="primary"
              href="#join-chapter"
              onClick={onJoinClick}
              icon="arrow_forward"
              className="px-7 py-3.5 text-sm"
            >
              JOIN CHAPTER
            </ChamferButton>

            <a
              href="#leadership"
              onClick={(e) => {
                if (onMeetTeamClick) {
                  e.preventDefault();
                  onMeetTeamClick();
                }
              }}
              className="inline-flex items-center gap-2 border border-[#dde2f7]/40 hover:border-[#F58220] bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 clip-button-chamfer font-mono text-xs tracking-wider transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[#F58220] text-base">group</span>
              <span>MEET THE TEAM</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
