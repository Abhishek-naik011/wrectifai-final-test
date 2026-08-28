'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Car,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  ShieldAlert,
  X,
  Sparkles,
  Settings,
  UploadCloud,
  CheckCircle2,
  Star
} from 'lucide-react';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { apiClient } from '@/lib/api-client';

interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  warranty?: unknown;
  plateNumber?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  isPrimary?: boolean;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const data = await apiClient.get<Vehicle[]>('/vehicles');
      setVehicles(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load vehicles';
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchVehicles();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchVehicles]);

  return { vehicles, loading, errorText, fetchVehicles };
}

function FeatureHeader({ onAddClick }: { onAddClick: () => void }) {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[#1a56db] shadow-sm lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
              WrectifAI Workspace
            </p>
            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17307a] dark:text-white">
              My Vehicles
            </h1>
          </div>
        </div>
        <div>
          <Button onClick={onAddClick} className="w-full lg:w-auto flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Vehicle
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FeatureAside() {
  const tips = [
    {
      title: 'Why Register Your Vehicle?',
      text: 'Adding real vehicle details enables accurate diagnostic lookup, precise spare parts compatibility matching, and accurate garage repair quotes.',
      icon: Sparkles,
    },
    {
      title: 'VIN Benefits',
      text: 'Providing your 17-digit Vehicle Identification Number (VIN) unlocks factory recall alerts and manufacturer warranty status tracking directly within WrectifAI.',
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="space-y-4">
      {tips.map(({ title, text, icon: Icon }) => (
        <Card key={title} className="rounded-[20px] p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef4ff] dark:bg-blue-900/30 text-[#1a56db] shadow-[0_10px_24px_rgba(26,86,219,0.12)]">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-[16.5px] font-bold tracking-[-0.03em] text-[#17307a] dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#5d6f9f]">{text}</p>
        </Card>
      ))}
    </aside>
  );
}

export function VehiclesPage() {
  const { vehicles, loading, errorText, fetchVehicles } = useVehicles();

  // Modal control states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState<number | ''>('');
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [color, setColor] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setMake('');
    setModel('');
    setYear(new Date().getFullYear());
    setVin('');
    setMileage('');
    setLicensePlate('');
    setFuelType('');
    setTransmission('');
    setColor('');
    setIsPrimary(false);
    setPhotos([]);
    setFormError(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = [...photos];
    let added = 0;
    
    Array.from(files).forEach(file => {
      if (newPhotos.length + added >= 5) return;
      if (file.type.startsWith('image/')) {
        added++;
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => {
            if (prev.length < 5) {
              return [...prev, reader.result as string];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!make.trim() || !model.trim() || !year) {
      setFormError('Make, model, and year are required.');
      return;
    }
    
    if (vin.trim() && vin.trim().length !== 17) {
      setFormError('VIN must be exactly 17 characters if provided.');
      return;
    }
    
    if (mileage !== '' && Number(mileage) < 0) {
      setFormError('Mileage cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/vehicles', {
        make,
        model,
        year: Number(year),
        vin: vin.trim() || undefined,
        mileage: mileage !== '' ? Number(mileage) : undefined,
        plateNumber: licensePlate.trim() || undefined,
        fuelType: fuelType || undefined,
        transmission: transmission || undefined,
        color: color.trim() || undefined,
        isPrimary,
        photos,
      });
      setIsAddOpen(false);
      resetForm();
      fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save vehicle';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setVin(vehicle.vin || '');
    setMileage(vehicle.mileage || '');
    setLicensePlate(vehicle.plateNumber || '');
    setFuelType(vehicle.fuelType || '');
    setTransmission(vehicle.transmission || '');
    setColor(vehicle.color || '');
    setIsPrimary(vehicle.isPrimary || false);
    setPhotos(vehicle.photos || []);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedVehicle) return;

    if (!make.trim() || !model.trim() || !year) {
      setFormError('Make, model, and year are required.');
      return;
    }
    
    if (vin.trim() && vin.trim().length !== 17) {
      setFormError('VIN must be exactly 17 characters if provided.');
      return;
    }

    if (mileage !== '' && Number(mileage) < 0) {
      setFormError('Mileage cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.patch(`/vehicles/${selectedVehicle.id}`, {
        make,
        model,
        year: Number(year),
        vin: vin.trim() || undefined,
        mileage: mileage !== '' ? Number(mileage) : undefined,
        plateNumber: licensePlate.trim() || undefined,
        fuelType: fuelType || undefined,
        transmission: transmission || undefined,
        color: color.trim() || undefined,
        isPrimary,
        photos,
      });
      setIsEditOpen(false);
      setSelectedVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update vehicle';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    setSubmitting(true);
    try {
      await apiClient.delete(`/vehicles/${selectedVehicle.id}`);
      setIsDeleteOpen(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete vehicle';
      setDeleteError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      header={<FeatureHeader onAddClick={() => { resetForm(); setIsAddOpen(true); }} />}
      aside={<FeatureAside />}
    >
      <div className="space-y-6">
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse rounded-[24px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-2/3">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : errorText ? (
          <Card className="rounded-[24px] border border-red-100 bg-red-50/50 p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800">Error Loading Vehicles</h3>
            <p className="mt-2 text-sm text-red-600 max-w-md mx-auto">{errorText}</p>
            <Button variant="outline" className="mt-4 border-red-200 hover:bg-red-50" onClick={fetchVehicles}>
              Retry Fetching
            </Button>
          </Card>
        ) : vehicles.length === 0 ? (
          // Empty State
          <Card className="rounded-[24px] border border-[#dfe8ff] bg-white dark:bg-[#1A2233] p-8 text-center shadow-[0_12px_36px_rgba(30,58,138,0.04)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#eef4ff] dark:bg-blue-900/30 text-[#1a56db] mx-auto mb-6 shadow-[0_10px_24px_rgba(26,86,219,0.1)]">
              <Car className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#17307a] dark:text-white">No Vehicles Registered Yet</h2>
            <p className="mt-2 text-sm text-[#5d6f9f] max-w-md mx-auto leading-6">
              Register your vehicle to quickly request maintenance quotes, diagnose issues with AI, and track service history.
            </p>
            <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="mt-6 flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </Card>
        ) : (
          // Vehicles Grid List
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="relative overflow-hidden rounded-[24px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] p-6 shadow-[0_10px_30px_rgba(30,58,138,0.03)] hover:shadow-[0_15px_40px_rgba(26,86,219,0.06)] hover:border-[#bfd1ff] transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border border-[#dbe6ff] dark:border-[#2A3446] bg-[#f4f7ff]">
                      {vehicle.photos && vehicle.photos.length > 0 ? (
                        <img src={vehicle.photos[0]} alt={`${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#1a56db]">
                          <Car className="h-8 w-8 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#17307a] dark:text-white leading-tight">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        {vehicle.isPrimary && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] font-medium text-[#7a8ab4] uppercase tracking-wider">
                        {vehicle.plateNumber ? `PLATE: ${vehicle.plateNumber}` : `ID: ${vehicle.id.slice(0, 8)}`}
                      </p>
                    </div>
                  </div>
                  {(!vehicle.photos || vehicle.photos.length === 0) && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ff] dark:bg-blue-900/30 text-[#1a56db]">
                      <Car className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-y-2.5 gap-x-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[13px]">
                  {vehicle.vin && (
                    <div className="flex flex-col">
                      <span className="font-medium text-[#7a8ab4] text-[11px] uppercase tracking-wider">VIN</span>
                      <span className="font-mono text-[#17307a] dark:text-white tracking-tight">{vehicle.vin}</span>
                    </div>
                  )}
                  {vehicle.mileage !== undefined && vehicle.mileage !== null && (
                    <div className="flex flex-col">
                      <span className="font-medium text-[#7a8ab4] text-[11px] uppercase tracking-wider">Mileage</span>
                      <span className="text-[#17307a] dark:text-white font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                  )}
                  {vehicle.fuelType && (
                    <div className="flex flex-col">
                      <span className="font-medium text-[#7a8ab4] text-[11px] uppercase tracking-wider">Fuel</span>
                      <span className="text-[#17307a] dark:text-white">{vehicle.fuelType}</span>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex flex-col">
                      <span className="font-medium text-[#7a8ab4] text-[11px] uppercase tracking-wider">Transmission</span>
                      <span className="text-[#17307a] dark:text-white">{vehicle.transmission}</span>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex flex-col">
                      <span className="font-medium text-[#7a8ab4] text-[11px] uppercase tracking-wider">Color</span>
                      <span className="text-[#17307a] dark:text-white">{vehicle.color}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(vehicle)}
                    className="flex items-center gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(vehicle)}
                    className="border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50/50 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Add Vehicle */}
        {isAddOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,18,45,0.4)] px-4 py-5 backdrop-blur-[2px]">
            <Card className="flex flex-col w-full max-w-lg max-h-[90vh] rounded-[24px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] p-6 shadow-[0_20px_50px_rgba(10,18,45,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-[#17307a] dark:text-white mb-5 flex items-center gap-2 shrink-0">
                <Car className="h-5 w-5 text-[#1a56db]" />
                Add New Vehicle
              </h2>

              <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 -mr-2">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-[10px]">
                    {formError}
                  </div>
                )}

                <div className="mb-4">
                   <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">Vehicle Photos <span className="text-slate-400 font-normal lowercase">(up to 5)</span></label>
                   <div className="border border-slate-200 dark:border-slate-700 border-dashed rounded-[14px] p-4 bg-slate-50 dark:bg-[#121826] flex flex-col items-center justify-center text-center">
                     <UploadCloud className="w-8 h-8 text-[#a3b8e8] mb-2" />
                     <p className="text-sm font-medium text-slate-700 mb-1">Click to upload photos</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">First photo will be your primary vehicle image.</p>
                     <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" id="vehicle-photos-upload-add" />
                     <label htmlFor="vehicle-photos-upload-add" className="bg-white dark:bg-[#1A2233] border border-slate-200 dark:border-slate-700 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-50 dark:bg-[#121826] shadow-sm">Select Photos</label>
                   </div>
                   
                   {photos && photos.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-4">
                       {photos.map((photo: string, index: number) => (
                         <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                           <img src={photo} alt={`Vehicle ${index}`} className="w-full h-full object-cover" />
                           {index === 0 && (
                             <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-[9px] font-bold py-0.5 text-center">
                               PRIMARY
                             </div>
                           )}
                           <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-white dark:bg-[#1A2233] rounded-full p-1 shadow-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Make *
                    </label>
                    <Input placeholder="e.g. Honda" value={make} onChange={(e) => setMake(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Model *
                    </label>
                    <Input placeholder="e.g. Accord" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Year *
                    </label>
                    <Input type="number" min={1900} max={new Date().getFullYear() + 1} value={year} onChange={(e) => setYear(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Mileage (miles)
                    </label>
                    <Input type="number" placeholder="e.g. 45000" value={mileage} onChange={(e) => setMileage(e.target.value !== '' ? Number(e.target.value) : '')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      VIN (17 characters)
                    </label>
                    <Input placeholder="Enter 17-digit VIN" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} maxLength={17} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      License Plate
                    </label>
                    <Input placeholder="e.g. ABC-1234" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Fuel Type
                    </label>
                    <select 
                      value={fuelType} 
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full h-10 rounded-[10px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] px-3 text-[14px] text-[#17307a] dark:text-white outline-none placeholder:text-[#a3b8e8] focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]"
                    >
                      <option value="">Select</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Transmission
                    </label>
                    <select 
                      value={transmission} 
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full h-10 rounded-[10px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] px-3 text-[14px] text-[#17307a] dark:text-white outline-none placeholder:text-[#a3b8e8] focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]"
                    >
                      <option value="">Select</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Color
                    </label>
                    <Input placeholder="e.g. Black" value={color} onChange={(e) => setColor(e.target.value)} />
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3 p-3 rounded-[12px] border border-[#dbe6ff] dark:border-[#2A3446] bg-[#f8faff]">
                  <input 
                    type="checkbox" 
                    id="isPrimary-add" 
                    checked={isPrimary} 
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded border-[#a3b8e8] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <label htmlFor="isPrimary-add" className="text-sm font-medium text-[#17307a] dark:text-white cursor-pointer select-none flex-1">
                    Set as Primary Vehicle
                  </label>
                  {isPrimary && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                </div>

                </div>
                
                <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Modal: Edit Vehicle */}
        {isEditOpen && selectedVehicle && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,18,45,0.4)] px-4 py-5 backdrop-blur-[2px]">
            <Card className="flex flex-col w-full max-w-lg max-h-[90vh] rounded-[24px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] p-6 shadow-[0_20px_50px_rgba(10,18,45,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-[#17307a] dark:text-white mb-5 flex items-center gap-2 shrink-0">
                <Settings className="h-5 w-5 text-[#1a56db]" />
                Edit Vehicle Details
              </h2>

              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 -mr-2">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-[10px]">
                    {formError}
                  </div>
                )}

                <div className="mb-4">
                   <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">Vehicle Photos <span className="text-slate-400 font-normal lowercase">(up to 5)</span></label>
                   <div className="border border-slate-200 dark:border-slate-700 border-dashed rounded-[14px] p-4 bg-slate-50 dark:bg-[#121826] flex flex-col items-center justify-center text-center">
                     <UploadCloud className="w-8 h-8 text-[#a3b8e8] mb-2" />
                     <p className="text-sm font-medium text-slate-700 mb-1">Click to upload photos</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">First photo will be your primary vehicle image.</p>
                     <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" id="vehicle-photos-upload-edit" />
                     <label htmlFor="vehicle-photos-upload-edit" className="bg-white dark:bg-[#1A2233] border border-slate-200 dark:border-slate-700 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-50 dark:bg-[#121826] shadow-sm">Select Photos</label>
                   </div>
                   
                   {photos && photos.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-4">
                       {photos.map((photo: string, index: number) => (
                         <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                           <img src={photo} alt={`Vehicle ${index}`} className="w-full h-full object-cover" />
                           {index === 0 && (
                             <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 text-white text-[9px] font-bold py-0.5 text-center">
                               PRIMARY
                             </div>
                           )}
                           <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-white dark:bg-[#1A2233] rounded-full p-1 shadow-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Make *
                    </label>
                    <Input placeholder="e.g. Honda" value={make} onChange={(e) => setMake(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Model *
                    </label>
                    <Input placeholder="e.g. Accord" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Year *
                    </label>
                    <Input type="number" min={1900} max={new Date().getFullYear() + 1} value={year} onChange={(e) => setYear(Number(e.target.value))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Mileage (miles)
                    </label>
                    <Input type="number" placeholder="e.g. 45000" value={mileage} onChange={(e) => setMileage(e.target.value !== '' ? Number(e.target.value) : '')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      VIN (17 characters)
                    </label>
                    <Input placeholder="Enter 17-digit VIN" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} maxLength={17} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      License Plate
                    </label>
                    <Input placeholder="e.g. ABC-1234" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Fuel Type
                    </label>
                    <select 
                      value={fuelType} 
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full h-10 rounded-[10px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] px-3 text-[14px] text-[#17307a] dark:text-white outline-none placeholder:text-[#a3b8e8] focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]"
                    >
                      <option value="">Select</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Transmission
                    </label>
                    <select 
                      value={transmission} 
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full h-10 rounded-[10px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] px-3 text-[14px] text-[#17307a] dark:text-white outline-none placeholder:text-[#a3b8e8] focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db]"
                    >
                      <option value="">Select</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5d6f9f] uppercase tracking-wider mb-1.5">
                      Color
                    </label>
                    <Input placeholder="e.g. Black" value={color} onChange={(e) => setColor(e.target.value)} />
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3 p-3 rounded-[12px] border border-[#dbe6ff] dark:border-[#2A3446] bg-[#f8faff]">
                  <input 
                    type="checkbox" 
                    id="isPrimary-edit" 
                    checked={isPrimary} 
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded border-[#a3b8e8] text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <label htmlFor="isPrimary-edit" className="text-sm font-medium text-[#17307a] dark:text-white cursor-pointer select-none flex-1">
                    Set as Primary Vehicle
                  </label>
                  {isPrimary && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                </div>

                </div>
                
                <div className="flex justify-end gap-2.5 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Modal: Confirm Delete */}
        {isDeleteOpen && selectedVehicle && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(10,18,45,0.4)] px-4 py-5 backdrop-blur-[2px]">
            <Card className="w-full max-w-md rounded-[24px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mx-auto mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-[#17307a] dark:text-white">Delete Vehicle?</h2>
              
              {deleteError ? (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {deleteError}
                </div>
              ) : (
                <p className="mt-2 text-[14px] leading-6 text-[#5d6f9f]">
                  Are you sure you want to remove the <strong>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</strong>?
                  This action is permanent and will hide it from your diagnostics and quotes request lists.
                </p>
              )}

              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  {deleteError ? 'Close' : 'Cancel'}
                </Button>
                {!deleteError && (
                  <Button
                    disabled={submitting}
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:bg-red-700"
                  >
                    {submitting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default VehiclesPage;
