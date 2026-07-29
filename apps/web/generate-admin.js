const fs = require('fs');
const path = require('path');

const pages = [
  { slug: 'dashboard', title: 'Admin Dashboard', desc: 'Overview of platform activity and metrics' },
  { slug: 'users', title: 'User Management', desc: 'Manage platform customers and their accounts' },
  { slug: 'garages', title: 'Garage Management', desc: 'Manage registered garages and their status' },
  { slug: 'service-requests', title: 'Service Requests', desc: 'Monitor all service requests across the platform' },
  { slug: 'quotes', title: 'Quotes Overview', desc: 'View and manage all generated quotes' },
  { slug: 'reports', title: 'Reports & Analytics', desc: 'Platform analytics, revenue, and usage reports' },
  { slug: 'profile', title: 'Admin Profile', desc: 'Manage your admin account settings' },
  { slug: 'settings', title: 'Platform Settings', desc: 'Global platform configuration and rules' }
];

const basePath = 'd:/WRECTIFIAI/wrectifai/apps/web/src/app/admin';

pages.forEach(page => {
  const dirPath = path.join(basePath, page.slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `'use client';

export default function ${page.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Page() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-[#17307a]">${page.title}</h1>
        <p className="text-sm text-gray-500">${page.desc}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Module Under Construction</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          The ${page.title} module is currently being developed and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log('Created ' + page.slug);
});
