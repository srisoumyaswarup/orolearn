import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
};

function EducatorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const pullProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/onboarding');

      const { data } = await supabase.from('educators').select('*').eq('id', user.id).single();
      if (!data) return navigate('/onboarding');
      setProfile(data);
    };
    pullProfileData();
  }, [navigate]);

  if (!profile) return <div className="min-h-screen flex items-center justify-center font-mono">Loading Educator Session...</div>;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <aside className="w-64 border-r flex flex-col justify-between bg-white border-slate-200">
        <div>
          {/* LOGO REDIRECT LOGIC RESOLVED STRAIGHT TO ACTIVE HOME HUB PATHWAYS */}
          <div onClick={() => navigate('/home')} className="p-6 cursor-pointer transform hover:scale-[1.01] transition-transform">
            <OROLearnLogo variant="full" size="nav" theme="light" />
          </div>
          <nav className="px-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-bold bg-[#1a2a4e] text-white">{Icons.overview} <span>Overview</span></button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="w-full flex items-center space-x-3 p-3 text-slate-400 hover:text-red-500 font-bold">{Icons.logout} <span>Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center z-30">
          <h2 className="text-sm font-bold">Welcome back, Professor {profile.full_name.split(' ')[0]}</h2>
          <button onClick={() => navigate('/home')} className="p-2 text-slate-400 hover:text-slate-800">{Icons.home}</button>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-center border-slate-200">
            <div className="w-24 h-24 rounded-full border overflow-hidden bg-slate-100 shrink-0">
              {profile.profile_pic ? <img src={profile.profile_pic} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-[#1a2a4e] flex items-center justify-center text-white text-3xl font-bold">{profile.full_name.charAt(0)}</div>}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-1">{profile.full_name}</h2>
              <p className="text-[#C9A85E] font-bold text-sm">{profile.academic?.subjects?.[0] || 'Expert Mentor'} Instructor</p>
              <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-lg font-mono text-xs text-slate-600 font-bold border">{profile.oro_badge_id}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EducatorDashboard;