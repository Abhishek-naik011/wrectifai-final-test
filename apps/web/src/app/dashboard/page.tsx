'use client';

import { useAuth } from '@/lib/auth-context';
import { HomePage } from '@/pages/home/home-page';

export default function CustomerDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

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
