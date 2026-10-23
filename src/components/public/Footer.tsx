import React from 'react';
import { Instagram, Linkedin, Globe } from 'lucide-react';
import { LogoPlaceholder } from '../ui/LogoPlaceholder';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/') && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer className="bg-[#00184d] border-t border-[#76767f]/30 text-[#faf8ff]">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Col 1: Identity & Badges */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
              <LogoPlaceholder type="srmist" variant="footer" />
              <LogoPlaceholder type="edsoc" variant="footer" />
            </div>
            <div>
              <h4 className="font-poppins font-bold text-lg text-white">
                IEEE Education Society Student Chapter
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#c6c6cf] mt-0.5">
                SRM Institute of Science and Technology
              </p>
            </div>
          </div>

          {/* Col 2: Connect With Us */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <h5 className="font-mono text-xs text-[#ff8928] font-bold tracking-widest uppercase flex items-center gap-2">
              <span>Connect With Us</span>
              <span className="h-px bg-[#ff8928]/30 flex-1"></span>
            </h5>
            <p className="font-sans text-xs text-[#edf0ff]/85 leading-relaxed">
              Official channels for IEEE Education Society Student Chapter at SRMIST.
            </p>
            <div className="flex flex-col gap-2">
              <a
                className="border border-[#76767f]/30 bg-[#0d1b3d] hover:border-[#ff8928] hover:bg-[#ff8928]/10 hover:text-[#ff8928] text-[#c6c6cf] px-3.5 py-2 clip-button-chamfer transition-all duration-150 flex items-center justify-between text-xs font-mono group"
                href="https://www.instagram.com/ieee.es_srmist"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE Education Society SRMIST Instagram Profile"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-[#edf0ff]">Instagram</span>
                </div>
                <span className="text-[11px] text-[#76767f] group-hover:text-[#ff8928]">@ieee.es_srmist</span>
              </a>

              <a
                className="border border-[#76767f]/30 bg-[#0d1b3d] hover:border-[#ff8928] hover:bg-[#ff8928]/10 hover:text-[#ff8928] text-[#c6c6cf] px-3.5 py-2 clip-button-chamfer transition-all duration-150 flex items-center justify-between text-xs font-mono group"
                href="https://www.linkedin.com/company/ieee-education-society-srm-chapter/home/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE Education Society SRMIST Chapter LinkedIn Page"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-[#edf0ff]">LinkedIn</span>
                </div>
                <span className="text-[11px] text-[#76767f] group-hover:text-[#ff8928]">SRM Chapter</span>
              </a>

              <a
                className="border border-[#76767f]/30 bg-[#0d1b3d] hover:border-[#ff8928] hover:bg-[#ff8928]/10 hover:text-[#ff8928] text-[#c6c6cf] px-3.5 py-2 clip-button-chamfer transition-all duration-150 flex items-center justify-between text-xs font-mono group"
                href="https://ieee-edusociety.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official IEEE Education Society Global Website"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#ff8928] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-[#edf0ff]">Official Website</span>
                </div>
                <span className="text-[11px] text-[#76767f] group-hover:text-[#ff8928]">ieee-edusociety.org</span>
              </a>
            </div>
          </div>

          {/* Col 3: Sitemap */}
          <div className="md:col-span-3 flex flex-col md:items-end">
            <span className="font-mono text-[10px] text-[#ffdcc6] font-bold tracking-widest uppercase mb-3">
              SITEMAP
            </span>
            <nav className="flex flex-col md:items-end gap-2">
              <a
                className="text-[#c6c6cf] hover:text-white font-sans text-xs sm:text-sm transition-colors duration-150"
                href="/#about"
                onClick={(e) => handleLinkClick(e, '/')}
              >
                About
              </a>
              <a
                className="text-[#c6c6cf] hover:text-white font-sans text-xs sm:text-sm transition-colors duration-150"
                href="/#focus-areas"
                onClick={(e) => handleLinkClick(e, '/')}
              >
                Initiatives
              </a>
              <a
                className="text-[#c6c6cf] hover:text-white font-sans text-xs sm:text-sm transition-colors duration-150"
                href="/events"
                onClick={(e) => handleLinkClick(e, '/events')}
              >
                Events
              </a>
              <a
                className="text-[#c6c6cf] hover:text-white font-sans text-xs sm:text-sm transition-colors duration-150"
                href="/resources"
                onClick={(e) => handleLinkClick(e, '/resources')}
              >
                Research / Resources
              </a>
              <a
                className="text-[#c6c6cf] hover:text-white font-sans text-xs sm:text-sm transition-colors duration-150"
                href="/leadership"
                onClick={(e) => handleLinkClick(e, '/leadership')}
              >
                Leadership
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 border-t border-[#76767f]/20 text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs sm:text-sm text-[#c6c6cf]">
            © 2025 IEEE Education Society Student Chapter — SRM Institute of Science and Technology. All rights reserved.
          </p>
          <a
            href="/admin"
            onClick={(e) => handleLinkClick(e, '/admin')}
            className="text-[11px] font-mono text-[#c6c6cf]/60 hover:text-[#ffdcc6] transition-colors"
          >
            [ Staff Access ]
          </a>
        </div>
      </div>
    </footer>
  );
};
