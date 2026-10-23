import React, { useState } from 'react';
import { Instagram, Linkedin, Globe } from 'lucide-react';
import { LogoPlaceholder, HeaderDualLogos } from '../ui/LogoPlaceholder';
import { ChamferButton } from '../ui/ChamferButton';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(href);
        setMobileMenuOpen(false);
      }
    } else if (href.startsWith('#')) {
      if (currentPath !== '/') {
        if (onNavigate) {
          e.preventDefault();
          onNavigate('/' + href);
          setMobileMenuOpen(false);
        }
      } else {
        setMobileMenuOpen(false);
      }
    }
  };

  const navItems = [
    { label: '01. ABOUT', href: currentPath === '/' ? '#about' : '/' },
    { label: '02. INITIATIVES', href: currentPath === '/' ? '#focus-areas' : '/#focus-areas' },
    { label: '03. EVENTS', href: '/events' },
    { label: '04. RESEARCH / RESOURCES', href: currentPath === '/' ? '#lineage' : '/resources' },
    { label: '05. LEADERSHIP', href: currentPath === '/' ? '#leadership' : '/leadership' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0d1b3d]/90 backdrop-blur-md border-b border-[#964900]/40 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-2.5 sm:py-3 flex items-center justify-between mx-auto">
        {/* Brand Logo Anchor with Verified Dual Official Logos (SRMIST + IEEE EdSoc) */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-2 group text-white shrink-0"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <HeaderDualLogos />
            <span className="font-poppins font-bold tracking-tight text-white text-sm sm:text-base lg:text-lg leading-tight hidden xl:inline">
              IEEE EdSoc SRMIST
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/events' && currentPath.startsWith('/events')) ||
              (item.href === '/resources' && currentPath === '/resources') ||
              (item.href === '/leadership' && currentPath === '/leadership') ||
              (item.href === '/' && currentPath === '/' && false);

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`font-mono text-xs tracking-wider py-1 transition-colors duration-150 ${
                  isActive
                    ? 'text-[#ffdcc6] border-b-2 border-[#F58220] font-semibold'
                    : 'text-[#c6c6cf] hover:text-white'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Trailing Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="/admin"
            onClick={(e) => handleLinkClick(e, '/admin')}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#c6c6cf] hover:text-[#ffdcc6] border border-white/20 hover:border-[#F58220]/60 px-2.5 py-1.5 clip-button-chamfer transition-colors"
            title="Chapter Admin Console"
          >
            <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
            <span>ADMIN</span>
          </a>

          <ChamferButton
            variant="primary"
            href="#join-chapter"
            onClick={() => {
              if (currentPath !== '/' && onNavigate) {
                onNavigate('/#join-chapter');
              }
            }}
            icon="arrow_forward"
          >
            JOIN CHAPTER
          </ChamferButton>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1.5 border border-white/20 hover:border-[#F58220] ml-1 clip-button-chamfer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1b3d] border-b border-[#964900]/40 px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="block font-mono text-sm tracking-wider py-2 text-[#c6c6cf] hover:text-[#ffdcc6] border-b border-white/10"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <a
              href="/admin"
              onClick={(e) => handleLinkClick(e, '/admin')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#c6c6cf] hover:text-[#ffdcc6]"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>ADMIN PANEL</span>
            </a>

            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/ieee.es_srmist"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE Education Society SRMIST Instagram Profile"
                className="w-7 h-7 rounded bg-white/5 border border-white/20 hover:border-[#ff8928] hover:text-[#ff8928] flex items-center justify-center text-[#c6c6cf] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/company/ieee-education-society-srm-chapter/home/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="IEEE Education Society SRMIST Chapter LinkedIn Page"
                className="w-7 h-7 rounded bg-white/5 border border-white/20 hover:border-[#ff8928] hover:text-[#ff8928] flex items-center justify-center text-[#c6c6cf] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://ieee-edusociety.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official IEEE Education Society Global Website"
                className="w-7 h-7 rounded bg-white/5 border border-white/20 hover:border-[#ff8928] hover:text-[#ff8928] flex items-center justify-center text-[#c6c6cf] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
