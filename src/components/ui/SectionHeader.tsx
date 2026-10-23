import React from 'react';

interface SectionHeaderProps {
  number?: string;
  category: string;
  title: string;
  description?: string;
  theme?: 'light' | 'dark';
  className?: string;
  badgeContent?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  category,
  title,
  description,
  theme = 'light',
  className = '',
  badgeContent,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-3.5 h-3.5 rounded-full bg-[#F58220] pulse-solder flex items-center justify-center -ml-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
        <span
          className={`font-mono text-xs font-semibold tracking-widest uppercase ${
            isDark ? 'text-[#ffdcc6]' : 'text-[#964900]'
          }`}
        >
          {number ? `${number} // ${category}` : category}
        </span>
        {badgeContent}
      </div>

      <h2
        className={`font-poppins font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-3 ${
          isDark ? 'text-[#faf8ff]' : 'text-[#151b2a]'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`font-sans text-base sm:text-lg max-w-3xl leading-relaxed ${
            isDark ? 'text-[#edf0ff]/85' : 'text-[#45464e]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
