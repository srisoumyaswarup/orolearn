import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  google: <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  microsoft: <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>,
  mail: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  lock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
};

function Onboarding() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await routeUserContext(session.user);
    };
    checkActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await routeUserContext(session.user);
      }
    });
    return () => subscription.unsubscribe();
  }, [role]);

  const routeUserContext = async (user) => {
    const { data: student } = await supabase.from('students').select('*').eq('id', user.id).single();
    if (student) return navigate('/home');

    const { data: educator } = await supabase.from('educators').select('*').eq('id', user.id).single();
    if (educator) return navigate('/home');

    const destination = role === 'educator' ? '/educator-setup' : '/student-setup';
    navigate(destination, { state: { uid: user.id, email: user.email, fullName: user.user_metadata?.full_name || '' } });
  };

  const handleOAuth = async (provider) => {
    setErrorText('');
    try {
      const targetRedirectUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5173/onboarding'
        : `${window.location.origin}/onboarding`;

      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: { redirectTo: targetRedirectUrl }
      });
      if (error) throw error;
    } catch (err) {
      setErrorText(err.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorText('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await routeUserContext(data.user);
    } catch (err) {
      setErrorText(err.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-slate-50 relative">
      <div className="hidden lg:flex lg:w-5/12 bg-[#0B1120] text-white flex-col justify-between p-12 relative overflow-hidden shadow-2xl z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#C9A85E]/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10"><div onClick={() => navigate('/')} className="cursor-pointer inline-block"><OROLearnLogo variant="stacked" size="small" theme="dark" /></div></div>
        <div className="relative z-10 mb-20 mt-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#C9A85E]/20 border border-[#C9A85E]/30 text-[#C9A85E] text-[10px] font-black uppercase tracking-[0.2em] mb-6">{role === 'educator' ? 'Educator Network' : 'Student Platform'}</div>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-6">{role === 'educator' ? <span>Shape the future of <br/><span className="text-[#C9A85E]">Indian Education.</span></span> : <span>Unlock your true <br/><span className="text-[#C9A85E]">Academic Potential.</span></span>}</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 lg:left-12 text-sm font-bold text-gray-400 hover:text-[#C9A85E] flex items-center transition-colors"><span className="mr-2">←</span> Back Home</button>
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black text-[#1a2a4e] mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium mb-6">Access your workspace hub securely.</p>

          {errorText && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-xl tracking-wide">{errorText}</div>}

          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${role === 'educator' ? 'translate-x-full' : 'translate-x-0'}`}></div>
            <button type="button" onClick={() => setRole('student')} className={`flex-1 py-3 text-sm font-bold z-10 transition-colors duration-300 ${role === 'student' ? 'text-[#1a2a4e]' : 'text-gray-400'}`}>I am a Student</button>
            <button type="button" onClick={() => setRole('educator')} className={`flex-1 py-3 text-sm font-bold z-10 transition-colors duration-300 ${role === 'educator' ? 'text-[#1a2a4e]' : 'text-gray-400'}`}>I am an Educator</button>
          </div>

          <div className="flex gap-3 mb-6">
            <button type="button" onClick={() => handleOAuth('google')} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all">{Icons.google} Google</button>
            <button type="button" onClick={() => handleOAuth('azure')} className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all">{Icons.microsoft} Microsoft</button>
          </div>

          <div className="flex items-center my-6"><div className="flex-1 border-t border-gray-200"></div><span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">OR SECURE LOGIN</span><div className="flex-1 border-t border-gray-200"></div></div>

          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden focus-within:border-[#C9A85E] px-4 py-3.5 shadow-sm">
              <span className="text-gray-400 mr-3 mt-0.5">{Icons.mail}</span>
              <input type="email" placeholder="name@example.com" required className="w-full outline-none text-[#1a2a4e] font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden focus-within:border-[#C9A85E] px-4 py-3.5 shadow-sm">
              <span className="text-gray-400 mr-3 mt-0.5">{Icons.lock}</span>
              <input type="password" placeholder="••••••••" required minLength="6" className="w-full outline-none text-[#1a2a4e] font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="w-full bg-[#1a2a4e] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;