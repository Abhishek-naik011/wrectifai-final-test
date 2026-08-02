'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [show401, setShow401] = useState(false);
  
  // Compute authorization synchronously to prevent UI flashes
  let isAuthorized = false;
  if (user && user.roles) {
    const mappedUserRoles = user.roles.map(r => r === 'user' ? 'customer' : r);
    const mappedAllowed = allowedRoles.map(r => r === 'user' ? 'customer' : r);
    isAuthorized = mappedUserRoles.some((role) => mappedAllowed.includes(role));
  }

  useEffect(() => {
    if (isLoading) return; // Wait until auth state is resolved

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('accessToken') : null;
    
    if (!isAuthenticated && !token) {
      if (pathname?.startsWith('/admin')) {
        setShow401(true);
      }
      return;
    }

    if (user && user.roles && !isAuthorized) {
      // We rely entirely on AuthGuard to handle redirection to the correct home.
      // This guard acts purely as an authorization boundary to prevent rendering forbidden content.
      setShow401(true);
    }
  }, [isLoading, isAuthenticated, user, isAuthorized, pathname]);

  if (show401) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f8fe]">
        <h1 className="text-4xl font-bold text-red-600 mb-2">401</h1>
        <div className="text-[16px] font-medium text-slate-700">Unauthorized Access</div>
        <a href="/" className="mt-6 text-blue-600 hover:underline">Go to Homepage</a>
      </div>
    );
  }

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
