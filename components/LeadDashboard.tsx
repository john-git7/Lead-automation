'use client';

import { useState } from 'react';
import { updateLeadStatus, deleteLead, updateLeadDetails } from '@/app/actions/leads';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MoreVertical, Edit, Trash } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  created_at: string;
};

export default function LeadDashboard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Edit Modal State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Stats calculation
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New Lead').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    closed: leads.filter(l => l.status === 'Closed').length,
    conversion: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'Closed').length / leads.length) * 100) : 0
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const result = await updateLeadStatus(id, newStatus);
    
    if (result.success) {
      toast.success('Status updated successfully');
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } else {
      toast.error(result.error || 'Failed to update status');
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
    
    const result = await deleteLead(id);
    if (result.success) {
      toast.success('Lead deleted successfully');
      setLeads(leads.filter(lead => lead.id !== id));
    } else {
      toast.error(result.error || 'Failed to delete lead');
    }
  };

  const openEditDialog = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLead) return;
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateLeadDetails(editingLead.id, formData);

    if (result.success) {
      toast.success('Lead updated successfully');
      const updatedData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        source: formData.get('source') as string,
      };
      setLeads(leads.map(lead => lead.id === editingLead.id ? { ...lead, ...updatedData } : lead));
      setIsEditDialogOpen(false);
    } else {
      toast.error(result.error || 'Failed to update lead');
    }
    setIsSaving(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total, color: 'text-[#FAFAFA]' },
          { label: 'New Inquiries', value: stats.new, color: 'text-[#A3A3A3]' },
          { label: 'Contacted', value: stats.contacted, color: 'text-[#FAFAFA]' },
          { label: 'Conversion', value: `${stats.conversion}%`, color: 'text-[#FAFAFA]' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-lg bg-[#111111] border border-[#262626] flex flex-col space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            <span className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-[#262626] overflow-hidden bg-[#0A0A0A]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#111111] hover:bg-[#111111]">
              <TableRow className="border-[#262626] hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium min-w-[120px]">Name</TableHead>
                <TableHead className="text-muted-foreground font-medium min-w-[200px]">Contact Info</TableHead>
                <TableHead className="text-muted-foreground font-medium min-w-[100px]">Source</TableHead>
                <TableHead className="text-muted-foreground font-medium min-w-[100px] hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-muted-foreground font-medium min-w-[140px]">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow className="border-[#262626]">
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} className="border-[#262626] hover:bg-[#111111]/50 transition-colors">
                    <TableCell className="font-medium text-[#FAFAFA]">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[#FAFAFA] text-sm break-all">{lead.email}</span>
                        <span className="text-muted-foreground text-xs">{lead.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#FAFAFA] capitalize text-sm">{lead.source}</TableCell>
                    <TableCell className="text-[#FAFAFA] text-sm hidden sm:table-cell">{formatDate(lead.created_at)}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={lead.status} 
                        onValueChange={(val) => handleStatusChange(lead.id, val as string)}
                        disabled={updatingId === lead.id}
                      >
                        <SelectTrigger className="h-8 w-full bg-[#171717] border-[#262626] text-[#FAFAFA] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#262626] text-[#FAFAFA]">
                          <SelectItem value="New Lead">New Lead</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Qualified">Qualified</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-[#FAFAFA] hover:bg-[#111111] transition-colors focus:outline-none">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#171717] border-[#262626] text-[#FAFAFA]">
                          <DropdownMenuItem onClick={() => openEditDialog(lead)} className="cursor-pointer focus:bg-[#262626] focus:text-[#FAFAFA]">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[#262626] text-[#FAFAFA] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#FAFAFA]">Full Name</Label>
              <Input id="name" name="name" defaultValue={editingLead?.name} required className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#FAFAFA]">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editingLead?.email} required className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#FAFAFA]">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={editingLead?.phone} required className="bg-[#111111] border-[#262626] text-[#FAFAFA]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source" className="text-[#FAFAFA]">Source</Label>
              <Select name="source" defaultValue={editingLead?.source} required>
                <SelectTrigger className="bg-[#111111] border-[#262626] text-[#FAFAFA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#171717] border-[#262626] text-[#FAFAFA]">
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent border-[#262626] text-[#FAFAFA] hover:bg-[#171717] hover:text-[#FAFAFA]">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E5E5E5]">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
