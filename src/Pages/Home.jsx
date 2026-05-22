import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  location: <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>,
  feed: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h3" /></svg>,
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  bell: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
};

function Home() {
  const navigate = useNavigate();
  const [educators, setEducators] = useState([]);
  const [filteredEducators, setFilteredEducators] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  // Notification system states
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchCoreHubData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/onboarding');

      let { data: profile } = await supabase.from('students').select('*').eq('id', user.id).single();
      let role = 'student';
      if (!profile) {
        const { data: edProf } = await supabase.from('educators').select('*').eq('id', user.id).single();
        profile = edProf;
        role = 'educator';
      }
      setUserProfile({ ...profile, userRole: role });

      // Load validated educators
      const { data: edList } = await supabase.from('educators').select('*').eq('is_onboarding_complete', true);
      if (edList) {
        setEducators(edList);
        setFilteredEducators(edList);
      }

      // Load real-time system notifications for the logged-in individual
      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (notifs) setNotifications(notifs);

      // Initialize real-time event listener pipeline
      supabase.channel('custom-filter-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          payload => { setNotifications(prev => [payload.new, ...prev]); }
        ).subscribe();
    };
    fetchCoreHubData();
  }, [navigate]);

  useEffect(() => {
    let output = educators;
    if (searchQuery.trim()) output = output.filter(ed => ed.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedSubject) output = output.filter(ed => ed.academic?.subjects?.includes(selectedSubject));
    if (selectedState) output = output.filter(ed => ed.location?.state === selectedState);
    setFilteredEducators(output);
  }, [searchQuery, selectedSubject, selectedState, educators]);

  // FIXED: Added missing context routing handler to connect buttons with dashboard layout matrices
  const handleDashboardRoute = () => {
    if (userProfile?.userRole === 'educator') {
      navigate('/educator-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  // Mock booking execution trigger framework to fire system alerts
  const handleBookingExecution = async (educatorId, educatorName) => {
    try {
      // 1. Alert the Targeted Educator Node immediately
      await supabase.from('notifications').insert([{
        user_id: educatorId,
        title: "New Student Booking Confirmed 📅",
        message: `${userProfile.full_name} has booked an onboarding consultation session with you. Please review your active schedule.`,
        type: "booking_received"
      }]);

      // 2. Log confirmation directly to the booking Student's console logs
      await supabase.from('notifications').insert([{
        user_id: userProfile.id,
        title: "Tutor Booking Dispatched!",
        message: `Your appointment tracking token with ${educatorName} was generated successfully. Check your schedule container for room keys.`,
        type: "booking_confirmed"
      }]);

      alert(`Booking tracking event with ${educatorName} successfully dispatched across secure production networks!`);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16 relative">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-8 py-4 flex justify-between items-center">
        <div onClick={() => navigate('/home')} className="cursor-pointer"><OROLearnLogo variant="full" size="nav" theme="light" /></div>
        <div className="flex items-center gap-4 relative">
          
          {/* NOTIFICATION HUB CONTROLLER BUTTON */}
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors">
            {Icons.bell}
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>}
          </button>

          {/* SYSTEM DROP-DOWN NOTIFICATION INTERACTION COMPONENT CONTAINER */}
          {showNotifDropdown && (
            <div className="absolute top-12 right-24 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-scale-in max-h-[360px] overflow-y-auto">
              <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black tracking-wide text-slate-900">Notifications</span>
                {unreadCount > 0 && <button className="text-[10px] text-blue-600 font-bold" onClick={async () => { await supabase.from('notifications').update({ is_read: true }).eq('user_id', userProfile.id); setNotifications(prev => prev.map(n => ({...n, is_read: true}))); }}>Clear All</button>}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs font-semibold text-slate-400">System event inbox empty.</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-50 text-left transition-colors ${!n.is_read ? 'bg-blue-50/50' : 'bg-white'}`}>
                    <h5 className="text-xs font-bold text-slate-900 mb-0.5">{n.title}</h5>
                    <p className="text-[11px] font-medium text-slate-500 leading-normal">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          )}

          <button onClick={() => navigate('/feed')} className="flex items-center gap-2 text-sm font-bold border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all">{Icons.feed} Feed Hub</button>
          <button onClick={handleDashboardRoute} className="flex items-center gap-2 text-sm font-bold bg-[#1a2a4e] text-white px-5 py-2.5 rounded-xl hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all">{Icons.dashboard} Workspace</button>
        </div>
      </header>

      <section className="bg-[#1a2a4e] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#111a33] to-[#253b6e] z-0"></div>
        <div className="max-w-6xl w-full mx-auto relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Discover Elite Mentorship.</h1>
          <p className="text-slate-300 font-medium text-sm max-w-xl">Cross-reference verified educators across structural educational taxonomies globally.</p>
          <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 max-w-4xl text-slate-800">
            <div className="flex-1 flex items-center gap-3 px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
              <span className="text-slate-400">{Icons.search}</span>
              <input type="text" placeholder="Search mentors by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducators.map(ed => (
            <div key={ed.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-12 h-12 rounded-full overflow-hidden mb-4 border">
                  {ed.profile_pic ? <img src={ed.profile_pic} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-200" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{ed.full_name}</h3>
                <p className="text-xs font-semibold text-slate-400 mb-2">{ed.location?.city}, {ed.location?.state}</p>
                <p className="text-xs font-medium text-slate-600 line-clamp-2">Expertise domain specialized in standard board qualifications.</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-4">
                <span className="text-sm font-black">₹{ed.preferences?.pricing?.hourlyRate || '400'}<span className="text-xs text-slate-400 font-medium">/hr</span></span>
                <button onClick={() => handleBookingExecution(ed.id, ed.full_name)} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#C9A85E] hover:text-slate-900 transition-all">Connect Profile</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;