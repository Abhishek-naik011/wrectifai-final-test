'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { Flame, Star, Package, CheckCircle, Percent, Clock, ChevronDown, Filter } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/common/modal';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const iconMap: Record<string, any> = { Flame, CheckCircle, Package, Percent };

export const initialFeaturedOffers = [
  { id: 1, type: 'HOT DEAL', title: '25% OFF', subtitle: 'On Full Car Service', desc: 'Complete car service with engine check-up, scan & more.', garage: 'Metro Auto Bay', rating: 4.8, reviews: 120, validTill: '15 Aug 2025', img: '/assets/garage_1_1778071156220.png', icon: 'Flame', color: 'text-orange-500', bg: 'bg-orange-50', category: 'Service' },
  { id: 2, type: 'BEST PRICE', title: '30% OFF', subtitle: 'On Brake Pads', desc: 'High performance brake pads for maximum safety.', garage: 'SpeedCare Garage', rating: 4.6, reviews: 98, validTill: '10 Aug 2025', img: '/assets/brake_disc_1778070670609.png', icon: 'CheckCircle', color: 'text-green-500', bg: 'bg-green-50', category: 'Parts' },
  { id: 3, type: 'COMBO OFFER', title: '15% OFF', subtitle: 'On Tyres & Wheel Alignment', desc: 'Get discount on premium tyres + wheel alignment', garage: 'Tyre Hub', rating: 4.7, reviews: 76, img: '/assets/clean_tire.png', validTill: '20 Aug 2025', icon: 'Package', color: 'text-purple-500', bg: 'bg-purple-50', category: 'Combo' },
];

export const initialAllOffers = [
  { id: 101, title: '20% OFF on Engine Oil', desc: 'Premium engine oil for better performance and mileage.', garage: 'AutoFix Pro', rating: 4.5, reviews: 63, validTill: '05 Aug 2025', img: '/assets/engine_oil_bottle.png', color: 'text-red-500', bg: 'bg-red-50', category: 'Parts' },
  { id: 102, title: 'Free Battery Check-up', desc: 'Get free battery health check and performance report.', garage: 'Battery Zone', rating: 4.4, reviews: 51, validTill: '08 Aug 2025', img: '/assets/car_battery.png', color: 'text-green-500', bg: 'bg-green-50', category: 'Service' },
  { id: 103, title: '10% OFF on AC Service', desc: 'Keep your AC cool and clean this summer.', garage: 'Cool Ride Garage', rating: 4.6, reviews: 88, validTill: '12 Aug 2025', img: '/assets/ac_vent_1778070688367.png', color: 'text-blue-500', bg: 'bg-blue-50', category: 'Service' },
  { id: 104, title: '15% OFF on Filters', desc: 'Air filter, cabin filter & fuel filter combo discount.', garage: 'Quick Service', rating: 4.3, reviews: 35, validTill: '18 Aug 2025', img: '/assets/Parts and components.png', color: 'text-amber-500', bg: 'bg-amber-50', category: 'Combo' },
  { id: 105, title: 'Complimentary 10 Points Check', desc: 'Safety check on 10 key points for worry-free driving.', garage: 'DriveSafe Garage', rating: 4.7, reviews: 110, validTill: '25 Aug 2025', img: '/assets/Documentation.png', color: 'text-purple-500', bg: 'bg-purple-50', category: 'Service' },
];

