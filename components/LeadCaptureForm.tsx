'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions/leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);

    if (result.success) {
      toast.success('Thank you! Our team will contact you shortly.');
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#FAFAFA]">Full Name</Label>
        <Input id="name" name="name" required placeholder="John Doe" className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#FAFAFA]">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#FAFAFA]">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="(555) 123-4567" className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source" className="text-[#FAFAFA]">How did you hear about us?</Label>
        <Select name="source" required defaultValue="google">
          <SelectTrigger className="bg-[#111111] border-[#262626] text-[#FAFAFA]">
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent className="bg-[#171717] border-[#262626] text-[#FAFAFA]">
            <SelectItem value="google">Google Search</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5] transition-colors" disabled={loading}>
        {loading ? 'Submitting...' : 'Request Information'}
      </Button>
    </form>
  );
}
