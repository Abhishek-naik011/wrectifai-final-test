'use client';

import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { ChevronRight, Wrench, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const mockServices = [
  { id: 1, name: 'Oil Change', desc: 'Engine oil replacement with premium quality oil for better performance.', price: '$10 onwards', img: '/assets/engine_oil_bottle.png' },
  { id: 2, name: 'Brake Service', desc: 'Complete brake inspection and maintenance for your safety.', price: '$20 onwards', img: '/assets/brake_disc_1778070670609.png' },
  { id: 3, name: 'Tyre Services', desc: 'Tyre rotation, balancing and alignment for smooth driving.', price: '$15 onwards', img: '/assets/clean_tire.png' },
  { id: 4, name: 'AC Service', desc: 'AC gas refill and system check for a cool and comfortable ride.', price: '$25 onwards', img: '/assets/ac_vent_1778070688367.png' },
  { id: 5, name: 'Diagnostics', desc: 'Advanced scanning to detect and fix problems accurately.', price: '$30 onwards', img: '/assets/Robo_icon.png' },
  { id: 6, name: 'Battery Replacement', desc: 'High-performance batteries for a reliable start every time.', price: '$80 onwards', img: '/assets/car_battery.png' },
  { id: 7, name: 'Wiper Replacement', desc: 'Clear visibility in all weather conditions with new wipers.', price: '$15 onwards', img: '/assets/wiper_blade_1778070781712.png' },
  { id: 8, name: 'Coolant Flush', desc: 'Keep your engine cool and protected with coolant replacement.', price: '$20 onwards', img: '/assets/oil_pour_1778070767058.png' },
  { id: 9, name: 'Suspension Check', desc: 'Ensure a smooth and safe driving experience.', price: '$40 onwards', img: '/assets/Electrical.png' },
];

export function ServicesPage() {
  const router = useRouter();

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Our Services</h1>
            <p className="text-slate-500 text-sm">Professional car services for every need</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm">All Services</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Maintenance</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Repairs</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Diagnostics</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Other Services</button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group">
                <div className="relative h-40 bg-slate-100 flex items-center justify-center p-4">
                  <Image src={service.img} alt={service.name} width={120} height={120} className="object-contain group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{service.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{service.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-slate-900 text-sm">{service.price}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">View All Services <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="p-6 text-center border-blue-100 shadow-sm bg-gradient-to-b from-blue-50/50 to-white">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wrench className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-sm text-slate-500 mb-6">Find the right service for your vehicle and get it done by trusted garages.</p>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push('/garages')}>Request a Service</Button>
              <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => router.push('/bookings')}>View Bookings</Button>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Why Choose WrectifAI?</h3>
            <ul className="space-y-3">
              {[
                'Trusted Garages',
                'Transparent Pricing',
                'Real-time Updates',
                'Secure Payments'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
