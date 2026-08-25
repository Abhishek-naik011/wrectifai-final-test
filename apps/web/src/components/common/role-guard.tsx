'use client';

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

  // Wait until AuthProvider finishes checking the current session.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">
          Loading...
        </div>
      </div>
    );
  }

  // Auth check is complete. If there is no authenticated user,
  // show Unauthorized Access.
  if (!isAuthenticated || !user) {
    if (pathname?.startsWith('/admin')) {
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

    return null;
  }

  // Map the existing "user" role to "customer" as before.
  const mappedUserRoles = user.roles.map((role) =>
    role === 'user' ? 'customer' : role
  );

  const mappedAllowedRoles = allowedRoles.map((role) =>
    role === 'user' ? 'customer' : role
  );

  const isAuthorized = mappedUserRoles.some((role) =>
    mappedAllowedRoles.includes(role)
  );

  // Authenticated but does not have the required role.
  if (!isAuthorized) {
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

  return <>{children}</>;
}