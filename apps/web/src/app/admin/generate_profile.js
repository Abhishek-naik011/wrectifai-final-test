const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n', 'utf8');
};

const adminProfileDir = 'd:/WRECTIFIAI/wrectifai/apps/web/src/app/admin/profile';

write(`${adminProfileDir}/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Shield, Clock, Calendar, Edit, Mail, Phone, MapPin, CheckCircle2, Lock, Smartphone, Laptop, History, Globe, Sun, Moon, Monitor } from 'lucide-react';

export default function ProfilePage() {
  const adminInfo = {
    initials: 'AS',
    name: 'Admin Surabhi',
    role: 'Super Admin',
    email: 'admin@wrectifai.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, Telangana, India',
    joinedOn: '12 Jan, 2024',
    lastLogin: '29 Jun, 2024\\n10:45 AM',
    accountStatus: 'Active',
    mfaStatus: 'Enabled',
    bio: 'Super Admin of WrectifAI platform. Managing all operations, users, and system configurations.',
  };

  const recentActivity = [
    { type: 'Login Successful', location: 'Hyderabad, India', date: '29 Jun, 2024 10:45 AM', status: 'Success' },
    { type: 'Password Changed', location: 'Hyderabad, India', date: '15 Jun, 2024 02:30 PM', status: 'Success' },
    { type: 'Profile Updated', location: 'Hyderabad, India', date: '10 Jun, 2024 11:20 AM', status: 'Success' },
    { type: 'Two-Factor Authentication Enabled', location: 'Hyderabad, India', date: '05 Jun, 2024 09:15 AM', status: 'Success' },
    { type: 'Login Successful', location: 'Hyderabad, India', date: '01 Jun, 2024 08:40 AM', status: 'Success' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">Home &gt; Profile</p>
        </div>
        <div>
          <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
             <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      <Card className="mb-6 p-6 shadow-sm border-slate-200">
        <div className="flex items-center gap-8">
           <div className="w-32 h-32 rounded-full bg-blue-400 text-white flex items-center justify-center text-5xl font-bold shadow-md relative">
              {adminInfo.initials}
              <div className="absolute bottom-1 right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
           </div>
           
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                 <h2 className="text-2xl font-bold text-slate-900">{adminInfo.name}</h2>
                 <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">{adminInfo.role}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                       <Mail className="w-4 h-4 text-slate-400" /> {adminInfo.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                       <Phone className="w-4 h-4 text-slate-400" /> {adminInfo.phone}
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                       <MapPin className="w-4 h-4 text-slate-400" /> {adminInfo.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                       <Calendar className="w-4 h-4 text-slate-400" /> Joined on {adminInfo.joinedOn}
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-12 border-l border-slate-200 pl-12">
              <div className="flex flex-col items-center justify-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
                 <p className="text-xs font-bold text-slate-900">Role</p>
                 <p className="text-xs text-slate-600">{adminInfo.role}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Calendar className="w-5 h-5" /></div>
                 <p className="text-xs font-bold text-slate-900">Last Login</p>
                 <div className="text-center">
                   <p className="text-xs text-slate-600">{adminInfo.lastLogin.split('\\n')[0]}</p>
                   <p className="text-xs text-slate-600">{adminInfo.lastLogin.split('\\n')[1]}</p>
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                 <p className="text-xs font-bold text-slate-900">Account Status</p>
                 <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded">{adminInfo.accountStatus}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Lock className="w-5 h-5" /></div>
                 <p className="text-xs font-bold text-slate-900">2FA Status</p>
                 <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded">{adminInfo.mfaStatus}</span>
              </div>
           </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
           <Card className="p-6 shadow-sm border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
              
              <div className="flex flex-col gap-5">
                 <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" defaultValue={adminInfo.name} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50" readOnly />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                       <input type="email" defaultValue={adminInfo.email} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50" readOnly />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                       <input type="text" defaultValue={adminInfo.phone} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50" readOnly />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
                    <input type="text" defaultValue={adminInfo.location} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50" readOnly />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bio</label>
                    <textarea defaultValue={adminInfo.bio} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 min-h-[80px]" readOnly />
                 </div>
                 
                 <div className="mt-2">
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                       Save Changes
                    </button>
                 </div>
              </div>
           </Card>
           
           <Card className="p-6 shadow-sm border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Preferences</h3>
              
              <div className="flex flex-col gap-6">
                 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                       <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Language</p>
                          <p className="text-xs text-slate-500">Select your preferred language.</p>
                       </div>
                    </div>
                    <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white min-w-[140px]">
                       <option>English</option>
                    </select>
                 </div>
                 
                 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                       <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Timezone</p>
                          <p className="text-xs text-slate-500">Select your timezone.</p>
                       </div>
                    </div>
                    <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white min-w-[200px]">
                       <option>Asia/Kolkata (GMT +5:30)</option>
                    </select>
                 </div>
                 
                 <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                       <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Date Format</p>
                          <p className="text-xs text-slate-500">Select your preferred date format.</p>
                       </div>
                    </div>
                    <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 bg-white min-w-[140px]">
                       <option>DD MMM YYYY</option>
                    </select>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                       <Sun className="w-5 h-5 text-slate-400 mt-0.5" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Theme</p>
                          <p className="text-xs text-slate-500">Select your preferred theme.</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg transition-colors">
                          <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm ring-1 ring-blue-600 flex items-center justify-center relative"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span></span> Light
                       </button>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
                          <span className="w-3 h-3 rounded-full border border-slate-300"></span> Dark
                       </button>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
                          <Monitor className="w-3.5 h-3.5" /> System
                       </button>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
        
        <div className="flex flex-col gap-6">
           <Card className="p-6 shadow-sm border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Security Settings</h3>
              
              <div className="flex flex-col gap-6">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                       <Lock className="w-5 h-5 text-slate-500 mt-1" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Change Password</p>
                          <p className="text-xs text-slate-500 mt-0.5">Update your password regularly to keep your account secure.</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                       Change Password
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                       <Shield className="w-5 h-5 text-slate-500 mt-1" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                          <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                       </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Enabled</span>
                 </div>
                 
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                       <Laptop className="w-5 h-5 text-slate-500 mt-1" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Active Sessions</p>
                          <p className="text-xs text-slate-500 mt-0.5">Manage your active sessions across devices.</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                       Manage Sessions
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                       <History className="w-5 h-5 text-slate-500 mt-1" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Login History</p>
                          <p className="text-xs text-slate-500 mt-0.5">View your recent login activity.</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                       View History
                    </button>
                 </div>
              </div>
           </Card>
           
           <Card className="p-6 shadow-sm border-slate-200">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                 <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
              </div>
              
              <div className="flex flex-col gap-0 relative">
                 <div className="absolute left-2.5 top-2 bottom-4 w-px bg-slate-200"></div>
                 {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-4 relative pb-5">
                       <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                       </div>
                       <div className="flex-1 flex justify-between items-start pt-0.5">
                          <div>
                             <p className="text-sm font-bold text-slate-900">{activity.type}</p>
                             <p className="text-[11px] text-slate-500 mt-0.5">{activity.location} • {activity.date}</p>
                          </div>
                          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded border border-green-100">{activity.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
`);
