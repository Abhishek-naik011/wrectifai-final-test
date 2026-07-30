'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { GarageStatCard, GarageSummaryCard, WorkshopCard, RequestCard } from '@/components/garages/ui/reusable-components';
import { Card } from '@/components/common/card';
import { Calendar, Inbox, CheckCircle, Car, DollarSign, Plus, Calendar as CalendarIcon, Star, PenTool, Wrench, AlertTriangle, ArrowRight } from 'lucide-react';

export default function GarageDashboard() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#17307a]">Welcome back, Metro Auto Bay 👋</h1>
              <p className="text-sm text-slate-500">Here's what's happening in your garage today.</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#17307a] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/> Create Quote</button>
              <button className="bg-white border text-[#17307a] px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm"><CalendarIcon className="w-4 h-4"/> View Bookings</button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <GarageStatCard title="Today's Bookings" value="14" icon={<Calendar className="w-5 h-5 text-blue-500"/>} trend="+18%" color="blue" />
            <GarageStatCard title="Incoming Requests" value="12" icon={<Inbox className="w-5 h-5 text-orange-500"/>} trend="+15%" color="orange" />
            <GarageStatCard title="Active Jobs" value="08" icon={<CheckCircle className="w-5 h-5 text-purple-500"/>} trend="-5%" color="purple" />
            <GarageStatCard title="Vehicles Waiting" value="05" icon={<Car className="w-5 h-5 text-green-500"/>} trend="-3%" color="green" />
            <GarageStatCard title="Today's Revenue" value="₹42,850" icon={<DollarSign className="w-5 h-5 text-emerald-500"/>} trend="+22%" color="emerald" />
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9 space-y-6">
              
              <Card className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-[#17307a]">Active Workshop Floor</h2>
                  <a href="#" className="text-sm text-blue-600 hover:underline">View All Jobs</a>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <WorkshopCard title="ACCEPTED (3)" status="accepted" items={[{id: 'TS09HK1234', time: '10:20 AM', model: 'Toyota Fortuner', customer: 'Rohan Sharma', assignedTo: 'Amit K.'}]} />
                  <WorkshopCard title="INSPECTION (2)" status="inspection" items={[{id: 'TS09KL4567', time: '09:45 AM', model: 'Kia Seltos', customer: 'Neha Singh', assignedTo: 'Prakash'}]} />
                  <WorkshopCard title="REPAIR (2)" status="repair" items={[{id: 'TS11PQ3456', time: '09:30 AM', model: 'BMW 320d', customer: 'Sanjay Verma', assignedTo: 'Ramesh'}]} />
                  <WorkshopCard title="READY (1)" status="ready" items={[{id: 'TS13TU2345', time: '01:20 PM', model: 'Volkswagen Polo', customer: 'Ayesha Khan', assignedTo: 'Manoj'}]} />
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-6">
                 <Card className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#17307a]">Pending Service Requests</h3>
                      <a href="#" className="text-xs text-blue-600">View All</a>
                    </div>
                    <div className="space-y-3">
                       <RequestCard name="Ananya Patel" vehicle="Toyota Innova • TS08HK2345" issue="AC not cooling properly" time="2 min ago" />
                       <RequestCard name="Rahul Verma" vehicle="Honda Amaze • TS09AB7788" issue="Brake noise" time="15 min ago" />
                    </div>
                 </Card>
                 <Card className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#17307a]">Recent Quotes</h3>
                      <a href="#" className="text-xs text-blue-600">View All</a>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600"><PenTool className="w-4 h-4"/></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Q-2024-1256</p>
                          <p className="text-xs text-slate-500">Mahindra XUV700 • TS08HK2345</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹21,450</p>
                          <p className="text-[10px] text-blue-600 font-medium">Sent 20 min ago</p>
                        </div>
                      </div>
                    </div>
                 </Card>
                 <Card className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[#17307a]">Recent Reviews</h3>
                      <a href="#" className="text-xs text-blue-600">View All</a>
                    </div>
                    <div className="space-y-3">
                       <div className="flex gap-2">
                         <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center"><Star className="w-4 h-4 text-white"/></div>
                         <div className="flex-1">
                           <div className="flex justify-between">
                             <p className="text-sm font-semibold">Rohan Sharma</p>
                             <p className="text-[10px] text-slate-400">2 hrs ago</p>
                           </div>
                           <div className="flex text-yellow-400 my-0.5"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                           <p className="text-xs text-slate-600">Excellent service! Quick diagnosis...</p>
                         </div>
                       </div>
                    </div>
                 </Card>
              </div>

            </div>

            <div className="col-span-3 space-y-6">
              <GarageSummaryCard title="Today's Summary" isLive>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><div className="flex items-center gap-2"><Star className="w-4 h-4 text-blue-500"/> <span className="text-sm font-medium">Average Rating</span></div> <span className="font-bold">4.8 / 5.0</span></div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500"/> <span className="text-sm font-medium">Satisfaction Rate</span></div> <span className="font-bold">96%</span></div>
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> <span className="text-sm font-medium">Total Orders</span></div> <span className="font-bold">12 Active</span></div>
                 </div>
              </GarageSummaryCard>
              
              <GarageSummaryCard title="Today's Schedule" actionText="View Calendar">
                 <div className="space-y-3 relative before:absolute before:inset-0 before:ml-1 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-4">
                   <div className="relative mb-4">
                     <div className="absolute w-2 h-2 bg-green-500 rounded-full -left-[21px] top-1.5"></div>
                     <p className="text-xs font-bold text-slate-700">10:30 AM - Mahindra XUV700</p>
                     <p className="text-[11px] text-slate-500">General Service</p>
                   </div>
                   <div className="relative mb-4">
                     <div className="absolute w-2 h-2 bg-yellow-500 rounded-full -left-[21px] top-1.5"></div>
                     <p className="text-xs font-bold text-slate-700">12:45 PM - Kia Seltos</p>
                     <p className="text-[11px] text-slate-500">Brake Pad Replacement</p>
                   </div>
                 </div>
              </GarageSummaryCard>
              
              <GarageSummaryCard title="Inventory Alerts" actionText="View All">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs font-bold">Engine Oil 5W-30</p>
                      <p className="text-[10px] text-red-500">Low Stock (2 Units Left)</p>
                    </div>
                  </div>
                </div>
              </GarageSummaryCard>

              <div className="bg-[#17307a] rounded-xl p-5 text-white">
                <h3 className="font-bold mb-2 text-sm flex items-center gap-2">Need Help?</h3>
                <p className="text-xs text-blue-200 mb-4">Connect with your WrectifAI Manager for priority support.</p>
                <button className="w-full bg-white text-[#17307a] py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">Chat Now</button>
              </div>

            </div>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
