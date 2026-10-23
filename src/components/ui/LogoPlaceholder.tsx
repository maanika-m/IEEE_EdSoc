import React from 'react';

export const SRMIST_LOGO_PATH = '/assets/aistudio/srm_2d80ef8c.png';
export const IEEE_EDSOC_LOGO_PATH = '/assets/aistudio/ieeeeducationsociety-cropped_15876e50.png';

interface LogoPlaceholderProps {
  type: 'edsoc' | 'srmist';
  variant?: 'nav' | 'hero' | 'card' | 'footer';
  className?: string;
}

/**
 * Official Brand Logo Component for SRMIST & IEEE Education Society.
 * - SRMIST logo preserved at original baseline dimensions.
 * - IEEE Education Society logo scaled to ~1.3-1.4x for enhanced visual weight and prominence.
 */
export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  type,
  variant = 'nav',
  className = '',
}) => {
  const isEdSoc = type === 'edsoc';
  const logoSrc = isEdSoc ? IEEE_EDSOC_LOGO_PATH : SRMIST_LOGO_PATH;
  const logoAlt = isEdSoc
    ? 'IEEE Education Society'
    : 'SRM Institute of Science and Technology';

  if (variant === 'nav') {
    return (
      <div
        className={`${
          isEdSoc
            ? 'h-[40px] sm:h-[45px] md:h-[48px] px-3 py-1'
            : 'h-8 sm:h-9 md:h-9.5 px-2.5 py-1'
        } bg-white rounded flex items-center justify-center shadow-xs select-none ${className}`}
      >
        <img
          src={logoSrc}
          alt={logoAlt}
          className={`h-full w-auto ${
            isEdSoc
              ? 'max-w-[160px] sm:max-w-[190px] md:max-w-[210px]'
              : 'max-w-[130px] sm:max-w-[150px]'
          } object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`${
          isEdSoc
            ? 'h-[40px] sm:h-[45px] md:h-[48px] px-3.5 py-1'
            : 'h-8 sm:h-9 md:h-9.5 px-3 py-1'
        } bg-white rounded flex items-center justify-center shadow-xs select-none ${className}`}
      >
        <img
          src={logoSrc}
          alt={logoAlt}
          className={`h-full w-auto ${
            isEdSoc
              ? 'max-w-[160px] sm:max-w-[195px] md:max-w-[215px]'
              : 'max-w-[130px] sm:max-w-[150px]'
          } object-contain`}
          loading="lazy"
        />
      </div>
    );
  }

  // Card presentation variant for Lineage and Institutional hierarchy
  return (
    <div
      className={`bg-white border border-[#c6c6cf]/80 clip-button-chamfer p-4 sm:p-5 flex items-center justify-between shadow-xs ${className}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`${
            isEdSoc ? 'h-16 w-36 sm:w-44' : 'h-12 w-28 sm:w-36'
          } bg-white p-1 rounded border border-slate-100 flex items-center justify-center shrink-0`}
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <p className="font-poppins font-bold text-sm text-[#151b2a] leading-tight">
            {isEdSoc
              ? 'IEEE Education Society'
              : 'SRM Institute of Science and Technology'}
          </p>
          <p className="font-mono text-[10px] text-[#76767f] mt-0.5">
            {isEdSoc
              ? 'Official Society Emblem (Region 10)'
              : 'Official University Crest & Seal (Deemed University)'}
          </p>
        </div>
      </div>
      <span
        className={`font-mono text-[9px] font-bold px-2 py-1 uppercase tracking-wider shrink-0 ${
          isEdSoc ? 'text-[#964900] bg-[#ff8928]/15' : 'text-[#002855] bg-[#e9edff]'
        }`}
      >
        {isEdSoc ? 'NODE 02 // VERIFIED' : 'NODE 03 // VERIFIED'}
      </span>
    </div>
  );
};

/**
 * Unified Header Dual Logo Lockup.
 * Required order (left to right):
 * 1. Official SRMIST Logo (at current baseline size)
 * 2. Official IEEE Education Society Logo (scaled 1.3-1.4x larger)
 *
 * Size, spacing, and alignment:
 * - SRMIST: h-7 sm:h-8 md:h-[34px] lg:h-[35px] (current baseline)
 * - IEEE EdSoc: h-[38px] sm:h-[43px] md:h-[46px] lg:h-[48px] (~1.35x current height)
 * - Vertical Divider: h-6 sm:h-7 md:h-8 w-px bg-slate-300
 * - Horizontal separation: ~12-16px total gap between logos
 * - Container: White background with balanced padding and rounded corners
 */
export const HeaderDualLogos: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-md shadow-xs border border-white/30 select-none ${className}`}
    >
      {/* 1. Official SRMIST Logo (Left - baseline size preserved) */}
      <img
        src={SRMIST_LOGO_PATH}
        alt="SRM Institute of Science and Technology"
        className="h-7 sm:h-8 md:h-[34px] lg:h-[35px] w-auto object-contain max-w-[115px] sm:max-w-[145px] md:max-w-[165px]"
        loading="eager"
      />

      {/* Vertical Divider with balanced horizontal separation */}
      <div className="h-6 sm:h-7 md:h-8 w-px bg-slate-300 mx-1.5 sm:mx-2 md:mx-2.5 shrink-0"></div>

      {/* 2. Official IEEE Education Society Logo (Right - 1.35x enlarged size) */}
      <img
        src={IEEE_EDSOC_LOGO_PATH}
        alt="IEEE Education Society"
        className="h-[38px] sm:h-[43px] md:h-[46px] lg:h-[48px] w-auto object-contain max-w-[145px] sm:max-w-[180px] md:max-w-[205px]"
        loading="eager"
      />
    </div>
  );
};
