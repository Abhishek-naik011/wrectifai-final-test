'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { HomePage } from '@/pages/home/home-page';

export default function RootPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // AuthGuard handles all role-based routing globally.
  // We simply render the customer home page here if they are authorized to view it.

  if (isLoading || !isAuthenticated || (user?.roles && (user.roles.includes('admin') || user.roles.includes('garage')))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">Loading...</div>
      </div>
    );
  }

  // Render the customer application
  return <HomePage />;
}
