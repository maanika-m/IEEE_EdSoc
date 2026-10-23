import React from 'react';

interface ChamferButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const ChamferButton: React.FC<ChamferButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  href,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'right',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 font-headline-sm font-bold uppercase tracking-wider text-xs sm:text-[13px] px-4 py-2 clip-button-chamfer transition-all duration-150 active:translate-y-px select-none cursor-pointer';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-[#F58220] text-white hover:bg-[#e07519] shadow-lg shadow-[#F58220]/25 hover:shadow-[#F58220]/45';
      break;
    case 'secondary':
      variantClasses =
        'bg-[#ff8928] text-white hover:bg-[#964900] shadow-md hover:shadow-lg';
      break;
    case 'dark':
      variantClasses =
        'bg-[#00020d] text-[#faf8ff] hover:bg-[#0d1b3d] shadow-sm';
      break;
    case 'outline':
      variantClasses =
        'border border-[#dde2f7]/40 hover:border-[#F58220] bg-white/5 hover:bg-white/10 text-white font-mono font-medium';
      break;
  }

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {content}
    </button>
  );
};
