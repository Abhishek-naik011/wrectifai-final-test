'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/modal';
import { apiClient } from '@/lib/api-client';

export function BookingModal({ isOpen, onClose, garageId, onSubmitSuccess }: { isOpen: boolean, onClose: () => void, garageId: string, onSubmitSuccess: () => void }) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    if (isOpen) {
      apiClient.get<any[]>('/vehicles').then(data => {
        setVehicles(data);
        if (data.length > 0) setSelectedVehicleId(data[0].id);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const { createBooking } = await import('@/lib/bookings-api');
      
      const scheduledAt = new Date(`${preferredDate}T${preferredTime}:00`).toISOString();
      
      await createBooking({
        garageId,
        vehicleId: selectedVehicleId || '00000000-0000-0000-0000-000000000002',
        scheduledAt,
        totalAmount: 0, // Quote not established yet for direct booking
        bookingType: 'instant',
        quoteId: null
      });
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Appointment" className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-semibold">{errorMsg}</div>}
        <div>
          <label className="block text-sm font-semibold mb-1">Select Vehicle</label>
          <select 
            value={selectedVehicleId} 
            onChange={(e) => setSelectedVehicleId(e.target.value)} 
            className="w-full p-2 border rounded"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.make} {v.model} ({v.plate_number})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Preferred Date</label>
            <input type="date" required value={preferredDate} onChange={e => setPreferredDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Preferred Time</label>
            <input type="time" required value={preferredTime} onChange={e => setPreferredTime(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Issue Description / Notes</label>
          <textarea 
            value={issueDescription} 
            onChange={e => setIssueDescription(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Describe any issues or specific instructions..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#1a56db] text-white rounded font-bold text-sm disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Book Now'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
