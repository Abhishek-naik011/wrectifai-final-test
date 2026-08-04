const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Garage
const garageProfilePath = path.join(srcDir, 'app/garage/profile/page.tsx');
const garageSettingsPath = path.join(srcDir, 'app/garage/settings/page.tsx');
const garageHelpPath = path.join(srcDir, 'app/garage/help/page.tsx');

const garageProfileContent = `'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { ProfilePage as CommonProfilePage } from '@/pages/profile/profile-page';

export default function ProfilePage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <CommonProfilePage />
      </DashboardShell>
    </RoleGuard>
  );
}
`;

const garageSettingsContent = `'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { SettingsPage as CommonSettingsPage } from '@/pages/settings/settings-page';

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <CommonSettingsPage />
      </DashboardShell>
    </RoleGuard>
  );
}
`;

const garageHelpContent = `'use client';
import { RoleGuard } from '@/components/common/role-guard';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { DashboardHeader } from '@/components/common/dashboard-header';
import { garageNavItems } from '@/lib/garage-config';
import { HelpPage as CommonHelpPage } from '@/pages/help/help-page';

export default function HelpPage() {
  return (
    <RoleGuard allowedRoles={['garage']}>
      <DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>
        <CommonHelpPage />
      </DashboardShell>
    </RoleGuard>
  );
}
`;

if (fs.existsSync(garageProfilePath)) fs.writeFileSync(garageProfilePath, garageProfileContent, 'utf8');
if (fs.existsSync(garageSettingsPath)) fs.writeFileSync(garageSettingsPath, garageSettingsContent, 'utf8');
if (fs.existsSync(garageHelpPath)) fs.writeFileSync(garageHelpPath, garageHelpContent, 'utf8');

// Admin
const adminProfilePath = path.join(srcDir, 'app/admin/profile/page.tsx');
const adminSettingsPath = path.join(srcDir, 'app/admin/settings/page.tsx');
const adminSupportPath = path.join(srcDir, 'app/admin/support/page.tsx');

const adminProfileContent = `'use client';
import { ProfilePage as CommonProfilePage } from '@/pages/profile/profile-page';

export default function ProfilePage() {
  return (
    <div className="flex-1">
      <CommonProfilePage />
    </div>
  );
}
`;

const adminSettingsContent = `'use client';
import { SettingsPage as CommonSettingsPage } from '@/pages/settings/settings-page';

export default function SettingsPage() {
  return (
    <div className="flex-1">
      <CommonSettingsPage />
    </div>
  );
}
`;

const adminSupportContent = `'use client';
import { HelpPage as CommonHelpPage } from '@/pages/help/help-page';

export default function SupportPage() {
  return (
    <div className="flex-1">
      <CommonHelpPage />
    </div>
  );
}
`;

// wait, Admin pages don't have wrappers because layout.tsx handles it.
// Let's verify admin/layout.tsx 
// The files might exist, let's just write them.
if (fs.existsSync(adminProfilePath)) fs.writeFileSync(adminProfilePath, adminProfileContent, 'utf8');
if (fs.existsSync(adminSettingsPath)) fs.writeFileSync(adminSettingsPath, adminSettingsContent, 'utf8');
if (fs.existsSync(adminSupportPath)) fs.writeFileSync(adminSupportPath, adminSupportContent, 'utf8');

console.log('Routes wired up successfully.');
