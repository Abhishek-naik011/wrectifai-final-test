const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, '../src/app/admin/dashboard/page.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// 1. Remove View All from Recent Activity
content = content.replace(
  /<Link href="\/coming-soon" className="text-xs text-blue-600 font-bold">View All<\/Link>(\s*)<\/div>\s*<div className="space-y-4 pl-4 relative/g,
  '</div>$1<div className="space-y-4 pl-4 relative'
);

// 2. Remove View All from Pending Tasks
content = content.replace(
  /<h3 className="font-bold text-\[#17307a\]">Pending Tasks<\/h3>\s*<Link href="\/coming-soon" className="text-xs text-blue-600 font-bold">View All<\/Link>/g,
  '<h3 className="font-bold text-[#17307a]">Pending Tasks</h3>'
);

// 3. Fix 3-dot menu in the table to have Approve, Reject, Suspend
// Need to add state or just simple buttons. Let's use simple buttons.
const menuReplacement = `
<div className="flex gap-2">
  {g.approvalStatus === 'pending' && (
    <>
      <button onClick={() => handleApprove(g.id)} className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-bold">Approve</button>
      <button onClick={() => handleAction(g.id, 'reject')} className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100 font-bold">Reject</button>
    </>
  )}
  {g.approvalStatus === 'approved' && (
    <button onClick={() => handleAction(g.id, 'suspend')} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100 font-bold">Suspend</button>
  )}
</div>
`;
content = content.replace(
  /<td className="p-4">\s*<Link href="\/coming-soon" className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">\s*<MoreVertical className="w-4 h-4" \/>\s*<\/Link>\s*<\/td>/g,
  `<td className="p-4">${menuReplacement}</td>`
);

// Add handleAction to the component
const handleActionFn = `
  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(\`/admin/onboarding/garages/\${id}/\${action}\`, {});
      const garagesData = await apiClient.get<any[]>('/admin/onboarding/garages');
      setGarages(garagesData);
    } catch (err) {
      console.error('Failed to ' + action + ' garage', err);
    }
  };
`;

if (!content.includes('const handleAction =')) {
  content = content.replace(
    /const handleApprove = async[\s\S]*?};/m,
    match => match + '\n' + handleActionFn
  );
}

// In the pending approvals cards, fix "View" to open modal or something?
// "View All in Pending Approvals must open the Pending Approvals page, NOT Feature Coming Soon." => I checked and it's already /admin/garages/pending-approvals.
// The card has "Reject" button that goes to /coming-soon. Let's wire it up to handleAction.
content = content.replace(
  /<Link href="\/coming-soon" className="bg-red-50 text-red-600 rounded text-\[10px\] font-bold py-1\.5 hover:bg-red-100 text-center">Reject<\/Link>/g,
  '<button onClick={() => handleAction(g.id, \'reject\')} className="bg-red-50 text-red-600 rounded text-[10px] font-bold py-1.5 hover:bg-red-100 text-center">Reject</button>'
);

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log('Dashboard fixed.');
