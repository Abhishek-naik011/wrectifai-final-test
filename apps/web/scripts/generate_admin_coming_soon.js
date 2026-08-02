const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'support', title: 'Support Center' },
  { dir: 'profile', title: 'Profile' },
  { dir: 'settings', title: 'Settings' },
  { dir: 'notifications', title: 'Notifications' },
  { dir: 'audit', title: 'Audit Logs' }
];

const template = (title) => `
import { FeatureComingSoon } from '@/components/admin/feature-coming-soon';

export default function Page() {
  return <FeatureComingSoon title="${title}" />;
}
`;

pages.forEach(p => {
  const pageDir = path.join(__dirname, '../src/app/admin', p.dir);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), template(p.title), 'utf8');
});

console.log('Coming soon pages generated successfully.');
