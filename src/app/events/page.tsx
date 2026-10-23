import React, { useState } from 'react';
import { Navbar } from '../../components/public/Navbar';
import { Footer } from '../../components/public/Footer';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatCategory } from '../../lib/utils/format';
import type { Event, EventCategory } from '../../lib/types/database';

interface EventsPageProps {
  events?: Event[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onNavigate?: (path: string) => void;
}

export default function EventsPage({
  events = [],
  isLoading = false,
  errorMessage = null,
  onRetry,
  onNavigate,
}: EventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '[ALL EVENTS]' },
    { id: 'workshop', label: 'WORKSHOPS' },
    { id: 'seminar', label: 'SEMINARS' },
    { id: 'technical_session', label: 'TECHNICAL SESSIONS' },
    { id: 'meeting', label: 'MEETINGS' },
    { id: 'outreach', label: 'OUTREACH' },
  ];

  // Strictly filter only published events
  const filteredEvents = events.filter((evt) => {
    if (evt.status !== 'published') return false;
    if (selectedCategory === 'all') return true;
    return evt.category === selectedCategory;
  });

  return (
    <div className="bg-[#faf8ff] text-[#151b2a] antialiased font-body-md min-h-screen flex flex-col selection:bg-[#ff8928] selection:text-white">
      {/* 1. Header & Global Navigation */}
      <Navbar currentPath="/events" onNavigate={onNavigate} />

      {/* Main Editorial & CMS Archive Canvas */}
      <main className="flex-grow pt-24 pb-20 telemetry-grid">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Sub-Surface Breadcrumb */}
          <section className="pt-6 pb-6 border-b border-[#c6c6cf]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#76767f]">
              <span className="inline-block w-1.5 h-1.5 bg-[#ff8928]"></span>
              <span>IEEE EDUCATION SOCIETY</span>
              <span>/</span>
              <span>SRMIST STUDENT CHAPTER</span>
              <span>/</span>
              <span className="text-[#0d1b3d] font-semibold">EVENTS & TECHNICAL REPORTS</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#c6c6cf]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8928]"></span>
              <span>KATTANKULATHUR, CHENNAI</span>
            </div>
          </section>

          {/* 2. Section Header & Metadata */}
          <section className="py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#f2f3ff] border border-[#c6c6cf]/40 mb-4">
                <span className="font-mono text-xs text-[#964900] tracking-widest uppercase font-semibold">
                  03 // EVENTS & ARCHIVE
                </span>
              </div>
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0d1b3d] tracking-tight leading-none mb-4">
                Events & Technical Reports
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#45464e] max-w-2xl leading-relaxed">
                A structured archive of IEEE Education Society Student Chapter activities, photographs and event reports.
              </p>
            </div>

            <div className="lg:col-span-4 bg-white border border-[#c6c6cf]/40 p-5 relative shadow-sm">
              <div className="ic-lead-pins absolute -top-1 left-0"></div>
              <div className="flex items-center justify-between font-mono text-xs text-[#76767f] mb-2">
                <span>CHAPTER ARCHIVE</span>
                <span className="font-bold text-[#0d1b3d]">OFFICIAL REPOSITORY</span>
              </div>
              <div className="pt-3 border-t border-[#e9edff]">
                <div className="font-mono text-[10px] text-[#76767f] uppercase mb-1">
                  INSTITUTIONAL METADATA
                </div>
                <div className="font-sans text-sm text-[#0d1b3d] font-semibold">
                  SRM Institute of Science and Technology
                </div>
                <div className="font-sans text-xs text-[#45464e] mb-3">
                  Kattankulathur Campus
                </div>
                <div className="flex flex-col gap-1.5 pt-2 border-t border-dashed border-[#c6c6cf]/40">
                  <div className="px-2.5 py-1.5 border border-dashed border-[#c6c6cf]/60 bg-[#f2f3ff] font-mono text-[10px] text-[#76767f] flex items-center justify-between">
                    <span>[ SRMIST LOGO PLACEHOLDER ]</span>
                    <span className="w-1.5 h-1.5 bg-[#ff8928]"></span>
                  </div>
                  <div className="px-2.5 py-1.5 border border-dashed border-[#c6c6cf]/60 bg-[#f2f3ff] font-mono text-[10px] text-[#76767f] flex items-center justify-between">
                    <span>[ IEEE EDUCATION SOCIETY LOGO PLACEHOLDER ]</span>
                    <span className="w-1.5 h-1.5 bg-[#ff8928]"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Category Filtering Bar (Zero Fake Counts) */}
          <section className="border border-[#c6c6cf]/50 bg-white p-3 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0d1b3d] text-white font-bold'
                        : 'bg-[#faf8ff] text-[#45464e] border border-[#c6c6cf]/30 hover:border-[#c6c6cf] hover:text-[#0d1b3d]'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 bg-[#ff8928]"></span>}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{errorMessage}</span>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="font-mono text-xs text-red-700 underline hover:text-red-900 cursor-pointer"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* 3. Empty Archive State / Loading / Real Event Cards */}
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#ff8928] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-xs text-[#76767f]">Loading published events...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <section className="mb-14">
              <EmptyState variant="events-archive" />
            </section>
          ) : (
            <section className="mb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onNavigate?.(`/events/${evt.slug}`)}
                  className="bg-white border border-[#c6c6cf]/60 clip-qfp-card p-6 hover:border-[#F58220] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="bg-[#ff8928]/20 text-[#964900] px-2 py-0.5 font-semibold">
                        {formatCategory(evt.category)}
                      </span>
                      <span className="text-[#76767f]">{formatDate(evt.date)}</span>
                    </div>
                    <h3 className="font-poppins font-bold text-lg text-[#0d1b3d] mb-2 group-hover:text-[#F58220] transition-colors">
                      {evt.title}
                    </h3>
                    {evt.description && (
                      <p className="font-sans text-xs text-[#45464e] line-clamp-3 mb-4 leading-relaxed">
                        {evt.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-[#e2e8fc] flex items-center justify-between text-xs font-mono text-[#964900]">
                    <span>{evt.venue || 'SRMIST'}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* 5. CMS Architecture Blueprint (Documentation Standard) */}
          <section className="mb-14">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#c6c6cf]/30 pb-4">
              <div>
                <div className="font-mono text-xs text-[#964900] uppercase tracking-widest mb-1 font-semibold">
                  CHAPTER DOCUMENTATION STANDARD
                </div>
                <h2 className="font-poppins font-bold text-xl sm:text-2xl text-[#0d1b3d]">
                  CMS Architecture Blueprint
                </h2>
              </div>
              <p className="font-mono text-xs text-[#76767f] max-w-md">
                Canonical record specification established for all forthcoming student chapter activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Layer 01 */}
              <div className="bg-white border border-[#c6c6cf]/50 p-5 flex flex-col justify-between relative group hover:border-[#964900] transition-colors shadow-sm">
                <div className="ic-lead-pins absolute top-0 left-0 right-0"></div>
                <div>
                  <span className="font-mono text-xs text-[#964900] tracking-wider block mb-2 font-semibold">
                    LAYER 01
                  </span>
                  <h3 className="font-poppins font-bold text-sm text-[#0d1b3d] mb-2">
                    01 // Event Overview
                  </h3>
                  <p className="font-sans text-xs text-[#45464e] leading-relaxed">
                    Essential metadata including official Title, Category classification, Date, Time, and Venue details.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#e9edff] flex items-center gap-1.5 font-mono text-[11px] text-[#76767f]">
                  <span className="w-1 h-1 bg-[#ff8928]"></span>
                  <span>Core Metadata</span>
                </div>
              </div>

              {/* Layer 02 */}
              <div className="bg-white border border-[#c6c6cf]/50 p-5 flex flex-col justify-between relative group hover:border-[#964900] transition-colors shadow-sm">
                <div className="ic-lead-pins absolute top-0 left-0 right-0"></div>
                <div>
                  <span className="font-mono text-xs text-[#964900] tracking-wider block mb-2 font-semibold">
                    LAYER 02
                  </span>
                  <h3 className="font-poppins font-bold text-sm text-[#0d1b3d] mb-2">
                    02 // About the Event
                  </h3>
                  <p className="font-sans text-xs text-[#45464e] leading-relaxed">
                    Official description, pedagogical objectives, invited speaker biographies, and educational agenda.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#e9edff] flex items-center gap-1.5 font-mono text-[11px] text-[#76767f]">
                  <span className="w-1 h-1 bg-[#ff8928]"></span>
                  <span>Curriculum & Narrative</span>
                </div>
              </div>

              {/* Layer 03 */}
              <div className="bg-white border border-[#c6c6cf]/50 p-5 flex flex-col justify-between relative group hover:border-[#964900] transition-colors shadow-sm">
                <div className="ic-lead-pins absolute top-0 left-0 right-0"></div>
                <div>
                  <span className="font-mono text-xs text-[#964900] tracking-wider block mb-2 font-semibold">
                    LAYER 03
                  </span>
                  <h3 className="font-poppins font-bold text-sm text-[#0d1b3d] mb-2">
                    03 // Event Photographs
                  </h3>
                  <p className="font-sans text-xs text-[#45464e] leading-relaxed mb-3">
                    High-resolution curated photo stream documenting active participants, workshops, and lab sessions.
                  </p>
                  <div className="p-2 border border-dashed border-[#c6c6cf]/60 bg-[#f2f3ff] font-mono text-[10px] text-[#964900]">
                    [ PHOTO UPLOAD / REAL EVENT PHOTOS WILL APPEAR HERE ]
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[#e9edff] flex items-center gap-1.5 font-mono text-[11px] text-[#76767f]">
                  <span className="w-1 h-1 bg-[#ff8928]"></span>
                  <span>Visual Archive</span>
                </div>
              </div>

              {/* Layer 04 */}
              <div className="bg-white border border-[#c6c6cf]/50 p-5 flex flex-col justify-between relative group hover:border-[#964900] transition-colors shadow-sm">
                <div className="ic-lead-pins absolute top-0 left-0 right-0"></div>
                <div>
                  <span className="font-mono text-xs text-[#964900] tracking-wider block mb-2 font-semibold">
                    LAYER 04
                  </span>
                  <h3 className="font-poppins font-bold text-sm text-[#0d1b3d] mb-2">
                    04 // Event Report
                  </h3>
                  <p className="font-sans text-xs text-[#45464e] leading-relaxed mb-3">
                    Official downloadable documentation PDF compiled by chapter rapporteurs for formal institutional records.
                  </p>
                  <div className="p-2 border border-dashed border-[#c6c6cf]/60 bg-[#f2f3ff] font-mono text-[10px] flex items-center justify-between text-[#45464e]">
                    <span className="text-[#964900] underline">[ DOWNLOAD REPORT -&gt; ]</span>
                    <span className="text-[#76767f]">[ NO REPORT UPLOADED YET ]</span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[#e9edff] flex items-center gap-1.5 font-mono text-[11px] text-[#76767f]">
                  <span className="w-1 h-1 bg-[#ff8928]"></span>
                  <span>Downloadable PDF</span>
                </div>
              </div>

              {/* Layer 05 */}
              <div className="bg-white border border-[#c6c6cf]/50 p-5 flex flex-col justify-between relative group hover:border-[#964900] transition-colors shadow-sm">
                <div className="ic-lead-pins absolute top-0 left-0 right-0"></div>
                <div>
                  <span className="font-mono text-xs text-[#964900] tracking-wider block mb-2 font-semibold">
                    LAYER 05
                  </span>
                  <h3 className="font-poppins font-bold text-sm text-[#0d1b3d] mb-2">
                    05 // Additional Resources
                  </h3>
                  <p className="font-sans text-xs text-[#45464e] leading-relaxed">
                    Curated educational slides, open reference links, demonstration code repositories, and follow-up reading.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#e9edff] flex items-center gap-1.5 font-mono text-[11px] text-[#76767f]">
                  <span className="w-1 h-1 bg-[#ff8928]"></span>
                  <span>Artifacts & Repos</span>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Contact / Coordination CTA */}
          <section className="bg-[#f2f3ff] border border-[#c6c6cf]/50 p-8 lg:p-10 chamfer-action">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-xs text-[#964900] uppercase tracking-widest mb-2 font-semibold">
                  <span className="w-1.5 h-1.5 bg-[#ff8928]"></span>
                  <span>SESSION COORDINATION</span>
                </div>
                <h3 className="font-poppins font-bold text-2xl text-[#0d1b3d] mb-2 tracking-tight">
                  Organizing an Educational Session or Technical Meeting?
                </h3>
                <p className="font-sans text-sm text-[#45464e] leading-relaxed">
                  Faculty members, domain specialists, and student members can coordinate with the Education Society Chapter for session scheduling and official documentation.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  className="inline-flex items-center gap-2 bg-[#0d1b3d] hover:bg-[#964900] text-white font-headline-sm text-xs uppercase tracking-wider px-6 py-3 font-semibold chamfer-action transition-all duration-150 active:translate-y-px shadow-sm"
                  href="/leadership"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/leadership');
                    }
                  }}
                >
                  <span>CONTACT CHAPTER LEADERSHIP -&gt;</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 7. Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