export function OffersPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [featuredOffers, setFeaturedOffers] = useState(initialFeaturedOffers);
  const [allOffers, setAllOffers] = useState(initialAllOffers);

  useEffect(() => {
    const handleSearch = (e: CustomEvent) => setSearchQuery(e.detail);
    
    const loadOffers = () => {
      const storedFeatured = localStorage.getItem('wrectifai_featured_offers');
      if (storedFeatured) {
        setFeaturedOffers(JSON.parse(storedFeatured));
      } else {
        localStorage.setItem('wrectifai_featured_offers', JSON.stringify(initialFeaturedOffers));
        setFeaturedOffers(initialFeaturedOffers);
      }
      
      const storedAll = localStorage.getItem('wrectifai_all_offers');
      if (storedAll) {
        setAllOffers(JSON.parse(storedAll));
      } else {
        localStorage.setItem('wrectifai_all_offers', JSON.stringify(initialAllOffers));
        setAllOffers(initialAllOffers);
      }
    };
    
    loadOffers();
    
    window.addEventListener('dashboard-search', handleSearch as EventListener);
    window.addEventListener('offers-updated', loadOffers);
    window.addEventListener('storage', (e) => {
      if (e.key === 'wrectifai_featured_offers' || e.key === 'wrectifai_all_offers') {
        loadOffers();
      }
    });
    
    return () => {
      window.removeEventListener('dashboard-search', handleSearch as EventListener);
      window.removeEventListener('offers-updated', loadOffers);
    };
  }, []);

  const filterOffer = (offer: any) => {
    const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || (offer.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) || offer.desc.toLowerCase().includes(searchQuery.toLowerCase()) || offer.garage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const filteredFeatured = featuredOffers.filter(filterOffer);
  const filteredAll = allOffers.filter(filterOffer);

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Offers</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Exclusive deals and discounts just for you!</p>
        </div>

        {searchQuery && (
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Searching offers for: <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">"{searchQuery}"</span>
          </div>
        )}

        {/* Hero Banner Placeholder */}
        {!searchQuery && selectedCategory === 'All' && (
          <Card className="h-48 rounded-[24px] bg-gradient-to-r from-blue-50 to-blue-100 flex items-center p-8 relative overflow-hidden border-blue-200 shadow-sm">
            <div className="relative z-10 w-2/3">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Save More. Drive Better.</h2>
              <p className="text-blue-700 text-sm mb-4">Grab the best offers from top garages near you.</p>
            </div>
            <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
               <Image src="/assets/summner_car.png" alt="Hero" width={300} height={200} className="object-contain" />
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Service', 'Parts', 'Combo'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={cn("px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors", selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white dark:bg-[#1A2233] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-[#121826]")}
            >
              {cat === 'All' ? 'All Offers' : `${cat} Offers`}
            </button>
          ))}
        </div>

        {/* Featured Offers Grid */}
        {filteredFeatured.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Featured Offers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.map((offer) => (
                <Card key={offer.id} className="flex flex-col group relative rounded-[20px] border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-orange-50/50 to-white">
                   <div className="p-5 flex-1 relative z-10">
                     <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-[10px] mb-3 ${offer.bg} ${offer.color}`}>
                        {(() => {
                          const Icon = iconMap[offer.icon] || Percent;
                          return <Icon className="w-3 h-3" />;
                        })()} {offer.type}
                     </div>
                     <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{offer.title}</h4>
                     <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">{offer.subtitle}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{offer.desc}</p>
                     
                     <div className="flex items-center gap-2 mt-auto">
                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                           <Image src="/assets/garage_2_1778071173295.png" alt="Garage" width={24} height={24} className="object-cover" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{offer.garage}</span>
                        <div className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                           <Star className="w-3 h-3 fill-current" /> {offer.rating} <span className="text-slate-400 font-normal">({offer.reviews})</span>
                        </div>
                     </div>
                   </div>
                   
                   <div className="absolute right-0 top-1/4 h-32 w-32 opacity-20 hidden sm:block">
                      <Image src={offer.img} alt={offer.title} width={128} height={128} className="object-contain" />
                   </div>
                   
                   <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1A2233] relative z-10">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Valid till {offer.validTill}</span>
                      <Button variant="outline" className="h-8 text-xs font-bold text-blue-600 border-blue-200 hover:bg-blue-50 px-4" onClick={() => setSelectedOffer(offer)}>View Offer</Button>
                   </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Offers List */}
        {filteredAll.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">More Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {filteredAll.map((offer) => (
                 <Card key={offer.id} className="p-4 flex gap-4 border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group rounded-[20px]" onClick={() => setSelectedOffer(offer)}>
                    <div className={cn("w-24 h-24 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 relative overflow-hidden", offer.bg)}>
                       <Image src={offer.img} alt={offer.title} width={60} height={60} className="object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-sm">{offer.title}</h4>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded ml-2", offer.bg, offer.color)}>{offer.category}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{offer.desc}</p>
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden">
                               <Image src="/assets/garage_1_1778071156220.png" alt="Garage" width={20} height={20} className="object-cover" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{offer.garage}</span>
                         </div>
                         <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-500">
                           <Star className="w-3 h-3 fill-current" /> {offer.rating}
                         </div>
                      </div>
                    </div>
                 </Card>
               ))}
            </div>
          </div>
        )}

        {filteredFeatured.length === 0 && filteredAll.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1A2233] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <Percent className="w-12 h-12 text-slate-200 mx-auto mb-3" />
             <p className="text-slate-500 dark:text-slate-400 font-medium">No offers found matching your criteria</p>
             <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-blue-600 text-sm mt-2 hover:underline font-semibold">Clear filters</button>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedOffer} onClose={() => setSelectedOffer(null)} title="Offer Details">
        {selectedOffer && (
          <div className="space-y-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedOffer.bg} ${selectedOffer.color}`}>
                {(() => {
                  const Icon = selectedOffer.icon ? iconMap[selectedOffer.icon] : Percent;
                  return <Icon className="w-5 h-5" />;
                })()}
             </div>
             <div className={cn("w-full h-40 rounded-xl flex items-center justify-center relative overflow-hidden", selectedOffer.bg)}>
                <Image src={selectedOffer.img} alt={selectedOffer.title} width={120} height={120} className="object-contain relative z-10" />
             </div>
             
             <div>
               <div className="flex justify-between items-center mb-2">
                 <span className={cn("px-2 py-1 text-xs font-bold rounded", selectedOffer.bg, selectedOffer.color)}>{selectedOffer.category || selectedOffer.type}</span>
                 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Valid till {selectedOffer.validTill}</span>
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedOffer.title}</h3>
               {selectedOffer.subtitle && <p className="font-semibold text-slate-700 mb-2">{selectedOffer.subtitle}</p>}
               <p className="text-sm text-slate-600 dark:text-slate-400 my-4">{selectedOffer.desc}</p>
               
               <div className="bg-slate-50 dark:bg-[#121826] rounded-lg p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                     <Image src="/assets/garage_1_1778071156220.png" alt="Garage" width={40} height={40} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Offered by</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOffer.garage}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 justify-end">
                       <Star className="w-3 h-3 fill-current" /> {selectedOffer.rating}
                    </div>
                    <p className="text-[10px] text-slate-400">{selectedOffer.reviews} reviews</p>
                  </div>
               </div>
               
               <Button className="w-full bg-blue-600 text-white" onClick={() => setSelectedOffer(null)}>Claim Offer</Button>
             </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}

export default OffersPage;