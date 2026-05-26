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

const officialLanguagesOfIndia = [
  "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri", 
  "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", 
  "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu", "English"
].sort();

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
    profilePic: null, fullName: passedData.fullName || '', dob: '', gender: '',
    email: passedData.email || '', phone: '',
    locationMode: 'standard', digipin: '', houseNo: '', street: '', city: '', addressState: '', pincode: '',
    baseLevel: '', stream: '', customStream: '', board: '', stateBoardName: '', university: '', preparingFor: '',
    selectedLanguages: [], learningModes: [], teacherGender: 'both', oroBadgeId: ''
  });

  useEffect(() => {
    if (!passedData.uid) setErrorText("Registration session missing. Please log in first.");
  }, [passedData]);

  const calculateAge = (dob) => {
    if (!dob) return '--';
    return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
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

  const handleAutoLocation = async () => {
    if (!navigator.geolocation) return setErrorText("Location tracking not supported on this browser.");
    setLoading(true); setErrorText('');
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
          setStep(3);
        } else {
          setErrorText("Could not resolve location coordinates.");
        }
      } catch (err) { setErrorText("Network location lookup failed."); } finally { setLoading(false); }
    }, () => { setErrorText("Permission denied."); setLoading(false); });
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => {
      const active = prev.selectedLanguages.includes(lang);
      return { ...prev, selectedLanguages: active ? prev.selectedLanguages.filter(l => l !== lang) : [...prev.selectedLanguages, lang] };
    });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedLanguages.length === 0) return setErrorText("Please pick at least one preferred instruction language.");
    setLoading(true);

    try {
      let cloudImageUrl = "";
      if (actualImageFile) {
        const fileExt = actualImageFile.name.split('.').pop();
        const { error: imgError } = await supabase.storage.from('avatars').upload(`students/${passedData.uid}.${fileExt}`, actualImageFile, { upsert: true });
        if (!imgError) cloudImageUrl = supabase.storage.from('avatars').getPublicUrl(`students/${passedData.uid}.${fileExt}`).data.publicUrl;
      }

      const generatedBadge = `ORO-STU-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error } = await supabase.from('students').upsert({
        id: passedData.uid, full_name: formData.fullName, dob: formData.dob, gender: formData.gender, email: formData.email, phone: formData.phone, is_onboarding_complete: true, oro_badge_id: generatedBadge, profile_pic: cloudImageUrl,
        location: { mode: formData.locationMode, digipin: formData.digipin, houseNo: formData.houseNo, street: formData.street, city: formData.city, state: formData.addressState, pincode: formData.pincode },
        academic: { baseLevel: formData.baseLevel, stream: formData.stream === 'Custom' ? formData.customStream : formData.stream, board: formData.board === 'State' ? formData.stateBoardName : formData.board, university: formData.university, preparingFor: formData.preparingFor },
        preferences: { languages: formData.selectedLanguages, learningModes: formData.learningModes, teacherGender: formData.teacherGender }
      });

      if (error) throw error;
      setFormData(prev => ({ ...prev, oroBadgeId: generatedBadge, profilePic: cloudImageUrl || prev.profilePic }));
      setStep(5);
    } catch (err) { setErrorText("Database synchronization aborted."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div onClick={() => navigate('/home')} className="cursor-pointer"><OROLearnLogo variant="full" size="nav" theme="light" /></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 ${step === 5 ? 'hidden' : 'block'}`}>
          <div className="mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            <div className="flex justify-between relative z-10">
              {['Identity', 'Location', 'Academic', 'Preferences'].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= i+1 ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'}`}>{step > i+1 ? Icons.check : i+1}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {errorText && <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{errorText}</div>}

          <form onSubmit={(e) => { if (step === 4) handleFinalSubmit(e); else { e.preventDefault(); handleNext(); } }}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
                    {formData.profilePic ? <img src={formData.profilePic} className="w-full h-full object-cover" alt="" /> : Icons.camera}
                    <input type="file" onChange={(e) => { if(e.target.files[0]) { setActualImageFile(e.target.files[0]); setFormData({...formData, profilePic: URL.createObjectURL(e.target.files[0])}); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2"><label className="text-xs font-semibold mb-1 block">Full Name</label><input type="text" required value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" /></div>
                  <div><label className="text-xs font-semibold mb-1 block">Date of Birth</label><input type="date" required value={formData.dob} onChange={e=>setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" /></div>
                  <div><label className="text-xs font-semibold mb-1 block">Gender</label><select required value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <button type="button" onClick={handleAutoLocation} disabled={loading} className="w-full py-3 rounded-xl border-2 bg-slate-50 text-sm flex items-center justify-center gap-2 hover:bg-slate-100 font-bold">
                  <span>{Icons.location}</span> {loading ? "Syncing Geolocation..." : "Auto-Detect Location & Continue"}
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-xs font-semibold block">City</label><input type="text" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" /></div>
                  <div><label className="text-xs font-semibold block">State</label>
                    <select value={formData.addressState} onChange={e=>setFormData({...formData, addressState: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
                      <option value="">Select State</option>
                      {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-semibold block">Pincode</label><input type="text" maxLength="6" value={formData.pincode} onChange={e=>setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 border rounded-xl text-sm" /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Current Academic Level</label>
                  <select required value={formData.baseLevel} onChange={e=>setFormData({...formData, baseLevel: e.target.value, stream: '', board: '', university: ''})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
                    <option value="">Select</option>
                    {baseLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
                {getStreamOptions(formData.baseLevel).length > 0 && (
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Stream</label>
                    <select required value={formData.stream} onChange={e=>setFormData({...formData, stream: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
                      <option value="">Select Stream</option>
                      {getStreamOptions(formData.baseLevel).map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                )}
                {formData.baseLevel && isSchoolLevel(formData.baseLevel) ? (
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Educational Board</label>
                    <select required value={formData.board} onChange={e=>setFormData({...formData, board: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State">State Board</option>
                    </select>
                  </div>
                ) : formData.baseLevel ? (
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Institution</label>
                    <input type="text" required value={formData.university} onChange={e=>setFormData({...formData, university: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
                  </div>
                ) : null}
                <div>
                  <label className="text-xs font-semibold mb-1 block">Target Milestone Goal</label>
                  <select required value={formData.preparingFor} onChange={e=>setFormData({...formData, preparingFor: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white font-medium">
                    <option value="">Select goal...</option>
                    {targetGoalsTaxonomy.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold mb-2 block">Instruction Languages (Multi-Select)</label>
                  <div className="border rounded-xl p-4 bg-slate-50 max-h-[160px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {officialLanguagesOfIndia.map(lang => {
                      const active = formData.selectedLanguages.includes(lang);
                      return (
                        <div key={lang} onClick={() => handleLanguageToggle(lang)} className={`px-3 py-2 rounded-lg border text-xs font-bold text-center cursor-pointer select-none truncate ${active ? 'bg-[#1a2a4e] text-white border-[#1a2a4e]' : 'bg-white text-slate-600'}`}>
                          {lang}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between pt-6 border-t">
              {step > 1 && <button type="button" onClick={handleBack} className="px-6 py-2.5 text-sm font-semibold text-slate-400">Back</button>}
              <button type="submit" disabled={loading} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold ml-auto">{step === 4 ? 'Generate ID' : 'Continue'}</button>
            </div>
          </form>
        </div>

        {step === 5 && (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-black mb-2">Welcome to ORO Learn!</h2>
            <p className="text-slate-500 mb-8">Your account identification sequence has successfully written onto Supabase.</p>
            <button onClick={() => navigate('/student-dashboard')} className="px-8 py-4 bg-[#C9A85E] text-slate-900 rounded-xl font-bold">Go to Dashboard 🚀</button>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className="rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-center">
    <p className="text-slate-400 text-xs font-semibold uppercase mb-2">{label}</p>
    <div className={`text-2xl font-bold ${color || 'text-slate-900'}`}>{value}</div>
  </div>
);

export default StudentSetup;