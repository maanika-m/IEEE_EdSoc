import React from 'react';
import { Instagram, Linkedin, Globe } from 'lucide-react';
import { ChamferButton } from '../ui/ChamferButton';

interface CtaBannerProps {
  onJoinClick?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onJoinClick }) => {
  return (
    <section
      className="bg-[#0d1b3d] text-[#faf8ff] py-16 relative overflow-hidden border-t border-[#964900]/40"
      id="join-chapter"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00184d] border border-[#F58220]/40 clip-button-chamfer mb-6">
          <span className="material-symbols-outlined text-sm text-[#F58220]">how_to_reg</span>
          <span className="font-mono text-xs text-[#ffdcc6]">MEMBERSHIP & ENGAGEMENT</span>
        </div>

        <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
          Interested in joining the chapter?
        </h2>

        <p className="font-sans text-base sm:text-lg text-[#edf0ff]/80 max-w-xl mx-auto mb-8">
          Stay connected with IEEE Education Society activities at SRMIST and participate in upcoming chapter initiatives.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <ChamferButton
            variant="primary"
            onClick={onJoinClick}
            className="px-8 py-3.5 text-sm"
          >
            JOIN THE CHAPTER →
          </ChamferButton>
        </div>

        {/* Permanent Verified Social Links Section */}
        <div className="pt-6 border-t border-[#964900]/20 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <a
            className="border border-[#964900]/40 bg-[#00184d]/60 hover:border-[#ff8928] hover:bg-[#ff8928]/15 hover:text-[#ff8928] text-[#edf0ff]/90 px-4 py-2 clip-button-chamfer transition-all duration-150 flex items-center gap-2 text-xs sm:text-sm font-mono active:translate-y-px group"
            href="https://www.instagram.com/ieee.es_srmist"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow IEEE Education Society SRMIST on Instagram"
          >
            <Instagram className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
            <span>Instagram</span>
          </a>

          <a
            className="border border-[#964900]/40 bg-[#00184d]/60 hover:border-[#ff8928] hover:bg-[#ff8928]/15 hover:text-[#ff8928] text-[#edf0ff]/90 px-4 py-2 clip-button-chamfer transition-all duration-150 flex items-center gap-2 text-xs sm:text-sm font-mono active:translate-y-px group"
            href="https://www.linkedin.com/company/ieee-education-society-srm-chapter/home/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with IEEE Education Society SRMIST on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
          </a>

          <a
            className="border border-[#964900]/40 bg-[#00184d]/60 hover:border-[#ff8928] hover:bg-[#ff8928]/15 hover:text-[#ff8928] text-[#edf0ff]/90 px-4 py-2 clip-button-chamfer transition-all duration-150 flex items-center gap-2 text-xs sm:text-sm font-mono active:translate-y-px group"
            href="https://ieee-edusociety.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit official global IEEE Education Society website"
          >
            <Globe className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
            <span>Official Website</span>
          </a>
        </div>
      </div>
    </section>
  );
};
