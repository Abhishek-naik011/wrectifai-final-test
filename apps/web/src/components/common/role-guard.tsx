'use client';

import { useAuth } from '@/lib/auth-context';

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('RoleGuard render:', { isLoading, isAuthenticated, user });

  // Never decide anything until auth check is fully done.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fe]">
        <div className="text-[14px] font-medium text-[#1a56db]">
          Loading...
        </div>
      </div>
    );
  }

  // Auth check finished. No user at all.
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f8fe]">
        <h1 className="mb-2 text-4xl font-bold text-red-600">401</h1>
        <div className="text-[16px] font-medium text-slate-700">
          Unauthorized Access
        </div>
        <a href="/" className="mt-6 text-blue-600 hover:underline">
          Go to Homepage
        </a>
      </div>
    );
  }

  const mappedUserRoles = user.roles.map((role) =>
    role === 'user' ? 'customer' : role
  );
  const mappedAllowedRoles = allowedRoles.map((role) =>
    role === 'user' ? 'customer' : role
  );
  const isAuthorized = mappedUserRoles.some((role) =>
    mappedAllowedRoles.includes(role)
  );

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f8fe]">
        <h1 className="mb-2 text-4xl font-bold text-red-600">401</h1>
        <div className="text-[16px] font-medium text-slate-700">
          Unauthorized Access
        </div>
        <a href="/" className="mt-6 text-blue-600 hover:underline">
          Go to Homepage
        </a>
      </div>
    );
  }

  return <>{children}</>;
}