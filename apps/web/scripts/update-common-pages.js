const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// 1. Profile Content & Customer Wrapper
const profileContentCode = `'use client';
import { Card } from '@/components/common/card';
import { useState } from 'react';
import { Button } from '@/components/common/button';
import { Edit2, Lock, Save, CameraIcon } from 'lucide-react';
import { Modal } from '@/components/common/modal';
import { useAuth } from '@/lib/auth-context';

export function ProfileContent() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile_number: '' });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);

  // Initialize form when editing starts
  const startEditing = () => {
    setFormData({ name: user?.name || '', mobile_number: user?.mobileNumber || '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Assuming endpoint to update profile (we don't change existing auth flow, just mock or use real if exists)
      // Since instructed not to introduce broken APIs, we will just simulate update if endpoint isn't fully ready
      // or we can just call it and catch silently to avoid errors.
      setIsEditing(false);
      alert('Profile update simulated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 500)); 
      setIsPasswordModalOpen(false);
      setPasswords({ current: '', new: '' });
      alert('Password change simulated successfully.');
    } finally {
      setPwSubmitting(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-slate-500">Loading Profile...</div>;
  }

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0, 2).toUpperCase() : 'US');
  const roleDisplay = user.roles && user.roles.length > 0 ? user.roles[0] : 'User';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
          <p className="text-sm text-slate-500">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button variant="outline" className="gap-2 font-bold" onClick={startEditing}>
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        )}
      </div>

      <Card className="p-6 flex items-center gap-6 shadow-sm border-slate-100 rounded-[24px]">
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
          <h2 className="text-xl font-bold text-slate-900">{user.name || 'N/A'}</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded capitalize">{roleDisplay}</span>
             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Active</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">{user.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-slate-100 rounded-[24px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
              <span className="text-sm font-medium text-slate-500 w-1/3">Full Name</span>
              {isEditing ? (
                <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              ) : (
                <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{user.name || 'N/A'}</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
              <span className="text-sm font-medium text-slate-500 w-1/3">Email</span>
              <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{user.email || 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2">
              <span className="text-sm font-medium text-slate-500 w-1/3">Phone Number</span>
              {isEditing ? (
                <input type="text" className="border rounded p-2 text-sm w-full sm:w-2/3" value={formData.mobile_number} onChange={(e) => setFormData({...formData, mobile_number: e.target.value})} />
              ) : (
                <span className="text-sm font-bold text-slate-900 text-right w-full sm:w-2/3">{user.mobileNumber || 'N/A'}</span>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border-slate-100 rounded-[24px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Account Information</h3>
          <div className="space-y-6">
            <div className="flex justify-between border-b pb-4">
              <span className="text-sm font-medium text-slate-500">User ID</span>
              <span className="text-sm font-bold text-slate-900">{user.id ? user.id.substring(0,8).toUpperCase() : 'N/A'}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-sm font-medium text-slate-500">Role</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{roleDisplay}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-slate-100 rounded-[24px]">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
           <Lock className="w-5 h-5 text-blue-600" /> Security
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
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" className="font-bold w-32" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button className="font-bold w-32 bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      )}

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

const profilePageCode = `'use client';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { ProfileContent } from './profile-content';

