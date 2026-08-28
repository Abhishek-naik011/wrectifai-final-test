'use client';
import { DashboardShell } from '@/components/home/dashboard-shell';
import { Card } from '@/components/common/card';
import { ProfileContent } from './profile-content';

function FeatureHeader() {
  return (
    <Card className="rounded-[20px] border border-[#dfe8ff] bg-white/90 p-4 shadow-[0_12px_30px_rgba(30,58,138,0.06)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#dbe6ff] dark:border-[#2A3446] bg-white dark:bg-[#1A2233] text-[#1a56db] shadow-sm lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8ab4]">
              WrectifAI Workspace
            </p>
            <h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17307a] dark:text-white">
              My Profile
            </h1>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <DashboardShell header={<FeatureHeader />}>
      <ProfileContent />
    </DashboardShell>
  );
}

export default ProfilePage;
