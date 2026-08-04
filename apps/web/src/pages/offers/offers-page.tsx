'use client';

import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { Flame, Star, Package, CheckCircle, Percent, Clock, ChevronDown, Filter } from 'lucide-react';
import Image from 'next/image';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const featuredOffers = [
  { id: 1, type: 'HOT DEAL', title: '25% OFF', subtitle: 'On Full Car Service', desc: 'Complete car service with engine check-up, scan & more.', garage: 'Metro Auto Bay', rating: 4.8, reviews: 120, validTill: '15 Aug 2025', img: '/assets/garage_1_1778071156220.png', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 2, type: 'BEST PRICE', title: '30% OFF', subtitle: 'On Brake Pads', desc: 'High performance brake pads for maximum safety.', garage: 'SpeedCare Garage', rating: 4.6, reviews: 98, validTill: '10 Aug 2025', img: '/assets/brake_disc_1778070670609.png', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 3, type: 'COMBO OFFER', title: '15% OFF', subtitle: 'On Tyres & Wheel Alignment', desc: 'Get discount on premium tyres + wheel alignment', garage: 'Tyre Hub', rating: 4.7, reviews: 76, img: '/assets/clean_tire.png', validTill: '20 Aug 2025', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const allOffers = [
  { id: 101, title: '20% OFF on Engine Oil', desc: 'Premium engine oil for better performance and mileage.', garage: 'AutoFix Pro', rating: 4.5, reviews: 63, validTill: '05 Aug 2025', img: '/assets/engine_oil_bottle.png', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 102, title: 'Free Battery Check-up', desc: 'Get free battery health check and performance report.', garage: 'Battery Zone', rating: 4.4, reviews: 51, validTill: '08 Aug 2025', img: '/assets/car_battery.png', color: 'text-green-500', bg: 'bg-green-50' },
  { id: 103, title: '10% OFF on AC Service', desc: 'Keep your AC cool and clean this summer.', garage: 'Cool Ride Garage', rating: 4.6, reviews: 88, validTill: '12 Aug 2025', img: '/assets/ac_vent_1778070688367.png', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 104, title: '15% OFF on Filters', desc: 'Air filter, cabin filter & fuel filter combo discount.', garage: 'Quick Service', rating: 4.3, reviews: 35, validTill: '18 Aug 2025', img: '/assets/Parts and components.png', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 105, title: 'Complimentary 10 Points Check', desc: 'Safety check on 10 key points for worry-free driving.', garage: 'DriveSafe Garage', rating: 4.7, reviews: 110, validTill: '25 Aug 2025', img: '/assets/Documentation.png', color: 'text-purple-500', bg: 'bg-purple-50' },
];

export function OffersPage() {
  const router = useRouter();

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Offers</h1>
          <p className="text-slate-500 text-sm">Exclusive deals and discounts just for you!</p>
        </div>

        {/* Hero Banner Placeholder */}
        <Card className="h-48 rounded-[24px] bg-gradient-to-r from-blue-50 to-blue-100 flex items-center p-8 relative overflow-hidden border-blue-200 shadow-sm">
          <div className="relative z-10 w-2/3">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Save More. Drive Better.</h2>
            <p className="text-blue-700 text-sm mb-4">Grab the best offers from top garages near you.</p>
          </div>
          <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
             <Image src="/assets/summner_car.png" alt="Hero" width={300} height={200} className="object-contain" />
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm flex items-center gap-2">All Offers</button>
            <button className="px-5 py-2.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">Service Offers</button>
            <button className="px-5 py-2.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">Parts Offers</button>
            <button className="px-5 py-2.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">Combo Offers</button>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium flex items-center gap-2">Sort by: Newest <ChevronDown className="w-4 h-4"/></button>
             <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600"><Filter className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Featured Offers Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">Featured Offers</h3>
            <span className="text-sm font-semibold text-blue-600 cursor-pointer">View All {'>'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOffers.map((offer) => (
              <Card key={offer.id} className="flex flex-col group relative rounded-[20px] border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-orange-50/50 to-white">
                 <div className="p-5 flex-1 relative z-10">
                   <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-[10px] mb-3 ${offer.bg} ${offer.color}`}>
                      <offer.icon className="w-3 h-3" /> {offer.type}
                   </div>
                   <h4 className="text-3xl font-extrabold text-slate-900 mb-1">{offer.title}</h4>
                   <p className="font-bold text-slate-900 text-sm mb-2">{offer.subtitle}</p>
                   <p className="text-xs text-slate-500 mb-4">{offer.desc}</p>
                   
                   <div className="flex items-center gap-2 mt-auto">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                         <Image src="/assets/garage_2_1778071173295.png" alt="Garage" width={24} height={24} className="object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{offer.garage}</span>
                      <div className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                         <Star className="w-3 h-3 fill-current" /> {offer.rating} <span className="text-slate-400 font-normal">({offer.reviews})</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="absolute right-0 top-1/4 h-32 w-32 opacity-20 hidden sm:block">
                    <Image src={offer.img} alt={offer.title} width={128} height={128} className="object-contain" />
                 </div>
                 
                 <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <span className="text-[11px] text-slate-500 font-medium">Valid till {offer.validTill}</span>
                    <Button variant="outline" className="h-8 text-xs font-bold text-blue-600 border-blue-200 hover:bg-blue-50 px-4">View Offer</Button>
                 </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Offers List */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4 mt-8">All Offers</h3>
          <Card className="shadow-sm border-slate-100 rounded-[20px] divide-y divide-slate-100">
            {allOffers.map((offer) => (
              <div key={offer.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50/50 transition-colors">
                 <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${offer.bg}`}>
                   <Image src={offer.img} alt={offer.title} width={32} height={32} className="object-contain" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{offer.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{offer.desc}</p>
                 </div>
                 <div className="w-full sm:w-auto flex flex-row items-center gap-6 mt-2 sm:mt-0">
                    <div className="hidden md:block">
                      <p className="text-xs font-bold text-slate-900">{offer.garage}</p>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                         <Star className="w-3 h-3 fill-current" /> {offer.rating} <span className="text-slate-400 font-normal">({offer.reviews})</span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500">Valid till</p>
                      <p className="text-[11px] font-medium text-slate-700">{offer.validTill}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <Button variant="outline" className="h-8 text-xs font-bold text-blue-600 border-blue-200 hover:bg-blue-50 px-4">View Offer</Button>
                      <span className="text-xs font-bold text-blue-600 cursor-pointer">T&C</span>
                    </div>
                 </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Benefits Footer */}
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 py-8 px-4 mt-4 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500"><CheckCircle className="w-5 h-5"/></div>
              <div><p className="font-bold text-xs text-slate-900">100% Trusted Garages</p><p className="text-[10px] text-slate-500">Verified garages you can rely on</p></div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-500"><Package className="w-5 h-5"/></div>
              <div><p className="font-bold text-xs text-slate-900">Best Price Guarantee</p><p className="text-[10px] text-slate-500">Get the best deals every time</p></div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500"><Percent className="w-5 h-5"/></div>
              <div><p className="font-bold text-xs text-slate-900">Exclusive Discounts</p><p className="text-[10px] text-slate-500">Special offers for WrectifAI users</p></div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-orange-500"><Clock className="w-5 h-5"/></div>
              <div><p className="font-bold text-xs text-slate-900">Limited Time Offers</p><p className="text-[10px] text-slate-500">Hurry! Offers valid for limited time</p></div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
