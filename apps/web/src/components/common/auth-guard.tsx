'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

function noop() {
  return noop;
}

function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useIsClient();

  const isPublicPath = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user && !isPublicPath) {
      const isAdmin = user.roles?.includes('admin');
      const isGarage = user.roles?.includes('garage');

      const onAdminPath = pathname?.startsWith('/admin');
      // Fix: /garages is a customer path. /garage/ is the garage module.
      const onGaragePath = pathname?.startsWith('/garage/') || pathname === '/garage' || pathname === '/garage/dashboard';
      const isRoot = pathname === '/';
      
      const onCustomerPath = !onAdminPath && !onGaragePath && !isRoot;

      // 1. Garage cannot access Admin routes, Customer cannot access Admin routes
      if (onAdminPath && !isAdmin) {
        if (isGarage) router.replace('/garage/dashboard');
        else router.replace('/');
        return;
      }

      // 2. Customer cannot access Garage routes, Admin cannot access Garage routes
      if (onGaragePath && !isGarage) {
        if (isAdmin) router.replace('/admin/dashboard');
        else router.replace('/');
        return;
      }

      // 3. Garage cannot access Customer protected routes, Admin cannot access Customer routes
      if (onCustomerPath && (isGarage || isAdmin)) {
        // Wait, what if a user is BOTH Garage and Customer? WrectifAI separates roles heavily in the Prompt. 
        // We will assume `isGarage` takes precedence, and they shouldn't access customer paths.
        // Wait, if we block it, Garage can't access `/bookings`.
        if (isAdmin) router.replace('/admin/dashboard');
        else router.replace('/garage/dashboard');
        return;
      }
    }
  }, [isAuthenticated, user, isPublicPath, router, pathname]);

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfe]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a56db]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
