'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { garageNavItems } from '@/lib/garage-config';
import FeatureComingSoonPage from '@/pages/feature-coming-soon/feature-coming-soon-page';

export default function CustomersPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <FeatureComingSoonPage 
        title="Customers" 
        customNavItems={garageNavItems} 
      />
    </RoleGuard>
  );
}
