import React from 'react';

interface EmptyStateProps {
  variant: 'events-home' | 'events-archive' | 'admin-table' | 'photo-stream';
  onCreateEvent?: () => void;
  onViewArchive?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant,
  onCreateEvent,
  onViewArchive,
}) => {
  if (variant === 'events-home') {
    return (
      <div className="relative bg-[#00184d]/40 border border-[#964900]/30 clip-qfp-card p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 bg-[#0d1b3d] border border-[#F58220]/40 flex items-center justify-center clip-button-chamfer text-[#F58220]">
          <span className="material-symbols-outlined text-2xl">event_note</span>
        </div>
        <h3 className="font-poppins font-bold text-xl text-[#faf8ff] mb-2">
          No events published yet.
        </h3>
        <p className="font-sans text-sm sm:text-base text-[#edf0ff]/80 max-w-lg mx-auto leading-relaxed mb-6">
          Event details, photographs and reports will appear here as chapter activities are documented.
        </p>
        <a
          href="/events"
          onClick={(e) => {
            if (onViewArchive) {
              e.preventDefault();
              onViewArchive();
            }
          }}
          className="inline-flex items-center gap-2 bg-[#F58220] text-white hover:bg-[#e07519] font-headline-sm text-xs uppercase tracking-wider font-bold px-6 py-2.5 clip-button-chamfer transition-all duration-150"
        >
          <span>VIEW ARCHIVE →</span>
        </a>
      </div>
    );
  }

  if (variant === 'photo-stream') {
    return (
      <div className="bg-[#ffffff] border border-[#c6c6cf]/60 clip-qfp-card p-8 sm:p-12 text-center max-w-4xl mx-auto mb-10">
        <div className="w-14 h-14 mx-auto mb-4 bg-[#e9edff] border border-dashed border-[#F58220]/80 flex items-center justify-center clip-button-chamfer text-[#F58220]">
          <span className="material-symbols-outlined text-2xl">cloud_upload</span>
        </div>
        <h3 className="font-poppins font-bold text-xl text-[#151b2a] mb-2 uppercase tracking-wide">
          Photo Upload / Real Event Photos Will Appear Here
        </h3>
        <p className="font-sans text-sm sm:text-base text-[#45464e] max-w-lg mx-auto leading-relaxed mb-4">
          High-resolution event photographs, workshops, and chapter milestones will be documented and displayed here as activities occur.
        </p>
        <span className="inline-block font-mono text-xs text-[#964900] bg-[#F58220]/15 px-3 py-1 clip-button-chamfer font-semibold">
          CAMERA LOG & ARCHIVE REPOSITORY [MEDIA LOG]
        </span>
      </div>
    );
  }

  if (variant === 'admin-table') {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center py-12">
        <div className="w-14 h-14 rounded-full bg-[#e2e8fc] text-[#964900] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">calendar_month</span>
        </div>
        <h3 className="font-headline-sm text-xl font-bold text-[#151b2a] mb-1">
          No events yet
        </h3>
        <p className="font-sans text-sm text-[#45464e] mb-6 text-center">
          Create your first event to publish it on the public website.
        </p>
        <button
          type="button"
          onClick={onCreateEvent}
          className="chamfer-btn inline-flex items-center gap-2 bg-[#ff8928] hover:bg-[#964900] text-white font-headline-sm text-sm uppercase px-5 py-2.5 font-bold transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Create First Event</span>
        </button>
      </div>
    );
  }

  // Canonical archive empty state
  return (
    <div className="relative bg-[#ffffff] border border-[#c6c6cf]/60 p-8 sm:p-14 lg:p-16 chamfer-qfp shadow-sm">
      <div className="ic-lead-pins absolute top-0 left-8 right-8"></div>
      <div className="hidden sm:block absolute top-3 left-4 font-mono text-[10px] text-[#c6c6cf] select-none">
        SRM INSTITUTE OF SCIENCE AND TECHNOLOGY
      </div>
      <div className="hidden sm:block absolute top-3 right-4 font-mono text-[10px] text-[#c6c6cf] select-none">
        CHAPTER ARCHIVE // DOCUMENTATION REPOSITORY
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center text-center py-6">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-16 sm:w-20 h-px bg-[#c6c6cf]/60"></div>
          <div className="w-14 h-14 rounded-none bg-[#f2f3ff] border border-[#76767f] flex items-center justify-center relative p-3">
            <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#76767f]"></span>
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#76767f]"></span>
            <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#76767f]"></span>
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#76767f]"></span>
            <span className="material-symbols-outlined text-[#76767f] text-2xl select-none">
              folder_open
            </span>
            <span className="w-2 h-2 bg-[#ff8928]/40 absolute"></span>
          </div>
          <div className="w-16 sm:w-20 h-px bg-[#c6c6cf]/60"></div>
        </div>

        <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-[#0d1b3d] max-w-lg mb-3 tracking-tight">
          No Events or Reports Published Yet
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#45464e] max-w-lg leading-relaxed mb-6">
          Event details, photographs and reports will appear here as chapter activities are documented.
        </p>

        <div className="p-3.5 bg-[#f2f3ff] border border-[#c6c6cf]/40 font-mono text-xs text-[#45464e] text-center max-w-xl">
          <span className="text-[#964900] font-semibold uppercase block mb-1">
            Future Content Model Preview
          </span>
          <span>
            Future entries will include event details, session summaries, photo galleries, downloadable PDF reports, and educational resources.
          </span>
        </div>
      </div>

      <div className="ic-lead-pins absolute bottom-0 left-8 right-8"></div>
    </div>
  );
};
