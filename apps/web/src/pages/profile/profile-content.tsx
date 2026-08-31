'use client';
import { Card } from '@/components/common/card';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/common/button';
import { Modal } from '@/components/common/modal';
import { Edit2, Save, CameraIcon, Trash2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

export function ProfileContent() {
  const { user, token, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobileNumber: '' });
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(event.target as Node)) {
        setIsPhotoMenuOpen(false);
      }
    };
    if (isPhotoMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPhotoMenuOpen]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const payload = {
          name: user?.name || '',
          email: user?.email || '',
          mobileNumber: user?.mobileNumber || '',
          profileImage: base64
        };
        const updatedUser = await apiClient.put<any>('/users/profile', payload);
        showToast('Profile photo updated successfully', 'success');
        const activeToken = token || (typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : null);
        if (activeToken) {
          login(activeToken, undefined, { ...user, ...updatedUser, roles: user?.roles || [] });
        }
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Failed to update profile photo', 'error');
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      const payload = {
        name: user?.name || '',
        email: user?.email || '',
        mobileNumber: user?.mobileNumber || '',
        profileImage: null // explicit null to clear photo
      };
      const updatedUser = await apiClient.put<any>('/users/profile', payload);
      showToast('Profile photo removed', 'success');
      setIsRemoveModalOpen(false);
      const activeToken = token || (typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : null);
      if (activeToken) {
        login(activeToken, undefined, { ...user, ...updatedUser, roles: user?.roles || [] });
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to remove profile photo', 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  const showToast = (message: string, type: 'success'|'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startEditing = () => {
    setFormData({ 
      name: user?.name || '', 
      email: user?.email || '', 
      mobileNumber: user?.mobileNumber || '' 
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await apiClient.put<any>('/users/profile', formData);
      setIsEditing(false);
      showToast('Profile updated successfully', 'success');
      const activeToken = token || (typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] : null);
      if (activeToken) {
        login(activeToken, undefined, { ...user, ...updatedUser, roles: user?.roles || [] });
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading Profile...</div>;
  }

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0, 2).toUpperCase() : 'US');

  return (
    <div className="space-y-6 relative h-full">
      {toast && (
        <div className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-5 flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button variant="outline" className="gap-2 font-bold" onClick={startEditing}>
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        )}
      </div>

      <Card className="p-6 flex items-center gap-6 shadow-sm border-slate-100 dark:border-slate-800 rounded-[24px]">
        <div className="relative">
          {user.profileImage ? (
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center border-2 border-white dark:border-[#1A2233]">
              <img src={user.profileImage} alt={user.name || 'Profile'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold border-2 border-white dark:border-[#1A2233]">
              {initials}
            </div>
          )}
          
          <div className="absolute bottom-0 right-0 z-10" ref={photoMenuRef}>
            <button 
              type="button"
              onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
              className="p-1.5 bg-white dark:bg-[#1A2233] border rounded-full text-slate-600 dark:text-slate-400 hover:text-blue-600 shadow-sm"
              title="Photo Options"
            >
              <CameraIcon className="w-4 h-4" />
            </button>
            
            {isPhotoMenuOpen && (
              <div className="absolute top-full mt-2 -left-12 sm:left-0 z-50 w-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A2233] shadow-lg py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setIsPhotoMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <CameraIcon className="w-4 h-4" />
                  Change Photo
                </button>
                
                {user.profileImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPhotoMenuOpen(false);
                      setIsRemoveModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Photo
                  </button>
                )}
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name || 'N/A'}</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{user.email || 'N/A'}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-slate-100 dark:border-slate-800 rounded-[24px]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-1/3">Full Name</span>
              {isEditing ? (
                <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-white text-right w-full sm:w-2/3">{user.name || 'N/A'}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-1/3">Email</span>
              {isEditing ? (
                <input type="email" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-white text-right w-full sm:w-2/3">{user.email || 'N/A'}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-1/3">Phone Number</span>
              {isEditing ? (
                <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
              ) : (
                <span className="text-sm font-bold text-slate-900 dark:text-white text-right w-full sm:w-2/3">{user.mobileNumber ?? 'N/A'}</span>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border-slate-100 dark:border-slate-800 rounded-[24px]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Account Information</h3>
          <div className="space-y-6">
            <div className="flex justify-between pb-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">User ID</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{user.id ? user.id.substring(0,8).toUpperCase() : 'N/A'}</span>
            </div>
          </div>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" className="font-bold w-32" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button className="font-bold w-32 bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      )}
      
      <Modal 
        isOpen={isRemoveModalOpen} 
        onClose={() => !isRemoving && setIsRemoveModalOpen(false)}
        title="Remove Profile Photo?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to remove your profile photo? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRemoveModalOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRemovePhoto} 
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {isRemoving ? 'Removing...' : 'Remove Photo'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileContent;
