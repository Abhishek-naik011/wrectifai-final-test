'use client';

import { useState } from 'react';
import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Clock, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const mockFeaturedTips = [
  { id: 1, title: 'How to check your engine oil level correctly', category: 'Maintenance', readTime: '3 min read', img: '/assets/engine_oil_bottle.png', color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 2, title: 'Signs your brake pads need immediate replacement', category: 'Safety', readTime: '4 min read', img: '/assets/brake_disc_1778070670609.png', color: 'text-red-600', bg: 'bg-red-50' },
  { id: 3, title: 'Maximizing your car battery life in extreme weather', category: 'Battery', readTime: '5 min read', img: '/assets/car_battery.png', color: 'text-green-600', bg: 'bg-green-50' },
];

const mockAllTips = [
  { id: 4, title: 'When should you replace your windshield wipers?', desc: 'A quick guide on identifying worn out wipers and replacing them for clear visibility.', category: 'Visibility', readTime: '2 min read', img: '/assets/wiper_blade_1778070781712.png', author: 'WrectifAI Team', date: '04 Aug 2026' },
  { id: 5, title: 'Understanding tyre pressure and tread depth', desc: 'Learn why maintaining correct tyre pressure is crucial for your safety and fuel economy.', category: 'Tyres', readTime: '6 min read', img: '/assets/clean_tire.png', author: 'Alex Tech', date: '01 Aug 2026' },
  { id: 6, title: 'The importance of regular AC servicing', desc: 'Don\'t wait for summer to fail you. Here\'s why regular AC checks save you money.', category: 'Cooling', readTime: '4 min read', img: '/assets/ac_vent_1778070688367.png', author: 'WrectifAI Team', date: '28 Jul 2026' },
  { id: 7, title: 'Engine Coolant: What it does and when to flush', desc: 'Prevent engine overheating by understanding the role of your engine coolant.', category: 'Engine', readTime: '5 min read', img: '/assets/oil_pour_1778070767058.png', author: 'Mike Mechanic', date: '25 Jul 2026' },
];

export function CarTipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTips = mockAllTips.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tip.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Car Tips & Guides</h1>
              <p className="text-slate-500 text-sm">Expert advice to keep your vehicle in top condition</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
              />
            </div>
          </div>

          {/* Featured Tips Row */}
          {!searchQuery && (
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Star className="w-4 h-4 mr-2 text-amber-500 fill-current" /> Must Read</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockFeaturedTips.map((tip) => (
                  <Card key={tip.id} className="p-0 overflow-hidden group cursor-pointer hover:shadow-md transition-all border-slate-100 flex flex-col h-full rounded-[20px]">
                    <div className={cn("h-32 flex items-center justify-center p-4 relative overflow-hidden", tip.bg)}>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                       <Image src={tip.img} alt={tip.title} width={100} height={100} className="object-contain group-hover:scale-110 transition-transform relative z-10" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 bg-white">
                      <div className="flex items-center justify-between mb-2">
                         <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", tip.bg, tip.color)}>{tip.category}</span>
                         <span className="flex items-center text-[10px] text-slate-500 font-medium"><Clock className="w-3 h-3 mr-1"/> {tip.readTime}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{tip.title}</h4>
                      <div className="mt-auto pt-3 flex items-center text-xs font-bold text-blue-600">
                         Read Article <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Latest Articles List */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">{searchQuery ? 'Search Results' : 'Latest Articles'}</h3>
            {filteredTips.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[20px] border border-slate-100">
                 <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                 <p className="text-slate-500 font-medium">No articles found for "{searchQuery}"</p>
                 <button onClick={() => setSearchQuery('')} className="text-blue-600 text-sm mt-2 hover:underline">Clear search</button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTips.map((tip) => (
                  <Card key={tip.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5 cursor-pointer hover:border-blue-200 transition-colors group rounded-[20px] border-slate-100 shadow-sm">
                    <div className="w-full sm:w-32 h-32 sm:h-24 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 p-2 relative overflow-hidden">
                       <Image src={tip.img} alt={tip.title} width={80} height={80} className="object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">{tip.category}</span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/> {tip.readTime}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{tip.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{tip.desc}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                             {tip.author.charAt(0)}
                           </div>
                           <span className="text-[11px] font-medium text-slate-700">{tip.author}</span>
                           <span className="text-slate-300 mx-1">•</span>
                           <span className="text-[11px] text-slate-500">{tip.date}</span>
                         </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!searchQuery && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Load More Articles <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[300px] space-y-6">
          <Card className="p-5 shadow-sm border-slate-100 rounded-[20px] bg-gradient-to-br from-blue-900 to-blue-800 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold mb-2">Got a Car Problem?</h3>
               <p className="text-xs text-blue-100 mb-5">Try our AI diagnostic tool to find out what's wrong with your vehicle instantly.</p>
               <Button className="w-full bg-white text-blue-900 hover:bg-blue-50 font-bold">Diagnose Issue</Button>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32">
                <Image src="/assets/Robo_icon.png" alt="AI" width={128} height={128} className="object-contain" />
             </div>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100 rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-4">Categories</h3>
            <div className="space-y-2">
               {['Maintenance', 'Safety', 'Engine & Performance', 'Tyres & Wheels', 'Electricals', 'DIY Fixes'].map((cat, i) => (
                 <button key={i} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-700 font-medium group">
                    <span>{cat}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {Math.floor(Math.random() * 20) + 5}
                    </span>
                 </button>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
