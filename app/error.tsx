'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-4 text-center">
      <h2 className="text-2xl font-bold text-[#FAFAFA] mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Please try again or contact support if the issue persists.
      </p>
      <Button 
        onClick={() => reset()}
        className="bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]"
      >
        Try again
      </Button>
    </div>
  );
}
