'use client';

import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/utils/cn';

export function DashboardHeader({ title }: { title?: string }) {
  const { user, logout } = useAuth();

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

      {/* Right: User Profile Dropdown */}
      <div className="flex items-center ml-auto">
        {user && (
          <div className="relative group ml-[5px]">
            <button className="flex h-9 lg:h-10 shrink-0 items-center gap-2 rounded-full border border-[#dbe6ff] bg-white p-0.5 lg:py-1 lg:pl-1.5 lg:pr-3 hover:bg-[#fcfdff] transition-all shadow-sm focus:outline-none">
              <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-[#1a56db] text-white font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden text-[13px] font-semibold text-[#17307a] lg:block">Hi, {user.name}</span>
              <ChevronDown className="hidden h-4 w-4 text-[#17307a] lg:block group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="bg-white border border-[#e4ecff] rounded-xl shadow-lg p-1.5">
                <div className="px-3 py-2 text-xs text-[#8ea0c7] border-b border-[#f2f6ff] mb-1">
                  Role: <span className="font-semibold text-[#1a56db] capitalize">{user.roles.join(', ')}</span>
                </div>
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
