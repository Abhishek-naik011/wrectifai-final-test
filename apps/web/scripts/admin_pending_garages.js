const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/app/admin/garages/pending-approvals/page.tsx');
let content = `
'use client';
import { Card } from '@/components/common/card';
import { Search, MapPin, Download, CheckCircle2, XCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
        // Filter pending garages
        setGarages(garagesData.filter(g => g.approvalStatus === 'pending'));
      } catch (err) {
        console.error('Failed to load garages', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(\`/admin/onboarding/garages/\${id}/approve\`, {});
      setGarages(garages.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to approve garage', err);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#17307a] mb-1">Pending Approvals</h1>
           <p className="text-sm text-slate-500">Dashboard &gt; Garages &gt; Pending Approvals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
            <p className="text-center text-slate-500 p-8">Loading pending approvals...</p>
        ) : garages.length === 0 ? (
            <div className="text-center bg-white border border-slate-100 rounded-xl p-12">
               <p className="text-slate-500 mb-4">No pending garage approvals at the moment.</p>
            </div>
        ) : garages.map(g => (
          <Card key={g.id} className="p-0 overflow-hidden shadow-sm">
            <div className="p-5 flex gap-6">
               <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {g.name ? g.name.substring(0, 2).toUpperCase() : 'G'}
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#17307a]">{g.name}</h3>
                      <p className="text-sm text-slate-500 mb-2">Owner: {g.ownerName || 'N/A'}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {g.city || 'N/A'}</span>
                        <span className="text-slate-300">|</span>
                        <span>Submitted: {formatTime(g.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => router.push('/coming-soon')} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">View Details</button>
                      <button onClick={() => handleApprove(g.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-green-700"><CheckCircle2 className="w-4 h-4"/> Approve</button>
                      <button onClick={() => router.push('/coming-soon')} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100"><XCircle className="w-4 h-4"/></button>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 rounded-xl p-4 mt-4 grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4"/></div>
                       <div><p className="text-[10px] text-slate-500">Identity</p><p className="text-xs font-bold text-slate-700">Verified</p></div>
                    </div>
                 </div>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced Admin Pending Approvals content successfully.');
