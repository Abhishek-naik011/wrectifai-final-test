const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n', 'utf8');
};

const adminSettingsDir = 'd:/WRECTIFIAI/wrectifai/apps/web/src/app/admin/settings';

write(`${adminSettingsDir}/page.tsx`, `
'use client';
import { Card } from '@/components/common/card';
import { Save, Settings, Sliders, Shield, Wrench, Info, Brain, FileText, Activity, Star, Server, Database, Code2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [quotesEnabled, setQuotesEnabled] = useState(true);
  const [requestsEnabled, setRequestsEnabled] = useState(true);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Home &gt; Settings</p>
        </div>
        <div>
          <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
             <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-5xl">
        
        {/* General Settings */}
        <Card className="p-6 shadow-sm border-slate-200">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                 <Settings className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">General Settings</h3>
                 <p className="text-sm text-slate-500">Configure basic platform preferences.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-6">
              <div>
                 <label className="block text-xs font-bold text-slate-900 mb-2">Platform Name</label>
                 <input type="text" defaultValue="WrectifAI" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-900 mb-2">Platform Tagline</label>
                 <input type="text" defaultValue="AI-Powered Vehicle Care Platform" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-900 mb-2">Default Timezone</label>
                 <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                    <option>Asia/Kolkata (GMT +5:30)</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-900 mb-2">Date Format</label>
                 <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                    <option>DD MMM YYYY</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-900 mb-2">Language</label>
                 <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                    <option>English</option>
                 </select>
              </div>
           </div>
        </Card>
        
        {/* Feature Settings */}
        <Card className="p-6 shadow-sm border-slate-200">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
                 <Sliders className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">Feature Settings</h3>
                 <p className="text-sm text-slate-500">Enable or disable platform features.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Enable AI<br/>Diagnosis</span>
                 </div>
                 <button 
                    type="button"
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${aiEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                 >
                    <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${aiEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                 </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                       <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Enable<br/>Quotes</span>
                 </div>
                 <button 
                    type="button"
                    onClick={() => setQuotesEnabled(!quotesEnabled)}
                    className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${quotesEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                 >
                    <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${quotesEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                 </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                       <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Enable Service<br/>Requests</span>
                 </div>
                 <button 
                    type="button"
                    onClick={() => setRequestsEnabled(!requestsEnabled)}
                    className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${requestsEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                 >
                    <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${requestsEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                 </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                       <Star className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Enable<br/>Reviews</span>
                 </div>
                 <button 
                    type="button"
                    onClick={() => setReviewsEnabled(!reviewsEnabled)}
                    className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${reviewsEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                 >
                    <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${reviewsEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                 </button>
              </div>
           </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 shadow-sm border-slate-200">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                 <Shield className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
                 <p className="text-sm text-slate-500">Configure platform security preferences.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-8">
              <div>
                 <p className="text-sm font-bold text-slate-900 mb-1">Two-Factor Authentication (2FA)</p>
                 <p className="text-xs text-slate-500 mb-4">Require 2FA for all admin users.</p>
                 <button 
                    type="button"
                    onClick={() => setMfaEnabled(!mfaEnabled)}
                    className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${mfaEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                 >
                    <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${mfaEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                 </button>
              </div>
              <div className="border-l border-slate-100 pl-8">
                 <p className="text-sm font-bold text-slate-900 mb-1">Session Timeout</p>
                 <p className="text-xs text-slate-500 mb-4">Automatically logout after inactivity.</p>
                 <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                    <option>30 Minutes</option>
                 </select>
              </div>
              <div className="border-l border-slate-100 pl-8">
                 <p className="text-sm font-bold text-slate-900 mb-1">Password Expiry</p>
                 <p className="text-xs text-slate-500 mb-4">Require password change after a period.</p>
                 <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-700">
                    <option>90 Days</option>
                 </select>
              </div>
           </div>
        </Card>
        
        {/* Maintenance Mode */}
        <Card className="p-6 shadow-sm border-slate-200">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                 <Wrench className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">Maintenance Mode</h3>
                 <p className="text-sm text-slate-500">Temporarily restrict access to the platform.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <p className="text-sm font-bold text-slate-900 mb-1">Maintenance Mode</p>
                 <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">Enable maintenance mode to restrict access.</p>
                    <button 
                       type="button"
                       onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                       className={\`w-12 h-6 rounded-full p-1 transition-colors relative \${maintenanceEnabled ? 'bg-indigo-600' : 'bg-slate-200'}\`}
                    >
                       <div className={\`w-4 h-4 bg-white rounded-full transition-transform \${maintenanceEnabled ? 'translate-x-6' : 'translate-x-0'}\`}></div>
                    </button>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-900 mb-2">Maintenance Message</label>
                 <textarea 
                    defaultValue="We are currently performing scheduled maintenance.\\nPlease check back soon." 
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 text-slate-700 min-h-[80px]" 
                 />
              </div>
           </div>
        </Card>

        {/* System Information */}
        <Card className="p-6 shadow-sm border-slate-200">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                 <Info className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">System Information</h3>
                 <p className="text-sm text-slate-500">View important system details.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Platform Version</p>
                    <p className="text-xs text-slate-600">v1.2.0</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Server className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Environment</p>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded">Production</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Monitor className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Server Status</p>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span> Healthy
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Database Status</p>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span> Connected
                    </p>
                 </div>
              </div>
           </div>
        </Card>

      </div>
    </div>
  );
}
`);
