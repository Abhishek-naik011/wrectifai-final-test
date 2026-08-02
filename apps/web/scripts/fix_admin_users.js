const fs = require('fs');
const path = require('path');

const usersPagePath = path.join(__dirname, '../src/app/admin/users/page.tsx');
let content = fs.readFileSync(usersPagePath, 'utf8');

// Replace the Actions header
content = content.replace(/<th className="p-4 font-semibold">Actions<\/th>/, '<th className="p-4 font-semibold text-right">Actions</th>');

// Replace the View eye button with inline actions for Verify, Reject, Suspend, Activate
const actionsReplacement = `
<td className="p-4 text-right">
  <div className="flex items-center justify-end gap-2">
    {c.status?.toLowerCase() === 'pending' && (
      <>
        <button onClick={() => handleAction(c.id, 'verify')} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-bold">Verify</button>
        <button onClick={() => handleAction(c.id, 'reject')} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100 font-bold">Reject</button>
      </>
    )}
    {c.status?.toLowerCase() === 'active' && (
      <button onClick={() => handleAction(c.id, 'suspend')} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded hover:bg-orange-100 font-bold">Suspend</button>
    )}
    {c.status?.toLowerCase() === 'suspended' && (
      <button onClick={() => handleAction(c.id, 'activate')} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 font-bold">Activate</button>
    )}
  </div>
</td>
`;

content = content.replace(
  /<td className="p-4">\s*<div className="flex items-center gap-2">\s*<button onClick=\{\(\) => router\.push\('\/coming-soon'\)\} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" \/><\/button>\s*<\/div>\s*<\/td>/,
  actionsReplacement
);
// Above regex only replaces the first instance because I missed /g, but inside map there is only one. Let's make sure it's global.
content = content.replace(
  /<td className="p-4">\s*<div className="flex items-center gap-2">\s*<button onClick=\{\(\) => router\.push\('\/coming-soon'\)\} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-4 h-4" \/><\/button>\s*<\/div>\s*<\/td>/g,
  actionsReplacement
);


// Add handleAction and Add Customer handlers
const handlers = `
  const handleAction = async (id: string, action: string) => {
    try {
      await apiClient.post(\`/admin/users/\${id}/\${action}\`, {});
      const data = await apiClient.get<any[]>('/admin/users');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to ' + action + ' customer', err);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
    };
    try {
      await apiClient.post('/admin/users', payload);
      setIsAddCustomerOpen(false);
      const data = await apiClient.get<any[]>('/admin/users');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to add customer', err);
    }
  };
`;

if (!content.includes('const handleAction =')) {
  content = content.replace(/const totalCustomers = customers\.length;/, handlers + '\n  const totalCustomers = customers.length;');
}

// Replace the Add Customer modal content
const addCustomerModalContent = `
<form onSubmit={handleAddCustomer} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
    <input name="name" required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
    <input name="email" required type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="john@example.com" />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
    <input name="phone" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="+1 234 567 8900" />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">City/Location</label>
    <input name="location" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="New York" />
  </div>
  <div className="flex gap-3 pt-2">
    <button type="button" onClick={() => setIsAddCustomerOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200">Cancel</button>
    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Add Customer</button>
  </div>
</form>
`;

content = content.replace(
  /<div className="space-y-4">\s*<p className="text-sm text-slate-500">Feature Coming Soon: Adding customers manually from admin panel is under development\.<\/p>\s*<button onClick=\{\(\) => setIsAddCustomerOpen\(false\)\} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Close<\/button>\s*<\/div>/,
  addCustomerModalContent
);

// Search Bar width: "Extend the Search Bar full width"
// Find <div className="relative flex-1 max-w-md"> and replace with <div className="relative w-full">
content = content.replace(/<div className="relative flex-1 max-w-md">/g, '<div className="relative w-full">');

// Verify Customer button (remove it since actions are inline now)
content = content.replace(
  /<button onClick=\{\(\) => setIsVerificationOpen\(true\)\} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">\s*Verify Customer\s*<\/button>/g,
  ''
);

// Remove Verification modal
content = content.replace(
  /<Modal isOpen=\{isVerificationOpen\} onClose=\{\(\) => setIsVerificationOpen\(false\)\} title="Customer Verification">[\s\S]*?<\/Modal>/,
  ''
);

fs.writeFileSync(usersPagePath, content, 'utf8');
console.log('Customer Management fixed.');
