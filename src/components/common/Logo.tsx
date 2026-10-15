import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'burgundy';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  linkTo?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'burgundy',
  size = 'md',
  showTagline = true,
  linkTo = '/',
  className = '',
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Geometric Gold Shield & Coin Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-[#701525] via-[#A71930] to-[#500e1b] border border-[#C9A45C]/40`}>
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Shield/Coin Rim */}
          <circle cx="50" cy="50" r="44" stroke="#E9D6A6" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.7" />
          <circle cx="50" cy="50" r="38" stroke="#C9A45C" strokeWidth="2" />
          {/* Diamond faceted gold icon */}
          <path d="M50 16 L72 38 L50 82 L28 38 Z" fill="url(#goldGrad)" />
          <path d="M50 16 L72 38 L50 48 Z" fill="#FFE59E" opacity="0.6" />
          <path d="M50 16 L28 38 L50 48 Z" fill="#B3873B" opacity="0.8" />
          {/* Inner core circle */}
          <circle cx="50" cy="48" r="8" fill="#701525" stroke="#E9D6A6" strokeWidth="1.5" />
          <path d="M50 43 L53 48 L50 53 L47 48 Z" fill="#FFE59E" />
          <defs>
            <linearGradient id="goldGrad" x1="28" y1="16" x2="72" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE082" />
              <stop offset="0.5" stopColor="#C9A45C" />
              <stop offset="1" stopColor="#8C6826" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display tracking-wider ${titleSizes[size]} ${isLight ? 'text-white' : 'text-[#701525]'}`}>
            AURUM
          </span>
          <span className={`font-display font-medium tracking-widest ${titleSizes[size]} text-[#C9A45C]`}>
            GOLD
          </span>
          <span className={`font-sans font-light tracking-wide ${titleSizes[size]} ${isLight ? 'text-white/80' : 'text-[#242424]'}`}>
            FINANCE
          </span>
        </div>
        {showTagline && (
          <span className={`font-sans tracking-wider uppercase font-medium mt-0.5 ${taglineSizes[size]} ${isLight ? 'text-[#E9D6A6]' : 'text-[#701525]/80'}`}>
            Your Gold. Your Financial Possibilities.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block transition-transform hover:scale-[1.01]">
        {content}
      </Link>
    );
  }

  return content;
};
