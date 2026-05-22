import { createClient } from '@supabase/supabase-js';

// Hardcoded for testing (we can move these to a .env file later)
const supabaseUrl = 'https://wdpagiohgvxviewmncag.supabase.co';
const supabaseAnonKey = 'sb_publishable_H__-71tVJn-rRN9I8mlPPw_244WamRE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- HELPER FUNCTIONS ---

export const sendPhoneOtp = async (phone) => {
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  return { data, error };
};

export const verifyPhoneOtp = async (phone, token) => {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/onboarding' },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

export const getUserProfile = async (userId, userType) => {
  const tableName = userType === 'educator' ? 'educators' : 'students';
  const { data, error } = await supabase.from(tableName).select('*').eq('id', userId).single();
  return { data, error };
};

export const createUserProfile = async (userId, userType, profileData) => {
  const tableName = userType === 'educator' ? 'educators' : 'students';
  const { data, error } = await supabase.from(tableName).insert([{ id: userId, ...profileData }]);
  return { data, error };
};

export const updateUserProfile = async (userId, userType, profileData) => {
  const tableName = userType === 'educator' ? 'educators' : 'students';
  const { data, error } = await supabase.from(tableName).update(profileData).eq('id', userId);
  return { data, error };
};

export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  return { data, error };
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};