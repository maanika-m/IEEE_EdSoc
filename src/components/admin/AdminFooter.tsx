import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-[#0d1b3d] text-[#faf8ff] py-4 px-6 lg:px-12 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-xs">
      <div className="flex items-center gap-3">
        <span className="font-headline-sm text-sm font-bold">IEEE EdSoc SRMIST</span>
        <span className="text-[#c6c6cf]">•</span>
        <span className="text-[#c6c6cf]">Student Chapter Administrative Console</span>
      </div>
      <div className="text-[#c6c6cf] text-xs font-mono">
        Logged in as Chapter Officer • SRM Institute of Science and Technology
      </div>
    </footer>
  );
};