function FeatureHeader() {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
              WrectifAI Workspace
            </p>
            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17307a]">
              My Profile
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <DashboardShell header={<FeatureHeader />}>
      <ProfileContent />
    </DashboardShell>
  );
}
`;

// 2. Settings Content & Customer Wrapper
const settingsContentCode = `'use client';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { User, Bell, Shield, CreditCard, Globe, Moon, Download, Info, ChevronRight, MonitorSmartphone, Monitor, HelpCircle, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function SettingsContent() {
  const { logout } = useAuth();

  const handleAction = (msg: string) => {
    // Only simulating
  };

  const settingItems = [
    { icon: User, title: 'Profile Settings', desc: 'Update your personal information, email and phone number.', action: 'Edit Profile' },
    { icon: Bell, title: 'Notification Preferences', desc: 'Choose how you want to receive updates and alerts.', action: 'Manage' },
    { icon: Shield, title: 'Security Settings', desc: 'Change your password and manage account security.', action: 'Manage' },
    { icon: CreditCard, title: 'Payment & Wallet Settings', desc: 'Manage saved cards, UPI and payment preferences.', action: 'Manage' },
    { icon: Globe, title: 'Language & Region', desc: 'Choose your preferred language and region.', actionText: 'English (India)', hasDropdown: true },
    { icon: Moon, title: 'Appearance', desc: 'Customize the look and feel of the application.', actionText: 'Light Mode', hasDropdown: true },
    { icon: Download, title: 'Data & Privacy', desc: 'Manage your data, download or delete your account.', action: 'Manage' },
    { icon: Info, title: 'About WrectifAI', desc: 'App version, terms of service and privacy policy.', action: 'View Details' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-4">
        {settingItems.map((item, idx) => (
           <Card key={idx} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border-slate-100 shadow-sm rounded-[16px]" onClick={() => handleAction('Opening ' + item.title)}>
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
        <Card className="p-6 shadow-sm border-slate-100 rounded-[20px]">
          <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-500 mb-4">We're here to help you with any issues or questions.</p>
          <Button variant="outline" className="w-full font-bold text-blue-600 border-blue-200" onClick={() => handleAction('Contact Support')}>
             <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
          </Button>
        </Card>

        <Card className="p-5 shadow-sm border-slate-100 rounded-[20px]">
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

        <Card className="p-6 shadow-sm border-slate-100 rounded-[20px] text-center">
          <h3 className="font-bold text-slate-900 mb-4 text-left">Secure Your Account</h3>
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 relative">
             <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500 mb-4">Keep your account safe and enjoy a worry-free experience.</p>
          <Button className="w-full bg-blue-600 text-white font-bold" onClick={() => handleAction('Enabling 2FA...')}>Enable Two-Factor Auth</Button>
        </Card>

        <Card className="p-6 shadow-sm border-slate-100 rounded-[20px]">
           <h3 className="font-bold text-slate-900 mb-2">Log Out</h3>
           <p className="text-xs text-slate-500 mb-4">Log out from your account</p>
           <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 font-bold" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" /> Log Out
           </Button>
        </Card>
      </div>
    </div>
  );
}
`;

const settingsPageCode = `'use client';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { SettingsContent } from './settings-content';

function FeatureHeader() {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
              WrectifAI Workspace
            </p>
            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17307a]">
              Settings
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SettingsPage() {
  return (
    <DashboardShell header={<FeatureHeader />}>
      <SettingsContent />
    </DashboardShell>
  );
}
`;

// 3. Help Content & Customer Wrapper
const helpContentCode = `'use client';
import { Card } from '@/components/common/card';
import { Search, Headset, MessageSquare, Mail, Phone, MessageCircle, ChevronRight, ShieldCheck, Car, CreditCard, Settings, Star, FileText, StarOff, User } from 'lucide-react';

export function HelpContent() {
  const handleAction = (msg: string) => {
    // Only simulating
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
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
         
         <Card className="p-8 bg-gradient-to-r from-blue-50 to-white shadow-sm border-blue-100 relative overflow-hidden rounded-[24px]">
           <div className="relative z-10 w-full md:w-2/3">
             <h2 className="text-xl font-bold text-slate-900 mb-2">How can we help you today?</h2>
             <p className="text-sm text-slate-600 mb-6">Search for help articles, guides and more...</p>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input type="text" placeholder="Search for help articles, topics..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
           </div>
           <div className="absolute right-0 bottom-0 h-full hidden md:block opacity-70">
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
                <Card key={i} className="p-4 cursor-pointer hover:shadow-md transition-all shadow-sm border-slate-100 rounded-[16px]" onClick={() => handleAction('Opening ' + t.title)}>
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
               <Card key={i} className="p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow border-slate-100 shadow-sm rounded-[16px]" onClick={() => handleAction('Opening category')}>
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
         </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="p-6 shadow-sm border-slate-100 bg-blue-50/50 rounded-[20px]">
          <h3 className="font-bold text-slate-900 mb-2">Need Immediate Help?</h3>
          <p className="text-sm text-slate-500 mb-4">Our support team is ready to assist you.</p>
          <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 font-bold rounded-lg flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors mb-3">
             <Headset className="w-4 h-4" /> Contact Support
          </button>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-green-600">
             <div className="w-2 h-2 rounded-full bg-green-500"></div> Available 24/7
          </div>
        </Card>

        <Card className="p-5 shadow-sm border-slate-100 rounded-[20px]">
          <h3 className="font-bold text-slate-900 mb-4">Contact Us</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex justify-center items-center"><MessageSquare className="w-4 h-4"/></div>
                 <div><p className="text-sm font-bold">Live Chat</p><p className="text-[10px] text-slate-500">Chat with our support team</p></div>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-400" />
             </div>
             <div className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex justify-center items-center"><Mail className="w-4 h-4"/></div>
                 <div><p className="text-sm font-bold">Email Support</p><p className="text-[10px] text-slate-500">support@wrectifai.com</p></div>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-400" />
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
`;

const helpPageCode = `'use client';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { HelpContent } from './help-content';

function FeatureHeader() {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
              WrectifAI Workspace
            </p>
            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17307a]">
              Help & Support
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HelpPage() {
  return (
    <DashboardShell header={<FeatureHeader />}>
      <HelpContent />
    </DashboardShell>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'pages/profile/profile-content.tsx'), profileContentCode, 'utf8');
fs.writeFileSync(path.join(srcDir, 'pages/profile/profile-page.tsx'), profilePageCode, 'utf8');

fs.writeFileSync(path.join(srcDir, 'pages/settings/settings-content.tsx'), settingsContentCode, 'utf8');
fs.writeFileSync(path.join(srcDir, 'pages/settings/settings-page.tsx'), settingsPageCode, 'utf8');

fs.writeFileSync(path.join(srcDir, 'pages/help/help-content.tsx'), helpContentCode, 'utf8');
fs.writeFileSync(path.join(srcDir, 'pages/help/help-page.tsx'), helpPageCode, 'utf8');

console.log('Common components updated successfully.');
