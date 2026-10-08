import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ASSET_URL } from '../services/api';
import { FiEye, FiEyeOff, FiEdit2, FiCamera } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateProfile, showToast } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Clear the input so selecting the same file again triggers onChange
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);
    let profileData;
    
    if (avatarFile) {
      profileData = new FormData();
      profileData.append('name', name);
      profileData.append('phone', phone);
      if (password) {
        profileData.append('password', password);
      }
      profileData.append('avatar', avatarFile);
    } else {
      profileData = {
        name,
        phone,
      };
      if (password) {
        profileData.password = password;
      }
    }

    const res = await updateProfile(profileData);
    if (res && res.success) {
      setPassword('');
      setConfirmPassword('');
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
    setSubmitting(false);
  };

  const avatarUrl = avatarPreview || (user?.avatar ? (user.avatar.startsWith('http') || user.avatar.startsWith('blob:') ? user.avatar : `${ASSET_URL}${user.avatar}?v=${user.updatedAt || Date.now()}`) : null);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Manage your account contact information and password credentials.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-3xl p-8 sm:p-12 flex flex-col gap-8 relative overflow-hidden transition-colors duration-300"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-tealbrand-500"></div>
          
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  // Cancel edit: reset avatar
                  setAvatarPreview(null);
                  setAvatarFile(null);
                  setPassword('');
                  setConfirmPassword('');
                  setName(user?.name || '');
                  setPhone(user?.phone || '');
                }
              }} 
              className={`p-3 rounded-full hover:shadow-md transition-all active:scale-95 border ${isEditing ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-brand-600 border-slate-200 dark:border-slate-700'}`} 
              title={isEditing ? "Cancel Edit" : "Edit Profile"}
            >
              <FiEdit2 />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar block */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-24 h-24 rounded-full bg-brand-50 dark:bg-brand-900/20 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-brand-600 dark:text-brand-400 text-3xl font-black relative overflow-hidden group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
                
                {/* Upload Overlay */}
                {isEditing && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiCamera className="text-white text-xl" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
              
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
                {user?.role} Account
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-5 py-3.5 rounded-2xl border transition-all text-sm font-medium ${isEditing ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-80'}`}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-sm cursor-not-allowed font-medium opacity-80"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-5 py-3.5 rounded-2xl border transition-all text-sm font-medium ${isEditing ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-80'}`}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-2 flex flex-col gap-6 animate-fade-in-up">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Update Password</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Leave blank if you do not wish to change it.</p>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border ${isEditing ? 'border-brand-100 dark:border-brand-900/50' : 'border-slate-100 dark:border-slate-800'}`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-5 py-3.5 pr-12 rounded-2xl border transition-all text-sm font-medium ${isEditing ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-80'}`}
                    disabled={!isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!isEditing}
                    className={`absolute right-4 top-3.5 focus:outline-none text-lg transition-colors ${isEditing ? 'text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-5 py-3.5 pr-12 rounded-2xl border transition-all text-sm font-medium ${isEditing ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-80'}`}
                    disabled={!isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!isEditing}
                    className={`absolute right-4 top-3.5 focus:outline-none text-lg transition-colors ${isEditing ? 'text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full sm:w-auto self-start px-10 py-4 bg-brand-600 hover:bg-brand-500 dark:bg-brand-700 dark:hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 animate-fade-in-up"
            >
              {submitting ? 'Saving modifications...' : 'Save Profile Settings'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
