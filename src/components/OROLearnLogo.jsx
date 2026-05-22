import React from 'react';

const OROLearnLogo = ({ variant = 'full', size = 'large', isLoading = false, theme = 'light' }) => {
  const isDark = theme === 'dark';

  // Proportional sizing configuration to prevent text stretching the navbar
  const sizes = {
    small: { 
      icon: 'w-16 h-16', 
      oro: 'text-xl', 
      learn: 'text-lg', 
      tag: 'text-[10px]',
      tagMargin: 'mt-1'
    },
    medium: { 
      icon: 'w-24 h-24', 
      oro: 'text-2xl', 
      learn: 'text-xl', 
      tag: 'text-xs',
      tagMargin: 'mt-1'
    },
    large: { 
      icon: 'w-32 h-32', 
      oro: 'text-3xl', 
      learn: 'text-3xl', 
      tag: 'text-sm',
      tagMargin: 'mt-2'
    },
    nav: { 
      icon: 'w-10 h-10', 
      oro: 'text-lg', 
      learn: 'text-lg', 
      tag: 'hidden', // Hide tag line inside headers to keep them professional
      tagMargin: 'mt-0'
    }, 
  };

  const sizing = sizes[size] || sizes.large;

  // Handles the high-speed spin around the custom coordinate center
  const spinnerStyle = isLoading 
    ? { transformOrigin: '100px 100px', animation: 'spin 0.8s linear infinite' } 
    : {};

  return (
    <div className="flex items-center justify-center">
      
      {/* ================= FULL HORIZONTAL LOGO ================= */}
      {variant === 'full' && (
        <div className="flex items-center gap-3 max-w-5xl">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`${sizing.icon} flex-shrink-0`}>
            
            {/* SPINNING GROUP: Outer mandala structures, petals, and dots */}
            <g style={spinnerStyle}>
              <circle cx="100" cy="100" r="98" fill="none" stroke="#C9A85E" strokeWidth="1.5" opacity="0.4" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A85E" strokeWidth="1.2" opacity="0.3" strokeDasharray="3,3" />
              <ellipse cx="100" cy="35" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
              <ellipse cx="144" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(45 144 48)" />
              <ellipse cx="165" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(90 165 100)" />
              <ellipse cx="144" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(135 144 152)" />
              <ellipse cx="100" cy="165" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
              <ellipse cx="56" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(225 56 152)" />
              <ellipse cx="35" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(270 35 100)" />
              <ellipse cx="56" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(315 56 48)" />
              <circle cx="100" cy="60" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="140" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="100" cy="140" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="60" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
            </g>

            {/* STATIC GROUP: Center Core (Stays perfectly still) */}
            <circle cx="100" cy="100" r="26" fill="#1a2a4e" />
            <circle cx="100" cy="88" r="7" fill="#C9A85E" />
            <path d="M 93 95 L 93 100 Q 93 105 100 105 Q 107 105 107 100 L 107 95" fill="none" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 100 105 L 100 112" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" />
            <polygon points="100,112 97,108 103,108" fill="#C9A85E" />
          </svg>

          {/* Text Section with reset line-heights and margins */}
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-baseline gap-1">
              <h1 className={`${sizing.oro} font-bold m-0 p-0 leading-none`} style={{ color: '#C9A85E', fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                ORO
              </h1>
              <h1 className={`${sizing.learn} font-bold m-0 p-0 leading-none`} style={{ color: isDark ? '#ffffff' : '#1a2a4e', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                Learn
              </h1>
            </div>
            <p className={`${sizing.tag} ${sizing.tagMargin} font-semibold tracking-wider p-0 leading-none`} style={{ color: isDark ? '#94a3b8' : '#1a2a4e', letterSpacing: '0.06em', fontFamily: "sans-serif" }}>
              SMARTER LEARNING STARTS HERE
            </p>
          </div>
        </div>
      )}

      {/* ================= STACKED LOGO ================= */}
      {variant === 'stacked' && (
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`${sizing.icon}`}>
            <g style={spinnerStyle}>
              <circle cx="100" cy="100" r="98" fill="none" stroke="#C9A85E" strokeWidth="1.5" opacity="0.4" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A85E" strokeWidth="1.2" opacity="0.3" strokeDasharray="3,3" />
              <ellipse cx="100" cy="35" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
              <ellipse cx="144" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(45 144 48)" />
              <ellipse cx="165" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(90 165 100)" />
              <ellipse cx="144" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(135 144 152)" />
              <ellipse cx="100" cy="165" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
              <ellipse cx="56" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(225 56 152)" />
              <ellipse cx="35" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(270 35 100)" />
              <ellipse cx="56" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(315 56 48)" />
              <circle cx="100" cy="60" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="140" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="100" cy="140" r="3" fill="#C9A85E" opacity="0.6" />
              <circle cx="60" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
            </g>

            <circle cx="100" cy="100" r="26" fill="#1a2a4e" />
            <circle cx="100" cy="88" r="7" fill="#C9A85E" />
            <path d="M 93 95 L 93 100 Q 93 105 100 105 Q 107 105 107 100 L 107 95" fill="none" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 100 105 L 100 112" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" />
            <polygon points="100,112 97,108 103,108" fill="#C9A85E" />
          </svg>

          <div className="text-center flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5 justify-center leading-none">
              <h1 className={`${sizing.oro} font-bold m-0 p-0`} style={{ color: '#C9A85E', fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                ORO
              </h1>
              <h1 className={`${sizing.learn} font-bold m-0 p-0`} style={{ color: theme === 'dark' ? '#ffffff' : '#1a2a4e', fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>
                Learn
              </h1>
            </div>
            <p className={`${sizing.tag} m-0 p-0`} style={{ color: theme === 'dark' ? '#94a3b8' : '#1a2a4e', letterSpacing: '0.06em', fontFamily: "sans-serif" }}>
              SMARTER LEARNING STARTS HERE
            </p>
          </div>
        </div>
      )}

      {/* ================= ICON ONLY ================= */}
      {variant === 'icon' && (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`${sizing.icon}`}>
          <g style={spinnerStyle}>
            <circle cx="100" cy="100" r="98" fill="none" stroke="#C9A85E" strokeWidth="1.5" opacity="0.4" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A85E" strokeWidth="1.2" opacity="0.3" strokeDasharray="3,3" />
            <ellipse cx="100" cy="35" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
            <ellipse cx="144" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(45 144 48)" />
            <ellipse cx="165" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(90 165 100)" />
            <ellipse cx="144" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(135 144 152)" />
            <ellipse cx="100" cy="165" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
            <ellipse cx="56" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(225 56 152)" />
            <ellipse cx="35" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(270 35 100)" />
            <ellipse cx="56" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(315 56 48)" />
            <circle cx="100" cy="60" r="3" fill="#C9A85E" opacity="0.6" />
            <circle cx="140" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
            <circle cx="100" cy="140" r="3" fill="#C9A85E" opacity="0.6" />
            <circle cx="60" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
          </g>

          <circle cx="100" cy="100" r="26" fill="#1a2a4e" />
          <circle cx="100" cy="88" r="7" fill="#C9A85E" />
          <path d="M 93 95 L 93 100 Q 93 105 100 105 Q 107 105 107 100 L 107 95" fill="none" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 100 105 L 100 112" stroke="#C9A85E" strokeWidth="2" strokeLinecap="round" />
          <polygon points="100,112 97,108 103,108" fill="#C9A85E" />
        </svg>
      )}
    </div>
  );
};

export default OROLearnLogo;
