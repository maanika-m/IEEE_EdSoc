import React from 'react';
import { Navbar } from '../../../components/public/Navbar';
import { Footer } from '../../../components/public/Footer';
import type { Event, EventPhoto, EventReport, EventResource } from '../../../lib/types/database';
import { formatDate, formatCategory } from '../../../lib/utils/format';

interface EventDetailPageProps {
  slug: string;
  event?: Event;
  photos?: EventPhoto[];
  report?: EventReport | null;
  resources?: EventResource[];
  isLoading?: boolean;
  onNavigate?: (path: string) => void;
}

export default function EventDetailPage({
  slug,
  event,
  photos = [],
  report = null,
  resources = [],
  isLoading = false,
  onNavigate,
}: EventDetailPageProps) {
  // If loading, show clean loader
  if (isLoading) {
    return (
      <div className="bg-[#faf8ff] text-[#151b2a] min-h-screen flex flex-col font-body-md">
        <Navbar currentPath="/events" onNavigate={onNavigate} />
        <main className="flex-grow pt-28 pb-20 max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white border border-[#c6c6cf]/60 p-12 clip-qfp-card shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#ff8928] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-xs text-[#76767f]">Loading event details...</p>
          </div>
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // If no event found or event is not published, strictly show faithful not-found state
  if (!event || event.status !== 'published') {
    return (
      <div className="bg-[#faf8ff] text-[#151b2a] min-h-screen flex flex-col font-body-md">
        <Navbar currentPath="/events" onNavigate={onNavigate} />
        <main className="flex-grow pt-28 pb-20 max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white border border-[#c6c6cf]/60 p-12 clip-qfp-card shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#76767f] mb-3">event_busy</span>
            <h2 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-2">Event Not Found</h2>
            <p className="font-sans text-sm text-[#45464e] mb-6">
              The requested event record <code className="font-mono text-xs bg-[#e9edff] px-2 py-0.5">[{slug}]</code> could not be found or has not been published yet.
            </p>
            <a
              href="/events"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/events');
              }}
              className="inline-flex items-center gap-2 bg-[#F58220] text-white px-5 py-2 clip-button-chamfer font-headline-sm text-xs font-bold uppercase"
            >
              ← Return to Events Archive
            </a>
          </div>
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] min-h-screen flex flex-col font-body-md telemetry-grid">
      <Navbar currentPath="/events" onNavigate={onNavigate} />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <div className="pt-4 pb-6 flex items-center gap-2 font-mono text-xs text-[#76767f]">
            <a
              href="/events"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('/events');
              }}
              className="hover:text-[#F58220] transition-colors"
            >
              Events Archive
            </a>
            <span>/</span>
            <span className="text-[#0d1b3d] font-semibold truncate">{event.title}</span>
          </div>

          {/* LAYER 01 // Event Overview */}
          <section className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 sm:p-10 mb-8 shadow-sm relative">
            <div className="ic-lead-pins absolute top-0 left-8 right-8"></div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="font-mono text-xs px-2.5 py-1 bg-[#F58220]/15 text-[#964900] font-bold">
                {formatCategory(event.category)}
              </span>
              <span className="font-mono text-xs text-[#76767f]">
                {formatDate(event.date)}
              </span>
            </div>

            <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-[#0d1b3d] mb-4 tracking-tight">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e2e8fc] font-mono text-xs text-[#45464e]">
              <div>
                <span className="text-[#76767f] block">VENUE</span>
                <span className="text-[#0d1b3d] font-bold">{event.venue || 'SRMIST Campus'}</span>
              </div>
              <div>
                <span className="text-[#76767f] block">SCHEDULE</span>
                <span className="text-[#0d1b3d] font-bold">
                  {event.start_time ? `${event.start_time} - ${event.end_time || 'TBD'}` : 'Scheduled Session'}
                </span>
              </div>
              <div>
                <span className="text-[#76767f] block">SPEAKER / GUEST</span>
                <span className="text-[#0d1b3d] font-bold">{event.speaker || 'Chapter Leadership'}</span>
              </div>
            </div>
          </section>

          {/* LAYER 02 // About the Event */}
          <section className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 sm:p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[#964900] font-bold">
              <span>02 // CURRICULUM & NARRATIVE</span>
            </div>
            <h2 className="font-poppins font-bold text-xl text-[#0d1b3d] mb-3">About the Event</h2>
            <div className="font-sans text-sm sm:text-base text-[#45464e] leading-relaxed whitespace-pre-line">
              {event.description || 'Full event overview, academic discussions, and proceedings.'}
            </div>
          </section>

          {/* LAYER 03 // Event Photographs */}
          <section className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 sm:p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[#964900] font-bold">
              <span>03 // EVENT PHOTOGRAPHS</span>
            </div>
            <h2 className="font-poppins font-bold text-xl text-[#0d1b3d] mb-3">Visual Archive</h2>
            {photos.length === 0 ? (
              <div className="p-8 border border-dashed border-[#c6c6cf] text-center bg-[#f2f3ff]/40">
                <p className="font-mono text-xs text-[#76767f]">[ PHOTO UPLOAD / REAL EVENT PHOTOS WILL APPEAR HERE ]</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((p) => (
                  <div key={p.id} className="border border-[#c6c6cf] overflow-hidden">
                    <img src={p.image_url || (p as any).public_url} alt={p.caption || 'Event photograph'} className="w-full h-48 object-cover" />
                    {p.caption && <p className="font-sans text-xs p-2 text-[#45464e]">{p.caption}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* LAYER 04 // Event Report & LAYER 05 // Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Report */}
            <div className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 shadow-sm">
              <span className="font-mono text-xs text-[#964900] font-bold block mb-2">04 // EVENT REPORT</span>
              <h3 className="font-poppins font-bold text-lg text-[#0d1b3d] mb-3">Official Documentation</h3>
              {report ? (
                <a
                  href={report.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#f2f3ff] border border-[#c6c6cf] hover:border-[#F58220] transition-colors"
                >
                  <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                  <div className="flex-1 truncate">
                    <p className="font-sans text-xs font-bold text-[#0d1b3d] truncate">{report.file_name}</p>
                    <p className="font-mono text-[10px] text-[#76767f]">Downloadable PDF Document</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#F58220]">download</span>
                </a>
              ) : (
                <div className="p-4 border border-dashed border-[#c6c6cf] font-mono text-xs text-[#76767f] text-center bg-[#f2f3ff]/40">
                  [ NO REPORT UPLOADED YET ]
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 shadow-sm">
              <span className="font-mono text-xs text-[#964900] font-bold block mb-2">05 // ADDITIONAL RESOURCES</span>
              <h3 className="font-poppins font-bold text-lg text-[#0d1b3d] mb-3">Educational Artifacts</h3>
              {resources.length === 0 ? (
                <div className="p-4 border border-dashed border-[#c6c6cf] font-mono text-xs text-[#76767f] text-center bg-[#f2f3ff]/40">
                  No additional resources or links attached yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 bg-[#f2f3ff] border border-[#c6c6cf] hover:border-[#F58220] transition-colors text-xs"
                    >
                      <span className="font-sans font-medium text-[#0d1b3d] truncate">{res.title}</span>
                      <span className="material-symbols-outlined text-sm text-[#F58220]">open_in_new</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
