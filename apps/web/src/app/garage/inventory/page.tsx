'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { garageNavItems } from '@/lib/garage-config';
import FeatureComingSoonPage from '@/pages/feature-coming-soon/feature-coming-soon-page';

export default function InventoryPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <FeatureComingSoonPage 
        title="Inventory" 
        customNavItems={garageNavItems} 
      />
    </RoleGuard>
  );
}
