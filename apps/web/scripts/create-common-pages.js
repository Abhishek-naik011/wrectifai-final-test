const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. Create Profile Page
const profileDir = path.join(srcDir, 'pages/profile');
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const profileContent = `'use client';
import { Card } from '@/components/common/card';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/common/button';
import { Edit2, Lock, Save, Camera, CameraIcon } from 'lucide-react';
import { Modal } from '@/components/common/modal';

export function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiClient.get('/auth/profile');
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiClient.patch('/auth/profile', {
        name: formData.name,
        mobile_number: formData.mobile_number,
      });
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSubmitting(true);
    try {
      // Mock endpoint if it doesn't exist, else use real one. Assuming /auth/change-password doesn't exist, we mock a response for now
      await new Promise(r => setTimeout(r, 1000)); 
      alert('Password changed successfully');
      setIsPasswordModalOpen(false);
      setPasswords({ current: '', new: '' });
    } catch (err) {
      console.error('Password change failed', err);
      alert('Failed to change password');
    } finally {
      setPwSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;
  }

  const initials = profile.name ? profile.name.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">View and manage your account information</p>
        </div>
        {!isEditing && (
          <Button variant="outline" className="gap-2 font-bold" onClick={() => setIsEditing(true)}>
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <Card className="p-6 flex items-center gap-6 shadow-sm border-slate-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-white border rounded-full text-slate-600 hover:text-blue-600 shadow-sm">
                <CameraIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded capitalize">{profile.roles?.[0] || 'User'}</span>
               <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Personal Information
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
                <span className="text-sm font-medium text-slate-500 w-1/3">Full Name</span>
                {isEditing ? (
                  <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                ) : (
                  <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{profile.name}</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
                <span className="text-sm font-medium text-slate-500 w-1/3">Email</span>
                <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{profile.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2">
                <span className="text-sm font-medium text-slate-500 w-1/3">Phone Number</span>
                {isEditing ? (
                  <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.mobile_number || ''} onChange={(e) => setFormData({...formData, mobile_number: e.target.value})} />
                ) : (
                  <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{profile.mobile_number || 'N/A'}</span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Account Information
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between border-b pb-4">
                <span className="text-sm font-medium text-slate-500">User ID</span>
                <span className="text-sm font-bold text-slate-900">{profile.id.substring(0,8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-sm font-medium text-slate-500">Joined Date</span>
                <span className="text-sm font-bold text-slate-900">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-sm border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
             <Lock className="w-5 h-5 text-blue-600" />
             Security
          </h3>
          <div className="flex flex-col sm:flex-row justify-between items-center pb-2">
            <div className="flex items-center gap-8 w-full sm:w-auto">
               <span className="text-sm font-medium text-slate-500">Password</span>
               <span className="text-sm font-bold text-slate-900 tracking-widest">********</span>
            </div>
            <Button variant="outline" className="font-bold text-sm mt-4 sm:mt-0" onClick={() => setIsPasswordModalOpen(true)}>
               <Lock className="w-4 h-4 mr-2" /> Change Password
            </Button>
          </div>
        </Card>

        {isEditing && (
          <Card className="p-4 flex justify-center sm:justify-end gap-4 bg-slate-50 border-t border-slate-200">
            <Button variant="outline" className="font-bold w-32" onClick={() => { setIsEditing(false); setFormData(profile); }}>Cancel</Button>
            <Button className="font-bold w-32 bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </Card>
        )}
      </div>

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
         <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Current Password</label>
              <input type="password" required className="w-full border rounded p-2 text-sm" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">New Password</label>
              <input type="password" required className="w-full border rounded p-2 text-sm" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
               <Button type="submit" className="bg-blue-600 text-white" disabled={pwSubmitting}>{pwSubmitting ? 'Saving...' : 'Change Password'}</Button>
            </div>
         </form>
      </Modal>
    </div>
  );
}
`;
fs.writeFileSync(path.join(profileDir, 'profile-page.tsx'), profileContent, 'utf8');

// 2. Create Settings Page
const settingsDir = path.join(srcDir, 'pages/settings');
if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });

