import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OROLearnLogo from '../components/OROLearnLogo';
import { supabase } from '../supabaseClient';

const Icons = {
  check: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  camera: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  location: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
};

const baseLevels = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Diploma', 'Bachelors', 'Masters', 'PhD'];
const streams11_12 = ['Science (PCM)', 'Science (PCB)', 'Science (PCMB)', 'Commerce', 'Arts', 'Vocational', 'Custom'];
const streamsDiploma = ['Engineering / Polytechnic', 'Computer Applications', 'Pharmacy (D.Pharm)', 'Nursing / Paramedical', 'Education (D.Ed)', 'Agriculture', 'Hotel Management', 'Custom'];
const streamsBachelors = ['Engineering (B.Tech/BE)', 'Science (B.Sc)', 'Commerce (B.Com)', 'Arts (BA)', 'Computer Applications (BCA)', 'Medicine (MBBS/BDS)', 'Business (BBA/BMS)', 'Law (LLB)', 'Education (B.Ed)', 'Agriculture (B.Sc Ag)', 'Custom'];
const streamsMasters = ['Engineering (M.Tech/ME)', 'Science (M.Sc)', 'Commerce (M.Com)', 'Arts (MA)', 'Computer Applications (MCA)', 'Business (MBA/PGDM)', 'Medicine (MD/MS)', 'Law (LLM)', 'Education (M.Ed)', 'Custom'];
const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi / NCR", "Jammu & Kashmir"];

// 22 Eighth Schedule Constitutional Languages of India
const officialLanguagesOfIndia = [
  "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri", 
  "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", 
  "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu", "English"
].sort();

// Standard Target Academic Goals Taxonomy
const targetGoalsTaxonomy = [
  "School Academic Excellence (CBSE/ICSE/State)",
  "JEE Mains & Advanced (Engineering Entrance)",
  "NEET UG (Medical Entrance)",
  "NDA / Defence Career Examinations",
  "UPSC Civil Services Foundation",
  "CA Foundation / Commerce Competitive Exams",
  "CLAT (Law Entrance)",
  "CUET (Central Universities Common Entrance Test)",
  "Olympiads, NTSE & KVPY Foundation",
  "Campus Placement Technical Training (B.Tech/MCA)",
  "Foreign Education Admissions (SAT/IELTS/TOEFL)",
  "General Skills Mastery & Coding Basics"
];

const isSchoolLevel = (level) => {
  const schoolLevels = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  return schoolLevels.includes(level);
};

