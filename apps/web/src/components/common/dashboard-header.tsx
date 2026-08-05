'use client';

import { ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/utils/cn';
import { useRouter, usePathname } from 'next/navigation';

export function DashboardHeader({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';
  const basePath = pathname.startsWith('/admin') ? '/admin' : pathname.startsWith('/garage') ? '/garage' : '';

  return (
    <header className="flex w-full items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Optional Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] bg-white text-[#1a56db] shadow-sm lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        {title && (
          <h1 className="hidden text-xl font-bold text-[#17307a] lg:block">{title}</h1>
        )}
      </div>

      {/* Right: User Profile Dropdown & Notifications */}
      <div className="flex items-center ml-auto gap-[12px]">
        <button
          onClick={() => router.push(`${basePath}/notifications`)}
          className="relative h-9 w-9 lg:h-10 lg:w-10 shrink-0 flex items-center justify-center rounded-full bg-white text-[#17307a] shadow-sm ring-1 ring-[#e5ecfb]"
        >
          <Bell className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
          <span className="absolute right-0 top-0 lg:right-1 flex h-4 lg:h-5 min-w-4 lg:min-w-5 items-center justify-center rounded-full bg-[#ff2f44] px-1 text-[9px] lg:text-[9.5px] font-bold text-white">
            3
          </span>
        </button>

        {user && (
          <div className="relative group ml-[5px]">
            <button className="flex h-9 lg:h-10 shrink-0 items-center gap-2 rounded-full border border-[#dbe6ff] bg-white p-0.5 lg:py-1 lg:pl-1.5 lg:pr-3 hover:bg-[#fcfdff] transition-all shadow-sm focus:outline-none">
              <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-[#1a56db] text-white font-bold text-sm">
                {(user.garageName || user.name) ? (user.garageName || user.name)!.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden text-[13px] font-semibold text-[#17307a] lg:block">Hi, {user.garageName || user.name}</span>
              <ChevronDown className="hidden h-4 w-4 text-[#17307a] lg:block group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="bg-white border border-[#e4ecff] rounded-xl shadow-lg p-1.5">
                <button
                  onClick={() => {
                    window.location.href = `${basePath}/profile`;
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] font-semibold text-[#1a56db] hover:bg-[#f2f6ff] rounded-lg transition-colors border-b border-[#f2f6ff] mb-1"
                >
                  View Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-[13px] font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
