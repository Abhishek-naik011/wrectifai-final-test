const fs = require('fs');
const path = require('path');
const dirs = ['incoming-requests', 'quotes', 'settings', 'profile'];
dirs.forEach(dir => {
  const file = path.join('d:/WRECTIFIAI/wrectifai/apps/web/src/app/garage', dir, 'page.tsx');
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('DashboardShell') && !content.includes('header={<DashboardHeader />}')) {
      content = content.replace(/<DashboardShell customNavItems={garageNavItems} hideBottomWidget={true}>/, '<DashboardShell customNavItems={garageNavItems} hideBottomWidget={true} header={<DashboardHeader />}>');
      content = content.replace(/import { garageNavItems } from '@\/lib\/garage-config';/, "import { garageNavItems } from '@/lib/garage-config';\nimport { DashboardHeader } from '@/components/common/dashboard-header';");
      fs.writeFileSync(file, content);
      console.log('Updated ' + dir);
    }
  }
})
