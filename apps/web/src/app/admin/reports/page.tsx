'use client';

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-[#17307a]">Reports & Analytics</h1>
        <p className="text-sm text-gray-500">Platform analytics, revenue, and usage reports</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Module Under Construction</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          The Reports & Analytics module is currently being developed and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
