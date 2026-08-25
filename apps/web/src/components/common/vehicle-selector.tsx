'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Car, ChevronDown, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
}

interface VehicleSelectorProps {
  value?: string;
  onChange: (vehicleId: string, vehicle?: Vehicle) => void;
  className?: string;
  error?: string;
}

export function VehicleSelector({ value, onChange, className = '', error }: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasAutoSelected = useRef(false);

  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const fetchVehicles = useCallback(async (active: { current: boolean }) => {
    await Promise.resolve();
    if (!active.current) return;

    setLoading(true);
    setErrorText(null);
    try {
      const data = await apiClient.get<Vehicle[]>('/vehicles');
      if (!active.current) return;

      setVehicles(data || []);

      const currentValue = valueRef.current;
      if (!hasAutoSelected.current && data && data.length > 0 && !currentValue && typeof window !== 'undefined') {
        hasAutoSelected.current = true;
        const storedStr = localStorage.getItem('wrectifai_selected_vehicle');
        let selected = false;
        if (storedStr) {
          try {
            const stored = JSON.parse(storedStr) as Vehicle;
            const found = data.find((v: Vehicle) => v.id === stored.id);
            if (found) {
              onChangeRef.current(found.id, found);
              localStorage.setItem('wrectifai_selected_vehicle', JSON.stringify(found));
              selected = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (!selected && data[0]) {
          onChangeRef.current(data[0].id, data[0]);
          localStorage.setItem('wrectifai_selected_vehicle', JSON.stringify(data[0]));
        }
      }
    } catch (err) {
      if (!active.current) return;
      const message = err instanceof Error ? err.message : 'Failed to load vehicles';
      setErrorText(message);
    } finally {
      if (active.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const active = { current: true };
    Promise.resolve().then(() => {
      if (active.current) {
        fetchVehicles(active);
      }
    });
    return () => {
      active.current = false;
    };
  }, [fetchVehicles]);

  const selectedVehicle = vehicles.find((v) => v.id === value);

  const handleSelect = (vehicle: Vehicle) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wrectifai_selected_vehicle', JSON.stringify(vehicle));
    }
    onChange(vehicle.id, vehicle);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading ? (
        <div className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#dbe6ff] bg-white px-3 py-2 text-sm text-[#7a8ab4]">
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#1a56db]" />
            Loading your vehicles...
          </span>
        </div>
      ) : errorText ? (
        <div className="flex h-10 w-full items-center justify-between rounded-[10px] border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertCircle className="h-4 w-4" />
            Error loading vehicles
          </span>
          <button
            type="button"
            onClick={() => {
              const active = { current: true };
              fetchVehicles(active);
            }}
            className="text-xs font-bold text-red-700 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#dbe6ff] bg-white px-3 py-2 text-sm">
          <span className="flex items-center gap-2 text-[#7a8ab4]">
            <Car className="h-4 w-4" />
            No vehicles registered
          </span>
          <Link
            href="/vehicles"
            className="text-xs font-bold text-[#1a56db] hover:underline flex items-center gap-0.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Vehicle
          </Link>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex min-h-[56px] w-full items-center justify-between rounded-[12px] border px-4 py-3 text-base transition-all bg-white text-[#17307a] shadow-[0_2px_8px_rgba(26,86,219,0.04)] ${
              isOpen ? 'border-[#1a56db] ring-4 ring-[#1a56db]/10' : 'border-[#dbe6ff] hover:border-[#bfd1ff] hover:shadow-[0_4px_12px_rgba(26,86,219,0.08)]'
            } ${error ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f8ff] text-[#1a56db]">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start min-w-0 flex-1">
                {selectedVehicle ? (
                  <span className="font-bold text-[#17307a] truncate w-full text-left text-[15px]">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </span>
                ) : (
                  <span className="text-[#7a8ab4] font-medium text-[14px]">Select your vehicle...</span>
                )}
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 shrink-0 text-[#7a8ab4] transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              {/* Backdrop to close dropdown on click outside */}
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

              <div className="absolute left-0 right-0 mt-1.5 z-50 rounded-[12px] border border-[#dbe6ff] bg-white p-1.5 shadow-[0_10px_25px_rgba(30,58,138,0.08)] max-h-60 overflow-y-auto animate-in fade-in duration-100">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleSelect(vehicle)}
                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-sm transition-colors ${
                      vehicle.id === value
                        ? 'bg-[#eef4ff] text-[#1a56db] font-semibold'
                        : 'text-[#17307a] hover:bg-slate-50'
                    }`}
                  >
                    <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                    {vehicle.id === value && <span className="h-2 w-2 rounded-full bg-[#1a56db]" />}
                  </button>
                ))}

                <div className="border-t border-slate-100 mt-1.5 pt-1.5 pb-0.5 px-2">
                  <Link
                    href="/vehicles"
                    className="flex items-center justify-center gap-1.5 py-1.5 rounded-[8px] border border-dashed border-[#dbe6ff] text-xs font-bold text-[#1a56db] hover:bg-[#f8fbff] hover:border-[#bfd1ff] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Manage Vehicles
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
