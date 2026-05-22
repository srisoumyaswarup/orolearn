import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import SplashScreen from '../components/SplashScreen';
import { supabase } from '../supabaseClient'; // Imported Supabase Client

// Professional SVGs (Zero Emojis)
const Icons = {
  sun: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  moon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  video: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  chat: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  shield: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  chart: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  arrowRight: <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
};

const FadeInView = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.unobserve(domRef.current); };
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

function Landing() {
  const navigate = useNavigate(); 
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [showSplash, setShowSplash] = useState(true);
  
  // New States to track if the user has an active, onboarded profile
  const [userSession, setUserSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkActiveUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserSession(session.user);
        
        // Let's check which table they belong to
        const { data: studentData } = await supabase.from('students').select('is_onboarding_complete').eq('id', session.user.id).single();
        if (studentData) {
          setUserRole('student');
          return;
        }

        const { data: educatorData } = await supabase.from('educators').select('is_onboarding_complete').eq('id', session.user.id).single();
        if (educatorData) {
          setUserRole('educator');
        }
      }
    };
    checkActiveUser();
  }, []);

  const handleDashboardRedirect = () => {
    if (userRole === 'educator') navigate('/educator-dashboard');
    else navigate('/student-dashboard');
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <div className={`min-h-screen font-sans transition-colors duration-500 relative overflow-x-hidden ${isDarkMode ? 'bg-[#0B1120] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
        
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#C9A85E]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-[#1a2a4e]/5 rounded-full blur-[120px] pointer-events-none dark:bg-blue-900/10"></div>
        
        {/* ================= STICKY HEADER NAVIGATION ================= */}
        <nav className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-xl ${isDarkMode ? 'bg-[#0B1120]/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => navigate('/')}>
              <OROLearnLogo variant="full" size="nav" theme={isDarkMode ? "dark" : "light"} isLoading={false} />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <button onClick={() => navigate('/how-it-works')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>How it Works</button>
              <button onClick={() => navigate('/privacy-policy')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>Privacy Policy</button>
              
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`ml-2 p-2.5 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-[#C9A85E] hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:text-[#C9A85E] hover:bg-slate-200'}`}>
                {isDarkMode ? Icons.sun : Icons.moon}
              </button>

              <div className={`flex items-center ml-4 space-x-4 border-l pl-5 transition-colors ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                {userSession ? (
                  <button onClick={handleDashboardRedirect} className="bg-[#1a2a4e] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all shadow-md">
                    Go to Dashboard 🚀
                  </button>
                ) : (
                  <>
                    <button onClick={() => navigate('/onboarding')} className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white hover:text-[#C9A85E]' : 'text-[#1a2a4e] hover:text-[#C9A85E]'}`}>Sign In</button>
                    <button onClick={() => navigate('/onboarding')} className="bg-[#1a2a4e] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all shadow-md">
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ================= HERO ACTION SECTION ================= */}
        <section className="pt-32 pb-16 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 min-h-[90vh]">
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
            <div className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-8 ${isDarkMode ? 'bg-[#C9A85E]/10 border-[#C9A85E]/20 text-[#C9A85E]' : 'bg-[#C9A85E]/10 border-[#C9A85E]/30 text-[#b38f40]'}`}>
              The Future of 1-on-1 Learning
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Unlock your <br/>
              <span className="text-[#C9A85E] relative">
                Academic Potential.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#C9A85E]/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
              </span>
            </h1>
            <p className={`text-lg max-w-xl mb-10 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Connect with India's top mentors and certified educators for personalized learning that fits your schedule, board, and budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {userSession ? (
                <button onClick={handleDashboardRedirect} className="w-full sm:w-auto px-8 py-4 bg-[#1a2a4e] text-white rounded-xl font-bold shadow-lg hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all flex items-center justify-center">
                  Open Workspace Dashboard {Icons.arrowRight}
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/onboarding')} className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'bg-[#C9A85E] text-slate-900 hover:bg-white' : 'bg-[#1a2a4e] text-white hover:bg-[#C9A85E] hover:text-[#1a2a4e]'}`}>
                    Join as Educator {Icons.arrowRight}
                  </button>
                  <button onClick={() => navigate('/onboarding')} className={`w-full sm:w-auto border-2 px-8 py-4 rounded-xl font-bold backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'}`}>
                    Join as Student
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative mt-16 lg:mt-0 lg:pl-10 h-[400px] sm:h-[500px] flex items-center justify-center">
             <div className={`w-[80%] h-[80%] rounded-[2rem] shadow-2xl relative border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`h-12 border-b flex items-center px-6 gap-2 ${isDarkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 space-y-4 opacity-50">
                   <div className={`h-6 w-1/3 rounded-md ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                   <div className={`h-24 w-full rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                   <div className={`h-24 w-full rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                </div>
             </div>

             <div className={`absolute top-10 left-0 lg:-left-10 p-5 rounded-2xl shadow-2xl border backdrop-blur-md animate-float ${isDarkMode ? 'bg-[#0B1120]/80 border-slate-700' : 'bg-white/90 border-slate-100'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Students Onboarded</p>
                <h3 className="text-3xl font-bold text-[#C9A85E] mb-3">12,450+</h3>
                <div className="flex -space-x-2">
                   {['bg-blue-500', 'bg-red-500', 'bg-emerald-500', 'bg-purple-500'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'} ${color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>{String.fromCharCode(65+i)}</div>
                   ))}
                   <div className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-slate-800 bg-slate-700 text-slate-300' : 'border-white bg-slate-100 text-slate-600'} flex items-center justify-center text-[10px] font-bold`}>+2k</div>
                </div>
             </div>

             <div className={`absolute bottom-10 right-0 lg:-right-4 p-5 rounded-2xl shadow-2xl border backdrop-blur-md animate-float-delayed ${isDarkMode ? 'bg-[#1a2a4e]/90 border-blue-900/50' : 'bg-[#1a2a4e]/95 border-[#1a2a4e]'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A85E] mb-1">Verified Educators</p>
                <h3 className="text-3xl font-bold text-white mb-3">3,200+</h3>
                 <div className="flex -space-x-2">
                   {['bg-indigo-500', 'bg-orange-500', 'bg-teal-500'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#1a2a4e] ${color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>{String.fromCharCode(88-i)}</div>
                   ))}
                   <div className={`w-8 h-8 rounded-full border-2 border-[#1a2a4e] bg-white text-[#1a2a4e] flex items-center justify-center text-[10px] font-bold`}>+</div>
                </div>
             </div>
          </div>
        </section>

        {/* ================= BRAND EQUITY BANNER ================= */}
        <FadeInView delay={100} className={`py-8 border-y ${isDarkMode ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-200 bg-white'}`}>
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Educators from top institutions</p>
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap opacity-50 grayscale">
              {['IIT Mentors', 'AIIMS Alumni', 'NIT Scholars', 'Delhi University', 'Central Board Experts'].map((inst, i) => (
                <h4 key={i} className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{inst}</h4>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* ================= HIGH-LEVEL VALUE PROPOSITIONS ================= */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why choose ORO Learn?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">We provide a secure, seamless environment for premium education to happen anywhere.</p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Icons.video} title="Live Studio HD" desc="Built-in video infrastructure for crystal clear 1-on-1 sessions without external links." isDark={isDarkMode} delay={100} />
            <FeatureCard icon={Icons.shield} title="Verified Tutors" desc="Every educator goes through a strict KYC and qualification check." isDark={isDarkMode} delay={200} />
            <FeatureCard icon={Icons.chat} title="Secure Chat" desc="Communicate, share files, and clear doubts without sharing personal phone numbers." isDark={isDarkMode} delay={300} />
            <FeatureCard icon={Icons.chart} title="Smart Tracking" desc="Automated attendance, performance scores, and ORO points to track progress." isDark={isDarkMode} delay={400} />
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#0B1120] text-slate-400 py-12 px-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
               <h1 className="text-2xl font-bold tracking-tight text-white mb-4">ORO<span className="text-[#C9A85E]">LEARN</span></h1>
               <p className="text-sm max-w-sm">Elevating education through transparent, premium 1-on-1 mentorship across India.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/onboarding')} className="hover:text-white transition-colors">Join as Student</button></li>
                <li><button onClick={() => navigate('/onboarding')} className="hover:text-white transition-colors">Join as Educator</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 ORO Learn. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ in India</p>
          </div>
        </footer>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
          @keyframes float-delayed { 0% { transform: translateY(0px); } 50% { transform: translateY(10px); } 100% { transform: translateY(0px); } }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        `}} />
      </div>
    </>
  );
}

const FeatureCard = ({ icon, title, desc, delay, isDark }) => (
  <FadeInView delay={delay} className={`p-8 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-[#1e293b] border-slate-700 hover:border-slate-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isDark ? 'bg-slate-800 text-[#C9A85E]' : 'bg-blue-50 text-blue-600'}`}>{icon}</div>
    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
  </FadeInView>
);

export default Landing;