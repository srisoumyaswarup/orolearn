import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 2.5 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete
      setTimeout(onComplete, 600);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center z-[9999] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#C9A85E]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-[#1a2a4e]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center relative z-10">
        {/* Animated Logo */}
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-48 drop-shadow-xl"
        >
          {/* Outer decorative circle - mandala inspired */}
          <circle cx="100" cy="100" r="98" fill="none" stroke="#C9A85E" strokeWidth="1.5" opacity="0.4" />

          {/* Inner mandala circle - Indian geometric pattern */}
          <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A85E" strokeWidth="1.2" opacity="0.3" strokeDasharray="3,3" />

          {/* Lotus petals - 8 petals with spinner animation */}
          <g className="spinner-petals">
            {/* Top petal */}
            <ellipse cx="100" cy="35" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
            {/* Top-right petal */}
            <ellipse cx="144" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(45 144 48)" />
            {/* Right petal */}
            <ellipse cx="165" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(90 165 100)" />
            {/* Bottom-right petal */}
            <ellipse cx="144" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(135 144 152)" />
            {/* Bottom petal */}
            <ellipse cx="100" cy="165" rx="12" ry="20" fill="#C9A85E" opacity="0.7" />
            {/* Bottom-left petal */}
            <ellipse cx="56" cy="152" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(225 56 152)" />
            {/* Left petal */}
            <ellipse cx="35" cy="100" rx="12" ry="20" fill="#C9A85E" opacity="0.7" transform="rotate(270 35 100)" />
            {/* Top-left petal */}
            <ellipse cx="56" cy="48" rx="12" ry="20" fill="#C9A85E" opacity="0.65" transform="rotate(315 56 48)" />
          </g>

          {/* Center circle - represents unity/core */}
          <circle cx="100" cy="100" r="26" fill="#1a2a4e" />

          {/* Student/Learner Icon - Learning App Symbol */}
          {/* Head - student/person */}
          <circle cx="100" cy="88" r="7" fill="#C9A85E" />

          {/* Body/Shoulders */}
          <path
            d="M 93 95 L 93 100 Q 93 105 100 105 Q 107 105 107 100 L 107 95"
            fill="none"
            stroke="#C9A85E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward growth arrow - learning progress */}
          <path
            d="M 100 105 L 100 112"
            stroke="#C9A85E"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Arrow head pointing up */}
          <polygon points="100,112 97,108 103,108" fill="#C9A85E" />

          {/* Small decorative dots - chakra points */}
          <circle cx="100" cy="60" r="3" fill="#C9A85E" opacity="0.6" />
          <circle cx="140" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
          <circle cx="100" cy="140" r="3" fill="#C9A85E" opacity="0.6" />
          <circle cx="60" cy="100" r="3" fill="#C9A85E" opacity="0.6" />
        </svg>

        {/* Loading Text */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-[#1a2a4e] mb-3">ORO Learn</h2>
          <p className="text-[#C9A85E] text-sm font-semibold tracking-widest uppercase">
            Loading Your Journey...
          </p>
        </div>

        {/* Animated Progress Dots */}
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C9A85E] animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#C9A85E] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#C9A85E] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spinPetals {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spinner-petals {
          animation: spinPetals 3s linear infinite;
          transform-origin: 100px 100px;
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        svg {
          animation: fadeInScale 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
