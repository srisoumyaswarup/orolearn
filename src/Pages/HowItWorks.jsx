import React from 'react';
import { useNavigate } from 'react-router-dom';

function HowItWorks() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#1a2a4e]">
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black cursor-pointer" onClick={() => navigate('/')}>ORO<span className="text-[#C9A85E]">LEARN</span></h1>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-[#1a2a4e]">Go Back</button>
      </nav>
      <main className="max-w-4xl mx-auto p-8 py-16">
        <h1 className="text-4xl font-black mb-10 text-center">How ORO Learn Works</h1>
        <div className="space-y-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><span className="bg-[#C9A85E] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span> For Students</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Complete your onboarding profile, select your preferred subjects and language, and access thousands of verified educators. Use our "Quick Revise" feature to instantly book 1-on-1 doubt-solving sessions, or enroll in long-term batches.</p>
          </div>
          <div className="bg-[#1a2a4e] text-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><span className="bg-[#C9A85E] text-[#1a2a4e] w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span> For Educators</h2>
            <p className="text-gray-300 leading-relaxed">Set your own schedule, define your hourly or monthly pricing, and connect securely with students across India. We provide a Live Studio, secure chat, and automated attendance tracking. Keep 80% of your earnings, transferred securely to your linked bank account after KYC verification.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HowItWorks;