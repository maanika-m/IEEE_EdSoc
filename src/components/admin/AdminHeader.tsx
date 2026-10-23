import React from 'react';
import type { AdminProfile } from '../../lib/types/database';

interface AdminHeaderProps {
  profile?: AdminProfile | null;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ profile, onNavigate, onSignOut }) => {
  // Determine display name and initials
  const displayName = profile?.full_name || 'Chapter Officer';
  const roleLabel = profile?.role === 'admin' ? 'Administrator' : 'Chapter Officer';
  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <header className="bg-[#0d1b3d] text-[#faf8ff] sticky top-0 z-50 px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-[#ff8928] text-white flex items-center justify-center font-headline-sm font-bold shadow-sm">
            <span className="material-symbols-outlined text-xl">account_balance</span>
          </span>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm sm:text-base font-bold tracking-tight text-white">
              IEEE EdSoc SRMIST
            </span>
            <span className="font-mono text-[10px] text-[#ffdcc6] tracking-wider">
              CHAPTER ADMIN PANEL
            </span>
          </div>
        </div>

        <div className="hidden md:flex h-5 w-px bg-white/20 ml-2"></div>

        <a
          href="/"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('/');
            }
          }}
          className="hidden md:inline-flex items-center gap-1.5 font-mono text-xs text-[#c6c6cf] hover:text-white transition-colors duration-150"
        >
          <span>View Public Website</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </a>
      </div>

      {/* OFFICER PROFILE & SIGN OUT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 pr-2">
          <div className="w-8 h-8 rounded-full bg-[#964900] text-white font-headline-sm text-[13px] font-bold flex items-center justify-center border border-[#ffdcc6]/40">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-sans text-xs font-semibold text-white leading-tight">
              {displayName}
            </span>
            <span className="font-mono text-[10px] text-[#ffdcc6]/80">
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-white/20"></div>

        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[#c6c6cf] hover:text-white hover:bg-white/10 font-mono text-xs transition-all duration-150 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
