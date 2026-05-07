'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { leadSchema } from '@/lib/validations';

/**
 * SUBMIT LEAD (Public Action)
 * Refactored to be non-blocking and production-aware.
 */
export async function submitLead(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    source: formData.get('source'),
  };

  const validation = leadSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const supabase = await createClient();

  try {
    // 1. Insert into database
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{ ...validation.data, status: 'New Lead' }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Database submission failed.' };
    }

    // 2. Trigger Automation (Non-blocking / Fire-and-Forget)
    // In a real production app, you'd use a background worker (e.g., Inngest, BullMQ)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      // Note: We intentionally don't 'await' the full response to keep the UI snappy
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch(err => console.error('Background webhook error:', err));
    }

    return { success: true, data: lead };
  } catch (err) {
    console.error('Unexpected lead submission error:', err);
    return { success: false, error: 'Internal server error.' };
  }
}

/**
 * GET LEADS (Authenticated)
 * Uses RLS - only returns what the user is allowed to see.
 */
export async function getLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch leads error:', error);
    return [];
  }
  return data;
}

/**
 * UPDATE LEAD STATUS (Authenticated)
 */
export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Update status error:', error);
    return { success: false, error: 'Update failed.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * DELETE LEAD (Authenticated)
 */
export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete lead error:', error);
    return { success: false, error: 'Delete failed.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * UPDATE LEAD DETAILS (Authenticated)
 */
export async function updateLeadDetails(id: string, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    source: formData.get('source'),
  };

  const validation = leadSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('leads')
    .update(validation.data)
    .eq('id', id);

  if (error) {
    console.error('Update lead error:', error);
    return { success: false, error: 'Update failed.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

