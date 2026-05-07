'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-[#FAFAFA]">Something went wrong</h2>
        <p className="text-muted-foreground">
          We encountered an error while loading your command center. This might be a temporary connection issue.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="bg-transparent border-[#262626] text-[#FAFAFA]"
          >
            Go Home
          </Button>
          <Button
            onClick={() => reset()}
            className="bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
