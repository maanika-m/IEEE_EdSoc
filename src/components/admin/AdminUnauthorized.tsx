import React from 'react';
import { LogoPlaceholder } from '../ui/LogoPlaceholder';
import { ChamferButton } from '../ui/ChamferButton';

interface AdminUnauthorizedProps {
  email?: string;
  userId?: string;
  onSignOut: () => void;
  onNavigate: (path: string) => void;
}

export const AdminUnauthorized: React.FC<AdminUnauthorizedProps> = ({
  email,
  userId,
  onSignOut,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-[#0d1b3d] text-white flex flex-col justify-between pcb-substrate-dark font-body-md antialiased">
      {/* Top Bar */}
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="flex items-center gap-2 text-xs font-mono text-[#c6c6cf] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Public Website</span>
        </a>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <LogoPlaceholder type="srmist" variant="nav" />
          <LogoPlaceholder type="edsoc" variant="nav" />
        </div>
      </header>

      {/* Main Unauthorized Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white text-[#151b2a] border border-[#c6c6cf]/60 clip-qfp-card p-8 sm:p-10 shadow-2xl relative">
          <div className="ic-pins-gold absolute top-0 left-6 right-6"></div>

          {/* Solder node header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-mono text-[10px] text-red-600 uppercase font-bold tracking-widest">
              SECURITY PROTOCOL • 403 RESTRICTED
            </span>
          </div>

          <h2 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-1">
            Officer Authorization Required
          </h2>
          <p className="font-sans text-xs text-[#45464e] mb-6">
            Authentication was successful, but your account is not registered as an active Chapter Administrator in the registry.
          </p>

          {/* Diagnostic Box */}
          <div className="bg-[#f2f3ff] border border-[#e2e8fc] p-4 rounded mb-6 font-mono text-xs space-y-2">
            <div className="flex items-start justify-between text-[11px]">
              <span className="text-[#76767f]">AUTHENTICATED ACCOUNT:</span>
              <span className="font-semibold text-[#0d1b3d] truncate max-w-[240px]">{email || 'Unknown User'}</span>
            </div>
            {userId && (
              <div className="flex items-start justify-between text-[10px]">
                <span className="text-[#76767f]">USER UUID:</span>
                <span className="text-[#45464e] truncate max-w-[240px]">{userId}</span>
              </div>
            )}
            <div className="flex items-start justify-between text-[11px] pt-1 border-t border-[#e2e8fc]">
              <span className="text-[#76767f]">REGISTRY RECORD:</span>
              <span className="text-red-600 font-bold">public.admin_profiles: MISSING OR INACTIVE</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 font-sans text-xs text-[#964900] leading-relaxed mb-6">
            To gain access to the Chapter Admin Console, your user ID must be provisioned in the <code className="font-mono text-[11px] bg-amber-100 px-1 py-0.5 rounded">admin_profiles</code> database table by the Faculty Advisor or Chapter Chair.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#e2e8fc]">
            <button
              type="button"
              onClick={onSignOut}
              className="chamfer-btn flex-1 py-2.5 bg-[#964900] hover:bg-[#7a3b00] text-white font-headline-sm text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out Account</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="chamfer-btn-outline flex-1 py-2.5 border border-[#c6c6cf] hover:border-[#0d1b3d] text-[#0d1b3d] font-headline-sm text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Public Website</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center font-mono text-xs text-[#c6c6cf]/60 border-t border-white/10">
        IEEE Education Society Student Chapter [CH-ID: 10429] • Access Control Protocol
      </footer>
    </div>
  );
};
