import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#1a2a4e]">
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-black cursor-pointer" onClick={() => navigate('/')}>ORO<span className="text-[#C9A85E]">LEARN</span></h1>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-[#1a2a4e]">Go Back</button>
      </nav>
      <main className="max-w-3xl mx-auto p-8 py-16 bg-white my-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p><strong>Last Updated:</strong> October 2026</p>
          <h3 className="text-xl font-bold text-[#1a2a4e] mt-6">1. Information We Collect</h3>
          <p>We collect personal data required to operate the platform securely, including your name, email, phone number, date of birth, gender, and language preferences. For educators, we also collect KYC documents (Aadhar/PAN) and Bank details for payout processing.</p>
          
          <h3 className="text-xl font-bold text-[#1a2a4e] mt-6">2. How We Use Your Information</h3>
          <p>Your data is used to match students with the best educators, facilitate secure communication via our encrypted chat system, manage attendance, and process payments. Educators have the option to hide their phone numbers to maintain privacy.</p>
          
          <h3 className="text-xl font-bold text-[#1a2a4e] mt-6">3. Data Security</h3>
          <p>All sensitive information, including KYC documents and payment details, are heavily encrypted. ORO Learn does not sell your personal data to third parties.</p>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;