'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [show401, setShow401] = useState(false);

  // Compute authorization synchronously
  let isAuthorized = false;

  if (user && user.roles) {
    const mappedUserRoles = user.roles.map((r) =>
      r === 'user' ? 'customer' : r
    );

    const mappedAllowed = allowedRoles.map((r) =>
      r === 'user' ? 'customer' : r
    );

    isAuthorized = mappedUserRoles.some((role) =>
      mappedAllowed.includes(role)
    );
  }

  useEffect(() => {
    // Do not make any authorization decision while auth is loading.
    if (isLoading) {
      setShow401(false);
      return;
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') ||
        localStorage.getItem('accessToken')
        : null;

    // Authentication is finished, but user is not authenticated.
    if (!isAuthenticated && !token) {
      if (pathname?.startsWith('/admin')) {
        setShow401(true);
      }
      return;
    }

    // Authentication is finished and user exists,
    // but the user does not have the required role.
    if (user && user.roles && !isAuthorized) {
      setShow401(true);
      return;
    }

    // User is authenticated and authorized.
    setShow401(false);
  }, [isLoading, isAuthenticated, user, isAuthorized, pathname]);

  // IMPORTANT:
  // While authentication is being resolved, never show 401.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">
          Loading...
        </div>
      </div>
    );
  }

  if (show401) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f8fe]">
        <h1 className="mb-2 text-4xl font-bold text-red-600">401</h1>
        <div className="text-[16px] font-medium text-slate-700">
          Unauthorized Access
        </div>
        <a
          href="/"
          className="mt-6 text-blue-600 hover:underline"
        >
          Go to Homepage
        </a>
      </div>
    );
  }

  // Auth finished but authorization has not been established yet.
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}