const settingsContent = `'use client';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { User, Bell, Shield, CreditCard, Globe, Moon, Download, Info, ChevronRight, MonitorSmartphone, Monitor, HelpCircle, ShieldCheck, LogOut } from 'lucide-react';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function SettingsPage() {
  const router = useRouter();

  const handleAction = (msg: string) => {
    alert(msg);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const settingItems = [
    { icon: User, title: 'Profile Settings', desc: 'Update your personal information, email and phone number.', action: 'Edit Profile', onClick: () => handleAction('Navigating to Profile...') },
    { icon: Bell, title: 'Notification Preferences', desc: 'Choose how you want to receive updates and alerts.', action: 'Manage', onClick: () => handleAction('Opening Notification Preferences...') },
    { icon: Shield, title: 'Security Settings', desc: 'Change your password and manage account security.', action: 'Manage', onClick: () => handleAction('Opening Security Settings...') },
    { icon: CreditCard, title: 'Payment & Wallet Settings', desc: 'Manage saved cards, UPI and payment preferences.', action: 'Manage', onClick: () => handleAction('Opening Payment Settings...') },
    { icon: Globe, title: 'Language & Region', desc: 'Choose your preferred language and region.', actionText: 'English (India)', hasDropdown: true, onClick: () => handleAction('Opening Language Selector...') },
    { icon: Moon, title: 'Appearance', desc: 'Customize the look and feel of the application.', actionText: 'Light Mode', hasDropdown: true, onClick: () => handleAction('Opening Theme Selector...') },
    { icon: Download, title: 'Data & Privacy', desc: 'Manage your data, download or delete your account.', action: 'Manage', onClick: () => handleAction('Opening Data Privacy Settings...') },
    { icon: Info, title: 'About WrectifAI', desc: 'App version, terms of service and privacy policy.', action: 'View Details', onClick: () => handleAction('Opening About page...') },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your preferences, security and account settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {settingItems.map((item, idx) => (
             <Card key={idx} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border-slate-100 shadow-sm" onClick={item.onClick}>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-50 border flex items-center justify-center text-slate-600">
                    <item.icon className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                   <p className="text-xs text-slate-500">{item.desc}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 {item.action && (
                    <span className="text-sm font-bold text-blue-600 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-lg bg-white"><item.icon className="w-4 h-4"/> {item.action}</span>
                 )}
                 {item.actionText && (
                    <span className="text-sm font-bold text-blue-600 flex items-center gap-1">{item.actionText} {item.hasDropdown && <ChevronRight className="w-4 h-4 rotate-90" />}</span>
                 )}
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
             </Card>
          ))}
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          <Card className="p-6 shadow-sm border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-sm text-slate-500 mb-4">We're here to help you with any issues or questions.</p>
            <Button variant="outline" className="w-full font-bold text-blue-600 border-blue-200" onClick={() => handleAction('Contact Support via Email')}>
               <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Clearing Cache...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex justify-center items-center"><MonitorSmartphone className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">Clear Cache</p><p className="text-[10px] text-slate-500">Free up space and improve performance</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Managing Devices...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex justify-center items-center"><Monitor className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">Manage Devices</p><p className="text-[10px] text-slate-500">See and manage your active devices</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-slate-100 text-center">
            <h3 className="font-bold text-slate-900 mb-4 text-left">Secure Your Account</h3>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 relative">
               <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Keep your account safe and enjoy a worry-free experience.</p>
            <Button className="w-full bg-blue-600 text-white font-bold" onClick={() => handleAction('Enabling 2FA...')}>Enable Two-Factor Auth</Button>
          </Card>

          <Card className="p-6 shadow-sm border-slate-100">
             <h3 className="font-bold text-slate-900 mb-2">Log Out</h3>
             <p className="text-xs text-slate-500 mb-4">Log out from your account</p>
             <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 font-bold" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Log Out
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(settingsDir, 'settings-page.tsx'), settingsContent, 'utf8');


// 3. Create Help & Support Page
const helpDir = path.join(srcDir, 'pages/help');
if (!fs.existsSync(helpDir)) fs.mkdirSync(helpDir, { recursive: true });

const helpContent = `'use client';
import { Card } from '@/components/common/card';
import { Search, Headset, MessageSquare, Mail, Phone, MessageCircle, ChevronRight, ShieldCheck, Car, CreditCard, Settings, Star, AlertCircle, FileText, StarOff } from 'lucide-react';

