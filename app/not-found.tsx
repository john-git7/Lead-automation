import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-4 text-center">
      <h2 className="text-4xl font-bold text-[#FAFAFA] mb-2">404</h2>
      <h3 className="text-xl text-[#FAFAFA] mb-6">Page Not Found</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
