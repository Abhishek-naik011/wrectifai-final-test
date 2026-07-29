'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { garageNavItems } from '@/lib/garage-config';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { fetchGarageActiveJobs, GarageActiveJob } from '@/lib/quotes-api';

export default function ActiveJobsPage() {
  const [jobs, setJobs] = useState<GarageActiveJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGarageActiveJobs();
        setJobs(data);
      } catch (err) {
        console.error('Failed to load active jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="space-y-6 p-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-[#17307a]">Active Jobs</h1>
            <p className="text-sm text-gray-500">Manage jobs you are currently quoting or working on</p>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a56db]"></div>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-gray-200">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#17307a] mb-2">No Active Jobs</h3>
              <p className="text-sm text-gray-500">You don't have any active jobs at the moment.</p>
            </Card>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#e4ecff] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f2f6ff] text-[#17307a] text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Job Status</th>
                      <th className="px-6 py-4">Service Type</th>
                      <th className="px-6 py-4">Complaint</th>
                      <th className="px-6 py-4">Booking Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4ecff]">
                    {jobs.map((job) => {
                      let statusText = 'Unknown';
                      let statusClass = 'bg-gray-100 text-gray-700';

                      if (job.bookingStatus) {
                        statusText = job.bookingStatus;
                        if (['confirmed', 'inService'].includes(statusText)) statusClass = 'bg-green-100 text-green-700';
                        else if (statusText === 'completed') statusClass = 'bg-blue-100 text-blue-700';
                        else if (statusText === 'cancelled') statusClass = 'bg-red-100 text-red-700';
                        else statusClass = 'bg-orange-100 text-orange-700';
                      } else if (job.quoteStatus === 'active' || job.quoteStatus === 'selected') {
                        statusText = 'Quoted';
                        statusClass = 'bg-blue-100 text-blue-700';
                      } else if (job.requestStatus === 'open') {
                        statusText = 'Accepted';
                        statusClass = 'bg-yellow-100 text-yellow-700';
                      }

                      const bookingDateStr = job.bookingDate ? new Date(job.bookingDate).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'N/A';

                      return (
                        <tr key={job.id} className="hover:bg-[#fcfdff] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                                {job.customerAvatar ? (
                                  <img src={job.customerAvatar} alt={job.customerName} className="w-full h-full object-cover" />
                                ) : (
                                  job.customerName?.charAt(0).toUpperCase() || 'C'
                                )}
                              </div>
                              <span className="font-semibold text-[#17307a] whitespace-nowrap">{job.customerName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                            {job.vehicleMake} {job.vehicleModel}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${statusClass}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {job.serviceType || 'General Service'}
                          </td>
                          <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={job.issueSummary}>
                            {job.issueSummary || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                            {bookingDateStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
