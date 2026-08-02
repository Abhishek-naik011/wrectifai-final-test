import { Card } from '@/components/common/card';
import { Hammer } from 'lucide-react';

export function FeatureComingSoon({ title }: { title: string }) {
  return (
    <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <Hammer className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#17307a] mb-2">{title}</h1>
        <p className="text-sm text-slate-500 mb-6">
          We are working hard to bring this feature to you in a future update.
        </p>
      </Card>
    </div>
  );
}
