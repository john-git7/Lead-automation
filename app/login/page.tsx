'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result.success) {
      toast.success('Login successful');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0A0A0A]">
      <Card className="w-full max-w-sm bg-[#111111] border-[#262626]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-[#FAFAFA] font-bold tracking-tight">Agent Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access your lead command center.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#FAFAFA]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="agent@example.com"
                required
                className="bg-[#0A0A0A] border-[#262626] text-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA]/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#FAFAFA]">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-[#0A0A0A] border-[#262626] text-[#FAFAFA] focus:ring-1 focus:ring-[#FAFAFA]/20"
              />
            </div>
            <Button type="submit" className="w-full bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5] font-medium transition-colors" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