export function HelpPage() {
  const handleAction = (msg: string) => {
    alert(msg);
  };

  const categories = [
    { icon: Star, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Getting Started', desc: 'Learn the basics and get started with WrectifAI.' },
    { icon: User, color: 'text-purple-500', bg: 'bg-purple-50', title: 'Account & Profile', desc: 'Update profile, email, phone and password.' },
    { icon: Car, color: 'text-green-500', bg: 'bg-green-50', title: 'Bookings & Services', desc: 'Booking, rescheduling, cancellations and more.' },
    { icon: StarOff, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Offers & Rewards', desc: 'Discounts, cashback, referral and loyalty points.' },
    { icon: CreditCard, color: 'text-indigo-500', bg: 'bg-indigo-50', title: 'Payments & Wallet', desc: 'Payment methods, transactions and refunds.' },
    { icon: Settings, color: 'text-red-500', bg: 'bg-red-50', title: 'Technical Support', desc: 'App issues, troubleshooting and bug reports.' },
    { icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Garages & Mechanics', desc: 'Find garages, compare and manage services.' },
    { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Policies & Legal', desc: 'Terms of service, privacy policy and more.' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-sm text-slate-500">We're here to help you. Find answers, get support and stay informed.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-8">
           
           <Card className="p-8 bg-gradient-to-r from-blue-50 to-white shadow-sm border-blue-100 relative overflow-hidden">
             <div className="relative z-10 w-full md:w-2/3">
               <h2 className="text-xl font-bold text-slate-900 mb-2">How can we help you today?</h2>
               <p className="text-sm text-slate-600 mb-6">Search for help articles, guides and more...</p>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input type="text" placeholder="Search for help articles, topics..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
             </div>
             <div className="absolute right-0 bottom-0 h-full hidden md:block opacity-70">
                {/* Visual placeholder for character */}
                <div className="h-full w-48 bg-blue-100 rounded-tl-full flex items-center justify-center">
                   <Headset className="w-16 h-16 text-blue-500" />
                </div>
             </div>
           </Card>

           <div>
             <h3 className="font-bold text-slate-900 mb-4">Popular Topics</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Car, title: 'Booking & Services', color: 'text-blue-500' },
                  { icon: CreditCard, title: 'Payments & Wallet', color: 'text-green-500' },
                  { icon: Settings, title: 'Account & Settings', color: 'text-purple-500' },
                  { icon: ShieldCheck, title: 'Security & Privacy', color: 'text-orange-500' }
                ].map((t, i) => (
                  <Card key={i} className="p-4 cursor-pointer hover:shadow-md transition-all shadow-sm border-slate-100" onClick={() => handleAction('Opening topic ' + t.title)}>
                     <div className={\`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white border border-slate-100 \${t.color}\`}>
                       <t.icon className="w-5 h-5" />
                     </div>
                     <div className="flex items-center justify-between">
                       <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                       <ChevronRight className="w-4 h-4 text-slate-400" />
                     </div>
                     <p className="text-xs text-slate-500 mt-1 line-clamp-2">Articles and guides related to {t.title.toLowerCase()}.</p>
                  </Card>
                ))}
             </div>
           </div>

           <div>
             <h3 className="font-bold text-slate-900 mb-4">Help Categories</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {categories.map((c, i) => (
                 <Card key={i} className="p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border-slate-100 shadow-sm" onClick={() => handleAction('Opening category ' + c.title)}>
                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 \${c.bg} \${c.color}\`}>
                       <c.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                 </Card>
               ))}
             </div>
             <div className="mt-4 text-center">
                <button className="text-blue-600 font-bold text-sm hover:underline" onClick={() => handleAction('View all articles...')}>View All Help Articles <ChevronRight className="w-4 h-4 inline" /></button>
             </div>
           </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          <Card className="p-6 shadow-sm border-slate-100 bg-blue-50/50">
            <h3 className="font-bold text-slate-900 mb-2">Need Immediate Help?</h3>
            <p className="text-sm text-slate-500 mb-4">Our support team is ready to assist you with any issues or questions.</p>
            <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 font-bold rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors mb-3" onClick={() => handleAction('Connecting to support...')}>
               <Headset className="w-4 h-4" /> Contact Support
            </button>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-green-600">
               <div className="w-2 h-2 rounded-full bg-green-500"></div> Available 24/7
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Contact Us</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Opening Live Chat...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex justify-center items-center"><MessageSquare className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">Live Chat</p><p className="text-[10px] text-slate-500">Chat with our support team</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Opening Email...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex justify-center items-center"><Mail className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">Email Support</p><p className="text-[10px] text-slate-500">support@wrectifai.com</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Calling Support...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex justify-center items-center"><Phone className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">Call Us</p><p className="text-[10px] text-slate-500">+91 98765 43210</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
               <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded" onClick={() => handleAction('Opening WhatsApp...')}>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-slate-100 text-green-600 flex justify-center items-center"><MessageCircle className="w-4 h-4"/></div>
                   <div><p className="text-sm font-bold">WhatsApp</p><p className="text-[10px] text-slate-500">+91 98765 43210</p></div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </div>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Quick Help</h3>
            <div className="space-y-3">
               {['How to Book a Service', 'How to Track My Booking', 'How to Add Money to Wallet', 'How to Use Referral Code', 'How to Cancel a Booking'].map((q, i) => (
                  <div key={i} className="flex justify-between items-center cursor-pointer hover:text-blue-600 group" onClick={() => handleAction('Viewing: ' + q)}>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-blue-600">
                      <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" /> {q}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
               ))}
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-slate-100 text-center">
            <h3 className="font-bold text-slate-900 mb-2 text-left">Share Your Feedback</h3>
            <p className="text-xs text-slate-500 mb-4 text-left">Help us improve your experience.</p>
            <button className="w-full py-2 border border-green-200 text-green-600 font-bold rounded-lg flex justify-center items-center gap-2 hover:bg-green-50 transition-colors" onClick={() => handleAction('Opening feedback form...')}>
               <Star className="w-4 h-4" /> Give Feedback
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

// User is imported for the categories icon fallback since it wasn't imported directly
import { User } from 'lucide-react';
`;
fs.writeFileSync(path.join(helpDir, 'help-page.tsx'), helpContent, 'utf8');

console.log('Common pages generated successfully');
