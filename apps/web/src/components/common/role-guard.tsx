'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Compute authorization synchronously to prevent UI flashes
  let isAuthorized = false;
  if (user && user.roles) {
    const mappedUserRoles = user.roles.map(r => r === 'user' ? 'customer' : r);
    const mappedAllowed = allowedRoles.map(r => r === 'user' ? 'customer' : r);
    isAuthorized = mappedUserRoles.some((role) => mappedAllowed.includes(role));
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('accessToken') : null;
    if (!isAuthenticated && !token) {
      router.replace('/login');
      return;
    }

    if (user && user.roles && !isAuthorized) {
      const mappedUserRoles = user.roles.map(r => r === 'user' ? 'customer' : r);
      if (mappedUserRoles.includes('admin')) {
        router.replace('/admin/dashboard');
      } else if (mappedUserRoles.includes('garage')) {
        router.replace('/garage/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, user, isAuthorized, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
