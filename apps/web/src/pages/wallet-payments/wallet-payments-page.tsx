'use client';

import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { Plus, Send, History, CreditCard, ChevronRight, HelpCircle, Gift, ArrowDownToLine, ArrowUpRight, Gift as GiftIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const mockTransactions = [
  { id: 1, date: '04 Aug 2026', time: '2:19 PM', desc: 'Added Money', subdesc: 'via UPI', type: 'Credit', amount: '+ $1,000.00', status: 'Success', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 2, date: '03 Aug 2026', time: '11:45 AM', desc: 'Payment for Booking', subdesc: 'Job-48EAEB9D', type: 'Debit', amount: '- $550.00', status: 'Success', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 3, date: '02 Aug 2026', time: '5:30 PM', desc: 'Cashback Received', subdesc: 'Referral Bonus', type: 'Credit', amount: '+ $50.00', status: 'Success', icon: GiftIcon, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 4, date: '01 Aug 2026', time: '9:10 AM', desc: 'Payment for Quote', subdesc: 'REQ-C2FEB431', type: 'Debit', amount: '- $220.00', status: 'Success', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 5, date: '31 Jul 2026', time: '7:22 PM', desc: 'Added Money', subdesc: 'via Card', type: 'Credit', amount: '+ $500.00', status: 'Success', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
];

export function WalletPaymentsPage() {
  const router = useRouter();

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Wallet & Payments</h1>
            <p className="text-slate-500 text-sm">Manage your wallet balance, payments and transaction history</p>
          </div>

          {/* Top Cards Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1 p-6 relative overflow-hidden bg-gradient-to-r from-blue-50 to-white shadow-sm rounded-[24px]">
              <div className="relative z-10 w-2/3">
                <h3 className="text-slate-900 font-bold mb-1 text-sm">Wallet Balance</h3>
                <p className="text-4xl font-extrabold text-slate-900 mb-1">$1,250.00</p>
                <p className="text-slate-500 text-xs mb-6">Total Balance</p>
                <Button className="bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm" onClick={() => {}}><Plus className="w-4 h-4 mr-2"/> Add Money</Button>
              </div>
              <div className="absolute right-0 bottom-0 h-full w-40 opacity-90 hidden sm:flex items-center justify-center">
                 <Image src="/assets/Electrical.png" alt="Wallet" width={140} height={140} className="object-contain" />
              </div>
            </Card>

            <Card className="w-full md:w-80 p-6 shadow-sm border-slate-100 flex flex-col justify-between rounded-[24px]">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Balance Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Main Balance</span>
                    <span className="font-bold text-slate-900">$1,200.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Bonus Balance</span>
                    <span className="font-bold text-green-600">$50.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Pending Refunds</span>
                    <span className="font-bold text-orange-500">$0.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <button className="flex items-center text-blue-600 text-xs font-semibold hover:underline">
                   <HelpCircle className="w-3.5 h-3.5 mr-1" /> Learn about Wallet <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              </div>
            </Card>
          </div>

          {/* Transactions Tabs */}
          <Card className="p-0 shadow-sm border-slate-100 rounded-[24px] overflow-hidden">
             <div className="flex border-b border-slate-100">
               <button className="px-6 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-sm">Transactions</button>
               <button className="px-6 py-4 text-slate-500 font-medium text-sm hover:text-slate-800">Payment History</button>
             </div>
             
             <div className="p-0 overflow-x-auto">
               <table className="w-full min-w-[700px] text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                   <tr>
                     <th className="px-6 py-4 font-medium">Date & Time</th>
                     <th className="px-6 py-4 font-medium">Description</th>
                     <th className="px-6 py-4 font-medium">Type</th>
                     <th className="px-6 py-4 font-medium">Amount</th>
                     <th className="px-6 py-4 font-medium text-center">Status</th>
                     <th className="px-6 py-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {mockTransactions.map((tx) => (
                     <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", tx.bg, tx.color)}>
                             <tx.icon className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-semibold text-slate-900">{tx.date}</p>
                             <p className="text-xs text-slate-500">{tx.time}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-semibold text-slate-900">{tx.desc}</p>
                         <p className="text-xs text-slate-500">{tx.subdesc}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={cn("px-2 py-1 rounded text-xs font-bold", tx.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
                           {tx.type}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <p className={cn("font-bold", tx.type === 'Credit' ? 'text-green-600' : 'text-slate-900')}>{tx.amount}</p>
                       </td>
                       <td className="px-6 py-4 text-center">
                         <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">{tx.status}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 ml-auto" />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             
             <div className="p-4 border-t border-slate-100 text-center">
               <button className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center gap-1">View All Transactions <ChevronRight className="w-4 h-4" /></button>
             </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] space-y-6">
          <Card className="p-4 shadow-sm border-slate-100 rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-4 px-2">Quick Actions</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                <span className="flex items-center gap-3"><Plus className="w-4 h-4 text-blue-600" /> Add Money</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                <span className="flex items-center gap-3"><Send className="w-4 h-4 text-blue-600" /> Send Money</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                <span className="flex items-center gap-3"><History className="w-4 h-4 text-blue-600" /> Transaction History</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-blue-600" /> Payment History</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-blue-100 bg-blue-50/30 rounded-[20px] relative overflow-hidden">
            <div className="relative z-10 w-2/3">
               <h3 className="font-bold text-blue-900 mb-1">Get 5% Cashback!</h3>
               <p className="text-xs text-blue-700 mb-4">Add money to your wallet and get 5% cashback up to $100</p>
               <Button className="bg-blue-600 text-white shadow-sm text-xs py-1.5 h-8">Add Money Now</Button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 flex items-center justify-center">
               <div className="w-16 h-16 bg-white/50 backdrop-blur rounded-full flex items-center justify-center">
                 <Gift className="w-8 h-8 text-red-500" />
               </div>
            </div>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100 rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-4">Saved Payment Methods</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 cursor-pointer transition-colors bg-white">
                  <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">UPI ID</p>
                    <p className="text-xs text-slate-500">user@bank</p>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded">Default</span>
               </div>
               
               <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-200 cursor-pointer transition-colors bg-white">
                  <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-900" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">VISA Bank **** 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/28</p>
                  </div>
               </div>
               
               <Button variant="outline" className="w-full text-blue-600 border-dashed border-slate-300 hover:bg-slate-50">
                 <Plus className="w-4 h-4 mr-2" /> Add New Card / UPI
               </Button>
            </div>
          </Card>
          
          <Card className="p-5 shadow-sm border-slate-100 bg-white rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-sm text-slate-500 mb-4">Facing issues with payments? We're here to help you.</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => router.push('/help-support')}>
              <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
