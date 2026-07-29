'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { HomePage } from '@/pages/home/home-page';

export default function RootPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.roles) {
      const mappedUserRoles = user.roles.map((r) => (r === 'user' ? 'customer' : r));
      if (mappedUserRoles.includes('admin')) {
        router.replace('/admin/dashboard');
      } else if (mappedUserRoles.includes('garage')) {
        router.replace('/garage/dashboard');
      }
      // If customer, we do nothing and let it render the HomePage below
    }
  }, [isLoading, isAuthenticated, user, router]);

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
