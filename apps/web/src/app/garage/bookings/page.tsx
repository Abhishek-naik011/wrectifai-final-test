'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { fetchBookings } from '@/lib/bookings-api';
import { useEffect, useState } from 'react';
import { Card } from '@/components/common/card';
import { updateBookingStatus } from '@/lib/bookings-api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings()
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#17307a] mb-1">Bookings</h1>
              <p className="text-sm text-slate-500">Manage all your bookings and workshop schedules.</p>
            </div>
          </div>
          
          <Card className="p-6">
            {loading ? (
              <p className="text-center text-slate-500 py-10">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No Bookings Found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-sm font-semibold text-[#17307a]">Booking ID</th>
                      <th className="p-3 text-sm font-semibold text-[#17307a]">Date</th>
                      <th className="p-3 text-sm font-semibold text-[#17307a]">Vehicle</th>
                      <th className="p-3 text-sm font-semibold text-[#17307a]">Status</th>
                      <th className="p-3 text-sm font-semibold text-[#17307a] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 text-sm font-medium">{b.id.substring(0, 8).toUpperCase()}</td>
                        <td className="p-3 text-sm text-slate-600">{new Date(b.scheduledAt).toLocaleString()}</td>
                        <td className="p-3 text-sm text-slate-600">{b.vehicleMake} {b.vehicleModel}</td>
                        <td className="p-3 text-sm text-slate-600 capitalize">
                          {b.status === 'pendingPayment' ? 'Pending' : b.status === 'in_progress' ? 'In Progress' : b.status}
                        </td>
                        <td className="p-3 text-sm text-right space-x-2 flex justify-end items-center h-full">
                          {b.status === 'pendingPayment' && (
                            <>
                              <button onClick={() => handleUpdateStatus(b.id, 'accepted')} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold hover:bg-blue-200">
                                Accept
                              </button>
                              <button onClick={() => handleUpdateStatus(b.id, 'rejected')} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded font-semibold hover:bg-red-200 ml-2">
                                Reject
                              </button>
                            </>
                          )}
                          {(b.status === 'confirmed' || b.status === 'accepted') && (
                            <button onClick={() => handleUpdateStatus(b.id, 'in_progress')} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-semibold hover:bg-indigo-200">
                              Start Job
                            </button>
                          )}
                          {b.status === 'in_progress' && (
                            <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-semibold hover:bg-green-200">
                              Complete Job
                            </button>
                          )}
                          {b.status === 'completed' && (
                            <button onClick={() => window.location.href = `/garage/service-history`} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded font-semibold hover:bg-slate-200 inline-block">
                              View History
                            </button>
                          )}
                          {b.status === 'cancelled' && (
                            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded font-semibold inline-block">
                              View Details
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
