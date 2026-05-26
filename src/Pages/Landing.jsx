import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';

function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans flex flex-col relative overflow-x-hidden">
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-50">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <OROLearnLogo variant="full" size="nav" theme="dark" />
        </div>

        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-300">
          <a href="#features" className="hover:text-[#C9A85E] transition-colors">Features</a>
          <a href="#about" className="hover:text-[#C9A85E] transition-colors">About</a>
          <a href="#privacy" className="hover:text-[#C9A85E] transition-colors">Privacy</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/onboarding')} className="px-6 py-2.5 bg-transparent border border-slate-700 text-sm font-bold rounded-xl hover:border-white transition-all">Sign In</button>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-2.5 bg-[#C9A85E] text-slate-900 text-sm font-black rounded-xl hover:bg-[#b39654] transition-all shadow-lg">Get Started</button>
        </div>

        {/* 3-HORIZON MORPHING HAMBURGER COMPONENT BUTTON */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 md:hidden focus:outline-none relative z-50 bg-slate-800/40 border border-slate-700/50 rounded-xl"
          aria-label="Toggle Menu"
        >
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </header>

      {/* MOBILE EXPANSION SLIDEOUT DRAWER */}
      <div className={`fixed inset-0 bg-[#0B1120]/98 backdrop-blur-lg z-40 md:hidden flex flex-col justify-center items-center transition-all duration-500 ease-in-out px-8 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-6 text-xl font-bold tracking-wide text-slate-200 mb-12">
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A85E] transition-colors">Features</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A85E] transition-colors">About</a>
          <a href="#privacy" onClick={() => setIsMenuOpen(false)} className="hover:text-[#C9A85E] transition-colors">Privacy Policy</a>
        </nav>
        <div className="w-full flex flex-col gap-4 max-w-xs">
          <button onClick={() => { setIsMenuOpen(false); navigate('/onboarding'); }} className="w-full py-3.5 bg-slate-900 border border-slate-700 font-bold rounded-xl text-sm tracking-wide">Sign In</button>
          <button onClick={() => { setIsMenuOpen(false); navigate('/onboarding'); }} className="w-full py-3.5 bg-[#C9A85E] text-slate-900 font-black rounded-xl text-sm tracking-wide">Get Started 🚀</button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center relative z-10 py-12 md:py-24">
        <div className="absolute top-[-20%] w-[80vw] h-[80vw] bg-[#C9A85E]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-[#C9A85E] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Autonomous Indian Learning System</div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mb-6">
          Direct Mentorship. <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A85E] via-amber-200 to-white">Zero Boundaries.</span>
        </h1>
        <p className="text-slate-400 font-medium text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
          Connect seamlessly with India's top certified mentors. Choose your goals, configure language nodes, and unlock absolute tracking dominance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <button onClick={() => navigate('/onboarding')} className="w-full sm:w-auto px-10 py-4 bg-[#C9A85E] text-slate-900 font-black rounded-xl text-base shadow-2xl hover:scale-105 transition-all">Begin Onboarding Pass</button>
        </div>
      </main>
    </div>
  );
}

export default Landing;