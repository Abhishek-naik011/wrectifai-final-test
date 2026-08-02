'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { garageNavItems } from '@/lib/garage-config';
import FeatureComingSoonPage from '@/pages/feature-coming-soon/feature-coming-soon-page';

export default function HelpPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <FeatureComingSoonPage 
        title="Help & Support" 
        customNavItems={garageNavItems} 
      />
    </RoleGuard>
  );
}
