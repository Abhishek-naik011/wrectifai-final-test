'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { Card } from '@/components/common/card';
import { CheckCircle2, Edit2, MapPin, Mail, Phone, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-screen flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <div>
               <h1 className="text-2xl font-bold text-[#17307a] mb-1">My Profile</h1>
               <p className="text-sm text-slate-500">Manage your personal information and account settings.</p>
            </div>
            
            <div className="flex gap-6 border-b border-slate-200">
               <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold text-sm px-2">Profile Information</button>
               <button className="pb-3 text-slate-500 font-bold text-sm px-2">Security</button>
               <button className="pb-3 text-slate-500 font-bold text-sm px-2">Notifications</button>
               <button className="pb-3 text-slate-500 font-bold text-sm px-2">Preferences</button>
            </div>

            <Card className="p-6">
               <div className="flex justify-between items-start">
                  <div className="flex gap-6 items-center">
                     <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex justify-center items-center text-4xl font-black relative shadow-lg shadow-blue-200">
                        M
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                           <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Edit2 className="w-3 h-3"/></div>
                        </div>
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-[#17307a] flex items-center gap-2 mb-2">Metro Auto Bay <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500 text-white bg-white rounded-full" /></h2>
                        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">Garage Owner</span>
                        <div className="flex flex-col gap-2">
                           <p className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> +91 98765 43210</p>
                           <p className="text-sm text-slate-600 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> metroautobay@gmail.com</p>
                           <p className="text-sm text-slate-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400"/> Hyderabad, Telangana, India</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center min-w-[200px]">
                        <div className="flex gap-3 items-center mb-4"><CalendarIcon className="w-4 h-4 text-blue-500"/><div><p className="text-[10px] text-slate-400 font-bold">Member Since</p><p className="text-sm font-bold text-slate-700">12 March 2024</p></div></div>
                        <div className="flex gap-3 items-center"><Clock className="w-4 h-4 text-blue-500"/><div><p className="text-[10px] text-slate-400 font-bold">Last Login</p><p className="text-sm font-bold text-slate-700">16 May 2025, 10:20 AM</p></div></div>
                     </div>
                     <button className="border border-slate-200 text-blue-600 bg-white rounded-lg px-4 py-2 text-sm font-bold h-fit shadow-sm flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Profile</button>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-[#17307a] mb-6">Personal Information</h3>
               <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Full Name</label>
                    <input type="text" value="Metro Auto Bay" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Business Name</label>
                    <input type="text" value="Metro Auto Bay" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Owner Name</label>
                    <input type="text" value="Ravi Kumar" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Phone Number</label>
                    <input type="text" value="+91 98765 43210" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Email Address</label>
                    <input type="text" value="metroautobay@gmail.com" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Alternate Phone</label>
                    <input type="text" value="+91 91234 56789" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-2">Business Address</label>
                    <input type="text" value="Plot No. 45, Industrial Area, Kukatpally, Hyderabad" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">City</label>
                    <input type="text" value="Hyderabad" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">State</label>
                      <select className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none appearance-none"><option>Telangana</option></select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">PIN Code</label>
                      <input type="text" value="500072" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                    </div>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-[#17307a] mb-6">Business Information</h3>
               <div className="grid grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Business Type</label>
                    <select className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none appearance-none"><option>Multi-brand Workshop</option></select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">GST Number</label>
                    <input type="text" value="36AABCM1234D1Z5" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">License Number</label>
                    <input type="text" value="TG-09-WS-2024-5678" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Established Year</label>
                    <input type="text" value="2018" readOnly className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white outline-none" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">About Business</label>
                  <textarea readOnly className="w-1/2 border rounded-lg px-4 py-3 text-sm bg-white outline-none h-24" value="We provide quality car services including general repairs, engine diagnostics, AC service, body work, and more. Customer satisfaction is our priority."></textarea>
               </div>
            </Card>
          </div>
          
          <div className="w-72 flex flex-col gap-6 flex-shrink-0">
             <Card className="p-5">
               <h3 className="font-bold text-[#17307a] mb-4">Account Summary</h3>
               <div className="space-y-4 text-xs font-bold text-slate-700">
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-blue-50 text-blue-500 flex justify-center items-center text-[10px]">⚙</span> Total Jobs Completed</span> <span className="text-sm">156</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-green-50 text-green-500 flex justify-center items-center text-[10px]">👥</span> Total Customers</span> <span className="text-sm">98</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-yellow-50 text-yellow-500 flex justify-center items-center text-[10px]">★</span> Total Reviews</span> <span className="text-sm">128</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-purple-50 text-purple-500 flex justify-center items-center text-[10px]">⭐</span> Average Rating</span> <span className="text-sm">4.6 / 5</span></div>
                 <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-green-50 text-green-600 flex justify-center items-center text-[10px]">$</span> Total Earnings</span> <span className="text-sm font-black">USD 8,45,320</span></div>
               </div>
               <Link href="/coming-soon" className="block text-[11px] text-blue-600 font-bold mt-4">View Full Analytics &rarr;</Link>
             </Card>
             <Card className="p-5">
               <h3 className="font-bold text-[#17307a] mb-6">Account Status</h3>
               <div className="flex flex-col items-center justify-center mb-2">
                 <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-3"><CheckCircle2 className="w-8 h-8"/></div>
                 <p className="font-bold text-sm text-slate-800">Verified Account</p>
                 <p className="text-[10px] text-slate-500 mt-1">Your account is verified and active.</p>
               </div>
               <div className="mt-4 flex justify-center">
                 <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100">All systems operational</span>
               </div>
             </Card>
             <Card className="p-5">
               <h3 className="font-bold text-[#17307a] mb-4">Quick Links</h3>
               <div className="space-y-3 text-xs font-bold text-slate-600">
                  <Link href="/coming-soon" className="flex items-center justify-between hover:text-blue-600"><span className="flex items-center gap-2"><span className="text-slate-400">🔒</span> Change Password</span> <ChevronRight className="w-4 h-4 text-slate-400"/></Link>
                  <Link href="/coming-soon" className="flex items-center justify-between hover:text-blue-600"><span className="flex items-center gap-2"><span className="text-slate-400">🔔</span> Notification Settings</span> <ChevronRight className="w-4 h-4 text-slate-400"/></Link>
                  <Link href="/coming-soon" className="flex items-center justify-between hover:text-blue-600"><span className="flex items-center gap-2"><span className="text-slate-400">🛡️</span> Privacy Policy</span> <ChevronRight className="w-4 h-4 text-slate-400"/></Link>
                  <Link href="/coming-soon" className="flex items-center justify-between hover:text-blue-600"><span className="flex items-center gap-2"><span className="text-slate-400">📄</span> Terms & Conditions</span> <ChevronRight className="w-4 h-4 text-slate-400"/></Link>
               </div>
             </Card>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
