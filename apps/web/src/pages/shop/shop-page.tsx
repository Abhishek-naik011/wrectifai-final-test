'use client';

import { Card } from '@/components/common/card';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Heart, CheckCircle, Shield, Clock } from 'lucide-react';
import Image from 'next/image';

import { DashboardShell } from '@/components/home/dashboard-shell';
import { TopNavbar } from '@/components/home/top-navbar';

const mockProducts = [
  { id: 1, name: 'Mobil 1 5W-30 Fully Synthetic Engine Oil', price: 1299, oldPrice: 1599, discount: '19% OFF', rating: 4.6, reviews: 128, img: '/assets/engine_oil_bottle.png' },
  { id: 2, name: 'Bosch Car Air Filter', price: 599, oldPrice: 799, discount: '25% OFF', rating: 4.5, reviews: 96, img: '/assets/Parts and components.png' },
  { id: 3, name: 'Amaron Pro Rider Battery 42B20L', price: 4299, oldPrice: 4999, discount: '14% OFF', rating: 4.7, reviews: 78, img: '/assets/car_battery.png' },
  { id: 4, name: 'Brembo Front Brake Pads', price: 1899, oldPrice: 2299, discount: '17% OFF', rating: 4.6, reviews: 64, img: '/assets/brake_disc_1778070670609.png' },
  { id: 5, name: 'Philips H7 LED Headlight Bulb', price: 1499, oldPrice: 1899, discount: '21% OFF', rating: 4.4, reviews: 54, img: '/assets/Electrical.png' },
  { id: 6, name: 'Bosch Aerotwin Wiper Blade Set', price: 899, oldPrice: 1199, discount: '25% OFF', rating: 4.5, reviews: 112, img: '/assets/wiper_blade_1778070781712.png' },
  { id: 7, name: 'Bosch Oil Filter', price: 299, oldPrice: 399, discount: '25% OFF', rating: 4.6, reviews: 88, img: '/assets/Accessories (2).png' },
  { id: 8, name: 'Liqui Moly Coolant Ready Mix 1L', price: 499, oldPrice: 649, discount: '23% OFF', rating: 4.3, reviews: 46, img: '/assets/oil_pour_1778070767058.png' },
];

export function ShopPage() {
  const router = useRouter();

  return (
    <DashboardShell header={<TopNavbar />}>
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Shop</h1>
            <p className="text-slate-500 text-sm">Quality car parts, accessories and more</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-sm">All Categories</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Engine Parts</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Oils & Fluids</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Batteries</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Brakes</button>
            <button className="px-5 py-2 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors">Tyres</button>
          </div>

          {/* Hero Banner Placeholder */}
          <Card className="h-48 rounded-[24px] bg-gradient-to-r from-blue-900 to-blue-600 flex items-center p-8 relative overflow-hidden border-0 shadow-md">
            <div className="relative z-10 w-1/2">
              <h2 className="text-2xl font-bold text-white mb-2">Top Quality Products</h2>
              <p className="text-blue-100 text-sm mb-4">Genuine parts and premium accessories for your vehicle</p>
              <Button className="bg-white text-blue-900 hover:bg-blue-50 font-bold">Shop Now</Button>
            </div>
            <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
              <Image src="/assets/car_battery.png" alt="Hero" width={250} height={200} className="object-contain opacity-80" />
            </div>
          </Card>

          {/* Products Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Popular Products</h3>
              <span className="text-sm font-semibold text-blue-600 cursor-pointer">View All {'>'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockProducts.map((product) => (
                <Card key={product.id} className="p-4 flex flex-col group relative rounded-[16px] border-slate-200 hover:shadow-lg transition-shadow">
                  <button className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors z-10">
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="relative h-32 flex items-center justify-center mb-4">
                    <Image src={product.img} alt={product.name} width={100} height={100} className="object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 h-10 mb-2">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900">${(product.price / 100).toFixed(2)}</span>
                    <span className="text-xs text-slate-400 line-through">${(product.oldPrice / 100).toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{product.discount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 mb-4">
                    <Star className="w-3.5 h-3.5 fill-current" /> {product.rating} <span className="text-slate-400 font-normal">({product.reviews})</span>
                  </div>
                  <Button variant="outline" className="w-full mt-auto text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => router.push('/wallet-payments')}>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[300px] space-y-6">
          <Card className="p-5 shadow-sm border-slate-100 rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-4">Shop with Confidence</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                 <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                 <div>
                   <p className="font-bold text-slate-900">100% Genuine Products</p>
                   <p className="text-xs text-slate-500">Authentic parts from trusted brands</p>
                 </div>
              </li>
              <li className="flex gap-3">
                 <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                 <div>
                   <p className="font-bold text-slate-900">Best Prices</p>
                   <p className="text-xs text-slate-500">Competitive prices guaranteed</p>
                 </div>
              </li>
              <li className="flex gap-3">
                 <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                 <div>
                   <p className="font-bold text-slate-900">Fast Delivery</p>
                   <p className="text-xs text-slate-500">Quick delivery to your doorstep</p>
                 </div>
              </li>
            </ul>
          </Card>

          <Card className="p-5 shadow-sm border-slate-100 bg-blue-50/50 rounded-[20px]">
            <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-sm text-slate-500 mb-4">Can't find what you're looking for? Our experts are here to help you.</p>
            <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => router.push('/help-support')}>
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
