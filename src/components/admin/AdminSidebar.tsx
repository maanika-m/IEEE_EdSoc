import React from 'react';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { id: 'events', label: 'Events', icon: 'event', path: '/admin/events' },
    { id: 'members', label: 'Members', icon: 'group', path: '/admin/members' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#ffffff] border-r border-[#e2e8fc] hidden md:flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div className="px-3">
          <span className="font-mono text-[10px] font-bold text-[#76767f] tracking-widest uppercase">
            WORKSPACE
          </span>
        </div>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const isActive =
              item.path === currentPath ||
              (item.path === '/admin' && currentPath === '/admin');

            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.path);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded font-sans text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0d1b3d] text-white font-semibold shadow-sm'
                    : 'text-[#45464e] hover:bg-[#e9edff] hover:text-[#151b2a] font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#ff8928]' : 'text-[#76767f]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#ff8928]"></span>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* SIDEBAR FOOTER NOTE */}
      <div className="p-3 bg-[#f2f3ff] border border-[#e2e8fc] rounded text-left">
        <div className="flex items-center gap-2 mb-1 text-[#964900] font-mono text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px]">help_outline</span>
          <span>Chapter Officer Help</span>
        </div>
        <p className="font-sans text-xs text-[#45464e] leading-snug">
          Need assistance publishing an event? Contact the chapter secretary or web chair.
        </p>
      </div>
    </aside>
  );
};
