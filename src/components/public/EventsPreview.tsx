import React from 'react';
import type { Event } from '../../lib/types/database';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, formatCategory } from '../../lib/utils/format';

interface EventsPreviewProps {
  events?: Event[];
  onViewArchive?: () => void;
  onEventClick?: (slug: string) => void;
}

export const EventsPreview: React.FC<EventsPreviewProps> = ({
  events = [],
  onViewArchive,
  onEventClick,
}) => {
  return (
    <section
      className="py-20 bg-[#0d1b3d] text-[#faf8ff] relative overflow-hidden border-y border-[#964900]/30"
      id="events"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F58220]"></span>
              <span className="font-mono text-xs text-[#ffdcc6] uppercase tracking-wider font-semibold">
                03 // RECENT EVENTS
              </span>
            </div>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Latest Chapter Activity
            </h2>
          </div>

          <a
            href="/events"
            onClick={(e) => {
              if (onViewArchive) {
                e.preventDefault();
                onViewArchive();
              }
            }}
            className="font-mono text-xs text-[#F58220] hover:text-[#ffdcc6] border border-[#F58220]/40 hover:border-[#F58220] px-4 py-2 clip-button-chamfer bg-[#00184d] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>VIEW ARCHIVE</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        {/* Clean Intentional CMS State: Zero fake data */}
        {events.length === 0 ? (
          <EmptyState variant="events-home" onViewArchive={onViewArchive} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onEventClick?.(evt.slug)}
                className="bg-[#00184d]/60 border border-[#964900]/40 clip-qfp-card p-6 hover:border-[#F58220] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="bg-[#F58220]/20 text-[#ffdcc6] px-2 py-0.5">
                      {formatCategory(evt.category)}
                    </span>
                    <span className="text-[#c6c6cf]">{formatDate(evt.date)}</span>
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-white mb-2 group-hover:text-[#F58220] transition-colors">
                    {evt.title}
                  </h3>
                  {evt.description && (
                    <p className="font-sans text-xs text-[#edf0ff]/80 line-clamp-3 mb-4 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#ffdcc6]">
                  <span>{evt.venue || 'SRMIST'}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
