'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { Plus, Send, History, CreditCard, ChevronRight, ChevronLeft, HelpCircle, Gift, ArrowDownToLine, ArrowUpRight, Gift as GiftIcon, Download, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/common/modal';
// eslint-disable-next-line @nx/enforce-module-boundaries
import jsPDF from 'jspdf';
// eslint-disable-next-line @nx/enforce-module-boundaries
import autoTable from 'jspdf-autotable';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const mockInitialTransactions = [
  { id: 1, date: '04 Aug 2026', time: '2:19 PM', desc: 'Added Money', subdesc: 'via UPI', type: 'Credit', amount: 1000.00, status: 'Completed', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'INV-1001', method: 'UPI (surabi@okaxis)' },
  { id: 2, date: '03 Aug 2026', time: '11:45 AM', desc: 'Payment for Booking', subdesc: 'Job-48EAEB9D', type: 'Debit', amount: 550.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Speed Car Garage', vehicle: 'Toyota Camry', invoice: 'INV-1002', method: 'Wallet Balance' },
  { id: 3, date: '02 Aug 2026', time: '5:30 PM', desc: 'Cashback Received', subdesc: 'Referral Bonus', type: 'Credit', amount: 50.00, status: 'Completed', icon: GiftIcon, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'N/A', method: 'Promo Code' },
  { id: 4, date: '01 Aug 2026', time: '9:10 AM', desc: 'Payment for Quote', subdesc: 'REQ-C2FEB431', type: 'Debit', amount: 220.00, status: 'Failed', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Metro Auto Bay', vehicle: 'Toyota Camry', invoice: 'INV-1004', method: 'Chase Bank **** 4242' },
  { id: 5, date: '31 Jul 2026', time: '7:22 PM', desc: 'Added Money', subdesc: 'via Card', type: 'Credit', amount: 500.00, status: 'Pending', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'INV-1005', method: 'Chase Bank **** 4242' },
  { id: 6, date: '28 Jul 2026', time: '10:15 AM', desc: 'Payment for Service', subdesc: 'General Maintenance', type: 'Debit', amount: 120.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Prime Auto Care', vehicle: 'Toyota Camry', invoice: 'INV-1006', method: 'Wallet Balance' },
  { id: 7, date: '25 Jul 2026', time: '4:40 PM', desc: 'Added Money', subdesc: 'via Card', type: 'Credit', amount: 200.00, status: 'Completed', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'INV-1007', method: 'Chase Bank **** 4242' },
  { id: 8, date: '22 Jul 2026', time: '1:20 PM', desc: 'Payment for Repair', subdesc: 'Brake Pad Replacement', type: 'Debit', amount: 310.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'AutoFix Garage', vehicle: 'Toyota Camry', invoice: 'INV-1008', method: 'Wallet Balance' },
  { id: 9, date: '19 Jul 2026', time: '9:00 AM', desc: 'Refund', subdesc: 'Overcharged Service', type: 'Credit', amount: 45.00, status: 'Completed', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'Speed Car Garage', vehicle: 'Toyota Camry', invoice: 'INV-1009', method: 'Wallet Balance' },
  { id: 10, date: '15 Jul 2026', time: '11:11 AM', desc: 'Payment for Tires', subdesc: '2x Michelin Pilot Sport', type: 'Debit', amount: 450.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Tyre Hub', vehicle: 'Toyota Camry', invoice: 'INV-1010', method: 'Chase Bank **** 4242' },
  { id: 11, date: '10 Jul 2026', time: '3:30 PM', desc: 'Added Money', subdesc: 'via UPI', type: 'Credit', amount: 800.00, status: 'Completed', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'INV-1011', method: 'UPI (surabi@okaxis)' },
  { id: 12, date: '05 Jul 2026', time: '2:45 PM', desc: 'Payment for Diagnostics', subdesc: 'Engine Check Light', type: 'Debit', amount: 85.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Metro Auto Bay', vehicle: 'Toyota Camry', invoice: 'INV-1012', method: 'Wallet Balance' },
  { id: 13, date: '01 Jul 2026', time: '10:00 AM', desc: 'Cashback Received', subdesc: 'July Promo', type: 'Credit', amount: 20.00, status: 'Completed', icon: GiftIcon, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'N/A', method: 'Promo Code' },
  { id: 14, date: '28 Jun 2026', time: '4:15 PM', desc: 'Payment for Wash', subdesc: 'Premium Detailing', type: 'Debit', amount: 150.00, status: 'Completed', icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50', customer: 'Surabi N', garage: 'Prime Auto Care', vehicle: 'Toyota Camry', invoice: 'INV-1014', method: 'Wallet Balance' },
  { id: 15, date: '25 Jun 2026', time: '12:30 PM', desc: 'Added Money', subdesc: 'via Card', type: 'Credit', amount: 300.00, status: 'Completed', icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50', customer: 'Surabi N', garage: 'N/A', vehicle: 'N/A', invoice: 'INV-1015', method: 'Chase Bank **** 4242' },
];

export function WalletPaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wallet_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({
          ...t,
          icon: t.type === 'Credit' ? (t.desc.includes('Cashback') ? GiftIcon : ArrowDownToLine) : (t.status === 'Failed' ? CreditCard : ArrowUpRight)
        }));
      }
    }
    return mockInitialTransactions;
  });
  const [balance, setBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wallet_balance');
      if (saved) return parseFloat(saved);
    }
    return 1250.00;
  });

  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  // Modals
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  
  const [isLearnWalletOpen, setIsLearnWalletOpen] = useState(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [newMethodType, setNewMethodType] = useState('Card');

  const [paymentMethods, setPaymentMethods] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wallet_methods');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          icon: m.type === 'UPI' ? Smartphone : CreditCard
        }));
      }
    }
    return [
      { id: 1, type: 'UPI', details: 'surabi@okaxis', isDefault: true, icon: Smartphone },
      { id: 2, type: 'Card', details: 'Chase Bank **** 4242', expiry: '12/28', isDefault: false, icon: CreditCard },
    ];
  });

  // Hydration fallback removed since states are lazily initialized

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    // Avoid serializing the React component icon
    const toSave = transactions.map(({ icon, ...rest }: any) => rest);
    localStorage.setItem('wallet_transactions', JSON.stringify(toSave));
  }, [transactions]);

  useEffect(() => {
    // Avoid serializing the React component icon
    const toSave = paymentMethods.map(({ icon, ...rest }: any) => rest);
    localStorage.setItem('wallet_methods', JSON.stringify(toSave));
  }, [paymentMethods]);

  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      setSearchQuery(e.detail);
      setPage(1);
    };
    window.addEventListener('dashboard-search', handleSearch as EventListener);
    return () => window.removeEventListener('dashboard-search', handleSearch as EventListener);
  }, []);

  const filteredTransactions = transactions.filter((tx: any) => {
    if (activeTab === 'Payment History') {
      return tx.type === 'Debit' && (tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) || tx.subdesc.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    const matchesTab = activeTab === 'All' || tx.status === activeTab;
    const matchesSearch = tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) || tx.subdesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageButtons = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 'ellipsis', totalPages] as const;
    if (currentPage >= totalPages - 2) return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages] as const;
    return [1, 'ellipsis', currentPage, 'ellipsis-2', totalPages] as const;
  }, [currentPage, totalPages]);

  const startIndex = filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredTransactions.length);

  const downloadReceipt = (tx: any) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Transaction Receipt', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
      
      const bodyData = [
        ['Transaction ID', tx.id?.toString() || 'N/A'],
        ['Date & Time', `${tx.date || ''} ${tx.time || ''}`.trim() || 'N/A'],
        ['Description', tx.desc || 'N/A'],
        ['Booking ID', tx.subdesc || 'N/A'],
        ['Type', tx.type || 'N/A'],
        ['Amount', `${tx.type === 'Credit' ? '+' : '-'} ₹${tx.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`],
        ['Status', tx.status || 'N/A'],
        ['Customer', tx.customer || 'N/A'],
        ['Garage', tx.garage || 'N/A'],
        ['Vehicle', tx.vehicle || 'N/A'],
        ['Invoice', tx.invoice || 'N/A'],
        ['Payment Method', tx.method || 'N/A'],
      ];

      autoTable(doc, {
        startY: 35,
        head: [['Field', 'Details']],
        body: bodyData,
      });
      
      doc.save(`receipt_${tx.id || Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      alert('Failed to generate PDF receipt. Please try again.');
    }
  };

  const handleAddMoney = () => {
    const amount = parseFloat(addMoneyAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setBalance(prev => prev + amount);
    setTransactions([{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      desc: 'Added Money',
      subdesc: 'via Default Method',
      type: 'Credit',
      amount: amount,
      status: 'Completed',
      icon: ArrowDownToLine,
      color: 'text-green-600',
      bg: 'bg-green-50',
      customer: 'Vishnu',
      garage: 'N/A',
      vehicle: 'N/A',
      invoice: `INV-${Math.floor(Math.random() * 10000)}`,
      method: paymentMethods.find((m: any) => m.isDefault)?.details || 'Card'
    }, ...transactions]);
    
    setIsAddMoneyOpen(false);
    setAddMoneyAmount('');
  };

  const setAsDefault = (id: number) => {
    setPaymentMethods((methods: any[]) => methods.map((m: any) => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Wallet & Payments</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your wallet balance, payments and transaction history</p>
          </div>

          {/* Top Cards Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1 p-6 relative overflow-hidden bg-gradient-to-r from-blue-50 to-white dark:from-[#1A2233] dark:to-[#1A2233] shadow-sm rounded-[24px]">
              <div className="relative z-10 w-2/3">
                <h3 className="text-slate-900 dark:text-white font-bold mb-1 text-sm">Wallet Balance</h3>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Total Balance</p>
                <Button onClick={() => setIsAddMoneyOpen(true)} className="bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4 mr-2"/> Add Money</Button>
              </div>
              <div className="absolute right-0 bottom-0 h-full w-40 opacity-90 hidden sm:flex items-center justify-center">
                 <Image src="/assets/Electrical.png" alt="Wallet" width={140} height={140} className="object-contain" />
              </div>
            </Card>

            <Card className="w-full md:w-80 p-6 shadow-sm border-slate-100 dark:border-slate-800 flex flex-col justify-between rounded-[24px]">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Balance Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Main Balance</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{(balance - 50).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Bonus Balance</span>
                    <span className="font-bold text-green-600">₹50.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Pending Refunds</span>
                    <span className="font-bold text-orange-500">₹0.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setIsLearnWalletOpen(true)} className="flex items-center text-blue-600 text-xs font-semibold hover:underline">
                   <HelpCircle className="w-3.5 h-3.5 mr-1" /> Learn about Wallet <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              </div>
            </Card>
          </div>

          {searchQuery && (
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Searching transactions for: <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">&quot;{searchQuery}&quot;</span>
            </div>
          )}

          {/* Transactions Tabs */}
          <Card className="p-0 shadow-sm border-slate-100 dark:border-slate-800 rounded-[24px] overflow-hidden">
             <div className="flex justify-between items-center pr-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1A2233]">
               <div className="flex overflow-x-auto">
                 {['All', 'Completed', 'Pending', 'Failed', 'Payment History'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => { setActiveTab(tab); setPage(1); }}
                     className={cn("px-6 py-4 font-bold text-sm border-b-2 whitespace-nowrap", activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800")}
                   >
                     {tab === 'All' ? 'Transactions' : tab}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="p-0 overflow-x-auto bg-white dark:bg-[#1A2233]">
               <table className="w-full min-w-[700px] text-sm text-left">
                 <thead className="bg-slate-50 dark:bg-[#121826] text-slate-500 dark:text-slate-400 text-xs font-semibold border-b border-slate-100 dark:border-slate-800">
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
                   {paginatedTransactions.map((tx: any) => (
                     <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", tx.bg, tx.color)}>
                             <tx.icon className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-semibold text-slate-900 dark:text-white">{tx.date}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">{tx.time}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="font-semibold text-slate-900 dark:text-white">{tx.desc}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{tx.subdesc}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={cn("px-2 py-1 rounded text-xs font-bold", tx.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
                           {tx.type}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <p className={cn("font-bold", tx.type === 'Credit' ? 'text-green-600' : 'text-slate-900 dark:text-white')}>
                           {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </p>
                       </td>
                       <td className="px-6 py-4 text-center">
                         <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", 
                           tx.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                           tx.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                           'bg-red-50 text-red-600 border-red-100'
                         )}>{tx.status}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 ml-auto" />
                       </td>
                     </tr>
                   ))}
                   {filteredTransactions.length === 0 && (
                     <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                         No transactions found.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination */}
             {filteredTransactions.length > 0 && (
                <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center bg-white dark:bg-[#1A2233] border-t border-slate-100 dark:border-slate-800">
                  <div className="hidden lg:block" />
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[#17307a] dark:text-white shadow-[0_8px_20px_rgba(30,58,138,0.04)] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {pageButtons.map((entry, index) =>
                      entry === 'ellipsis' || entry === 'ellipsis-2' ? (
                        <div
                          key={`${entry}-${index}`}
                          className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[12px] font-semibold text-[#6173a1] dark:text-slate-400"
                        >
                          ...
                        </div>
                      ) : (
                        <button
                          key={entry}
                          type="button"
                          onClick={() => setPage(entry as number)}
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-[12px] border text-[12px] font-semibold',
                            entry === currentPage
                              ? 'border-[#1a56db] bg-[#1a56db] text-white shadow-[0_10px_20px_rgba(26,86,219,0.18)]'
                              : 'border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[#6173a1] dark:text-slate-400'
                          )}
                        >
                          {entry}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[#17307a] dark:text-white shadow-[0_8px_20px_rgba(30,58,138,0.04)] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-center text-[12.5px] font-medium text-[#4f67a2] dark:text-slate-400 lg:text-right">
                    Showing {startIndex} - {endIndex} of {filteredTransactions.length} transactions
                  </div>
                </div>
             )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] space-y-6">
          <Card className="p-5 shadow-sm border-slate-100 dark:border-slate-800 rounded-[20px] bg-white dark:bg-[#1A2233]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Saved Payment Methods</h3>
            <div className="space-y-4">
               {paymentMethods.map((method: any) => (
                 <div key={method.id} onClick={() => setAsDefault(method.id)} className={cn("flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors", method.isDefault ? "border-blue-500 bg-blue-50/30" : "border-slate-100 dark:border-slate-800 hover:border-blue-200 bg-white dark:bg-[#1A2233]")}>
                    <div className="w-10 h-10 bg-slate-50 dark:bg-[#121826] rounded flex items-center justify-center">
                      <method.icon className={cn("w-5 h-5", method.isDefault ? "text-blue-600" : "text-slate-500 dark:text-slate-400")} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{method.type === 'Card' ? method.details : 'UPI ID'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{method.type === 'Card' ? `Expires ${method.expiry}` : method.details}</p>
                    </div>
                    {method.isDefault && <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded">Default</span>}
                 </div>
               ))}
               
               <Button variant="outline" className="w-full text-blue-600 border-dashed border-slate-300 hover:bg-slate-50 dark:bg-[#121826]" onClick={() => setIsAddMethodOpen(true)}>
                 <Plus className="w-4 h-4 mr-2" /> Add New Card / UPI
               </Button>
            </div>
          </Card>
          
          <Card className="p-5 shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1A2233] rounded-[20px]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Need Help?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Facing issues with payments? We&apos;re here to help you.</p>
            <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => router.push('/help-support')}>
              <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} title="Add Money to Wallet">
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Amount (₹)</label>
            <input type="number" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-lg font-bold focus:outline-none focus:border-blue-500" placeholder="100.00" value={addMoneyAmount} onChange={(e) => setAddMoneyAmount(e.target.value)} />
          </div>
          <Button className="w-full bg-blue-600 text-white" onClick={handleAddMoney}>Confirm & Add</Button>
        </div>
      </Modal>

      <Modal isOpen={isLearnWalletOpen} onClose={() => setIsLearnWalletOpen(false)} title="About Your Wallet">
        <div className="space-y-4 py-2 text-sm text-slate-600 dark:text-slate-400">
          <p><strong className="text-slate-900 dark:text-white">Main Balance:</strong> The actual money you have added via cards or UPI.</p>
          <p><strong className="text-slate-900 dark:text-white">Bonus Balance:</strong> Promotional credits or cashback. Cannot be withdrawn, only used for bookings.</p>
          <p><strong className="text-slate-900 dark:text-white">Pending Refunds:</strong> Refunds currently processing back to your original payment method.</p>
          <p><strong className="text-slate-900 dark:text-white">Wallet Usage:</strong> Your wallet balance is automatically prioritized during checkout for services and parts.</p>
          <Button className="w-full mt-4" onClick={() => setIsLearnWalletOpen(false)}>Got it</Button>
        </div>
      </Modal>

      <Modal isOpen={isAddMethodOpen} onClose={() => setIsAddMethodOpen(false)} title="Add Payment Method">
        <div className="space-y-4 py-2">
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
            <button className={cn("flex-1 py-2 text-sm font-bold border-b-2", newMethodType === 'Card' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 dark:text-slate-400")} onClick={() => setNewMethodType('Card')}>Credit/Debit Card</button>
            <button className={cn("flex-1 py-2 text-sm font-bold border-b-2", newMethodType === 'UPI' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 dark:text-slate-400")} onClick={() => setNewMethodType('UPI')}>UPI</button>
          </div>
          
          {newMethodType === 'Card' ? (
            <div className="space-y-3">
              <input type="text" placeholder="Card Number" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
              <div className="flex gap-3">
                <input type="text" placeholder="MM/YY" className="w-1/2 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="CVV" className="w-1/2 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input type="text" placeholder="UPI ID (e.g. name@bank)" className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          )}
          
          <Button className="w-full mt-4 bg-blue-600 text-white" onClick={() => {
            setPaymentMethods([...paymentMethods, { id: Date.now(), type: newMethodType, details: newMethodType === 'Card' ? 'New Bank **** 1234' : 'new@upi', expiry: '11/29', isDefault: false, icon: newMethodType === 'Card' ? CreditCard : Smartphone }]);
            setIsAddMethodOpen(false);
          }}>Save Method</Button>
        </div>
      </Modal>

      <Modal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} title="Transaction Details">
        {selectedTransaction && (
          <div className="space-y-6 pt-4 pb-2 relative">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", selectedTransaction.bg, selectedTransaction.color)}>
                 <selectedTransaction.icon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTransaction.type === 'Credit' ? '+' : '-'}₹{selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className="text-slate-500 dark:text-slate-400">{selectedTransaction.status}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#121826] rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Customer</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Garage</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.garage}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Vehicle</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.vehicle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Booking ID</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.subdesc}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Invoice</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.invoice}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTransaction.date} {selectedTransaction.time}</span>
              </div>
            </div>
            
            <div className="sticky bottom-[-16px] -mx-4 -mb-2 px-4 pt-4 pb-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 z-10">
               <Button className="flex-1" variant="outline" onClick={() => setSelectedTransaction(null)}>Close</Button>
               <Button className="flex-1 bg-blue-600 text-white" onClick={() => downloadReceipt(selectedTransaction)}>Download PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}

export default WalletPaymentsPage;