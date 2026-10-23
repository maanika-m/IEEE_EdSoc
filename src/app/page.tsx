import React from 'react';
import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
import { LineageSection } from '../components/public/LineageSection';
import { FocusAreas } from '../components/public/FocusAreas';
import { EventsPreview } from '../components/public/EventsPreview';
import { PhotoStream } from '../components/public/PhotoStream';
import { LeadershipSection } from '../components/public/LeadershipSection';
import { CtaBanner } from '../components/public/CtaBanner';
import { Footer } from '../components/public/Footer';
import type { Event } from '../lib/types/database';

interface HomePageProps {
  events?: Event[];
  onNavigate?: (path: string) => void;
}

export default function HomePage({ events = [], onNavigate }: HomePageProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#151b2a] antialiased relative selection:bg-[#F58220] selection:text-white overflow-x-hidden font-body-md text-sm">
      {/* 1. Top Navbar */}
      <Navbar currentPath="/" onNavigate={onNavigate} />

      {/* 2. Connective Tissue: Continuous Vertical Trace Line */}
      <div className="hidden lg:block absolute left-8 xl:left-14 top-0 bottom-0 w-[1.5px] bg-[#F58220]/25 z-20 pointer-events-none"></div>

      <main className="relative pt-16">
        {/* 3. Hero Section */}
        <Hero
          onJoinClick={() => scrollTo('join-chapter')}
          onMeetTeamClick={() => scrollTo('leadership')}
        />

        {/* 4. Compact IEEE Lineage & Roots */}
        <LineageSection />

        {/* 5. What We Focus On */}
        <FocusAreas />

        {/* 6. Recent Events */}
        <EventsPreview
          events={events}
          onViewArchive={() => onNavigate?.('/events')}
          onEventClick={(slug) => onNavigate?.(`/events/${slug}`)}
        />

        {/* 7. Chapter In Motion (Photo Stream) */}
        <PhotoStream />

        {/* 8. Leadership & Advisory Section */}
        <LeadershipSection />

        {/* 9. Membership & Engagement CTA */}
        <CtaBanner onJoinClick={() => scrollTo('join-chapter')} />
      </main>

      {/* 10. Unified Global Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
