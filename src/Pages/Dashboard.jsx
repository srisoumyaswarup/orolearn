import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  schedule: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>,
  video: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  library: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  sun: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  moon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  chat: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  attendance: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  lock: <svg className="w-8 h-8 mb-4 text-[#1a2a4e] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
};

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVerified, setIsVerified] = useState(false); 
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  // Realtime notification state matrix
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const pullProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/onboarding');

      const { data } = await supabase.from('students').select('*').eq('id', user.id).single();
      if (!data) return navigate('/onboarding');
      
      setProfile(data);
      setIsVerified(data.is_onboarding_complete);

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (notifs) setNotifications(notifs);

      supabase.channel(`student-notif-${user.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          payload => { setNotifications(prev => [payload.new, ...prev]); }
        ).subscribe();
    };
    pullProfileData();
  }, [navigate]);

  if (!profile) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono">Authenticating Token...</div>;

  const calculateAge = (dob) => {
    if (!dob) return '22';
    return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      <aside className={`w-20 lg:w-64 border-r flex flex-col z-20 fixed h-full transition-colors duration-300 justify-between ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          {/* LOGO NAVIGATION ROUTED DIRECTLY TO CORE HOME SCREEN PLATFORM */}
          <div onClick={() => navigate('/home')} className="p-6 mb-4 cursor-pointer flex justify-center lg:justify-start transform hover:scale-[1.02] transition-transform">
            <OROLearnLogo variant="full" size="nav" theme={isDarkMode ? 'dark' : 'light'} />
          </div>
          <nav className="px-3 space-y-1">
            <NavItem icon={Icons.overview} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} isDark={isDarkMode} />
            <NavItem icon={Icons.schedule} label="Scheduled Classes" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} isDark={isDarkMode} />
            <NavItem icon={Icons.video} label="Online Classes" active={activeTab === 'online_classes'} onClick={() => setActiveTab('online_classes')} isDark={isDarkMode} />
            <NavItem icon={Icons.attendance} label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} isDark={isDarkMode} />
            <NavItem icon={Icons.chat} label="Messages" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isDark={isDarkMode} />
            <NavItem icon={Icons.library} label="Library" active={activeTab === 'library'} onClick={() => setActiveTab('library')} isDark={isDarkMode} />
            <NavItem icon={Icons.settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} isDark={isDarkMode} />
          </nav>
        </div>
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
           <button onClick={async () => { await supabase.auth.signOut(); navigate('/'); }} className="w-full flex items-center space-x-3 p-3 rounded-lg font-medium text-slate-500 hover:text-red-500">{Icons.logout} <span className="hidden lg:block">Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto min-h-screen">
        <header className={`sticky top-0 z-30 border-b px-8 py-4 flex justify-between items-center ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
          <h2 className="text-sm font-semibold">Ready to learn, {profile.full_name.split(' ')[0]}</h2>
          <div className="flex items-center gap-5 relative">
             <button onClick={() => navigate('/home')} className="p-2 text-slate-400 hover:text-slate-800 transition-colors" title="Discover Hub">{Icons.home}</button>
             
             {/* TOP BAR REALTIME NOTIFICATION POP PANEL */}
             <div className="relative">
               <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors relative">
                 {Icons.bell}
                 {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
               </button>
               {showNotifDropdown && (
                 <div className={`absolute top-10 right-0 w-80 rounded-xl shadow-2xl border py-3 z-50 max-h-[300px] overflow-y-auto text-left ${isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
                   <div className="px-4 pb-2 border-b font-bold text-xs flex justify-between items-center">
                     <span>System Events</span>
                     {unreadCount > 0 && <button className="text-[10px] text-blue-500" onClick={async () => { await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id); setNotifications(prev => prev.map(n => ({...n, is_read: true}))); }}>Mark Read</button>}
                   </div>
                   {notifications.length === 0 ? (
                     <div className="p-4 text-center text-xs text-slate-400">Notification dashboard empty.</div>
                   ) : (
                     notifications.map(n => (
                       <div key={n.id} className={`p-3 border-b text-xs ${!n.is_read ? (isDarkMode ? 'bg-slate-800/40' : 'bg-blue-50/40') : ''} ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                         <h6 className="font-bold mb-0.5">{n.title}</h6>
                         <p className="text-slate-400 leading-tight">{n.message}</p>
                       </div>
                     ))
                   )}
                 </div>
               )}
             </div>

             <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-slate-400">{isDarkMode ? Icons.sun : Icons.moon}</button>
             <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border">
               {profile.profile_pic ? <img src={profile.profile_pic} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full bg-[#1a2a4e] flex items-center justify-center text-xs text-white">{profile.full_name.charAt(0)}</div>}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-6 relative">
          {activeTab === 'overview' && (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isVerified ? 'z-10 relative' : ''}`}>
              
              {/* BRAND CARD WRAPPER WITH STRUCTURAL FIXES */}
              <div className={`lg:col-span-2 rounded-2xl border p-8 shadow-sm flex flex-col justify-between min-h-[240px] ${isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student System Badge</h3>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold">Active Profile</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden shrink-0 shadow-md bg-slate-50">
                    {profile.profile_pic ? <img src={profile.profile_pic} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full bg-[#1a2a4e] flex items-center justify-center text-3xl text-white">{profile.full_name.charAt(0)}</div>}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">{profile.full_name}</h2>
                    <p className="text-[#C9A85E] font-bold text-sm mb-4">{profile.academic?.baseLevel || 'Bachelors'} — <span className="text-slate-400 font-medium">{profile.academic?.stream || 'General Academic'}</span></p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-xs font-bold">
                      <span className="px-3 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">{profile.oro_badge_id || 'ORO-STU-MOCK'}</span>
                      <span className="px-3 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-500">{calculateAge(profile.dob)} Yrs • {profile.gender || 'Male'}</span>
                    </div>
                  </div>
                  <div onClick={() => setIsQrModalOpen(true)} className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 cursor-pointer hover:scale-105 transition-transform shrink-0">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${profile.oro_badge_id || 'ORO-STU-MOCK'}&color=C9A85E&bgcolor=${isDarkMode ? '1e293b' : 'ffffff'}`} className="w-16 h-16 rounded-lg opacity-90" alt="QR" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <StatCard label="State Rank" value="#42" isDark={isDarkMode} />
                <StatCard label="ORO Points" value="1,250" color="text-[#C9A85E]" isDark={isDarkMode} />
              </div>
            </div>
          )}

          <div className="relative">
            {!isVerified && (
               <div className="absolute inset-0 z-40 backdrop-blur-md flex flex-col items-center justify-start pt-20">
                 <div className="p-8 rounded-2xl shadow-lg flex flex-col items-center max-w-sm text-center border bg-white dark:bg-[#1e293b]">
                    {Icons.lock}
                    <h3 className="text-xl font-bold tracking-tight mb-2">Verification Pending</h3>
                    <p className="text-slate-500 text-sm mb-6">Your profile is currently under review. Features will unlock automatically once verified.</p>
                 </div>
               </div>
            )}

            {activeTab === 'chat' && (
              <div className={`rounded-2xl border p-8 text-center ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xl font-bold mb-2">Live Connected Classroom Chat</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">Once you confirm an appointment booking from the discover grid, a real-time communications token mounts right here automatically.</p>
              </div>
            )}

            {activeTab === 'settings' && (
               <div className="rounded-2xl border p-8 bg-white dark:bg-[#1e293b]">
                  <h3 className="text-lg font-bold mb-6">Developer Controls</h3>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <span className="text-sm font-medium">Bypass Security Lock (Demo Toggle)</span>
                    <button onClick={() => setIsVerified(!isVerified)} className="bg-[#C9A85E] text-white px-4 py-2 rounded-lg text-sm font-semibold">Toggle Lock</button>
                  </div>
               </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'chat' && (
               <div className="rounded-2xl border p-12 text-center bg-white dark:bg-[#1e293b]">
                  <h3 className="text-xl font-bold mb-2 capitalize">{activeTab.replace('_', ' ')}</h3>
                  <p className="text-slate-500 text-sm">Active pipeline connection securely synced with Supabase.</p>
               </div>
            )}
          </div>
        </div>
      </main>

      {isQrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsQrModalOpen(false)}>
          <div className={`rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${profile.oro_badge_id || 'ORO-STU-MOCK'}&color=C9A85E&bgcolor=${isDarkMode ? '1e293b' : 'ffffff'}`} alt="Student QR Code" className="w-48 h-48 rounded-xl border p-2" />
            <h3 className="text-xl font-bold tracking-tight mt-4 mb-4">Scan to Connect</h3>
            <button onClick={() => setIsQrModalOpen(false)} className="w-full font-semibold py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, isDark }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-[#1a2a4e] text-white' : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
    {icon} <span className="hidden lg:block">{label}</span>
  </button>
);

const StatCard = ({ label, value, color, isDark }) => (
  <div className={`rounded-2xl border p-5 shadow-sm flex flex-col justify-center ${isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'}`}>
    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
    <div className={`text-2xl font-bold ${color || (isDark ? 'text-white' : 'text-slate-900')}`}>{value}</div>
  </div>
);

export default Dashboard;