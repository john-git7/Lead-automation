import { logout } from '@/app/actions/auth';
import { getLeads } from '@/app/actions/leads';
import LeadDashboard from '@/components/LeadDashboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#FAFAFA] tracking-tight">Command Center</h1>
            <p className="text-muted-foreground mt-1">Manage your inbound property leads.</p>
          </div>
          <form action={logout}>
            <Button variant="outline" type="submit" className="bg-[#111111] border-[#262626] text-[#FAFAFA] hover:bg-[#171717]">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </header>

        <main>
          <LeadDashboard initialLeads={leads} />
        </main>
      </div>
    </div>
  );
}
