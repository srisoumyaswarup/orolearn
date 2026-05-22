import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  send: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  image: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  upvote: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7 7 7M5 14l7 7 7-7" /></svg>,
  comment: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
};

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initFeed = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/onboarding');
      setCurrentUser(user);

      let { data: prof } = await supabase.from('students').select('*').eq('id', user.id).single();
      let role = 'student';
      if (!prof) {
        const { data: edProf } = await supabase.from('educators').select('*').eq('id', user.id).single();
        prof = edProf;
        role = 'educator';
      }
      setProfile({ ...prof, userRole: role });
      fetchPosts();
    };
    initFeed();
  }, [navigate]);

  const fetchPosts = async () => {
    // Structural Constraint: Query posts explicitly containing non-null content logs
    const { data, error } = await supabase.from('posts').select('*').not('content', 'eq', '').order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;
    setSubmitting(true);

    try {
      let uploadedMediaUrl = "";
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const path = `feed/${currentUser.id}_${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, mediaFile);
        if (!uploadErr) {
          uploadedMediaUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
        }
      }

      await supabase.from('posts').insert([{
        author_id: currentUser.id,
        author_name: profile.full_name,
        author_role: profile.userRole,
        author_avatar: profile.profile_pic,
        content: content,
        media_url: uploadedMediaUrl,
        upvotes: []
      }]);

      setContent('');
      setMediaFile(null);
      setMediaPreview('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (postId, currentUpvotes) => {
    const hasUpvoted = currentUpvotes.includes(currentUser.id);
    const updatedUpvotes = hasUpvoted 
      ? currentUpvotes.filter(id => id !== currentUser.id)
      : [...currentUpvotes, currentUser.id];

    const { error } = await supabase.from('posts').update({ upvotes: updatedUpvotes }).eq('id', postId);
    if (!error) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: updatedUpvotes } : p));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col pb-12">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center">
        <div onClick={() => navigate('/home')} className="cursor-pointer"><OROLearnLogo variant="full" size="nav" theme="light" /></div>
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-sm font-bold bg-[#1a2a4e] text-white px-5 py-2 rounded-xl hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all">
          {Icons.home} Core Hub
        </button>
      </header>

      <div className="max-w-3xl w-full mx-auto px-4 mt-8 flex flex-col gap-6">
        {profile?.userRole === 'educator' && (
          <form onSubmit={handlePostSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border">
                {profile.profile_pic ? <img src={profile.profile_pic} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-[#1a2a4e] text-white flex items-center justify-center text-xs">{profile.full_name.charAt(0)}</div>}
              </div>
              <textarea placeholder="Announce a dynamic concept insight or masterclass update..." value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[80px] text-sm resize-none outline-none pt-2 text-slate-800 placeholder:text-slate-400 font-medium" />
            </div>

            {mediaPreview && (
              <div className="relative rounded-xl overflow-hidden border max-h-[300px]">
                <img src={mediaPreview} className="w-full h-full object-cover" alt="" />
                <button type="button" onClick={() => { setMediaFile(null); setMediaPreview(''); }} className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1.5 text-xs">✕</button>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-slate-500 hover:text-[#C9A85E] cursor-pointer text-xs font-bold transition-colors">
                {Icons.image} Add Media Asset
                <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) { setMediaFile(e.target.files[0]); setMediaPreview(URL.createObjectURL(e.target.files[0])); } }} />
              </label>
              <button type="submit" disabled={submitting} className="bg-[#1a2a4e] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#C9A85E] hover:text-[#1a2a4e] transition-all">
                {submitting ? "Publishing..." : "Broadcast"} {Icons.send}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 font-medium text-sm">No educational broadcasts found on the active timeline.</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border">
                      {post.author_avatar ? <img src={post.author_avatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{post.author_name.charAt(0)}</div>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{post.author_name}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${post.author_role === 'educator' ? 'bg-[#C9A85E]/10 text-[#b38f40]' : 'bg-slate-100 text-slate-500'}`}>{post.author_role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <p className="text-sm leading-relaxed font-medium text-slate-700 whitespace-pre-wrap">{post.content}</p>

                {post.media_url && (
                  <div className="rounded-xl overflow-hidden border max-h-[400px] bg-slate-50">
                    <img src={post.media_url} className="w-full h-full object-cover" alt="Broadcast Asset" />
                  </div>
                )}

                <div className="flex gap-4 pt-2 border-t border-slate-100">
                  <button onClick={() => handleUpvote(post.id, post.upvotes || [])} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.upvotes?.includes(currentUser?.id) ? 'text-[#C9A85E]' : 'text-slate-400 hover:text-[#C9A85E]'}`}>
                    {Icons.upvote} Upvote ({post.upvotes?.length || 0})
                  </button>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    {Icons.comment} Context Queries (0)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;