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
      // If the user has a role but is trying to access a route that belongs to another role
      const isAdmin = user.roles?.includes('admin');
      const isGarage = user.roles?.includes('garage');

      const onAdminPath = pathname?.startsWith('/admin');
      const onGaragePath = pathname?.startsWith('/garage');

      // If they are on a path they are authorized for, do nothing.
      if (isAdmin && onAdminPath) return;
      if (isGarage && onGaragePath) return;
      if (!isAdmin && !isGarage && !onAdminPath && !onGaragePath) return;

      // Otherwise, redirect them to their highest priority role path
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else if (isGarage) {
        router.push('/garage/dashboard');
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