function StudentSetup() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const passedData = state || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [actualImageFile, setActualImageFile] = useState(null);
  const [formData, setFormData] = useState({
    profilePic: null, 
    fullName: passedData.fullName || '', 
    dob: '', 
    gender: '',
    email: passedData.email || '', 
    phone: '', 
    locationMode: 'standard', digipin: '', houseNo: '', street: '', city: '', addressState: '', pincode: '',
    baseLevel: '', stream: '', customStream: '', board: '', stateBoardName: '', university: '', preparingFor: '',
    selectedLanguages: [], // Secure Array container for JSONB matching schema rules
    learningModes: [], 
    teacherGender: 'both',
    oroBadgeId: ''
  });

  useEffect(() => {
    if (!passedData.uid) setErrorText("Registration session missing. Please log in first.");
  }, [passedData]);

  const calculateAge = (dob) => {
    if (!dob) return '--';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const getStreamOptions = (level) => {
    if (['Class 11', 'Class 12'].includes(level)) return streams11_12;
    if (level === 'Diploma') return streamsDiploma;
    if (level === 'Bachelors') return streamsBachelors;
    if (level === 'Masters') return streamsMasters;
    return [];
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // Auto-detect handles response and auto-skips straight to step 3 layout natively
  const handleAutoLocation = async () => {
    if (!navigator.geolocation) return setErrorText("Location tracking not supported on this device ecosystem.");
    setLoading(true);
    setErrorText('');
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        const data = await response.json();
        
        if (data && data.address) {
          setFormData(prev => ({ 
            ...prev, 
            city: data.address.city || data.address.town || data.address.village || data.address.state_district || '', 
            addressState: data.address.state || '', 
            pincode: data.address.postcode || '' 
          }));
          
          // Instantly advance directly to Academic Step 3
          setStep(3);
        } else {
          setErrorText("Could not resolve location coordinates. Enter parameters manually below.");
        }
      } catch (err) { 
        setErrorText("Network reverse proxy latency. Fallback to manual allocation."); 
      } finally { 
        setLoading(false); 
      }
    }, () => {
      setErrorText("Location permission token request rejected by client browser.");
      setLoading(false);
    });
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const isSelected = prev.selectedLanguages.includes(lang);
      const updatedLanguages = isSelected
        ? prev.selectedLanguages.filter(l => l !== lang)
        : [...prev.selectedLanguages, lang];
      return { ...prev, selectedLanguages: updatedLanguages };
    });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!passedData.uid) return setErrorText("Missing User ID. Return to login mapping.");
    if (formData.selectedLanguages.length === 0) return setErrorText("Please pick at least one preferred instruction language.");
    setLoading(true); setErrorText('');

    try {
      let cloudImageUrl = "";
      if (actualImageFile) {
        const fileExt = actualImageFile.name.split('.').pop();
        const { error: imgError } = await supabase.storage.from('avatars').upload(`students/${passedData.uid}.${fileExt}`, actualImageFile, { upsert: true });
        if (!imgError) cloudImageUrl = supabase.storage.from('avatars').getPublicUrl(`students/${passedData.uid}.${fileExt}`).data.publicUrl;
      }

      const generatedBadge = `ORO-STU-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { error } = await supabase.from('students').upsert({
        id: passedData.uid,
        full_name: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        is_onboarding_complete: true,
        oro_badge_id: generatedBadge,
        profile_pic: cloudImageUrl,
        location: { mode: formData.locationMode, digipin: formData.digipin, houseNo: formData.houseNo, street: formData.street, city: formData.city, state: formData.addressState, pincode: formData.pincode },
        academic: { baseLevel: formData.baseLevel, stream: formData.stream === 'Custom' ? formData.customStream : formData.stream, board: formData.board === 'State' ? formData.stateBoardName : formData.board, university: formData.university, preparingFor: formData.preparingFor },
        preferences: { languages: formData.selectedLanguages, learningModes: formData.learningModes, teacherGender: formData.teacherGender }
      });

      if (error) throw error;
      setFormData(prev => ({ ...prev, oroBadgeId: generatedBadge, profilePic: cloudImageUrl || prev.profilePic }));
      setStep(5);
    } catch (err) { 
      setErrorText("Database sync failed. Verify permissions mapping inside your Supabase console."); 
    } finally { 
      setLoading(false); 
    }
  };

  const toggleCheckbox = (type, value) => setFormData(prev => ({ ...prev, [type]: prev[type].includes(value) ? prev[type].filter(i => i !== value) : [...prev[type], value] }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div onClick={() => navigate('/')} className="cursor-pointer transition-transform hover:scale-105"><OROLearnLogo variant="full" size="nav" theme="light" /></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 transition-all duration-500 ${step === 5 ? 'opacity-0 hidden' : 'opacity-100 block'}`}>
          <div className="mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            <div className="flex justify-between relative z-10">
              {['Identity', 'Location', 'Academic', 'Preferences'].map((label, i) => (
                <div key={i+1} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step >= i+1 ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{step > i+1 ? Icons.check : i+1}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= i+1 ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {errorText && <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl tracking-wide">{errorText}</div>}

          <form onSubmit={(e) => { 
            if (step === 4) {
              handleFinalSubmit(e);
            } else {
              e.preventDefault();
              if (step === 1 && (!formData.fullName || !formData.dob || !formData.gender)) return setErrorText("Please complete all identity variables.");
              if (step === 2 && formData.locationMode === 'standard' && (!formData.city || !formData.addressState || !formData.pincode)) return setErrorText("Please fill required address metrics layout fields.");
              handleNext();
            }
          }}>
            
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div><h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Student Details</h2></div>
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#C9A85E] hover:text-[#C9A85E] transition-all cursor-pointer relative overflow-hidden">
                    {formData.profilePic ? <img src={formData.profilePic} className="w-full h-full object-cover" alt="Avatar" /> : Icons.camera}
                    <input type="file" onChange={(e) => { if(e.target.files[0]) { setActualImageFile(e.target.files[0]); setFormData({...formData, profilePic: URL.createObjectURL(e.target.files[0])}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name</label><input type="text" required value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                  <div><label className="text-xs font-semibold text-slate-600 mb-1 block">Date of Birth</label><input type="date" required value={formData.dob} onChange={e=>setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                  <div><label className="text-xs font-semibold text-slate-600 mb-1 block">Gender</label><select required value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div className="sm:col-span-2 border-t border-slate-100 pt-5 mt-2">
                    <div className="space-y-4">
                      <div className="flex gap-2 items-center"><input type="email" value={formData.email} disabled className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-sm focus:outline-none" /></div>
                      <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#C9A85E]"><span className="bg-slate-50 px-3 py-2.5 text-slate-400 text-sm font-semibold border-r border-slate-200">+91</span><input type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})} placeholder="Contact Mobile Number (Optional)" className="w-full px-4 py-2.5 text-sm focus:outline-none bg-white text-slate-800" /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div><h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Location Details</h2></div>
                <button type="button" onClick={handleAutoLocation} disabled={loading} className="w-full py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                  <span className="text-blue-500">{Icons.location}</span> {loading ? "Detecting Coordinates..." : "Auto-Detect Location & Skip Forward"}
                </button>
                <div className="flex items-center my-4"><div className="flex-1 border-t border-slate-100"></div><span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR ENTER MANUALLY</span><div className="flex-1 border-t border-slate-100"></div></div>
                
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                  <button type="button" onClick={()=>setFormData({...formData, locationMode: 'standard'})} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${formData.locationMode === 'standard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Standard Address</button>
                  <button type="button" onClick={()=>setFormData({...formData, locationMode: 'digipin'})} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${formData.locationMode === 'digipin' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>DIGIPIN Code</button>
                </div>

                {formData.locationMode === 'digipin' ? (
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between mb-2"><label className="text-xs font-semibold text-slate-600 block">Enter 10-Digit DIGIPIN</label></div>
                    <input type="text" maxLength="12" placeholder="e.g. G8X-4M9-Q2W" value={formData.digipin} onChange={e=>setFormData({...formData, digipin: e.target.value.toUpperCase()})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-[#C9A85E] uppercase" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="text-xs font-semibold text-slate-600 mb-1 block">House No. / Building</label><input type="text" value={formData.houseNo} onChange={e=>setFormData({...formData, houseNo: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                    <div className="col-span-2"><label className="text-xs font-semibold text-slate-600 mb-1 block">Street / Area</label><input type="text" value={formData.street} onChange={e=>setFormData({...formData, street: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                    <div><label className="text-xs font-semibold text-slate-600 mb-1 block">City</label><input type="text" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                    <div><label className="text-xs font-semibold text-slate-600 mb-1 block">State</label>
                      <select value={formData.addressState} onChange={e=>setFormData({...formData, addressState: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white">
                        <option value="">Select State</option>
                        {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2"><label className="text-xs font-semibold text-slate-600 mb-1 block">Pincode</label><input type="text" maxLength="6" value={formData.pincode} onChange={e=>setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E]" /></div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div><h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Academic Background</h2></div>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Current Class / Degree Level</label>
                    <select required value={formData.baseLevel} onChange={e=>setFormData({...formData, baseLevel: e.target.value, stream: '', board: '', university: ''})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white">
                      <option value="">Select your academic level</option>
                      {baseLevels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                  {getStreamOptions(formData.baseLevel).length > 0 && (
                    <div className="animate-fade-in">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Select your Stream / Field</label>
                      <select required value={formData.stream} onChange={e=>setFormData({...formData, stream: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white">
                        <option value="">Select Stream</option>
                        {getStreamOptions(formData.baseLevel).map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                      {formData.stream === 'Custom' && <input type="text" placeholder="Type your stream manually..." value={formData.customStream} onChange={e=>setFormData({...formData, customStream: e.target.value})} className="w-full mt-3 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white animate-fade-in" />}
                    </div>
                  )}
                  {formData.baseLevel && isSchoolLevel(formData.baseLevel) ? (
                    <div className="animate-fade-in">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Educational Board</label>
                      <select required value={formData.board} onChange={e=>setFormData({...formData, board: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white">
                        <option value="">Select Board</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE / ISC</option><option value="State">State Board</option>
                      </select>
                      {formData.board === 'State' && (
                         <div className="animate-fade-in mt-3">
                           <select required value={formData.stateBoardName} onChange={e=>setFormData({...formData, stateBoardName: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white">
                             <option value="">Select your State</option>
                             {indianStates.map(state => <option key={state} value={state}>{state} Board</option>)}
                           </select>
                         </div>
                      )}
                    </div>
                  ) : formData.baseLevel ? (
                    <div className="animate-fade-in">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">University / Institution Name</label>
                      <input type="text" required placeholder="Type your University or College name" value={formData.university} onChange={e=>setFormData({...formData, university: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white" />
                    </div>
                  ) : null}
                  
                  {/* GOAL TAXONOMY DROP-DOWN SELECTION PANEL */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Primary Educational Target Milestone</label>
                    <select required value={formData.preparingFor} onChange={e=>setFormData({...formData, preparingFor: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#C9A85E] bg-white font-medium text-slate-700">
                      <option value="">Select structural tracking goal matrix...</option>
                      {targetGoalsTaxonomy.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div><h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Learning Preferences</h2></div>
                
                {/* DYNAMIC MULTI-SELECT LANGUAGE GRID */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">Languages of Instruction (Select all relevant nodes)</label>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-[180px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {officialLanguagesOfIndia.map(lang => {
                      const active = formData.selectedLanguages.includes(lang);
                      return (
                        <div key={lang} onClick={() => handleLanguageToggle(lang)} className={`px-3 py-2 rounded-lg border text-xs font-bold text-center cursor-pointer transition-all select-none truncate ${active ? 'bg-[#1a2a4e] text-white border-[#1a2a4e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                          {lang}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Configured languages array weight: {formData.selectedLanguages.length} selected</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">How do you want to learn? (Select multiple)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{id: 'online', label: 'Online Live Classes'}, {id: 'offline_private', label: 'Offline (Private Home)'}, {id: 'offline_group', label: 'Offline (Group Batch)'}].map(mode => (
                      <label key={mode.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors text-xs font-bold justify-center ${formData.learningModes.includes(mode.id) ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <input type="checkbox" className="hidden" checked={formData.learningModes.includes(mode.id)} onChange={() => toggleCheckbox('learningModes', mode.id)} />
                        {mode.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-2 block">Preferred Teacher Gender Option</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {[{id: 'both', label: 'No Preference'}, {id: 'male', label: 'Male Mentor'}, {id: 'female', label: 'Female Mentor'}].map(g => (
                      <button type="button" key={g.id} onClick={()=>setFormData({...formData, teacherGender: g.id})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.teacherGender === g.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{g.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
              {step > 1 ? <button type="button" onClick={handleBack} className="px-6 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors">Back</button> : <div></div>}
              <button type="submit" disabled={loading} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-[#C9A85E] hover:text-slate-900 transition-all shadow-sm">
                {loading ? "Syncing Workspace Node..." : step === 4 ? 'Generate Student ID' : 'Continue'}
              </button>
            </div>
          </form>
        </div>

        {step === 5 && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-fade-in bg-slate-50">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 z-10">Welcome to ORO Learn!</h2>
            <p className="text-slate-500 mb-12 z-10">Your official Student Identification credentials have been committed globally.</p>
            <div className="w-full max-w-md mb-12 z-10 hover:scale-105 transition-transform duration-500 shadow-2xl rounded-2xl">
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 flex flex-col justify-between min-h-[240px]">
                <div className="flex justify-between items-start mb-6">
                  <div><p className="text-[#C9A85E] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">STUDENT CREDENTIAL</p><OROLearnLogo variant="full" size="nav" theme="dark" /></div>
                  <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">Verified</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full border-2 border-slate-600 overflow-hidden bg-[#1a2a4e] flex items-center justify-center text-white text-2xl font-bold">
                    {formData.profilePic ? <img src={formData.profilePic} className="w-full h-full object-cover" alt="" /> : formData.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-0.5">{formData.fullName}</h2>
                    <p className="text-[#C9A85E] font-medium text-sm mb-3">{formData.baseLevel} • {formData.stream || 'General Academic'}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono">{formData.oroBadgeId}</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-mono">{calculateAge(formData.dob)}Y • {formData.gender.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/student-dashboard')} className="z-10 px-10 py-4 bg-[#C9A85E] text-slate-900 rounded-xl font-bold text-lg shadow-xl hover:bg-[#b39654] transition-all">Go to Dashboard 🚀</button>
          </div>
        )}

        {step < 5 && (
          <div className="w-full lg:w-[380px] shrink-0 hidden md:block">
            <div className="sticky top-10">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Live Preview</h3>
              <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col min-h-[220px]">
                <div className="mb-6"><p className="text-[#C9A85E] text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Official Student ID</p><OROLearnLogo variant="full" size="nav" theme="dark" /></div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-700 overflow-hidden bg-[#1a2a4e] flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {formData.profilePic ? <img src={formData.profilePic} className="w-full h-full object-cover" alt="" /> : (formData.fullName ? formData.fullName.charAt(0) : 'S')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-0.5 leading-tight">{formData.fullName || 'Your Name'}</h2>
                    <p className="text-[#C9A85E] font-medium text-xs mb-2">{formData.baseLevel || 'Class / Degree Level'}</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono border border-slate-700">{calculateAge(formData.dob)}Y • {formData.gender || 'Gen'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentSetup;