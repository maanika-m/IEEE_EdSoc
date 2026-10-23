import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { EmptyState } from '../ui/EmptyState';

export const PhotoStream: React.FC = () => {
  const slots = [
    { id: '01', label: 'PHOTO SLOT 01' },
    { id: '02', label: 'PHOTO SLOT 02' },
    { id: '03', label: 'PHOTO SLOT 03' },
    { id: '04', label: 'PHOTO SLOT 04' },
  ];

  return (
    <section
      className="py-20 bg-[#faf8ff] relative pcb-substrate-grid border-b border-[#c6c6cf]/30"
      id="photo-stream"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <SectionHeader
          number="04"
          category="CHAPTER IN MOTION"
          title="Photo Stream"
        />

        {/* Clean Empty State Card */}
        <EmptyState variant="photo-stream" />

        {/* Designed Empty Placeholder Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-[#ffffff] border border-dashed border-[#c6c6cf]/80 clip-qfp-card p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:border-[#F58220] transition-colors"
            >
              <div className="w-10 h-10 mb-2 bg-[#e9edff] text-[#F58220] flex items-center justify-center clip-button-chamfer">
                <span className="material-symbols-outlined text-xl">
                  add_photo_alternate
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#151b2a]">
                {slot.label}
              </span>
              <span className="font-mono text-[10px] text-[#76767f] mt-1">
                [ UPLOAD EVENT MEDIA ]
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
