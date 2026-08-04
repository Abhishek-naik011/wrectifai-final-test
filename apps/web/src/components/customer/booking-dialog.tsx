'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/modal';
import { Button } from '@/components/common/button';
import { apiClient } from '@/lib/api-client';
import type { QuoteItem } from '@/components/quotes/quotes-shared';

export function BookingDialog({ quote, onClose, onSuccess }: { quote: QuoteItem, onClose: () => void, onSuccess: () => void }) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState(quote.preferredDate ? quote.preferredDate.split('T')[0] : '');
  const [preferredTime, setPreferredTime] = useState('');
  const [issueDescription, setIssueDescription] = useState(quote.requestIssueSummary || '');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiClient.get<any[]>('/vehicles').then(data => {
      setVehicles(data || []);
      if (data && data.length === 1) {
        setVehicleId(data[0].id);
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) {
      setErrorMsg('Please select a vehicle.');
      return;
    }
    if (!preferredDate || !preferredTime) {
      setErrorMsg('Please select a preferred date and time.');
      return;
    }
    if (!issueDescription.trim()) {
      setErrorMsg('Please enter the issue description before booking.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiClient.post(`/bookings/from-quote/${quote.id}`, {
        vehicleId,
        issueDescription: issueDescription,
        scheduledAt: `${preferredDate}T${preferredTime}:00`,
        notes: additionalNotes,
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const quoteAmount = quote.price || `$${(quote as any).amount || (quote as any).totalCost || 0}`;
  const garageName = (quote as any).garageName || quote.garage;
  const rawTime = quote.time || (quote as any).eta_note;
  const estimatedDays = rawTime ? (/^\\d+$/.test(String(rawTime).trim()) ? `${String(rawTime).trim()} Days` : rawTime) : 'N/A';

  return (
    <Modal isOpen={true} onClose={onClose} title="Book Appointment" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded text-sm font-semibold">{errorMsg}</div>}
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="font-bold text-slate-600">Garage:</span>
            <span className="font-bold text-slate-800">{garageName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-600">Quote Amount:</span>
            <span className="font-bold text-blue-700">{quoteAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-600">Estimated Days:</span>
            <span className="font-bold text-slate-800">{estimatedDays}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Vehicle <span className="text-red-500">*</span></label>
          <select 
            value={vehicleId} 
            onChange={e => setVehicleId(e.target.value)} 
            className="w-full p-2 border rounded border-slate-300 bg-white"
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.make} {v.model} {v.year}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Preferred Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={preferredDate} 
              onChange={e => setPreferredDate(e.target.value)} 
              min={todayStr}
              className="w-full p-2 border rounded border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Preferred Time <span className="text-red-500">*</span></label>
            <input 
              type="time" 
              value={preferredTime} 
              onChange={e => setPreferredTime(e.target.value)} 
              className="w-full p-2 border rounded border-slate-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Issue Description <span className="text-red-500">*</span></label>
          <textarea
            value={issueDescription}
            onChange={e => setIssueDescription(e.target.value)}
            placeholder="Describe the issue you need fixed..."
            className="w-full p-2 border rounded border-slate-300 h-20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Additional Notes (Optional)</label>
          <textarea
            value={additionalNotes}
            onChange={e => setAdditionalNotes(e.target.value)}
            placeholder="Any specific instructions for the garage..."
            className="w-full p-2 border rounded border-slate-300 h-20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="default" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? 'Confirming...' : 'Book Now'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
