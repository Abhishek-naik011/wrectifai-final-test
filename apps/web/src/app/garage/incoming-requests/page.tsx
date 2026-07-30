'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { Card } from '@/components/common/card';

export default function IncomingRequestsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-screen flex gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#17307a] mb-1">Incoming Requests</h1>
            <p className="text-sm text-slate-500 mb-6">New service requests from customers looking for help.</p>
            
            <div className="grid grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <Card key={i} className="p-5 border-t-4 border-t-red-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">HIGH PRIORITY</span>
                    <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                  </div>
                  <div className="flex gap-3 items-center mb-4 border-b border-slate-100 pb-4">
                     <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                     <div>
                       <p className="font-bold text-sm text-[#17307a]">Ananya Patel</p>
                       <p className="text-[11px] text-slate-500 font-medium">+91 98765 43210</p>
                     </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div>
                       <p className="text-sm font-bold text-slate-700">Toyota Innova</p>
                       <p className="text-xs text-slate-500">TS08HK2345 • 2018</p>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-700">AC not cooling properly</p>
                       <p className="text-xs text-slate-500">AC & Heating</p>
                    </div>
                    <p className="text-xs text-green-600 font-bold">2.4 km away</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">View Details</button>
                    <button className="flex-1 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Reject</button>
                    <button className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Accept</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="w-80 space-y-6">
            <Card className="p-5">
              <h3 className="font-bold text-[#17307a] mb-6">Requests Summary</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-[10px] border-r-red-500 border-t-yellow-400 border-l-green-500 border-b-slate-100 flex items-center justify-center font-bold text-2xl text-slate-700">
                  <div className="text-center">12<div className="text-[10px] font-medium text-slate-400 -mt-1">Total</div></div>
                </div>
                <div className="space-y-3 flex-1 text-xs font-bold text-slate-600">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> High</span> <span>5</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Med</span> <span>4</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Low</span> <span>3</span></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
